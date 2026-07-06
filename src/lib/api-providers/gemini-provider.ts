import { GoogleGenAI } from '@google/genai';
import { BaseAPIProvider } from './base-provider';
import { APIResponse, ProviderConfig, GeminiRequest } from './types';
import {
  getGeminiModelCandidates,
  getGeminiResponseText,
  isGeminiQuotaError,
  isRetryableGeminiError,
  markGeminiModelExhausted,
  nextAvailableGeminiModel,
} from './gemini-retry-policy';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class GeminiProvider extends BaseAPIProvider {
  private client: GoogleGenAI;

  constructor(config: ProviderConfig) {
    super('google-gemini', 'ai', config);
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async execute(request: GeminiRequest & { model?: string }): Promise<APIResponse> {
    const startTime = Date.now();
    const requestId = `gemini-${Date.now()}`;
    const modelCandidates = getGeminiModelCandidates();
    const attemptedModels: string[] = [];

    try {
      if (!this.config.apiKey || this.config.apiKey.trim() === '') {
        throw new Error('Google AI API key is not configured');
      }

      if (!this.validateRequest(request)) {
        throw new Error('Invalid request format');
      }

      await this.checkRateLimit();

      let rawResponse: any = null;
      let modelUsed = '';
      let lastError: Error | null = null;
      const maxAttempts = modelCandidates.length;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const model = nextAvailableGeminiModel(modelCandidates, new Set(attemptedModels));

        if (!model) {
          throw lastError || new Error('All Gemini model candidates are marked as quota exhausted');
        }

        attemptedModels.push(model);

        console.log('Gemini SDK Request:', {
          model,
          contentsLength: request.contents?.length,
          toolsEnabled: Boolean(request.tools?.length),
        });

        try {
          rawResponse = await this.client.models.generateContent({
            model,
            contents: request.contents,
            config: {
              ...(request.generationConfig || {}),
              tools: request.tools || [{ googleSearch: {} }],
            } as any,
          });
          modelUsed = model;
          break;
        } catch (error) {
          lastError = error as Error;

          if (isGeminiQuotaError(error)) {
            markGeminiModelExhausted(model);
          }

          const retryable = isRetryableGeminiError(error);
          const canRetry = retryable && attempt < maxAttempts - 1;

          console.warn('Gemini model failed, trying fallback if available:', {
            model,
            retryable,
            error: lastError.message,
          });

          if (!canRetry) {
            throw error;
          }

          const delayMs = (700 * (2 ** attempt)) + Math.floor(Math.random() * 300);
          await wait(delayMs);
        }
      }

      if (!rawResponse) {
        throw lastError || new Error('All Gemini model fallbacks failed');
      }

      console.log('Gemini SDK Response received:', {
        hasText: Boolean(getGeminiResponseText(rawResponse)),
        hasCandidates: Boolean(rawResponse.candidates),
        candidatesLength: rawResponse.candidates?.length,
        modelUsed,
      });

      const transformedData = this.transformResponse(rawResponse);
      transformedData.modelUsed = modelUsed;
      transformedData.modelFallbacksTried = attemptedModels;

      const responseTime = Date.now() - startTime;
      const cost = this.calculateCost();

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
      const errorMessage = (error as Error).message;

      console.error('Gemini SDK Error:', {
        error: errorMessage,
        responseTime,
        apiKeyConfigured: !!this.config.apiKey && this.config.apiKey.trim() !== '',
        attemptedModels,
      });

      return {
        providerId: this.name,
        requestId,
        status: 'error',
        error: errorMessage,
        responseTime,
        cost: 0,
        timestamp: new Date(),
      };
    }
  }

  validateRequest(request: GeminiRequest): boolean {
    return !!(
      request.contents &&
      Array.isArray(request.contents) &&
      request.contents.length > 0 &&
      request.contents[0].parts &&
      Array.isArray(request.contents[0].parts)
    );
  }

  transformResponse(rawResponse: any): any {
    const candidate = rawResponse.candidates?.[0];

    return {
      content: getGeminiResponseText(rawResponse),
      finishReason: candidate?.finishReason,
      safetyRatings: candidate?.safetyRatings,
      citationMetadata: candidate?.citationMetadata,
      groundingMetadata: candidate?.groundingMetadata,
      webSearchEnabled: true,
      rawResponse,
    };
  }

  protected calculateCost(): number {
    return 0.0005;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testRequest: GeminiRequest = {
        contents: [{
          parts: [{ text: 'Hello' }]
        }]
      };

      const result = await this.execute(testRequest);
      return result.status === 'success';
    } catch {
      return false;
    }
  }
}
