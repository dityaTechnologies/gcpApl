import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from 'react';
import type { MatchState, BallOutcome, GameStats, PlayerStock, Commentary, PersonaId, Toast } from '../types';
import { getCommentary } from '../data/commentary';

interface GameContextType {
  match: MatchState;
  stats: GameStats;
  stocks: PlayerStock[];
  commentaryFeed: Commentary[];
  activePersona: PersonaId;
  setActivePersona: (p: PersonaId) => void;
  toasts: Toast[];
  addToast: (msg: string, type?: Toast['type']) => void;
  addCoins: (n: number) => void;
  addPoints: (n: number, streakContinue?: boolean) => void;
  breakStreak: () => void;
  lastBallResult: BallOutcome | null;
  ballCount: number;
}

const GameContext = createContext<GameContextType | null>(null);

const OUTCOMES: BallOutcome[] = [
  'dot', 'dot', 'dot', 'single', 'single', 'single', 'single',
  'two', 'four', 'four', 'six', 'wicket', 'wide',
];

function overString(balls: number): string {
  const completedOvers = Math.floor(balls / 6);
  const rem = balls % 6;
  return `${completedOvers}.${rem}`;
}

function computeRR(score: number, balls: number): number {
  if (balls === 0) return 0;
  return parseFloat(((score / balls) * 6).toFixed(2));
}

const initialStocks: PlayerStock[] = [
  { id: 'rg', name: 'R. Gaikwad', initials: 'RG', team: 'CSK', price: 128, change: 0, changePercent: 0 },
  { id: 'ms', name: 'MS Dhoni', initials: 'MD', team: 'CSK', price: 145, change: 0, changePercent: 0 },
  { id: 'rj', name: 'R. Jadeja', initials: 'RJ', team: 'CSK', price: 112, change: 0, changePercent: 0 },
  { id: 'vk', name: 'V. Kohli', initials: 'VK', team: 'RCB', price: 162, change: 0, changePercent: 0 },
  { id: 'gm', name: 'G. Maxwell', initials: 'GM', team: 'RCB', price: 134, change: 0, changePercent: 0 },
  { id: 'jb', name: 'J. Bumrah', initials: 'JB', team: 'RCB', price: 155, change: 0, changePercent: 0 },
];

const initialMatch: MatchState = {
  battingTeam: 'CSK',
  bowlingTeam: 'RCB',
  score: 156,
  wickets: 4,
  balls: 99, // 16.3 overs
  runRate: 9.45,
  phase: 'live',
  lastBall: null,
  timeoutSecsLeft: 0,
};

const initialStats: GameStats = {
  coins: 250,
  streak: 3,
  bestStreak: 5,
  points: 120,
  totalPredictions: 18,
  correctPredictions: 11,
};

function updateStocks(stocks: PlayerStock[], outcome: BallOutcome): PlayerStock[] {
  return stocks.map(s => {
    let delta = 0;
    if (outcome === 'six') delta = 8 + Math.floor(Math.random() * 4) - 2;
    else if (outcome === 'four') delta = 5 + Math.floor(Math.random() * 3) - 1;
    else if (outcome === 'wicket') delta = -(6 + Math.floor(Math.random() * 3));
    else if (outcome === 'dot') delta = -(2 + Math.floor(Math.random() * 2));
    else delta = Math.floor(Math.random() * 5) - 2;

    // add some individual noise
    delta += Math.floor(Math.random() * 5) - 2;

    const newPrice = Math.max(50, s.price + delta);
    const change = parseFloat((newPrice - s.price).toFixed(1));
    const changePercent = parseFloat(((change / s.price) * 100).toFixed(1));
    return { ...s, price: newPrice, change, changePercent };
  });
}

type Action =
  | { type: 'BALL'; outcome: BallOutcome }
  | { type: 'TIMEOUT_TICK' }
  | { type: 'TIMEOUT_END' }
  | { type: 'ADD_COINS'; amount: number }
  | { type: 'ADD_POINTS'; amount: number; streakContinue?: boolean }
  | { type: 'BREAK_STREAK' }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'SET_STOCKS'; stocks: PlayerStock[] }
  | { type: 'ADD_COMMENTARY'; entry: Commentary }
  | { type: 'SET_PERSONA'; persona: PersonaId };

