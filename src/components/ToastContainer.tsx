import { useGame } from '../context/GameContext';

export default function ToastContainer() {
  const { toasts } = useGame();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-[440px] px-4 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`glass animate-slide-down flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border-l-4 ${
            t.type === 'success' ? 'border-teal-400' :
            t.type === 'error' ? 'border-red-400' :
            'border-blue-400'
          }`}
        >
          <span className="text-base">{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
          <span className="text-sm font-semibold text-slate-200">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
