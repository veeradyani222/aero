import { CompanyInfo } from '@/lib/get-company-info';

export interface AmazonProductContext {
  asin: string;
  url: string;
  title: string;
  brand?: string;
  category?: string[];
  price?: number | string;
  rating?: number | string;
  reviewsCount?: number | string;
  bulletPoints?: string[];
  description?: string;
  topReview?: string;
  images?: string[];
  salesRank?: string[];
  salesVolume?: string;
  marketplaceDomain?: string;
}

export function extractAsin(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const directAsin = trimmed.match(/^[A-Z0-9]{10}$/i);
  if (directAsin) {
    return trimmed.toUpperCase();
  }

  const urlPatterns = [
    /\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /\/gp\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /\/product\/([A-Z0-9]{10})(?:[/?]|$)/i,
    /[?&]asin=([A-Z0-9]{10})(?:&|$)/i,
  ];

  for (const pattern of urlPatterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1].toUpperCase();
    }
  }

  return null;
}

export function buildAmazonProductUrl(asin: string, marketplaceDomain = 'com'): string {
  return `https://www.amazon.${marketplaceDomain}/dp/${asin}`;
}

function getDecodoAuthHeader(): string | null {
  const token = process.env.DECODO_API_KEY;

  if (token?.trim()) {
    const cleanToken = token.trim();
    return cleanToken.toLowerCase().startsWith('basic ')
      ? cleanToken
      : `Basic ${cleanToken}`;
  }

  return null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\n|;|\u2022/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function flattenCategory(category: any): string[] {
  if (!Array.isArray(category)) {
    return [];
  }

  return category.flatMap((item) => {
    const ladder = Array.isArray(item?.ladder) ? item.ladder : [];
    return ladder.map((entry: any) => String(entry?.name || '').trim()).filter(Boolean);
  });
}

function flattenSalesRank(salesRank: any): string[] {
  if (!Array.isArray(salesRank)) {
    return [];
  }

  return salesRank
    .map((entry) => {
      const category = entry?.ladder?.[0]?.name ? String(entry.ladder[0].name).trim() : '';
      return entry?.rank ? `#${entry.rank}${category ? ` in ${category}` : ''}` : category;
    })
    .filter(Boolean);
}

function normalizeDecodoProduct(rawProduct: any, asin: string, marketplaceDomain: string): AmazonProductContext {
  const title = String(rawProduct?.product_name || rawProduct?.title || '').trim();

  if (!title) {
    throw new Error(
      `Amazon returned no product title for ASIN ${asin} on amazon.${marketplaceDomain}. Try the product's correct Amazon country/marketplace.`
    );
  }

  return {
    asin,
    url: rawProduct?.url || buildAmazonProductUrl(asin, marketplaceDomain),
    title,
    marketplaceDomain,
    brand: rawProduct?.brand || rawProduct?.manufacturer || undefined,
    category: flattenCategory(rawProduct?.category),
    price: rawProduct?.price ?? rawProduct?.price_buybox ?? rawProduct?.price_upper,
    rating: rawProduct?.rating,
    reviewsCount: rawProduct?.reviews_count,
    bulletPoints: asStringArray(rawProduct?.bullet_points),
    description: rawProduct?.description || undefined,
    topReview: rawProduct?.top_review || undefined,
    images: asStringArray(rawProduct?.images).slice(0, 8),
    salesRank: flattenSalesRank(rawProduct?.sales_rank),
    salesVolume: rawProduct?.sales_volume || undefined,
  };
}

export async function fetchAmazonProductWithDecodo(
  asin: string,
  marketplaceDomain = 'com'
): Promise<AmazonProductContext> {
  const authHeader = getDecodoAuthHeader();

  if (!authHeader) {
    throw new Error('Decodo API key missing. Set DECODO_API_KEY in .env.local.');
  }

  const response = await fetch('https://scraper-api.decodo.com/v2/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      target: 'amazon_product',
      query: asin,
      domain: marketplaceDomain,
      parse: true,
      autoselect_variant: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Decodo Amazon product scrape failed with HTTP ${response.status}`);
  }

  const data = await response.json();
  const product = data?.results?.[0]?.content?.results;

  if (!product) {
    throw new Error('Decodo did not return parsed Amazon product details.');
  }

  return normalizeDecodoProduct(product, asin, marketplaceDomain);
}

export function amazonProductToCompanyInfo(
  product: AmazonProductContext,
  amazonOnlySearch: boolean
): CompanyInfo {
  const brand = product.brand?.trim() || product.title.split(/\s+/).slice(0, 2).join(' ');
  const category = product.category?.filter(Boolean) || [];
  const bullets = product.bulletPoints?.filter(Boolean) || [];
  const descriptionParts = [
    product.description,
    bullets.slice(0, 2).join(' '),
    product.rating ? `Amazon rating: ${product.rating}.` : '',
    product.salesVolume ? `Sales signal: ${product.salesVolume}.` : '',
  ].filter(Boolean);

  const keywords = [
    ...category.slice(-3),
    ...product.title.split(/[,\-:|]/).slice(0, 3),
    ...bullets.slice(0, 2).map((bullet) => bullet.split(/[,.]/)[0]),
  ]
    .map((item) => item.trim().toLowerCase())
    .filter((item, index, arr) => item && arr.indexOf(item) === index)
    .slice(0, 6);

  return {
    companyName: brand,
    shortDescription:
      descriptionParts.join(' ') ||
      `${product.title} is an Amazon product listed under ASIN ${product.asin}.`,
    productsAndServices: [
      product.title,
      ...bullets.slice(0, 5),
    ].filter(Boolean),
    keywords,
    competitors: [],
    website: product.url,
    sourceType: 'amazon',
    amazonAsin: product.asin,
    amazonOnlySearch,
    amazonProduct: product,
  };
}

