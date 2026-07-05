import type { RecommendationData } from '@/firebase/firestore/dashboardData';

const PRIORITIES: RecommendationData['priority'][] = ['high', 'medium', 'low'];
const CATEGORIES = [
  'Content Strategy',
  'Reputation Management',
  'Market Intelligence',
  'Competitive Analysis',
  'AI Visibility',
];

function pickPriority(index: number): RecommendationData['priority'] {
  return PRIORITIES[index % PRIORITIES.length];
}

function pickCategory(index: number): string {
  return CATEGORIES[index % CATEGORIES.length];
}

function cleanLine(line: string): string {
  return line
    .replace(/^[\s\-*•\d.)]+/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function splitIntoItems(content: string): string[] {
  const lines = content
    .split(/\n+/)
    .map(cleanLine)
    .filter((line) => line.length > 20);

  if (lines.length >= 2) return lines.slice(0, 5);

  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map(cleanLine)
    .filter((s) => s.length > 30);

  return sentences.slice(0, 5);
}

function toTitle(text: string): string {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text;
  if (firstSentence.length <= 80) return firstSentence;
  return `${firstSentence.slice(0, 77)}...`;
}

/**
 * Turn a Cognee search response into dashboard recommendation cards.
 * Returns an empty array when parsing fails — caller keeps existing fallbacks.
 */
export function formatCogneeRecommendations(
  cogneeContent: string,
  brandName?: string
): RecommendationData[] {
  const items = splitIntoItems(cogneeContent);
  if (items.length === 0) return [];

  return items.map((item, index) => {
    const title = toTitle(item);
    const description =
      item.length > title.length ? item : `Actionable insight for ${brandName || 'your brand'} based on AI visibility data.`;

    return {
      id: `cognee-${index + 1}`,
      title,
      description,
      priority: pickPriority(index),
      category: pickCategory(index),
      imageUrl: '',
      readTime: 'Powered by Cognee',
      rating: 4.5,
    };
  });
}
