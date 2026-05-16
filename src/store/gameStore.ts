import { create } from 'zustand';
import type { Card, Difficulty, GamePhase, GameState, Player, PlayedClue } from '../game/types';
import { createShuffledDeck, cardLabel } from '../game/deck';
import { isClue } from '../game/rules';
import { decideAiTurn } from '../game/ai';

export type AppPage = 'home' | 'game';

function cardsEqual(a: Card, b: Card): boolean {
  return a.suit === b.suit && a.rank === b.rank;
}

function buildGame(difficulty: Difficulty, numAiPlayers: number): GameState {
  const deck = createShuffledDeck();
  const total = 1 + numAiPlayers;
  const answerCards = deck.splice(0, total);
  const hands: Card[][] = Array.from({ length: total }, () => deck.splice(0, 3));

  const human: Player = {
    id: 'human',
    name: 'You',
    isHuman: true,
    answerCard: answerCards[0],
    hand: hands[0],
    playedClues: [],
    hasGuessed: false,
    isEliminated: false,
  };

  const ais: Player[] = Array.from({ length: numAiPlayers }, (_, i) => ({
    id: `cpu-${i + 1}`,
    name: `CPU ${i + 1}`,
    isHuman: false,
    answerCard: answerCards[i + 1],
    hand: hands[i + 1],
    playedClues: [],
    hasGuessed: false,
    isEliminated: false,
    difficulty,
  }));

  return {
    phase: 'player_turn',
    players: [human, ...ais],
    humanPlayerIndex: 0,
    activePlayerIndex: 0,
    deck,
    winners: [],
  };
}

function drawOne(deck: Card[], hand: Card[]): { hand: Card[]; deck: Card[] } {
  if (!deck.length) return { hand, deck };
  const [top, ...rest] = deck;
  return { hand: [...hand, top], deck: rest };
}

function nextNonEliminated(players: Player[], from: number): number {
  const n = players.length;
  for (let step = 1; step <= n; step++) {
    const idx = (from + step) % n;
    if (!players[idx].isEliminated) return idx;
  }
  return from;
}

function appendLog(log: string[], entry: string): string[] {
  return [...log, entry].slice(-10);
}

export interface GameStore {
  page: AppPage;
  game: GameState | null;
  isGuessModalOpen: boolean;
  actionLog: string[];

  navigateTo: (page: AppPage) => void;
  startGame: (difficulty: Difficulty, numAiPlayers: number) => void;
  resetGame: () => void;
  playClue: (cardIndex: number) => void;
  makeGuess: (guess: Card) => void;
  openGuessModal: () => void;
  closeGuessModal: () => void;
  processCurrentAiTurn: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  page: 'home',
  game: null,
  isGuessModalOpen: false,
  actionLog: [],

  navigateTo: (page) => set({ page }),

  startGame: (difficulty, numAiPlayers) =>
    set({
      game: buildGame(difficulty, numAiPlayers),
      page: 'game',
      actionLog: ['Game started! Your turn.'],
    }),

  resetGame: () =>
    set({ game: null, page: 'home', isGuessModalOpen: false, actionLog: [] }),

  openGuessModal: () => set({ isGuessModalOpen: true }),
  closeGuessModal: () => set({ isGuessModalOpen: false }),

  playClue: (cardIndex) => {
    const { game, actionLog } = get();
    if (!game || game.phase !== 'player_turn' || game.activePlayerIndex !== game.humanPlayerIndex) return;

    const human = game.players[game.humanPlayerIndex];
    const played = human.hand[cardIndex];
    if (!played) return;

    const result: 'yes' | 'no' = isClue(played, human.answerCard) ? 'yes' : 'no';
    const clue: PlayedClue = { card: played, result };
    const { hand: newHand, deck: newDeck } = drawOne(
      game.deck,
      human.hand.filter((_, i) => i !== cardIndex),
    );

    const updatedHuman: Player = { ...human, hand: newHand, playedClues: [...human.playedClues, clue] };
    const players = game.players.map((p, i) => (i === game.humanPlayerIndex ? updatedHuman : p));
    const log = appendLog(actionLog, `You played ${cardLabel(played)} → ${result === 'yes' ? '✓ Yes' : '✗ No'}`);

    const aiAlive = players.some((p) => !p.isHuman && !p.isEliminated);
    if (!aiAlive) {
      set({
        game: { ...game, players, deck: newDeck, phase: 'game_over', winners: [human.id], activePlayerIndex: game.humanPlayerIndex },
        actionLog: appendLog(log, 'All opponents eliminated — You win!'),
      });
      return;
    }

    const nextIdx = nextNonEliminated(players, game.humanPlayerIndex);
    set({
      game: { ...game, players, deck: newDeck, activePlayerIndex: nextIdx, phase: 'ai_turn' },
      actionLog: log,
    });
  },

