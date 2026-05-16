import { useGameStore } from '../store/gameStore';

export function WaitingRoomPage() {
  const mpRoomCode = useGameStore((s) => s.mpRoomCode);
  const mpLobbyPlayers = useGameStore((s) => s.mpLobbyPlayers);
  const mpIsHost = useGameStore((s) => s.mpIsHost);
  const mpError = useGameStore((s) => s.mpError);
  const startOnlineGame = useGameStore((s) => s.startOnlineGame);
  const leaveOnlineRoom = useGameStore((s) => s.leaveOnlineRoom);

  const canStart = mpIsHost && mpLobbyPlayers.length >= 2;

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-black text-white tracking-widest">CLUOKER</h1>
        <p className="text-green-400 mt-1 text-sm">Waiting for players…</p>
      </div>

      {/* Room code — big and shareable */}
      <div className="bg-green-900/60 border border-green-700/50 rounded-2xl p-6 w-full max-w-xs text-center space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Room Code</p>
        <p className="text-5xl font-black text-yellow-400 tracking-widest">{mpRoomCode}</p>
        <p className="text-gray-500 text-xs">Share this code with friends</p>
      </div>

      {/* Player list */}
      <div className="bg-green-900/40 border border-green-700/30 rounded-xl p-4 w-full max-w-xs space-y-2">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
          Players ({mpLobbyPlayers.length}/6)
        </p>
        {mpLobbyPlayers.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="text-white text-sm">{p.name}</span>
            {mpIsHost && mpLobbyPlayers[0]?.id === p.id && (
              <span className="text-yellow-500 text-[10px] ml-auto">HOST</span>
            )}
          </div>
        ))}
        {mpLobbyPlayers.length < 2 && (
          <p className="text-green-800 text-xs italic pt-1">Waiting for at least one more player…</p>
        )}
      </div>

      {mpError && (
        <p className="text-red-400 text-xs bg-red-900/20 rounded-lg px-4 py-2">{mpError}</p>
      )}

      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        {mpIsHost ? (
          <button
            onClick={startOnlineGame}
            disabled={!canStart}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700
              disabled:text-gray-500 text-gray-900 font-black rounded-xl text-base transition-colors"
          >
            {canStart ? 'Start Game' : 'Waiting for players…'}
          </button>
        ) : (
          <div className="w-full py-3 text-center text-green-600 text-sm animate-pulse">
            Waiting for host to start the game…
          </div>
        )}
        <button
          onClick={leaveOnlineRoom}
          className="text-green-700 hover:text-green-400 text-sm transition-colors"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
