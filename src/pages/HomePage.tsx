import { useState } from 'react';
import type { Difficulty } from '../game/types';
import { useGameStore } from '../store/gameStore';

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function HomePage() {
  const startGame = useGameStore((s) => s.startGame);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [numAi, setNumAi] = useState(1);

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h1 className="text-7xl font-black text-white tracking-widest drop-shadow-lg">CLUOKER</h1>
        <p className="text-green-400 mt-2 text-sm tracking-wider">DEDUCE YOUR HIDDEN CARD</p>
      </div>

      <div className="bg-green-900/60 border border-green-700/50 rounded-2xl p-6 w-full max-w-xs space-y-5">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">AI Difficulty</p>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors
                  ${difficulty === d
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-green-800/60 text-gray-400 hover:text-white hover:bg-green-700/60'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Opponents</p>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumAi(n)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors
                  ${numAi === n
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-green-800/60 text-gray-400 hover:text-white hover:bg-green-700/60'}`}
              >
                {n} CPU
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => startGame(difficulty, numAi)}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600
            text-gray-900 font-black rounded-xl text-base tracking-wide transition-colors shadow-lg"
        >
          Deal Cards
        </button>
      </div>

      <div className="text-center text-green-800 text-xs max-w-xs space-y-1">
        <p>Play clues from your hand to narrow down your hidden Answer Card.</p>
        <p>One wrong guess eliminates you. Good luck.</p>
      </div>

      {/* Rulebook links */}
      <div className="flex gap-4">
        <a
          href="https://github.com/hungjuichangus-sketch/Cluoker-Card-Game/blob/main/Cluoker%20Rulebook%20v1.0.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-green-700/50
            text-green-500 hover:text-white hover:border-green-500 text-xs font-medium transition-colors"
        >
          📖 Rules (EN)
        </a>
        <a
          href="https://github.com/hungjuichangus-sketch/Cluoker-Card-Game/blob/main/Cluoker%20%E4%B8%AD%E6%96%87%E8%A6%8F%E5%89%87%E6%9B%B8v1.0.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-green-700/50
            text-green-500 hover:text-white hover:border-green-500 text-xs font-medium transition-colors"
        >
          📖 規則書 (中文)
        </a>
      </div>
    </div>
  );
}