  makeGuess: (guess) => {
    const { game, actionLog } = get();
    if (!game) return;

    const human = game.players[game.humanPlayerIndex];
    const correct = cardsEqual(guess, human.answerCard);
    const updatedHuman: Player = { ...human, hasGuessed: true, isEliminated: !correct };
    const players = game.players.map((p, i) => (i === game.humanPlayerIndex ? updatedHuman : p));
    const entry = correct
      ? `You guessed ${cardLabel(guess)} → Correct! You win!`
      : `You guessed ${cardLabel(guess)} → Wrong! Eliminated.`;

    set({
      game: { ...game, players, phase: 'game_over', winners: correct ? [human.id] : [] },
      isGuessModalOpen: false,
      actionLog: appendLog(actionLog, entry),
    });
  },

  processCurrentAiTurn: () => {
    const { game, actionLog } = get();
    if (!game || game.phase !== 'ai_turn') return;

    const aiIdx = game.activePlayerIndex;
    const ai = game.players[aiIdx];
    if (!ai || ai.isHuman || ai.isEliminated) return;

    const decision = decideAiTurn(ai);
    let players = [...game.players];
    let deck = [...game.deck];
    let phase: GamePhase = game.phase;
    let winners = [...game.winners];
    let entry = '';

    if (decision.action === 'guess' && decision.guess) {
      const correct = cardsEqual(decision.guess, ai.answerCard);
      entry = correct
        ? `${ai.name} guessed ${cardLabel(decision.guess)} → Correct! ${ai.name} wins.`
        : `${ai.name} guessed ${cardLabel(decision.guess)} → Wrong! Eliminated.`;

      players = players.map((p, i) =>
        i === aiIdx ? { ...p, hasGuessed: true, isEliminated: !correct } : p,
      );

      if (correct) {
        phase = 'game_over';
        winners = [ai.id];
      } else {
        const alive = players.filter((p) => !p.isEliminated);
        if (alive.length === 1 && alive[0].isHuman) {
          phase = 'game_over';
          winners = [players[game.humanPlayerIndex].id];
          entry += ' You are the last one standing!';
        }
      }
    } else if (decision.action === 'play_clue' && decision.card) {
      const played = decision.card;
      const result: 'yes' | 'no' = isClue(played, ai.answerCard) ? 'yes' : 'no';
      entry = `${ai.name} played ${cardLabel(played)} → ${result === 'yes' ? '✓ Yes' : '✗ No'}`;

      const newHand = ai.hand.filter((c) => !cardsEqual(c, played));
      const drawn = drawOne(deck, newHand);
      deck = drawn.deck;

      players = players.map((p, i) =>
        i === aiIdx
          ? { ...p, hand: drawn.hand, playedClues: [...p.playedClues, { card: played, result }] }
          : p,
      );
    }

    const nextIdx = phase === 'game_over' ? aiIdx : nextNonEliminated(players, aiIdx);
    const nextPhase =
      phase === 'game_over'
        ? 'game_over'
        : nextIdx === game.humanPlayerIndex
          ? 'player_turn'
          : 'ai_turn';

    set({
      game: { ...game, players, deck, activePlayerIndex: nextIdx, phase: nextPhase, winners },
      actionLog: appendLog(actionLog, entry),
    });
  },
}));
