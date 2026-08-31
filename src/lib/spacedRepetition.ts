import { Flashcard } from '../types';

export type ReviewRating = 1 | 2 | 3 | 4; // 1 = Again, 2 = Hard, 3 = Good, 4 = Easy

export interface ReviewResult {
  interval: number;
  repetition: number;
  easeFactor: number;
  dueDate: string;
}

/**
 * SuperMemo SM-2 Spaced Repetition Algorithm
 * Computes optimal interval and ease factor based on student recall rating.
 */
export const calculateSM2 = (card: Flashcard, rating: ReviewRating): ReviewResult => {
  let { repetition, interval, easeFactor } = card;

  // Map 1-4 rating to SM-2 quality (0 to 5)
  // 1 (Again) -> 0
  // 2 (Hard) -> 3
  // 3 (Good) -> 4
  // 4 (Easy) -> 5
  const qualityMap: Record<ReviewRating, number> = {
    1: 0,
    2: 3,
    3: 4,
    4: 5
  };
  const q = qualityMap[rating];

  // Update Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (q < 3) {
    // If forgotten (Again), reset repetitions and set interval to 1 day
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = rating === 2 ? 3 : 6;
    } else {
      const modifier = rating === 4 ? 1.3 : rating === 2 ? 0.85 : 1.0;
      interval = Math.round(interval * easeFactor * modifier);
    }
    repetition += 1;
  }

  // Calculate next due date
  const now = new Date();
  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  const dueDate = nextDate.toISOString().split('T')[0];

  return {
    interval,
    repetition,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    dueDate
  };
};

export const isCardDueToday = (card: Flashcard): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return !card.dueDate || card.dueDate <= today;
};
