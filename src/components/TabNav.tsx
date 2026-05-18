import type { TabId } from '../types';

const tabs: { id: TabId; label: string; emoji: string }[] = [
  { id: 'predict', label: 'Predict', emoji: '🎯' },
  { id: 'quickxi', label: 'Quick XI', emoji: '👥' },
  { id: 'quiz', label: 'Quiz', emoji: '❓' },
  { id: 'tictactoe', label: 'TicTacToe', emoji: '❌' },
  { id: 'housie', label: 'Housie', emoji: '🎱' },
  { id: 'aitalk', label: 'AI Talk', emoji: '🎙️' },
  { id: 'stocks', label: 'Stocks', emoji: '📈' },
  { id: 'shop', label: 'Shop', emoji: '🛍️' },
  { id: 'leaderboard', label: 'Board', emoji: '🏆' },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 px-3 py-2 overflow-x-auto tab-scroll border-b border-slate-700/30 bg-navy-900/80 backdrop-blur-sm">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            active === t.id
              ? 'gradient-bg text-white shadow-lg shadow-teal-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
          }`}
        >
          <span>{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
