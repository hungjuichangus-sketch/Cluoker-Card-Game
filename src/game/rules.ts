import type { Card, Rank } from './types';

const MAX_RANK = 13;

function isAdjacentOrEqual(a: Rank, b: Rank): boolean {
  if (a === b) return true;
  const diff = Math.abs(a - b);
  // normal adjacency or wrap-around (A=1 and K=13 are adjacent)
  return diff === 1 || diff === MAX_RANK - 1;
}

export function isClue(played: Card, answer: Card): boolean {
  return played.suit === answer.suit || isAdjacentOrEqual(played.rank, answer.rank);
}

// Returns every card that is still a possible Answer Card given the clue history.
export function computePossibleAnswers(
  allCards: Card[],
  playedClues: Array<{ card: Card; result: 'yes' | 'no' }>,
): Card[] {
  return allCards.filter((candidate) =>
    playedClues.every(({ card, result }) => {
      const wouldBeClue = isClue(card, candidate);
      return result === 'yes' ? wouldBeClue : !wouldBeClue;
    }),
  );
}
