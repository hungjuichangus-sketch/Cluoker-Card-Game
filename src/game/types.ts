export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

// A=1, 2-10, J=11, Q=12, K=13
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type ClueResult = 'yes' | 'no';

export interface PlayedClue {
  card: Card;
  result: ClueResult;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  answerCard: Card;        // hidden from this player, visible to others
  hand: Card[];            // 3-card hand, hidden from other players
  playedClues: PlayedClue[];
  hasGuessed: boolean;     // each player gets only one guess
  isEliminated: boolean;
  difficulty?: Difficulty; // only for AI players
}

export type GamePhase =
  | 'setup'
  | 'player_turn'
  | 'ai_turn'
  | 'guess'
  | 'game_over';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  humanPlayerIndex: number;
  activePlayerIndex: number;
  deck: Card[];
  winners: string[];              // player IDs of winners
  lastChancePlayers: string[] | null; // null = normal play; array = last round in progress
}
