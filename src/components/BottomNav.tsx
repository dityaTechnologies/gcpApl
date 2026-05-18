import type { TabId } from '../types';

const items: { id: TabId; label: string; emoji: string }[] = [
  { id: 'predict', label: 'Predict', emoji: '🎯' },
  { id: 'quickxi', label: 'Quick XI', emoji: '👥' },
  { id: 'quiz', label: 'Quiz', emoji: '❓' },
  { id: 'housie', label: 'Housie', emoji: '🎱' },
  { id: 'leaderboard', label: 'Board', emoji: '🏆' },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 glass-dark border-t border-slate-700/40 safe-bottom">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
              active === item.id
                ? 'text-teal-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className={`text-xl transition-transform duration-200 ${active === item.id ? 'scale-110' : ''}`}>
              {item.emoji}
            </span>
            <span className={`text-[10px] font-semibold ${active === item.id ? 'text-teal-400' : 'text-slate-500'}`}>
              {item.label}
            </span>
            {active === item.id && (
              <div className="w-1 h-1 rounded-full bg-teal-400 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
