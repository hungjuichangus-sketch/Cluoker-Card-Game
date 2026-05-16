import type { Player } from '../game/types';
import { CardFace } from './CardFace';
import { ClueHistory } from './ClueHistory';

interface OpponentZoneProps {
  player: Player;
  isActive: boolean;
}

export function OpponentZone({ player, isActive }: OpponentZoneProps) {
  return (
    <div
      className={`bg-green-800/40 rounded-xl p-3 border-2 transition-all duration-300
        ${isActive ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-green-700/50'}
        ${player.isEliminated ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white font-bold text-sm">{player.name}</span>
        {isActive && !player.isEliminated && (
          <span className="text-yellow-300 text-xs animate-pulse">● thinking…</span>
        )}
        {player.isEliminated && (
          <span className="text-red-400 text-xs font-medium">✗ Eliminated</span>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <p className="text-gray-400 text-[10px] mb-1">Answer Card (visible to you)</p>
          <CardFace card={player.answerCard} size="md" />
        </div>

        {player.playedClues.length > 0 && (
          <div className="flex-1 min-w-0">
            <ClueHistory clues={player.playedClues} title="Clues played" />
          </div>
        )}

        {player.playedClues.length === 0 && (
          <p className="text-green-700 text-xs self-center italic">No clues played yet</p>
        )}
      </div>
    </div>
  );
}
