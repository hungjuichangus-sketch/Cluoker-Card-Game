import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CardFace } from '../components/CardFace';
import { ClueHistory } from '../components/ClueHistory';
import { OpponentZone } from '../components/OpponentZone';
import { GuessModal } from '../components/GuessModal';
import { cardLabel } from '../game/deck';

export function GamePage() {
  const [guessEliminated, setGuessEliminated] = useState<Set<string>>(new Set());
  const game = useGameStore((s) => s.game);
  const isGuessModalOpen = useGameStore((s) => s.isGuessModalOpen);
  const actionLog = useGameStore((s) => s.actionLog);
  const playClue = useGameStore((s) => s.playClue);
  const makeGuess = useGameStore((s) => s.makeGuess);
  const openGuessModal = useGameStore((s) => s.openGuessModal);
  const closeGuessModal = useGameStore((s) => s.closeGuessModal);
  const processCurrentAiTurn = useGameStore((s) => s.processCurrentAiTurn);
  const resetGame = useGameStore((s) => s.resetGame);

  // Drive AI turns: when it's an AI's turn, wait 1.2s then process it.
  // Zustand action refs are stable, so excluding from deps is safe.
  useEffect(() => {
    if (!game || game.phase !== 'ai_turn') return;
    const active = game.players[game.activePlayerIndex];
    if (!active || active.isHuman || active.isEliminated) return;
    const timer = setTimeout(processCurrentAiTurn, 1200);
    return () => clearTimeout(timer);
  }, [game?.phase, game?.activePlayerIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!game) return null;

  const human = game.players[game.humanPlayerIndex];
  const opponents = game.players.filter((p) => !p.isHuman);
  const activePlayer = game.players[game.activePlayerIndex];
  const isHumanTurn = game.phase === 'player_turn' && game.activePlayerIndex === game.humanPlayerIndex;
  const isGameOver = game.phase === 'game_over';
  const humanWon = game.winners.includes(human.id);

  const statusText = isGameOver
    ? humanWon
      ? '🎉 You cracked the code! You win!'
      : game.winners.length > 0
        ? `${game.players.find((p) => p.id === game.winners[0])?.name} guessed correctly. You lose.`
        : '💀 Wrong guess — eliminated!'
    : isHumanTurn
      ? 'Your turn — click a hand card to play it as a clue, or make a guess'
      : `${activePlayer?.name} is thinking…`;

  return (
    <div className="min-h-screen bg-green-950 flex flex-col p-4 gap-3 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-black text-lg tracking-widest text-white">CLUOKER</span>
        <span className="text-green-500 text-sm">{game.deck.length} cards in deck</span>
        <button
          onClick={resetGame}
          className="text-green-700 hover:text-green-400 text-sm transition-colors"
        >
          Quit
        </button>
      </div>

      {/* Status bar */}
      <div
        className={`text-center text-sm font-medium py-2 px-4 rounded-lg transition-colors
          ${isGameOver
            ? humanWon
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-red-900/40 text-red-300'
            : isHumanTurn
              ? 'bg-green-800/50 text-green-300'
              : 'bg-blue-900/30 text-blue-300 animate-pulse'}`}
      >
        {statusText}
      </div>

      {/* Opponent zones */}
      <div className="flex gap-3 flex-wrap">
        {opponents.map((opp) => (
          <div key={opp.id} className="flex-1 min-w-56">
            <OpponentZone
              player={opp}
              isActive={!isGameOver && activePlayer?.id === opp.id}
            />
          </div>
        ))}
      </div>

      {/* Spacer — gives the table some breathing room */}
      <div className="flex-1" />

      {/* Human zone */}
      <div className="bg-green-800/25 rounded-xl p-4 border border-green-700/40 space-y-4">
        <div className="flex items-start gap-6 flex-wrap">
          {/* Answer card */}
          <div className="shrink-0">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Your Answer Card</p>
            <CardFace faceDown size="md" />
            {isGameOver && (
              <p className="text-yellow-400 text-xs mt-1 text-center font-bold">
                {cardLabel(human.answerCard)}
              </p>
            )}
          </div>

          {/* Clue history */}
          {human.playedClues.length > 0 && (
            <div className="flex-1">
              <ClueHistory clues={human.playedClues} title="Your clues played" />
            </div>
          )}
        </div>

        {/* Hand */}
        <div>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-2">
            Your Hand
            {isHumanTurn && ' — click a card to play it as a clue'}
            {!isHumanTurn && !isGameOver && ' — waiting for opponents'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {human.hand.map((card, i) => (
              <CardFace
                key={i}
                card={card}
                size="md"
                onClick={isHumanTurn ? () => playClue(i) : undefined}
                className={!isHumanTurn ? 'opacity-50' : ''}
              />
            ))}
            {human.hand.length === 0 && (
              <p className="text-green-700 text-xs italic">No cards in hand</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          {isHumanTurn && !human.hasGuessed && (
            <button
              onClick={openGuessModal}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600
                text-gray-900 font-bold rounded-lg text-sm transition-colors shadow"
            >
              Make a Guess (one chance!)
            </button>
          )}
          {isGameOver && (
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm transition-colors"
            >
              Play Again
            </button>
          )}
        </div>
      </div>

      {/* Action log */}
      {actionLog.length > 0 && (
        <div className="space-y-0.5">
          {[...actionLog].reverse().slice(0, 4).map((entry, i) => (
            <p
              key={i}
              className={`text-xs ${i === 0 ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {entry}
            </p>
          ))}
        </div>
      )}

      {/* Guess modal */}
      {isGuessModalOpen && (
        <GuessModal
          eliminated={guessEliminated}
          onEliminatedChange={setGuessEliminated}
          onGuess={makeGuess}
          onClose={closeGuessModal}
        />
      )}
    </div>
  );
}
