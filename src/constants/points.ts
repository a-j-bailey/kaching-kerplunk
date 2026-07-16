import type { ScoreAction, VehicleType } from '../types';

export const POINT_VALUES: Record<VehicleType, number> = {
  car: 10,
  truck: 100,
};

export function getPoints(vehicle: VehicleType, action: ScoreAction): number {
  const base = POINT_VALUES[vehicle];
  return action === 'pass' ? base : -base;
}

export function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : `${points}`;
}
