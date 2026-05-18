import { useMemo } from 'react';
import { leaderboardFakes } from '../data/players';
import { useGame } from '../context/GameContext';

const rankColors = ['#f59e0b', '#94a3b8', '#cd7c2f'];
const rankEmojis = ['🥇', '🥈', '🥉'];

export default function LeaderboardTab() {
  const { stats } = useGame();

  const entries = useMemo(() => {
    const list = [
      ...leaderboardFakes,
      { username: 'You 🎯', score: stats.points },
    ].sort((a, b) => b.score - a.score);
    return list;
  }, [stats.points]);

  const userRank = entries.findIndex(e => e.username === 'You 🎯') + 1;

  return (
    <div className="animate-fade-in pb-2">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h2 className="font-heading text-xl font-black text-white">🏆 Match Leaderboard</h2>
        <p className="text-slate-400 text-xs mt-0.5">Top predictors win IPL match tickets! 🎫</p>
      </div>

      {/* Your rank highlight */}
      <div className="mx-4 mb-3 gradient-bg p-3 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-heading font-black text-white">
          {userRank}
        </div>
        <div>
          <p className="font-heading text-sm font-bold text-white">Your Rank</p>
          <p className="text-xs text-white/80">#{userRank} of {entries.length} players</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-heading text-lg font-black text-white">{stats.points}</p>
          <p className="text-xs text-white/70">points</p>
        </div>
      </div>

      {/* Leaderboard rows */}
      <div className="flex flex-col gap-1.5 px-4">
        {entries.map((e, i) => {
          const rank = i + 1;
          const isUser = e.username === 'You 🎯';
          const isTop3 = rank <= 3;

          return (
            <div
              key={e.username}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isUser
                  ? 'bg-teal-500/10 border border-teal-500/25'
                  : 'glass'
              }`}
            >
              {/* Rank */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-sm flex-shrink-0"
                style={isTop3 ? { color: rankColors[rank - 1] } : { color: '#64748b' }}
              >
                {isTop3 ? rankEmojis[rank - 1] : rank}
              </div>

              {/* Username */}
              <p className={`flex-1 text-sm font-semibold truncate ${isUser ? 'text-teal-300' : 'text-slate-200'}`}>
                {e.username}
              </p>

              {/* Score */}
              <span className={`font-heading text-sm font-black ${isUser ? 'text-teal-400' : isTop3 ? 'text-yellow-400' : 'text-slate-400'}`}>
                {e.score.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Weekly prizes */}
      <div className="mx-4 mt-4 glass p-4">
        <p className="font-heading text-sm font-bold text-white mb-3">Weekly Prizes 🎁</p>
        <div className="flex flex-col gap-2">
          {[
            { emoji: '🥇', label: '#1', prize: '2× VIP Match Tickets', color: 'text-yellow-400' },
            { emoji: '🥈', label: '#2–5', prize: 'Premium Stand Tickets', color: 'text-slate-300' },
            { emoji: '🥉', label: '#6–20', prize: 'Signed Merchandise', color: 'text-orange-400' },
            { emoji: '📦', label: '#21–100', prize: '500 CrickCoins', color: 'text-teal-400' },
          ].map(tier => (
            <div key={tier.label} className="flex items-center gap-3 py-1">
              <span className="text-lg">{tier.emoji}</span>
              <span className={`text-xs font-bold w-10 ${tier.color}`}>{tier.label}</span>
              <span className="text-xs text-slate-400">{tier.prize}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
