export type VehicleType = 'car' | 'truck';
export type ScoreAction = 'pass' | 'passed';

export type ScoreEvent = {
  id: string;
  vehicle: VehicleType;
  action: ScoreAction;
  points: number;
  scoreAfter: number;
  timestamp: number;
};

export type GameStats = {
  highScore: number;
  totalPasses: number;
  totalPassed: number;
  carsPassed: number;
  carsGotPassed: number;
  trucksPassed: number;
  trucksGotPassed: number;
  gamesPlayed: number;
  bestStreak: number;
  history: ScoreEvent[];
};

export type GameSession = {
  score: number;
  streak: number;
  startedAt: number;
};
