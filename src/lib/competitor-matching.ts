// Core competitor matching logic for brand analytics
import fuzzysort from 'fuzzysort';

export interface Competitor {
  name: string;
  domain?: string;
  aliases?: string[];
}

export interface MatchResult {
  competitor: Competitor;
  matchType: 'name' | 'domain' | 'alias' | 'fuzzy';
  matchedValue: string;
  score?: number;
}

/**
 * Normalize a string for comparison (lowercase, trim, remove www)
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/^www\./, '').trim();
}

/**
 * Attempt to match competitors in a given text (query)
 * @param text The text to search for competitor mentions
 * @param competitors List of competitors
 * @param fuzzyThreshold Fuzzysort score threshold (lower is better)
 */
export function matchCompetitorsInText(
  text: string,
  competitors: Competitor[],
  fuzzyThreshold = -50
): MatchResult[] {
  const results: MatchResult[] = [];
  const normalizedText = normalize(text);

  for (const competitor of competitors) {
    // Direct name match
    if (normalizedText.includes(normalize(competitor.name))) {
      results.push({
        competitor,
        matchType: 'name',
        matchedValue: competitor.name,
      });
      continue;
    }
    // Domain match
    if (competitor.domain && normalizedText.includes(normalize(competitor.domain))) {
      results.push({
        competitor,
        matchType: 'domain',
        matchedValue: competitor.domain,
      });
      continue;
    }
    // Alias match
    if (competitor.aliases) {
      for (const alias of competitor.aliases) {
        if (normalizedText.includes(normalize(alias))) {
          results.push({
            competitor,
            matchType: 'alias',
            matchedValue: alias,
          });
          break;
        }
      }
    }
    // Fuzzy match (name and aliases)
    const candidates = [competitor.name, ...(competitor.aliases || [])];
    const fuzzy = fuzzysort.go(normalizedText, candidates, { threshold: fuzzyThreshold });
    if (fuzzy.total > 0) {
      for (const res of fuzzy) {
        results.push({
          competitor,
          matchType: 'fuzzy',
          matchedValue: res.target,
          score: res.score,
        });
      }
    }
  }
  return results;
}

