import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

type Mode = 'choose' | 'create' | 'join';

export function LobbyPage() {
  const [mode, setMode] = useState<Mode>('choose');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const createOnlineRoom = useGameStore((s) => s.createOnlineRoom);
  const joinOnlineRoom = useGameStore((s) => s.joinOnlineRoom);
  const mpError = useGameStore((s) => s.mpError);
  const clearMpError = useGameStore((s) => s.clearMpError);
  const navigateTo = useGameStore((s) => s.navigateTo);

  function handleCreate() {
    if (!name.trim()) return;
    createOnlineRoom(name.trim());
  }

  function handleJoin() {
    if (!name.trim() || code.trim().length < 4) return;
    joinOnlineRoom(name.trim(), code.trim());
  }

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-black text-white tracking-widest">CLUOKER</h1>
        <p className="text-green-400 mt-1 text-sm tracking-wider">PLAY WITH FRIENDS</p>
      </div>

      <div className="bg-green-900/60 border border-green-700/50 rounded-2xl p-6 w-full max-w-xs space-y-4">
        {/* Name input — always visible */}
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Your Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); clearMpError(); }}
            placeholder="Enter your name"
            maxLength={16}
            className="w-full bg-green-800/60 border border-green-700/50 rounded-lg px-3 py-2
              text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
        </div>

        {mode === 'choose' && (
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setMode('create')}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold
                rounded-lg text-sm transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full py-2.5 bg-green-700/60 hover:bg-green-700 text-white font-bold
                rounded-lg text-sm transition-colors"
            >
              Join Room
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700
                disabled:text-gray-500 text-gray-900 font-bold rounded-lg text-sm transition-colors"
            >
              Create Room
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 hover:text-gray-300 text-xs transition-colors py-1">
              ← Back
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-2 pt-1">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Room Code</p>
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); clearMpError(); }}
                placeholder="XXXX"
                maxLength={4}
                className="w-full bg-green-800/60 border border-green-700/50 rounded-lg px-3 py-2
                  text-white text-sm font-mono tracking-widest placeholder-gray-500
                  focus:outline-none focus:border-green-500 uppercase"
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={!name.trim() || code.trim().length < 4}
              className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700
                disabled:text-gray-500 text-gray-900 font-bold rounded-lg text-sm transition-colors"
            >
              Join Room
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 hover:text-gray-300 text-xs transition-colors py-1">
              ← Back
            </button>
          </div>
        )}

        {mpError && (
          <p className="text-red-400 text-xs text-center bg-red-900/20 rounded-lg px-3 py-2">
            {mpError}
          </p>
        )}
      </div>

      <button
        onClick={() => navigateTo('home')}
        className="text-green-700 hover:text-green-400 text-sm transition-colors"
      >
        ← Back to Home
      </button>
    </div>
  );
}
