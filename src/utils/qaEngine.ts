import { AnswerType, MysteryLevel } from '../types/game';

interface QAResult {
  answer: AnswerType;
  detail: string;
}

interface SolutionResult {
  isCorrect: boolean;
  message: string;
}

// Tokenize and normalize words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// Check for common synonyms in question evaluation
const SYNONYM_MAP: Record<string, string[]> = {
  dog: ['dog', 'puppy', 'pet', 'hound', 'canine', 'animal'],
  rain: ['rain', 'raining', 'shower', 'storm', 'downpour', 'wet weather'],
  sprinkler: ['sprinkler', 'sprinklers', 'hose', 'garden hose', 'watering'],
  fan: ['fan', 'ceiling fan', 'blower', 'air current', 'ventilation fan'],
  window: ['window', 'glass window', 'casement', 'pane'],
  ice: ['ice', 'frozen', 'solid', 'freeze', 'freezing'],
  person: ['person', 'human', 'someone', 'man', 'woman', 'people', 'anybody', 'nobody'],
  cleaner: ['cleaner', 'janitor', 'custodian', 'maid', 'staff'],
  clock: ['clock', 'watch', 'timepiece', 'timer', 'alarm'],
  fake: ['fake', 'replica', 'imitation', 'prop', 'artificial', 'toy', 'dummy'],
  phone: ['phone', 'mobile', 'cellphone', 'smartphone', 'device'],
  audiobook: ['audiobook', 'audio', 'listening', 'recorded book', 'headphones'],
  key: ['key', 'fob', 'digital key', 'smart key', 'card key'],
  player: ['player', 'me', 'myself', 'i', 'user', 'gamer', 'detective alex and me'],
};

function hasKeywordMatch(queryTokens: string[], targetPhrase: string): boolean {
  const targetTokens = tokenize(targetPhrase);
  if (targetTokens.length === 0) return false;

  // Check if every target token has an equivalent in query tokens or synonyms
  let matchedCount = 0;
  for (const tToken of targetTokens) {
    if (queryTokens.includes(tToken)) {
      matchedCount++;
      continue;
    }
    // Check synonyms
    let foundSynonym = false;
    for (const [key, list] of Object.entries(SYNONYM_MAP)) {
      if ((key === tToken || list.includes(tToken)) && list.some((syn) => queryTokens.includes(syn))) {
        matchedCount++;
        foundSynonym = true;
        break;
      }
    }
    if (foundSynonym) continue;
  }

  // At least 60% of target phrase words matched, or 100% if phrase is short (<=2 words)
  const required = targetTokens.length <= 2 ? targetTokens.length : Math.ceil(targetTokens.length * 0.6);
  return matchedCount >= required;
}

/**
 * Process a user question deterministically against the level facts
 */
