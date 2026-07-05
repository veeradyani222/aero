import { BaseAPIProvider } from './base-provider';
import { APIResponse, ProviderConfig, ChatGPTSearchRequest } from './types';
import OpenAI from 'openai';

export class ChatGPTSearchProvider extends BaseAPIProvider {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    super('chatgptsearch', 'ai', config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
      timeout: config.timeout,
      maxRetries: 0,
    });
  }

  async execute(request: ChatGPTSearchRequest): Promise<APIResponse> {
    const startTime = Date.now();
    const requestId = `chatgptsearch-${Date.now()}`;
    const searchModelCandidates = this.getModelCandidates(
      process.env.CHATGPT_SEARCH_MODELS,
      ['gpt-4.1-mini', 'gpt-4.1', 'gpt-4o-mini-search-preview-2025-03-11', 'gpt-4o-search-preview-2025-03-11']
    );
    const noSearchModelCandidates = this.getModelCandidates(
      process.env.CHATGPT_FALLBACK_MODELS,
      ['gpt-4.1-mini', 'gpt-4.1']
    );

    try {
      if (!this.validateRequest(request)) {
        throw new Error('Invalid request format');
      }

      await this.checkRateLimit();

      let response: any = null;
      let modelUsed = '';
      let lastError: Error | null = null;
      let usedWebSearch = false;

      for (const model of searchModelCandidates) {
        try {
          response = await this.retryRequest(async () => {
            return await this.client.responses.create({
              model,
              tools: [{ type: "web_search_preview" }],
              input: request.input,
              temperature: request.temperature,
            });
          });
          modelUsed = model;
          usedWebSearch = this.didUseWebSearch(response);
          break;
        } catch (error) {
          lastError = error as Error;
          console.warn('ChatGPT Search model failed, trying fallback if available:', {
            model,
            error: lastError.message,
          });
        }
      }

      if (!response) {
        for (const model of noSearchModelCandidates) {
          try {
            response = await this.retryRequest(async () => {
              return await this.client.responses.create({
                model,
                input: request.input,
                temperature: request.temperature,
              });
            });
            modelUsed = model;
            usedWebSearch = false;
            break;
          } catch (error) {
            lastError = error as Error;
            console.warn('ChatGPT no-search fallback model failed, trying next if available:', {
              model,
              error: lastError.message,
            });
          }
        }
      }

      if (!response) {
        throw lastError || new Error('All ChatGPT Search model fallbacks failed');
      }

      // Console log the complete raw response from ChatGPT Search
      console.log('🔍 ChatGPT Search Complete Raw Response:', JSON.stringify(response, null, 2));
      
      // Log specific parts for easier debugging
      console.log('🌐 ChatGPT Search Response Summary:', {
        model: response.model || modelUsed,
        hasOutput: !!response.output_text,
        outputLength: response.output_text?.length || 0,
        preview: response.output_text?.substring(0, 200) + '...',
        usage: response.usage,
        hasAnnotations: this.extractAnnotations(response).length > 0,
        annotationsCount: this.extractAnnotations(response).length,
        annotationsPreview: this.extractAnnotations(response).slice(0, 3)
      });

      const transformedData = this.transformResponse(response);
      transformedData.modelFallbacksTried = [...searchModelCandidates, ...noSearchModelCandidates];
      transformedData.modelUsed = response.model || modelUsed;
      transformedData.webSearchUsed = usedWebSearch;
      transformedData.searchEnabled = usedWebSearch;
      transformedData.tools = usedWebSearch ? ['web_search_preview'] : [];
      
      // Console log the transformed data
      console.log('✨ ChatGPT Search Transformed Data:', JSON.stringify(transformedData, null, 2));
      
      const responseTime = Date.now() - startTime;
      const cost = this.calculateCost(response.usage?.total_tokens);

      return {
        providerId: this.name,
        requestId,
        status: 'success',
        data: transformedData,
        responseTime,
        cost,
        timestamp: new Date(),
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Console log ChatGPT Search errors
      console.error('❌ ChatGPT Search Request Error:', {
        requestId,
        error: (error as Error).message,
        stack: (error as Error).stack,
        responseTime,
        request: JSON.stringify(request, null, 2)
      });
      
      return {
        providerId: this.name,
        requestId,
        status: 'error',
        error: (error as Error).message,
        responseTime,
        cost: 0,
        timestamp: new Date(),
      };
    }
  }

  validateRequest(request: ChatGPTSearchRequest): boolean {
    return !!(
      request.input &&
      typeof request.input === 'string' &&
      request.input.trim().length > 0
    );
  }

  transformResponse(rawResponse: any): any {
    const annotations = this.extractAnnotations(rawResponse);
    const usedWebSearch = this.didUseWebSearch(rawResponse);

    return {
      content: rawResponse.output_text || '',
      model: rawResponse.model || 'gpt-4.1-mini',
      usage: rawResponse.usage,
      searchEnabled: usedWebSearch,
      webSearchUsed: usedWebSearch,
      tools: usedWebSearch ? ['web_search_preview'] : [],
      // Include annotations (sources, citations, etc.)
      annotations,
      annotationsCount: annotations.length,
      // Include any other metadata
      metadata: {
        hasAnnotations: annotations.length > 0,
        responseId: rawResponse.id,
        created: rawResponse.created,
        object: rawResponse.object,
      },
      // Raw response for debugging (optional)
      rawResponse: rawResponse
    };
  }

  private getModelCandidates(envValue: string | undefined, defaults: string[]): string[] {
    const configuredModels = (envValue || '')
      .split(',')
      .map((model) => this.normalizeModelName(model))
      .filter(Boolean);

    return Array.from(new Set([...(configuredModels.length > 0 ? configuredModels : defaults), ...defaults]));
  }

  private normalizeModelName(model: string | undefined): string {
    return (model || '').trim().replace(/\s+/g, '-');
  }

  private didUseWebSearch(rawResponse: any): boolean {
    const output = Array.isArray(rawResponse?.output) ? rawResponse.output : [];
    return output.some((item: any) => item?.type === 'web_search_call');
  }

  private extractAnnotations(rawResponse: any): any[] {
    if (Array.isArray(rawResponse.annotations)) {
      return rawResponse.annotations;
    }

    const output = Array.isArray(rawResponse.output) ? rawResponse.output : [];
    return output.flatMap((item: any) => {
      const content = Array.isArray(item.content) ? item.content : [];
      return content.flatMap((contentItem: any) => (
        Array.isArray(contentItem.annotations) ? contentItem.annotations : []
      ));
    });
  }

  protected calculateCost(tokensUsed: number = 0): number {
    // ChatGPT Search pricing (with web search premium)
    const baseCostPer1K = 0.002;  // Base cost per 1K tokens
    const webSearchPremium = 0.001; // Additional cost for web search
    
    return (tokensUsed / 1000) * (baseCostPer1K + webSearchPremium);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testRequest: ChatGPTSearchRequest = {
        input: 'What is the current weather?',
        model: 'gpt-4.1',
        max_tokens: 50,
      };
      
      const result = await this.execute(testRequest);
      return result.status === 'success';
    } catch {
      return false;
    }
  }
} 