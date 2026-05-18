import { useState } from 'react';
import { players } from '../data/players';
import { useGame } from '../context/GameContext';

const BUDGET = 100;
const MAX_PLAYERS = 5;

const teamColors: Record<string, string> = {
  CSK: 'text-yellow-400',
  RCB: 'text-red-400',
};

export default function QuickXITab() {
  const { addCoins, addToast } = useGame();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [captain, setCaptain] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const spent = Array.from(selected).reduce((acc, id) => {
    const p = players.find(pl => pl.id === id);
    return acc + (p?.price ?? 0);
  }, 0);

  const remaining = BUDGET - spent;

  const toggle = (id: string) => {
    if (locked) return;
    const p = players.find(pl => pl.id === id)!;
    if (selected.has(id)) {
      const next = new Set(selected);
      next.delete(id);
      setSelected(next);
      if (captain === id) setCaptain(null);
    } else {
      if (selected.size >= MAX_PLAYERS) return;
      if (remaining < p.price) return;
      const next = new Set(selected);
      next.add(id);
      setSelected(next);
    }
  };

  const setCap = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!selected.has(id) || locked) return;
    setCaptain(prev => (prev === id ? null : id));
  };

  const lockTeam = () => {
    if (selected.size < 3 || !captain || locked) return;
    setLocked(true);
    addCoins(10);
    addToast('✅ Quick XI Locked! +10 CrickCoins');
  };

  const canLock = selected.size >= 3 && captain !== null && !locked;

  return (
    <div className="animate-fade-in pb-2">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">👥 Quick XI</h2>
            <p className="text-slate-400 text-sm">Pick up to 5 players in budget</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-500/15 text-teal-400 border border-teal-500/25 px-2.5 py-1 rounded-full font-bold">
              {selected.size}/{MAX_PLAYERS}
            </span>
            <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-2.5 py-1 rounded-full font-bold">
              Budget: {remaining}
            </span>
          </div>
        </div>
      </div>

      {/* Players list */}
      <div className="flex flex-col gap-2 px-4">
        {players.map(p => {
          const isSel = selected.has(p.id);
          const isCap = captain === p.id;
          const cantAfford = !isSel && remaining < p.price;
          const maxed = !isSel && selected.size >= MAX_PLAYERS;
          const disabled = cantAfford || maxed || locked;

          return (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`glass flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 ${
                isSel ? 'border-teal-400/50 shadow-teal-500/20 shadow-lg' : ''
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}`}
              style={isSel ? { boxShadow: '0 0 0 1.5px #00d4aa, 0 4px 24px rgba(0,212,170,0.15)' } : {}}
            >
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-heading font-black text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #00d4aa, #7c5cfc)' }}
              >
                {p.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-white truncate">{p.name}</p>
                <p className="text-xs text-slate-400">
                  {p.role} • <span className={teamColors[p.team] ?? 'text-slate-300'}>{p.team}</span>
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-yellow-400">🪙{p.price}</span>

                {/* Captain button */}
                {isSel && (
                  <button
                    onClick={(e) => setCap(e, p.id)}
                    className={`w-8 h-8 rounded-full text-xs font-black transition-all duration-200 ${
                      isCap
                        ? 'gradient-bg text-white shadow-teal-500/30 shadow-md'
                        : 'bg-slate-600/50 text-slate-400 hover:bg-slate-500/50'
                    }`}
                  >
                    C
                  </button>
                )}

                {/* Select button */}
                <button
                  onClick={e => { e.stopPropagation(); toggle(p.id); }}
                  disabled={disabled && !isSel}
                  className={`w-8 h-8 rounded-full text-lg flex items-center justify-center transition-all duration-200 ${
                    isSel
                      ? 'bg-teal-500/20 text-teal-400'
                      : disabled
                      ? 'bg-slate-700/30 text-slate-600'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-teal-500/20 hover:text-teal-400'
                  }`}
                >
                  {isSel ? '✓' : '+'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lock button / locked state */}
      <div className="px-4 mt-4">
        {locked ? (
          <div className="glass p-4 text-center border border-teal-500/30">
            <p className="text-2xl mb-1">✅</p>
            <p className="font-heading text-base font-bold text-teal-400">Team Locked!</p>
            <p className="text-xs text-slate-400 mt-1">+10 CrickCoins for participating</p>
            {captain && (
              <p className="text-xs text-yellow-400 mt-1">
                Captain: {players.find(p => p.id === captain)?.name} (2x points)
              </p>
            )}
          </div>
        ) : (
          <>
            {!captain && selected.size >= 1 && (
              <p className="text-xs text-orange-400 text-center mb-2">Tap C to assign a captain</p>
            )}
            <button
              onClick={lockTeam}
              disabled={!canLock}
              className={`w-full py-3.5 rounded-2xl font-heading text-sm font-bold transition-all duration-200 ${
                canLock
                  ? 'gradient-bg text-white shadow-lg shadow-teal-500/25 active:scale-[0.98]'
                  : 'bg-slate-700/40 text-slate-500 cursor-not-allowed'
              }`}
            >
              🔒 Lock Quick XI
              {!canLock && selected.size < 3 && ` (Pick ${3 - selected.size} more)`}
              {!canLock && selected.size >= 3 && !captain && ' (Pick Captain)'}
            </button>
          </>
        )}
      </div>

      {/* Guide */}
      <div className="mx-4 mt-3 glass p-3">
        <p className="text-xs text-slate-400 text-center">
          🎯 Pick at least 3 players • 👑 Assign a captain for 2x points • Budget: 100 credits
        </p>
      </div>
    </div>
  );
}
