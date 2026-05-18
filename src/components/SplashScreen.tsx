import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1200);
    const t2 = setTimeout(() => onDone(), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ background: '#0a0e1a', opacity: fading ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-4 animate-bounce-in">
        <div className="text-6xl">🏏</div>
        <h1 className="font-heading text-5xl font-black gradient-text">CrickPulse</h1>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
          Your Second Screen, Your Game
        </p>
      </div>
      <div className="mt-12">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r="20" fill="none"
            stroke="#00d4aa" strokeWidth="3"
            strokeDasharray="30 96"
            strokeLinecap="round"
            className="animate-spin-slow"
            style={{ transformOrigin: '24px 24px' }}
          />
        </svg>
      </div>
    </div>
  );
}
