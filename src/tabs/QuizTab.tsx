import { useState, useEffect, useRef } from 'react';
import { quizQuestions } from '../data/players';
import { useGame } from '../context/GameContext';

const QUIZ_TIME = 15;

type QuizPhase = 'start' | 'question' | 'end';

export default function QuizTab() {
  const { addCoins, addToast } = useGame();
  const [phase, setPhase] = useState<QuizPhase>('start');
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [startTime, setStartTime] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startQuiz = () => {
    setPhase('question');
    setQIndex(0);
    setScore(0);
    setTotalCoins(0);
    setAnswered(null);
    setTimeLeft(QUIZ_TIME);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (phase !== 'question') return;
    setTimeLeft(QUIZ_TIME);
    setStartTime(Date.now());
    setAnswered(null);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase]);

  const handleTimeout = () => {
    setAnswered(-1);
    setTimeout(() => advance(), 1500);
  };

  const handleAnswer = (idx: number) => {
    if (answered !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setAnswered(idx);
    const q = quizQuestions[qIndex];
    const timeTaken = (Date.now() - startTime) / 1000;
    if (idx === q.correct) {
      const coins = timeTaken < 5 ? 10 : 5;
      setScore(s => s + 1);
      setTotalCoins(c => c + coins);
      addCoins(coins);
    }
    setTimeout(() => advance(), 1500);
  };

  const advance = () => {
    if (qIndex >= quizQuestions.length - 1) {
      setPhase('end');
    } else {
      setQIndex(i => i + 1);
    }
  };

  useEffect(() => {
    if (phase === 'end' && totalCoins > 0) {
      addToast(`🏆 Quiz Complete! +${totalCoins} CrickCoins`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const q = quizQuestions[qIndex];
  const circumference = 2 * Math.PI * 22;
  const dashOffset = circumference - (timeLeft / QUIZ_TIME) * circumference;
  const timerColor = timeLeft <= 5 ? '#ef4444' : '#00d4aa';

  if (phase === 'start') {
    return (
      <div className="animate-fade-in px-4 pt-8 pb-4 flex flex-col items-center text-center gap-4">
        <div className="text-6xl animate-bounce-in">❓</div>
        <div>
          <h2 className="font-heading text-2xl font-black text-white">Strategic Timeout Quiz</h2>
          <p className="text-slate-400 text-sm mt-1">10 questions. 15 seconds each.</p>
          <p className="text-slate-400 text-sm">Win CrickCoins & match tickets!</p>
        </div>
        <div className="flex gap-2 justify-center">
          <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-3 py-1.5 rounded-full font-semibold">
            🎫 Top 3 win tickets
          </span>
          <span className="text-xs bg-teal-500/15 text-teal-400 border border-teal-500/25 px-3 py-1.5 rounded-full font-semibold">
            🪙 5-10 coins / correct
          </span>
        </div>
        <button
          onClick={startQuiz}
          className="gradient-bg text-white font-heading font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-500/25 active:scale-95 transition-transform"
        >
          ⚡ Start Quiz
        </button>
      </div>
    );
  }

  if (phase === 'end') {
    return (
      <div className="animate-bounce-in px-4 pt-8 pb-4 flex flex-col items-center text-center gap-4">
        <div className="text-6xl">🏆</div>
        <div>
          <h2 className="font-heading text-2xl font-black text-white">Quiz Complete!</h2>
          <p className="text-slate-400 text-sm mt-1">
            Score: <span className="text-teal-400 font-bold">{score}/{quizQuestions.length}</span>
          </p>
        </div>
        <div className="glass p-5 w-full max-w-xs">
          <p className="text-3xl font-black font-heading text-yellow-400">+{totalCoins}</p>
          <p className="text-slate-400 text-sm mt-1">CrickCoins earned</p>
        </div>
        <button
          onClick={() => setPhase('start')}
          className="gradient-bg text-white font-heading font-bold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-500/25 active:scale-95 transition-transform"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-4 pt-4 pb-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-teal-500/20 text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full font-bold">
          Q{qIndex + 1}/{quizQuestions.length}
        </span>
        <span className="text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 px-2.5 py-1 rounded-full font-bold">
          Score: {score}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-700/50 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full gradient-bg rounded-full transition-all duration-300"
          style={{ width: `${((qIndex) / quizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Timer ring + question */}
      <div className="glass p-5">
        <div className="flex items-start gap-4">
          {/* Timer */}
          <div className="relative flex items-center justify-center w-14 h-14 flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56" className="absolute">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke={timerColor}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="countdown-ring transition-all duration-1000"
              />
            </svg>
            <span className={`font-heading text-lg font-black ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}
            </span>
          </div>
          <p className="font-heading text-base font-bold text-white flex-1">{q.q}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-4">
          {q.options.map((opt, i) => {
            const letter = ['A', 'B', 'C', 'D'][i];
            const isCorrect = i === q.correct;
            const isSelected = answered === i;
            const isAnswered = answered !== null;

            let btnClass = 'bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50';
            if (isAnswered) {
              if (isCorrect) btnClass = 'bg-teal-500/25 border-2 border-teal-400 text-teal-300';
              else if (isSelected) btnClass = 'bg-red-500/25 border-2 border-red-400 text-red-300';
              else btnClass = 'bg-slate-700/20 border border-slate-600/20 text-slate-500 opacity-50';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-200 active:scale-[0.98] ${btnClass}`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  isAnswered && isCorrect ? 'bg-teal-500 text-white' :
                  isAnswered && isSelected ? 'bg-red-500 text-white' :
                  'bg-slate-600/50 text-slate-400'
                }`}>
                  {letter}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
