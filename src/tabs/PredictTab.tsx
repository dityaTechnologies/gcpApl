import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import type { BallOutcome } from '../types';

const PREDICT_OPTIONS: { id: BallOutcome; label: string; emoji: string }[] = [
  { id: 'dot', label: 'Dot', emoji: '⚫' },
  { id: 'single', label: 'Single', emoji: '1️⃣' },
  { id: 'four', label: 'Four', emoji: '4️⃣' },
  { id: 'six', label: 'Six', emoji: '6️⃣' },
  { id: 'wicket', label: 'Wicket', emoji: '🏏' },
  { id: 'wide', label: 'Wide', emoji: '⚡' },
];

const COUNTDOWN = 10;

interface Confetti { id: number; x: number; color: string; delay: number }

function overStr(balls: number) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

export default function PredictTab() {
  const { match, stats, lastBallResult, ballCount, addCoins, addPoints, breakStreak, addToast } = useGame();

  const [phase, setPhase] = useState<'waiting' | 'locked' | 'result'>('waiting');
  const [selected, setSelected] = useState<BallOutcome | null>(null);
  const [countdown, setCountdown] = useState(COUNTDOWN);
  const [resultCorrect, setResultCorrect] = useState<boolean | null>(null);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [shake, setShake] = useState(false);
  const [communityPct] = useState(() => Math.floor(Math.random() * 25) + 5);

  const prevBallCount = useRef(ballCount);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN);
    setPhase('waiting');
    setSelected(null);
    setResultCorrect(null);
    setConfetti([]);
    setShake(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // auto-lock with no selection
          setPhase('locked');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startCountdown]);

  // When ball result comes in
  useEffect(() => {
    if (ballCount === prevBallCount.current) return;
    prevBallCount.current = ballCount;

    if (phase === 'locked' || phase === 'waiting') {
      const correct = selected !== null && selected === lastBallResult;
      setResultCorrect(correct);
      setPhase('result');

      if (selected !== null) {
        if (correct) {
          const multiplier = stats.streak >= 5 ? 3 : stats.streak >= 3 ? 2 : 1;
          const pts = 10 * multiplier;
          const coins = 5 * multiplier;
          addPoints(pts, true);
          addCoins(coins);
          addToast(`✅ Correct! +${pts} pts • +${coins} CC`);
          // spawn confetti
          const c: Confetti[] = Array.from({ length: 16 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: ['#00d4aa', '#7c5cfc', '#f97316', '#22c55e', '#f59e0b'][i % 5],
            delay: Math.random() * 0.4,
          }));
          setConfetti(c);
        } else {
          breakStreak();
          setShake(true);
          addToast(`❌ Wrong! It was ${lastBallResult?.toUpperCase()}. Streak reset.`, 'error');
          setTimeout(() => setShake(false), 500);
        }
      }

      // Back to waiting after 2.5s
      setTimeout(() => startCountdown(), 2500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballCount]);

  const handleSelect = (id: BallOutcome) => {
    if (phase !== 'waiting') return;
    setSelected(id);
    setPhase('locked');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference - (countdown / COUNTDOWN) * circumference;
  const timerColor = countdown <= 3 ? '#ef4444' : '#00d4aa';

  const multiplier = stats.streak >= 5 ? 3 : stats.streak >= 3 ? 2 : 1;

  return (
    <div className="animate-fade-in pb-2">
      {/* Confetti overlay */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
          {confetti.map(c => (
            <div
              key={c.id}
              className="confetti-particle absolute"
              style={{
                left: `${c.x}%`,
                top: '20%',
                background: c.color,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-heading text-lg font-bold text-white">
          🎯 Ball Predictions
        </h2>
        <p className="text-slate-400 text-sm">Predict what happens on the next ball</p>
      </div>

      {/* Prediction card */}
      <div className={`mx-4 glass p-4 ${shake ? 'animate-shake' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              BALL {overStr(match.balls + 1)}
            </p>
            <p className="font-heading text-base font-bold text-white mt-0.5">
              {phase === 'waiting' ? 'What happens next? 🏏' :
               phase === 'locked' ? '🔒 Prediction locked!' :
               resultCorrect ? '✅ Correct prediction!' : '❌ Wrong prediction!'}
            </p>
          </div>

          {/* Timer ring */}
          <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56" className="absolute">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3" />
              {phase === 'waiting' && (
                <circle
                  cx="28" cy="28" r="22" fill="none"
                  stroke={timerColor}
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="countdown-ring transition-all duration-1000"
                />
              )}
            </svg>
            <span className={`font-heading text-lg font-black ${countdown <= 3 ? 'text-red-400' : 'text-white'}`}>
              {phase === 'waiting' ? countdown :
               phase === 'locked' ? '🔒' :
               resultCorrect ? '✅' : '❌'}
            </span>
          </div>
        </div>

        {/* Phase: waiting or locked */}
        {phase !== 'result' && (
          <div className="grid grid-cols-3 gap-2">
            {PREDICT_OPTIONS.map(opt => {
              const isSelected = selected === opt.id;
              const isLocked = phase === 'locked';
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isLocked}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-semibold text-sm transition-all duration-200 min-h-[60px] ${
                    isSelected
                      ? 'bg-teal-500/30 border-2 border-teal-400 text-teal-300 scale-105'
                      : isLocked && !isSelected
                      ? 'bg-slate-700/20 border border-slate-600/20 text-slate-600 opacity-40'
                      : 'bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 active:scale-95'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs">{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Result phase */}
        {phase === 'result' && lastBallResult && (
          <div className={`rounded-xl p-4 text-center ${resultCorrect ? 'bg-teal-500/15 border border-teal-500/30' : 'bg-red-500/15 border border-red-500/30'}`}>
            {resultCorrect ? (
              <>
                <p className="text-2xl mb-1">🎉</p>
                <p className="font-heading text-lg font-bold text-teal-400">
                  +{10 * multiplier} pts • +{5 * multiplier} CC
                </p>
                {multiplier > 1 && (
                  <p className="text-xs text-orange-400 mt-1">🔥 {multiplier}x Streak Multiplier!</p>
                )}
              </>
            ) : (
              <>
                <p className="text-2xl mb-1">💔</p>
                <p className="font-heading text-base font-bold text-red-400">
                  It was <span className="uppercase">{lastBallResult}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Streak reset to 0</p>
              </>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Only {communityPct}% predicted this!
            </p>
          </div>
        )}
      </div>

      {/* Streak badge */}
      {stats.streak >= 3 && (
        <div className="mx-4 mt-3">
          <div className="glass p-3 flex items-center gap-3">
            <span className="text-2xl">{stats.streak >= 5 ? '🔥🔥' : '🔥'}</span>
            <div>
              <p className="font-heading text-sm font-bold text-orange-400">
                {stats.streak}x Streak — {multiplier}x Multiplier!
              </p>
              <p className="text-xs text-slate-400">Keep it going!</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats card */}
      <div className="mx-4 mt-3 glass p-4">
        <p className="font-heading text-sm font-bold text-white mb-3">Your Stats</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-white font-heading">{stats.totalPredictions}</p>
            <p className="text-xs text-slate-400">Total</p>
          </div>
          <div className="bg-teal-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-teal-400 font-heading">{stats.correctPredictions}</p>
            <p className="text-xs text-slate-400">Correct</p>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-yellow-400 font-heading">{stats.bestStreak}</p>
            <p className="text-xs text-slate-400">Best Streak</p>
          </div>
          <div className="bg-teal-500/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-teal-400 font-heading">{stats.points}</p>
            <p className="text-xs text-slate-400">Points</p>
          </div>
        </div>
        {/* Accuracy bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Accuracy</span>
            <span className="text-teal-400 font-semibold">
              {stats.totalPredictions > 0
                ? Math.round((stats.correctPredictions / stats.totalPredictions) * 100)
                : 0}%
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg rounded-full transition-all duration-500"
              style={{
                width: `${stats.totalPredictions > 0 ? (stats.correctPredictions / stats.totalPredictions) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Match tickets card */}
      <div className="mx-4 mt-3 rounded-2xl p-4 border border-yellow-500/25"
        style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(249,115,22,0.08))' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎫</span>
          <div>
            <p className="font-heading text-sm font-bold text-yellow-400">Win Match Tickets!</p>
            <p className="text-xs text-slate-400 mt-1">Top predictors win real IPL match tickets every week!</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            { medal: '🥇', label: 'VIP Tickets', color: 'text-yellow-400' },
            { medal: '🥈', label: 'Premium Stand', color: 'text-slate-300' },
            { medal: '🥉', label: 'General Stand', color: 'text-orange-400' },
          ].map(tier => (
            <div key={tier.label} className="flex items-center gap-2">
              <span>{tier.medal}</span>
              <span className={`text-xs font-semibold ${tier.color}`}>{tier.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
