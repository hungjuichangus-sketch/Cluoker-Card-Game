import type { Card, Difficulty, Player, PlayedClue } from './types';
import { createDeck } from './deck';
import { isClue, computePossibleAnswers } from './rules';
import { shuffle } from './deck';

// Determine the Yes/No answer to give when a player plays a clue card.
// (All other players who CAN see this player's answer card call this.)
export function answerClue(played: Card, answerCard: Card): 'yes' | 'no' {
  return isClue(played, answerCard) ? 'yes' : 'no';
}

// Choose which card from the AI's hand to play as a clue.
// Strategy depends on difficulty:
//   easy   — random card
//   medium — pick the card that eliminates the most possible answers
//   hard   — pick the card that maximally partitions remaining candidates
function chooseCluCard(hand: Card[], playedClues: PlayedClue[], difficulty: Difficulty): Card {
  if (difficulty === 'easy' || hand.length === 0) {
    return shuffle(hand)[0];
  }

  const allCards = createDeck();
  const possible = computePossibleAnswers(allCards, playedClues);

  // For medium and hard: pick the card that splits the possibility space most evenly.
  // Score = how close the yes/no split is to 50/50 (minimises worst-case remaining options).
  let bestCard = hand[0];
  let bestScore = Infinity;

  for (const card of hand) {
    const yesCount = possible.filter((c) => isClue(card, c)).length;
    const noCount = possible.length - yesCount;
    // Distance from perfect 50/50 split; lower is better
    const score = Math.abs(yesCount - noCount);
    if (score < bestScore) {
      bestScore = score;
      bestCard = card;
    }
  }

  return bestCard;
}

// Decide whether the AI should guess this turn instead of playing a clue.
function shouldGuess(playedClues: PlayedClue[], difficulty: Difficulty): boolean {
  const allCards = createDeck();
  const possible = computePossibleAnswers(allCards, playedClues);

  if (difficulty === 'easy') {
    // Guess randomly once fewer than 6 cards remain
    return possible.length <= 6 && Math.random() < 0.3;
  }
  if (difficulty === 'medium') {
    return possible.length === 1;
  }
  // hard: guess when narrowed to 1, or take a calculated risk at 2
  return possible.length <= 2 && Math.random() < 0.5;
}

export interface AiTurnResult {
  action: 'play_clue' | 'guess';
  card?: Card;        // the clue card to play (if action === 'play_clue')
  guess?: Card;       // the guessed Answer Card (if action === 'guess')
}

export function decideAiTurn(ai: Player): AiTurnResult {
  const difficulty = ai.difficulty ?? 'medium';

  if (!ai.hasGuessed && shouldGuess(ai.playedClues, difficulty)) {
    const allCards = createDeck();
    const possible = computePossibleAnswers(allCards, ai.playedClues);
    // Pick the most likely candidate (first after filtering)
    const guess = possible[0];
    return { action: 'guess', guess };
  }

  const card = chooseCluCard(ai.hand, ai.playedClues, difficulty);
  return { action: 'play_clue', card };
}
