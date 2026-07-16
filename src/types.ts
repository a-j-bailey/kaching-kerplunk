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
  history: ScoreEvent[];
};

export type SessionStats = {
  peakScore: number;
  carsPassed: number;
  carsGotPassed: number;
  trucksPassed: number;
  trucksGotPassed: number;
  history: ScoreEvent[];
};

export type StatsScope = 'thisGame' | 'allTime';