interface State {
  match: MatchState;
  stats: GameStats;
  stocks: PlayerStock[];
  commentaryFeed: Commentary[];
  activePersona: PersonaId;
  toasts: Toast[];
  ballCount: number;
  lastBallResult: BallOutcome | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'BALL': {
      const { outcome } = action;
      const m = { ...state.match };
      let { score, wickets, balls, phase } = m;

      if (outcome === 'wicket') { wickets = Math.min(10, wickets + 1); balls += 1; }
      else if (outcome === 'wide') { score += 1; }
      else if (outcome === 'dot') { balls += 1; }
      else if (outcome === 'single') { score += 1; balls += 1; }
      else if (outcome === 'two') { score += 2; balls += 1; }
      else if (outcome === 'four') { score += 4; balls += 1; }
      else if (outcome === 'six') { score += 6; balls += 1; }

      if (balls >= 120 || wickets >= 10) {
        phase = 'innings_break';
        balls = Math.min(balls, 120);
        wickets = Math.min(wickets, 10);
      }

      const newMatch: MatchState = {
        ...m,
        score,
        wickets,
        balls,
        runRate: computeRR(score, balls),
        phase,
        lastBall: outcome,
      };

      const newStocks = updateStocks(state.stocks, outcome);

      return {
        ...state,
        match: newMatch,
        stocks: newStocks,
        lastBallResult: outcome,
        ballCount: state.ballCount + 1,
      };
    }
    case 'TIMEOUT_TICK': {
      const secsLeft = state.match.timeoutSecsLeft - 1;
      return { ...state, match: { ...state.match, timeoutSecsLeft: secsLeft } };
    }
    case 'TIMEOUT_END': {
      return { ...state, match: { ...state.match, phase: 'live', timeoutSecsLeft: 0 } };
    }
    case 'ADD_COINS': {
      return { ...state, stats: { ...state.stats, coins: state.stats.coins + action.amount } };
    }
    case 'ADD_POINTS': {
      const stats = { ...state.stats };
      stats.points += action.amount;
      if (action.streakContinue) {
        stats.streak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
        stats.correctPredictions += 1;
        stats.totalPredictions += 1;
      }
      return { ...state, stats };
    }
    case 'BREAK_STREAK': {
      return { ...state, stats: { ...state.stats, streak: 0, totalPredictions: state.stats.totalPredictions + 1 } };
    }
    case 'ADD_TOAST': {
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 3) };
    }
    case 'REMOVE_TOAST': {
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    }
    case 'ADD_COMMENTARY': {
      return { ...state, commentaryFeed: [action.entry, ...state.commentaryFeed].slice(0, 30) };
    }
    case 'SET_PERSONA': {
      return { ...state, activePersona: action.persona };
    }
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    match: initialMatch,
    stats: initialStats,
    stocks: initialStocks,
    commentaryFeed: [],
    activePersona: 'bollywood',
    toasts: [],
    ballCount: 0,
    lastBallResult: null,
  });

  const ballIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_TOAST', toast: { id, message: msg, type } });
    const t = setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 2500);
    toastTimeoutsRef.current.set(id, t);
  }, []);

  const addCoins = useCallback((n: number) => dispatch({ type: 'ADD_COINS', amount: n }), []);
  const addPoints = useCallback((n: number, sc?: boolean) => dispatch({ type: 'ADD_POINTS', amount: n, streakContinue: sc }), []);
  const breakStreak = useCallback(() => dispatch({ type: 'BREAK_STREAK' }), []);
  const setActivePersona = useCallback((p: PersonaId) => dispatch({ type: 'SET_PERSONA', persona: p }), []);

  // Ball simulation
  useEffect(() => {
    if (state.match.phase !== 'live') return;

    ballIntervalRef.current = setInterval(() => {
      const outcome = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];
      dispatch({ type: 'BALL', outcome });

      // commentary
      const text = getCommentary(state.activePersona, outcome);
      const ballStr = overString(state.match.balls);
      dispatch({
        type: 'ADD_COMMENTARY',
        entry: { id: Date.now().toString(), personaId: state.activePersona, text, ball: ballStr, timestamp: Date.now() },
      });

      // random timeout ~3%
      if (Math.random() < 0.03) {
        dispatch({ type: 'BALL', outcome: 'dot' }); // placeholder
      }
    }, 5000);

    return () => {
      if (ballIntervalRef.current) clearInterval(ballIntervalRef.current);
    };
  }, [state.match.phase, state.activePersona, state.match.balls]);

  return (
    <GameContext.Provider value={{
      match: state.match,
      stats: state.stats,
      stocks: state.stocks,
      commentaryFeed: state.commentaryFeed,
      activePersona: state.activePersona,
      setActivePersona,
      toasts: state.toasts,
      addToast,
      addCoins,
      addPoints,
      breakStreak,
      lastBallResult: state.lastBallResult,
      ballCount: state.ballCount,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
