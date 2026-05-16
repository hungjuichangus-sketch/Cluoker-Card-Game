import type { Card, PlayedClue } from '../game/types';

export interface LobbyPlayer {
  id: string;
  name: string;
}

export interface LobbyView {
  roomCode: string;
  hostId: string;
  players: LobbyPlayer[];
  state: 'waiting' | 'playing' | 'finished';
}

export interface OpponentView {
  id: string;
  name: string;
  answerCard: Card;
  playedClues: PlayedClue[];
  hasGuessed: boolean;
  isEliminated: boolean;
}

export interface PlayerView {
  phase: 'waiting' | 'playing' | 'finished';
  playerId: string;
  playerName: string;
  isHost: boolean;
  roomCode: string;
  myHand: Card[];
  myPlayedClues: PlayedClue[];
  myHasGuessed: boolean;
  myIsEliminated: boolean;
  myAnswerCard?: Card;
  opponents: OpponentView[];
  activePlayerId: string | null;
  deckCount: number;
  winners: string[];
  winnerNames: string[];
  actionLog: string[];
}
