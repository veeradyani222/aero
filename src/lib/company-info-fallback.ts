export interface CompanyInfoFallback {
  companyName: string;
  shortDescription: string;
  productsAndServices: string[];
  keywords: string[];
  competitors: string[];
  website: string;
}

export function normalizeCompanyDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .toLowerCase();
}

export function getFallbackCompanyName(domain: string): string {
  const normalizedDomain = normalizeCompanyDomain(domain);
  const firstLabel = normalizedDomain.split('.')[0] || 'Company';

  return firstLabel.charAt(0).toUpperCase() + firstLabel.slice(1);
}

export function createFallbackCompanyInfo(domain: string): CompanyInfoFallback {
  const normalizedDomain = normalizeCompanyDomain(domain);
  const companyName = getFallbackCompanyName(normalizedDomain);

  return {
    companyName,
    shortDescription: `${companyName} operates at ${normalizedDomain}. Detailed company information is temporarily unavailable because AI analysis could not be completed.`,
    productsAndServices: [],
    keywords: [],
    competitors: [],
    website: `https://www.${normalizedDomain}`,
  };
}
