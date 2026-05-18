import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

function generateTicket(): number[][] {
  const pool = Array.from({ length: 90 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const nums = pool.slice(0, 15).sort((a, b) => a - b);
  return [nums.slice(0, 5), nums.slice(5, 10), nums.slice(10, 15)];
}

export default function HousieTab() {
  const { match, addCoins, addToast } = useGame();
  const [ticket] = useState<number[][]>(generateTicket);
  const [called, setCalled] = useState<number[]>([]);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [lineWon, setLineWon] = useState(false);
  const [fullHouseWon, setFullHouseWon] = useState(false);
  const prevScore = useRef(match.score);
  const prevBalls = useRef(match.balls);

  // Call numbers from match events
  useEffect(() => {
    const scoreDelta = match.score - prevScore.current;
    const ballDelta = match.balls - prevBalls.current;
    prevScore.current = match.score;
    prevBalls.current = match.balls;

    if (ballDelta === 0 && scoreDelta === 0) return;

    const newNums: number[] = [];
    if (scoreDelta > 0) {
      const n = (match.score % 90) + 1;
      if (!called.includes(n)) newNums.push(n);
    }
    if (ballDelta > 0) {
      const n = (match.balls % 90) + 1;
      if (!called.includes(n) && !newNums.includes(n)) newNums.push(n);
    }
    // Random
    if (Math.random() < 0.4) {
      let r;
      do { r = Math.floor(Math.random() * 90) + 1; } while (called.includes(r) || newNums.includes(r));
      newNums.push(r);
    }

    if (newNums.length > 0) {
      setCalled(prev => [...prev, ...newNums].slice(-50));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.score, match.balls]);

  // Check prizes
  useEffect(() => {
    if (!lineWon) {
      for (const row of ticket) {
        const allMarked = row.every(n => marked.has(n));
        if (allMarked) {
          setLineWon(true);
          addCoins(50);
          addToast('🎉 First Line! +50 CrickCoins!');
          break;
        }
      }
    }
    if (!fullHouseWon) {
      const allNums = ticket.flat();
      if (allNums.every(n => marked.has(n))) {
        setFullHouseWon(true);
        addCoins(200);
        addToast('🏆 Full House! +200 CrickCoins & Match Tickets!');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marked]);

  const handleMark = (num: number) => {
    if (!called.includes(num)) return;
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const lastFive = called.slice(-5).reverse();

  return (
    <div className="animate-fade-in pb-2">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-black text-white">🎱 Cricket Housie</h2>
            <p className="text-slate-400 text-xs mt-0.5">Numbers called from match events! Tap to mark.</p>
          </div>
          <span className="text-xs bg-teal-500/15 text-teal-400 border border-teal-500/25 px-2.5 py-1 rounded-full font-bold">
            {called.length} called
          </span>
        </div>
      </div>

      {/* Last called */}
      <div className="px-4 mb-3">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Last Called</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {lastFive.length === 0 ? (
            <p className="text-xs text-slate-500">Waiting for match events...</p>
          ) : (
            lastFive.map((n, i) => (
              <div
                key={`${n}-${i}`}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black transition-all duration-300 ${
                  i === 0
                    ? 'gradient-bg text-white text-base shadow-teal-500/30 shadow-md scale-110'
                    : 'bg-slate-700/50 text-slate-300 text-sm'
                }`}
              >
                {n}
                {i === 0 && <span className="absolute -top-1 -right-1 text-xs">🔥</span>}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket */}
      <div className="mx-4 glass p-4">
        <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">Your Ticket</p>
        <div className="flex flex-col gap-2">
          {ticket.map((row, ri) => (
            <div key={ri} className="grid grid-cols-5 gap-1.5">
              {row.map(num => {
                const isCalled = called.includes(num);
                const isMarked = marked.has(num);
                return (
                  <button
                    key={num}
                    onClick={() => handleMark(num)}
                    disabled={!isCalled}
                    className={`aspect-square rounded-xl flex items-center justify-center font-heading font-bold text-sm transition-all duration-200 ${
                      isMarked
                        ? 'bg-teal-500 text-white border-2 border-teal-300 shadow-teal-500/30 shadow-md scale-105'
                        : isCalled
                        ? 'bg-yellow-500/20 border-2 border-yellow-400/60 text-yellow-300 cursor-pointer hover:scale-105 active:scale-95'
                        : 'bg-slate-700/30 border border-slate-600/20 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          🟡 Called • 🟢 Marked • tap called to mark
        </p>
      </div>

      {/* Prizes */}
      <div className="mx-4 mt-3 glass p-4">
        <p className="font-heading text-sm font-bold text-white mb-3">Prizes</p>
        <div className="flex flex-col gap-2">
          <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${lineWon ? 'bg-teal-500/20 border border-teal-400/40' : 'bg-slate-700/20'}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🥈</span>
              <div>
                <p className="text-xs font-bold text-white">First Line</p>
                <p className="text-xs text-slate-400">Complete any one row</p>
              </div>
            </div>
            <div className="text-right">
              {lineWon ? (
                <span className="text-xs text-teal-400 font-bold">✅ Won!</span>
              ) : (
                <span className="text-xs text-yellow-400 font-bold">50 CC</span>
              )}
            </div>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${fullHouseWon ? 'bg-yellow-500/20 border border-yellow-400/40' : 'bg-slate-700/20'}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🥇</span>
              <div>
                <p className="text-xs font-bold text-white">Full House</p>
                <p className="text-xs text-slate-400">Mark all 15 numbers</p>
              </div>
            </div>
            <div className="text-right">
              {fullHouseWon ? (
                <span className="text-xs text-yellow-400 font-bold">✅ Won!</span>
              ) : (
                <span className="text-xs text-yellow-400 font-bold">🎫 Tickets!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
