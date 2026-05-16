import type { Card } from '../game/types';
import { rankLabel } from '../game/deck';

const SUIT_SYMBOL: Record<string, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const SIZES = {
  sm: { outer: 'w-10 h-14', rank: 'text-[10px]', suit: 'text-base' },
  md: { outer: 'w-14 h-20', rank: 'text-xs', suit: 'text-xl' },
  lg: { outer: 'w-16 h-24', rank: 'text-sm', suit: 'text-2xl' },
};

interface CardFaceProps {
  card?: Card;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  highlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CardFace({
  card,
  faceDown = false,
  size = 'md',
  selected = false,
  highlighted = false,
  onClick,
  className = '',
}: CardFaceProps) {
  const sz = SIZES[size];
  const clickable = !!onClick;

  if (faceDown || !card) {
    return (
      <div
        className={`${sz.outer} rounded-lg border-2 shadow-md flex items-center justify-center
          bg-indigo-900 border-indigo-600
          ${clickable ? 'cursor-pointer hover:border-indigo-400' : 'cursor-default'}
          ${className}`}
        onClick={onClick}
      >
        <span className="text-indigo-300 font-black text-sm select-none">?</span>
      </div>
    );
  }

  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  const textColor = isRed ? 'text-red-600' : 'text-gray-900';
  const borderColor = selected
    ? 'border-yellow-400 ring-2 ring-yellow-300'
    : highlighted
      ? 'border-blue-400 ring-1 ring-blue-300'
      : 'border-gray-200';

  return (
    <div
      className={`${sz.outer} bg-white rounded-lg border-2 ${borderColor} shadow-md
        flex flex-col p-1 select-none
        ${clickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-100' : 'cursor-default'}
        ${textColor} ${className}`}
      onClick={onClick}
    >
      <span className={`${sz.rank} font-bold leading-none`}>{rankLabel(card.rank)}</span>
      <span className={`flex-1 flex items-center justify-center ${sz.suit} font-bold leading-none`}>
        {SUIT_SYMBOL[card.suit]}
      </span>
      <span className={`${sz.rank} font-bold leading-none rotate-180 self-end`}>{rankLabel(card.rank)}</span>
    </div>
  );
}
