import { useGame } from '../context/GameContext';

const teamColors: Record<string, string> = {
  CSK: '#f59e0b',
  RCB: '#ef4444',
};

export default function StocksTab() {
  const { stocks } = useGame();

  return (
    <div className="animate-fade-in pb-2">
      <div className="px-4 pt-4 pb-3">
        <h2 className="font-heading text-xl font-black text-white">📈 Player Stocks</h2>
        <p className="text-slate-400 text-xs mt-0.5">Virtual CrickCoin stocks — prices change with every ball!</p>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {stocks.map(s => {
          const isUp = s.change >= 0;
          return (
            <div key={s.id} className="glass p-4 flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-heading font-black text-sm text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${teamColors[s.team] ?? '#00d4aa'}aa, #1a1f35)`, border: `2px solid ${teamColors[s.team] ?? '#00d4aa'}44` }}
              >
                {s.initials}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-white">{s.name}</p>
                <p className="text-xs" style={{ color: teamColors[s.team] ?? '#94a3b8' }}>{s.team}</p>
              </div>

              {/* Price */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-heading text-base font-black text-yellow-400">🪙 {s.price}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isUp
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {isUp ? '▲' : '▼'} {Math.abs(s.change)} ({isUp ? '+' : ''}{s.changePercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-3 glass p-3 text-center">
        <p className="text-xs text-slate-500">
          📊 Prices update after every ball • Virtual currency only
        </p>
      </div>
    </div>
  );
}
