import type { PlayedClue } from '../game/types';
import { CardFace } from './CardFace';

interface ClueHistoryProps {
  clues: PlayedClue[];
  title?: string;
}

export function ClueHistory({ clues, title }: ClueHistoryProps) {
  if (clues.length === 0) return null;

  const yes = clues.filter((c) => c.result === 'yes');
  const no = clues.filter((c) => c.result === 'no');

  return (
    <div className="space-y-1.5">
      {title && <p className="text-gray-400 text-xs">{title}</p>}
      <div className="flex flex-wrap gap-2">
        {yes.map((clue, i) => (
          <div key={`y-${i}`} className="relative">
            <CardFace card={clue.card} size="sm" className="border-green-400" />
            <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow">
              Y
            </span>
          </div>
        ))}
        {no.map((clue, i) => (
          <div key={`n-${i}`} className="relative">
            <CardFace card={clue.card} size="sm" className="border-red-400 opacity-60" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow">
              N
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
