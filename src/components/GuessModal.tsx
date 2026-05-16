import { useState } from 'react';
import type { Card, Rank } from '../game/types';
import { cardLabel } from '../game/deck';
import { CardFace } from './CardFace';

const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'] as const;
type Suit = typeof SUITS[number];

const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣',
};
const SUIT_TEXT_COLOR: Record<Suit, string> = {
  spades: 'text-gray-100', hearts: 'text-red-400', diamonds: 'text-red-400', clubs: 'text-gray-100',
};

const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

function cardKey(card: Card): string {
  return `${card.suit}-${card.rank}`;
}

interface GuessModalProps {
  eliminated: Set<string>;
  onEliminatedChange: (next: Set<string>) => void;
  onGuess: (card: Card) => void;
  onClose: () => void;
  canGuess?: boolean;
}

export function GuessModal({ eliminated, onEliminatedChange, onGuess, onClose, canGuess = true }: GuessModalProps) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [eliminateMode, setEliminateMode] = useState(false);

  function isEliminated(card: Card) {
    return eliminated.has(cardKey(card));
  }

  function isSelected(card: Card) {
    return selected?.suit === card.suit && selected?.rank === card.rank;
  }

  function isSuitFullyEliminated(suit: Suit) {
    return RANKS.every((rank) => eliminated.has(cardKey({ suit, rank })));
  }

  function toggleCard(card: Card) {
    if (eliminateMode) {
      const key = cardKey(card);
      const currentlyEliminated = eliminated.has(key);
      if (!currentlyEliminated && isSelected(card)) setSelected(null);
      const next = new Set(eliminated);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      onEliminatedChange(next);
    } else {
      if (isEliminated(card)) return; // can't select an eliminated card
      setSelected(isSelected(card) ? null : card);
    }
  }

  function toggleSuit(suit: Suit) {
    const keys = RANKS.map((rank) => cardKey({ suit, rank }));
    const allEliminated = keys.every((k) => eliminated.has(k));
    const next = new Set(eliminated);
    if (allEliminated) {
      keys.forEach((k) => next.delete(k));
    } else {
      keys.forEach((k) => next.add(k));
      if (selected?.suit === suit) setSelected(null);
    }
    onEliminatedChange(next);
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-5 w-full max-w-2xl shadow-2xl">

        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-black text-lg leading-none">{canGuess ? 'Make Your Guess' : 'Card Board'}</h2>
            <p className="text-gray-500 text-xs mt-1">{canGuess ? 'One shot only — choose carefully.' : 'Track possibilities — not your turn to guess.'}</p>
          </div>

          {/* Eliminate mode toggle */}
          <button
            onClick={() => setEliminateMode((m) => !m)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0
              ${eliminateMode
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <span className="text-sm">✕</span>
            Eliminate Mode {eliminateMode ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Card grid */}
        <div className="space-y-1.5 mb-3 overflow-x-auto pb-1">
          {SUITS.map((suit) => {
            const fullyEliminated = isSuitFullyEliminated(suit);
            return (
              <div key={suit} className="flex items-center gap-2">
                {/* Suit row toggle */}
                <button
                  onClick={() => toggleSuit(suit)}
                  title={fullyEliminated ? `Restore all ${suit}` : `Eliminate all ${suit}`}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-base font-bold shrink-0 transition-all
                    ${fullyEliminated
                      ? 'bg-gray-800 opacity-30 ring-1 ring-gray-600'
                      : `bg-gray-800 hover:bg-gray-700 ${SUIT_TEXT_COLOR[suit]}`}`}
                >
                  {SUIT_SYMBOL[suit]}
                </button>

                {/* 13 cards */}
                <div className="flex gap-1">
                  {RANKS.map((rank) => {
                    const card: Card = { suit, rank: rank as Rank };
                    const elim = isEliminated(card);
                    const sel = isSelected(card);
                    return (
                      <CardFace
                        key={rank}
                        card={card}
                        size="sm"
                        selected={sel}
                        onClick={() => toggleCard(card)}
                        className={
                          elim
                            ? 'opacity-20 grayscale'
                            : eliminateMode && !sel
                              ? 'hover:border-red-400'
                              : ''
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-gray-600 text-xs mb-4">
          {eliminateMode
            ? 'Click a card to gray it out. Click the suit symbol to eliminate the whole row. Click again to restore.'
            : 'Click a card to select your guess. Turn on Eliminate Mode to cross out impossible cards first.'}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-3">
          {canGuess ? (
            <button
              disabled={!selected}
              onClick={() => selected && onGuess(selected)}
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500
                text-gray-900 font-bold rounded-lg text-sm transition-colors"
            >
              {selected ? `Guess ${cardLabel(selected)}` : 'Select a card to guess'}
            </button>
          ) : (
            <span className="text-gray-600 text-xs italic">Wait for your turn to guess</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Close
          </button>
          {eliminated.size > 0 && (
            <button
              onClick={() => onEliminatedChange(new Set())}
              className="ml-auto text-gray-600 hover:text-gray-400 text-xs transition-colors"
            >
              Clear eliminations ({eliminated.size})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
