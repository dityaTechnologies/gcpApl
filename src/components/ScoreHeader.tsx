import { useGame } from '../context/GameContext';

function overStr(balls: number) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

export default function ScoreHeader() {
  const { match, stats } = useGame();
  const { score, wickets, balls, runRate, phase, battingTeam, bowlingTeam } = match;

  const phaseLabel =
    phase === 'live' ? '🔴 LIVE' :
    phase === 'timeout' ? '⏸️ TIMEOUT' :
    '🔄 INNINGS BREAK';

  const phaseColor =
    phase === 'live' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
    phase === 'timeout' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
    'bg-blue-500/20 text-blue-400 border-blue-500/30';

  const cskEmoji = '🦁';
  const rcbEmoji = '👑';

  const batting = battingTeam === 'CSK' ? { emoji: cskEmoji, name: 'CSK' } : { emoji: rcbEmoji, name: 'RCB' };
  const bowling = bowlingTeam === 'CSK' ? { emoji: cskEmoji, name: 'CSK' } : { emoji: rcbEmoji, name: 'RCB' };

  return (
    <div className="sticky top-0 z-40 glass-dark border-b border-slate-700/40 safe-top">
      {/* Main score row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Batting team */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-slate-400 font-medium">{batting.emoji} {batting.name}</span>
          <span className="font-heading text-2xl font-black text-white leading-none">
            {score}<span className="text-slate-400 text-lg">/{wickets}</span>
          </span>
        </div>

        {/* Center */}
        <div className="flex flex-col items-center gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${phaseColor}`}>
            {phaseLabel}
          </span>
          <span className="text-slate-500 text-xs">vs</span>
          <span className="text-slate-300 text-xs font-mono">{overStr(balls)} ov</span>
        </div>

        {/* Bowling team */}
        <div className="flex flex-col items-end min-w-0">
          <span className="text-xs text-slate-400 font-medium">{bowling.emoji} {bowling.name}</span>
          <span className="font-heading text-lg font-bold text-teal-400 leading-none">
            {runRate} <span className="text-xs text-slate-400">RR</span>
          </span>
        </div>
      </div>

      {/* Stats badges */}
      <div className="flex items-center gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
        <span className="flex-shrink-0 text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-2.5 py-1 rounded-full font-semibold">
          🪙 {stats.coins} CC
        </span>
        <span className="flex-shrink-0 text-xs bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2.5 py-1 rounded-full font-semibold">
          🔥 Streak: {stats.streak}
        </span>
        <span className="flex-shrink-0 text-xs bg-teal-500/15 text-teal-400 border border-teal-500/25 px-2.5 py-1 rounded-full font-semibold">
          ⭐ {stats.points} pts
        </span>
      </div>
    </div>
  );
}
