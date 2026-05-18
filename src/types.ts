export type BallOutcome = 'dot' | 'single' | 'two' | 'four' | 'six' | 'wicket' | 'wide';

export type PredictionState = 'waiting' | 'locked' | 'result';

export type MatchPhase = 'live' | 'timeout' | 'innings_break';

export interface MatchState {
  battingTeam: 'CSK' | 'RCB';
  bowlingTeam: 'CSK' | 'RCB';
  score: number;
  wickets: number;
  balls: number; // total balls bowled (6 per over)
  runRate: number;
  phase: MatchPhase;
  lastBall: BallOutcome | null;
  timeoutSecsLeft: number;
}

export interface PlayerStock {
  id: string;
  name: string;
  initials: string;
  team: 'CSK' | 'RCB';
  price: number;
  change: number;
  changePercent: number;
}

export interface Player {
  id: string;
  name: string;
  initials: string;
  team: 'CSK' | 'RCB';
  role: string;
  price: number;
}

export interface GameStats {
  coins: number;
  streak: number;
  bestStreak: number;
  points: number;
  totalPredictions: number;
  correctPredictions: number;
}

export type TabId = 'predict' | 'quickxi' | 'quiz' | 'tictactoe' | 'housie' | 'aitalk' | 'stocks' | 'shop' | 'leaderboard';

export type PersonaId = 'bollywood' | 'comedy' | 'professor' | 'dadi' | 'hype';

export interface Commentary {
  id: string;
  personaId: PersonaId;
  text: string;
  ball: string;
  timestamp: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}
