/**
 * @fileOverview This file contains the Azure OpenAI flow for fetching company information based on a domain.
 *
 * - getCompanyInfo - The main function that takes a domain and returns company details.
 * - CompanyInfoInput - The input type for the getCompanyInfo function.
 * - CompanyInfo - The output type for the getCompanyInfo function.
 */

import { z } from 'zod';

import OpenAI from 'openai';

// Input schema - now accepts domain instead of email
const CompanyInfoInputSchema = z.object({
  domain: z.string().describe('The company domain name (e.g., "example.com" or "https://example.com").'),
});
export type CompanyInfoInput = z.infer<typeof CompanyInfoInputSchema>;

// Output schema
export const CompanyInfoSchema = z.object({
  companyName: z.string().describe('The official brand or company name'),
  shortDescription: z.string().describe('A concise 2-3 sentence summary of what the company does'),
  productsAndServices: z.array(z.string()).describe('List of main products, services, features, or offerings'),
  keywords: z.array(z.string()).describe('4-5 relevant keywords or phrases representing core business'),
  competitors: z.array(z.string()).describe('3-5 main competitor companies or brands in the same industry'),
  website: z.string().describe('Company website URL'),
  sourceType: z.enum(['website', 'amazon']).optional(),
  amazonAsin: z.string().optional(),
  amazonOnlySearch: z.boolean().optional(),
  amazonProduct: z.object({
    asin: z.string(),
    url: z.string(),
    title: z.string(),
    brand: z.string().optional(),
    category: z.array(z.string()).optional(),
    price: z.union([z.number(), z.string()]).optional(),
    rating: z.union([z.number(), z.string()]).optional(),
    reviewsCount: z.union([z.number(), z.string()]).optional(),
    bulletPoints: z.array(z.string()).optional(),
    description: z.string().optional(),
    topReview: z.string().optional(),
    images: z.array(z.string()).optional(),
    salesRank: z.array(z.string()).optional(),
    salesVolume: z.string().optional(),
    marketplaceDomain: z.string().optional(),
  }).optional(),
});
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;

const OPENAI_API_KEY = process.env.CHATGPT_SEARCH_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_MODEL = normalizeModelName(process.env.OPENAI_COMPANY_INFO_MODEL) || 'gpt-4.1-mini';

export async function getCompanyInfo(input: CompanyInfoInput): Promise<CompanyInfo> {
  const domain = cleanDomain(input.domain);

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI configuration missing. Please set OPENAI_API_KEY.');
  }

  const prompt = generatePrompt(domain);

  try {
    const response = await callOpenAI(prompt);
    const parsedOutput = parseAIResponse(response);

    const finalOutput: CompanyInfo = {
      ...parsedOutput,
      website: `https://www.${domain}`,
    };

    return finalOutput;
  } catch (error) {
    console.error('Error getting company info:', error);

    // Fallback response
    return {
      companyName: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      shortDescription: `A company operating at ${domain}. Unable to fetch detailed information.`,
      productsAndServices: [],
      keywords: [],
      competitors: [],
      website: `https://www.${domain}`,
    };
  }
}

function cleanDomain(domain: string): string {
  // Remove protocol if present
  let cleanedDomain = domain.replace(/^https?:\/\//, '');

  // Remove www if present
  cleanedDomain = cleanedDomain.replace(/^www\./, '');

  // Remove trailing slash
  cleanedDomain = cleanedDomain.replace(/\/$/, '');

  return cleanedDomain;
}

function generatePrompt(domain: string): string {
  return `You are an AI assistant tasked with extracting structured company information from a given domain using publicly available data.

Input:  
Domain: ${domain}

Your Objective:  
Research the domain and relevant pages (e.g., homepage, /products, /services) and return the following structured information based only on verifiable evidence from the website or top-ranked search results. Avoid assumptions.

Output Structure:
You MUST return a valid JSON object with all of the following fields. If you cannot find information for a specific field, return an empty string "" for text fields or an empty array [] for list fields. DO NOT omit any fields.

{
  "companyName": "Identify the official brand or company name",
  "shortDescription": "A concise 2 to 3 sentence summary describing what the company does",
  "productsAndServices": ["A", "bullet-point", "list", "of", "main", "products", "services", "features", "or", "offerings"],
  "keywords": ["4", "to", "5", "relevant", "keywords", "or", "phrases"],
  "competitors": ["3", "to", "5", "main", "competitor", "companies", "or", "brands"]
}

Instructions:
- Prioritize clarity, conciseness, and factual accuracy.
- Prefer the company's own site first. Only use external web search if the website itself does not provide enough information.
- If external search is needed, keep it to a single targeted search.
- For competitors: Identify companies that offer the SAME or SIMILAR products/services as listed. Include both direct competitors (same target market) and companies that provide alternative solutions to the same customer problems.
- Consider businesses that target the same customer segments, industries, or solve similar pain points.
- Do NOT infer or speculate beyond what is clearly stated in the source content.
- Return ONLY the JSON object, no additional text or formatting.
- Ensure the JSON is valid and properly formatted.`;
}

function normalizeModelName(model: string | undefined): string {
  return (model || '').trim().replace(/\s+/g, '-');
}

async function callOpenAI(prompt: string): Promise<string> {
  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const response = await client.responses.create({
    model: OPENAI_MODEL,
    tools: [{ type: 'web_search_preview' }],
    input: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant that provides structured company information based on domain research. Always respond with valid JSON format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.1,
  });

  if (!response.output_text) {
    throw new Error('Invalid response from OpenAI API');
  }

  return response.output_text;
}

function parseAIResponse(response: string): Omit<CompanyInfo, 'website'> {
  try {
    // Clean the response to extract JSON
    let cleanedResponse = response.trim();

    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedResponse);

    // Validate the parsed response has required fields
    const result = {
      companyName: parsed.companyName || '',
      shortDescription: parsed.shortDescription || '',
      productsAndServices: Array.isArray(parsed.productsAndServices) ? parsed.productsAndServices : [],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      competitors: Array.isArray(parsed.competitors) ? parsed.competitors : [],
    };

    return result;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    console.error('Raw response:', response);

    // Return empty structure if parsing fails
    return {
      companyName: '',
      shortDescription: '',
      productsAndServices: [],
      keywords: [],
      competitors: [],
    };
  }
}

