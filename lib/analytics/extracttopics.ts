import natural from "natural";

const tokenizer = new natural.WordTokenizer();

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "how",
  "why",
  "what",
  "is",
  "are",
  "will",
  "with",
  "your",
  "this",
  "that",
  "from",
  "into",
  "using",
  "build",
]);

export function extractTopics(text: string): string[] {
  const tokens = tokenizer.tokenize(text.toLowerCase());

  const cleanedTokens = tokens.filter((token) => {
    return token.length > 2 && !STOP_WORDS.has(token);
  });

  return [...new Set(cleanedTokens)];
}