export function evaluateQuestion(question: string, level: MysteryLevel): QAResult {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      answer: 'AMBIGUOUS',
      detail: 'Please type a question, detective!',
    };
  }

  const tokens = tokenize(trimmed);

  // Check if it's too short to be meaningful
  if (tokens.length < 2) {
    return {
      answer: 'AMBIGUOUS',
      detail: 'Can you ask that with a few more words, detective?',
    };
  }

  // Check for non-yes/no questions (e.g. starting with "What is", "Where is", "Who was", "How much")
  const openQuestionStarters = ['what', 'why', 'who', 'where', 'when', 'how'];
  const firstWord = tokens[0];
  if (openQuestionStarters.includes(firstWord) && !['is', 'was', 'did', 'does', 'can', 'could', 'were'].includes(tokens[1])) {
    // If it's pure "Who did it?" or "What happened?", prompt for Yes/No format
    if (tokens.length <= 4) {
      return {
        answer: 'AMBIGUOUS',
        detail: 'Try framing your deduction as a YES/NO question (e.g. "Was the...?", "Did someone...?").',
      };
    }
  }

  // 1. Check against Positive Facts (YES)
  for (const fact of level.positiveFacts) {
    if (hasKeywordMatch(tokens, fact)) {
      return {
        answer: 'YES',
        detail: 'Confirmed by verified evidence.',
      };
    }
  }

  // 2. Check against Negative Facts (NO)
  for (const fact of level.negativeFacts) {
    if (hasKeywordMatch(tokens, fact)) {
      return {
        answer: 'NO',
        detail: 'Contradicted by the facts.',
      };
    }
  }

  // 3. Check against known Irrelevant Facts if listed
  if (level.irrelevantFacts && level.irrelevantFacts.length > 0) {
    for (const fact of level.irrelevantFacts) {
      if (hasKeywordMatch(tokens, fact)) {
        return {
          answer: 'NOT RELEVANT',
          detail: 'This detail does not affect the outcome.',
        };
      }
    }
  }

  // 4. Check for common unrelated inquiry topics (colors of walls, clothing, weather when irrelevant, etc.)
  const generalIrrelevantKeywords = [
    'color', 'colour', 'blue', 'green', 'yellow', 'red', 'purple', 'black', 'white',
    'shoes size', 'haircut', 'breakfast', 'socks', 'shirt', 'brand', 'hat',
  ];
  // If query focuses heavily on an irrelevant attribute not mentioned in positive/negative facts
  const matchesIrrelevant = generalIrrelevantKeywords.some((w) => tokens.includes(w));
  const isColorRelevantToLevel = level.keywords.some((k) => generalIrrelevantKeywords.includes(k));

  if (matchesIrrelevant && !isColorRelevantToLevel) {
    return {
      answer: 'NOT RELEVANT',
      detail: 'This attribute is unrelated to what happened.',
    };
  }

  // Check against level title and solution keywords to see if on right track
  let keywordHits = 0;
  for (const kw of level.keywords) {
    if (tokens.includes(kw) || SYNONYM_MAP[kw]?.some((syn) => tokens.includes(syn))) {
      keywordHits++;
    }
  }

  if (keywordHits > 0) {
    return {
      answer: 'YES',
      detail: 'You are on the right track!',
    };
  }

  // Default fallback according to Part 9 rules:
  // "If the question is outside the verified facts, respond: NOT RELEVANT."
  // "If the system cannot confidently determine an answer, it must never invent YES or NO."
  return {
    answer: 'NOT RELEVANT',
    detail: 'This does not relate to the verified solution.',
  };
}

/**
 * Check if the player's written explanation matches the official solution
 */
export function checkSolution(playerAnswer: string, level: MysteryLevel): SolutionResult {
  const trimmed = playerAnswer.trim();
  if (trimmed.length < 3) {
    return {
      isCorrect: false,
      message: 'Please write your explanation of the mystery.',
    };
  }

  const tokens = tokenize(trimmed);

  // Check keywords for this level
  let matchedKeywords = 0;
  for (const kw of level.keywords) {
    const kwTokens = tokenize(kw);
    const hasAll = kwTokens.every((kt) => {
      if (tokens.includes(kt)) return true;
      for (const list of Object.values(SYNONYM_MAP)) {
        if (list.includes(kt) && list.some((syn) => tokens.includes(syn))) {
          return true;
        }
      }
      return false;
    });

    if (hasAll) {
      matchedKeywords++;
    }
  }

  // Also check if critical solution phrases are present in player text
  const solutionTokens = tokenize(level.solution);
  const solutionTokenOverlap = tokens.filter((t) => solutionTokens.includes(t) && t.length > 3).length;

  // Level 200 special: player / me / you
  if (level.id === 200) {
    const playerSelfTerms = ['player', 'me', 'myself', 'i', 'you', 'user', 'gamer', 'alex and me'];
    const matchedSelf = playerSelfTerms.some((term) => tokens.includes(term) || trimmed.toLowerCase().includes(term));
    if (matchedSelf || matchedKeywords >= 1) {
      return {
        isCorrect: true,
        message: 'BRILLIANT! You are the Master Detective!',
      };
    }
  }

  // For general levels: if at least 1-2 distinct keywords match or significant semantic overlap
  const requiredKeywords = Math.min(level.keywords.length >= 3 ? 2 : 1, level.keywords.length);
  if (matchedKeywords >= requiredKeywords || solutionTokenOverlap >= 4) {
    return {
      isCorrect: true,
      message: 'Excellent deduction, detective! That is exactly what happened.',
    };
  }

  return {
    isCorrect: false,
    message: 'Not quite! Look at the clues and hints again, detective.',
  };
}
