import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CardFace } from '../components/CardFace';
import { ClueHistory } from '../components/ClueHistory';
import { GuessModal } from '../components/GuessModal';
import { cardLabel } from '../game/deck';
import type { OpponentView } from '../types/multiplayer';

function MultiOpponentZone({ opp, isActive }: { opp: OpponentView; isActive: boolean }) {
  return (
    <div className={`bg-green-800/40 rounded-xl p-3 border-2 transition-all duration-300
      ${isActive ? 'border-yellow-400 shadow-lg shadow-yellow-400/20' : 'border-green-700/50'}
      ${opp.isEliminated ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white font-bold text-sm">{opp.name}</span>
        {isActive && !opp.isEliminated && (
          <span className="text-yellow-300 text-xs animate-pulse">● their turn</span>
        )}
        {opp.isEliminated && <span className="text-red-400 text-xs">✗ Eliminated</span>}
      </div>
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <p className="text-gray-400 text-[10px] mb-1">Answer Card</p>
          <CardFace card={opp.answerCard} size="md" />
        </div>
        {opp.playedClues.length > 0 && (
          <div className="flex-1 min-w-0">
            <ClueHistory clues={opp.playedClues} title="Clues played" />
          </div>
        )}
      </div>
    </div>
  );
}

export function MultiGamePage() {
  const mpView = useGameStore((s) => s.mpView);
  const mpError = useGameStore((s) => s.mpError);
  const mpPlayClue = useGameStore((s) => s.mpPlayClue);
  const mpMakeGuess = useGameStore((s) => s.mpMakeGuess);
  const mpRestartGame = useGameStore((s) => s.mpRestartGame);
  const leaveOnlineRoom = useGameStore((s) => s.leaveOnlineRoom);

  const [isGuessModalOpen, setGuessModalOpen] = useState(false);
  const [guessEliminated, setGuessEliminated] = useState<Set<string>>(new Set());

  if (!mpView) return null;

  const isMyTurn = mpView.activePlayerId === mpView.playerId && mpView.phase === 'playing';
  const isFinished = mpView.phase === 'finished';
  const iWon = mpView.winners.includes(mpView.playerId);

  const statusText = isFinished
    ? iWon
      ? '🎉 You cracked the code — You win!'
      : mpView.winnerNames.length > 0
        ? `${mpView.winnerNames.join(', ')} won!`
        : '💀 Eliminated — Better luck next time.'
    : isMyTurn
      ? 'Your turn — click a card to play a clue'
      : `Waiting for ${mpView.opponents.find((o) => o.id === mpView.activePlayerId)?.name ?? 'opponent'}…`;

  function handleGuess(card: Parameters<typeof mpMakeGuess>[0]) {
    mpMakeGuess(card);
    setGuessModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-green-950 flex flex-col p-4 gap-3 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-black text-lg tracking-widest">CLUOKER</span>
        <span className="text-green-600 text-sm font-mono tracking-widest">{mpView.roomCode}</span>
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-sm">{mpView.deckCount} cards</span>
          <button onClick={leaveOnlineRoom} className="text-green-700 hover:text-green-400 text-sm transition-colors">
            Leave
          </button>
        </div>
      </div>

      {/* Status */}
      <div className={`text-center text-sm font-medium py-2 px-4 rounded-lg transition-colors
        ${isFinished
          ? iWon ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-900/40 text-red-300'
          : isMyTurn ? 'bg-green-800/50 text-green-300' : 'bg-blue-900/30 text-blue-300 animate-pulse'}`}
      >
        {statusText}
      </div>

      {mpError && (
        <p className="text-red-400 text-xs text-center bg-red-900/20 rounded-lg px-3 py-1">{mpError}</p>
      )}

      {/* Opponent zones */}
      <div className="flex gap-3 flex-wrap">
        {mpView.opponents.map((opp) => (
          <div key={opp.id} className="flex-1 min-w-56">
            <MultiOpponentZone opp={opp} isActive={!isFinished && mpView.activePlayerId === opp.id} />
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* My zone */}
      <div className="bg-green-800/25 rounded-xl p-4 border border-green-700/40 space-y-4">
        <div className="flex items-start gap-6 flex-wrap">
          <div className="shrink-0">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Your Answer Card</p>
            <CardFace faceDown size="md" />
            {isFinished && mpView.myAnswerCard && (
              <p className="text-yellow-400 text-xs mt-1 text-center font-bold">
                {cardLabel(mpView.myAnswerCard)}
              </p>
            )}
          </div>
          {mpView.myPlayedClues.length > 0 && (
            <div className="flex-1">
              <ClueHistory clues={mpView.myPlayedClues} title="Your clues played" />
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            Your Hand{isMyTurn ? ' — click to play a clue' : ' — not your turn'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {mpView.myHand.map((card, i) => (
              <CardFace
                key={i}
                card={card}
                size="md"
                onClick={isMyTurn ? () => mpPlayClue(i) : undefined}
                className={!isMyTurn ? 'opacity-50' : ''}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {isMyTurn && !mpView.myHasGuessed && (
            <button
              onClick={() => setGuessModalOpen(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold
                rounded-lg text-sm transition-colors shadow"
            >
              Make a Guess (one chance!)
            </button>
          )}
          {isFinished && mpView.isHost && (
            <button
              onClick={mpRestartGame}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg text-sm transition-colors"
            >
              New Round
            </button>
          )}
          {isFinished && !mpView.isHost && (
            <span className="text-green-600 text-sm animate-pulse">Waiting for host to start a new round…</span>
          )}
          {isFinished && (
            <button
              onClick={leaveOnlineRoom}
              className="px-4 py-2 bg-green-900/60 hover:bg-green-800 text-green-400 font-medium rounded-lg text-sm transition-colors"
            >
              Leave Room
            </button>
          )}
        </div>
      </div>

      {/* Action log */}
      {mpView.actionLog.length > 0 && (
        <div className="space-y-0.5">
          {[...mpView.actionLog].reverse().slice(0, 4).map((entry, i) => (
            <p key={i} className={`text-xs ${i === 0 ? 'text-gray-300' : 'text-gray-600'}`}>
              {entry}
            </p>
          ))}
        </div>
      )}

      {isGuessModalOpen && (
        <GuessModal
          eliminated={guessEliminated}
          onEliminatedChange={setGuessEliminated}
          onGuess={handleGuess}
          onClose={() => setGuessModalOpen(false)}
        />
      )}
    </div>
  );
}
