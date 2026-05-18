import { useState } from 'react';
import { useGame } from '../context/GameContext';

type Cell = 'X' | 'O' | null;
type GameStatus = 'playing' | 'win' | 'lose' | 'draw';

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board: Cell[]): Cell | 'draw' | null {
  for (const [a,b,c] of WINS) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  if (board.every(c => c !== null)) return 'draw';
  return null;
}

function aiMove(board: Cell[]): number {
  const empty = board.map((c, i) => c === null ? i : -1).filter(i => i !== -1);
  if (empty.length === 0) return -1;

  // Try to win
  for (const idx of empty) {
    const b = [...board]; b[idx] = 'O';
    if (checkWinner(b) === 'O') return idx;
  }
  // Block player
  for (const idx of empty) {
    const b = [...board]; b[idx] = 'X';
    if (checkWinner(b) === 'X') return idx;
  }
  // Center
  if (board[4] === null) return 4;
  // Random
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function TicTacToeTab() {
  const { addCoins, addToast } = useGame();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [status, setStatus] = useState<GameStatus>('playing');
  const [aiThinking, setAiThinking] = useState(false);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [rewarded, setRewarded] = useState(false);

  const getWinLine = (b: Cell[]): number[] | null => {
    for (const line of WINS) {
      const [a, bl, c] = line;
      if (b[a] && b[a] === b[bl] && b[bl] === b[c]) return line;
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || status !== 'playing' || aiThinking) return;
    const next = [...board];
    next[i] = 'X';
    setBoard(next);

    const result = checkWinner(next);
    if (result === 'X') {
      setStatus('win');
      setWinLine(getWinLine(next));
      if (!rewarded) {
        setRewarded(true);
        addCoins(15);
        addToast('🎉 You win! +15 CrickCoins!');
      }
      return;
    }
    if (result === 'draw') { setStatus('draw'); return; }

    setAiThinking(true);
    setTimeout(() => {
      const move = aiMove(next);
      if (move === -1) { setAiThinking(false); return; }
      const after = [...next];
      after[move] = 'O';
      setBoard(after);
      const r2 = checkWinner(after);
      if (r2 === 'O') { setStatus('lose'); setWinLine(getWinLine(after)); }
      else if (r2 === 'draw') setStatus('draw');
      setAiThinking(false);
    }, 600);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setStatus('playing');
    setWinLine(null);
    setAiThinking(false);
    setRewarded(false);
  };

  const statusText =
    status === 'playing' ? (aiThinking ? 'AI thinking...' : 'Your turn (X)') :
    status === 'win' ? '🎉 You win! +15 CrickCoins!' :
    status === 'lose' ? '😤 AI wins! Try again.' :
    '🤝 Draw! Good game.';

  const statusColor =
    status === 'win' ? 'text-teal-400' :
    status === 'lose' ? 'text-red-400' :
    status === 'draw' ? 'text-yellow-400' :
    aiThinking ? 'text-purple-400' : 'text-slate-300';

  return (
    <div className="animate-fade-in px-4 pt-4 pb-4 flex flex-col items-center">
      <h2 className="font-heading text-xl font-black text-white mb-1">❌⭕ Tic-Tac-Toe</h2>
      <p className={`text-sm font-semibold mb-4 ${statusColor} ${aiThinking ? 'animate-pulse' : ''}`}>
        {statusText}
      </p>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
        {board.map((cell, i) => {
          const inWinLine = winLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-black transition-all duration-200 glass border ${
                inWinLine
                  ? cell === 'X' ? 'border-teal-400 bg-teal-500/20 shadow-teal-500/30 shadow-lg' : 'border-purple-500 bg-purple-500/20'
                  : 'border-slate-600/30 hover:border-slate-500/50 active:scale-95'
              } ${!cell && status === 'playing' && !aiThinking ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {cell === 'X' && (
                <span className={`${inWinLine ? 'text-teal-300' : 'text-teal-400'} animate-bounce-in`}>✕</span>
              )}
              {cell === 'O' && (
                <span className={`${inWinLine ? 'text-purple-300' : 'text-purple-500'} animate-bounce-in`}>○</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-slate-400">
        <span className="text-teal-400 font-bold">✕ = You</span>
        <span className="text-purple-400 font-bold">○ = AI</span>
      </div>

      {/* Play again */}
      {status !== 'playing' && (
        <button
          onClick={reset}
          className="mt-5 gradient-bg text-white font-heading font-bold text-sm px-8 py-3 rounded-2xl shadow-lg shadow-teal-500/25 active:scale-95 transition-transform animate-bounce-in"
        >
          🔄 Play Again
        </button>
      )}

      {/* Prize info */}
      <div className="mt-5 glass p-3 w-full text-center">
        <p className="text-xs text-slate-400">
          🏆 Win to earn <span className="text-yellow-400 font-bold">+15 CrickCoins</span>
        </p>
      </div>
    </div>
  );
}
