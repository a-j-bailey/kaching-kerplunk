import type { ScoreAction, VehicleType } from '../types';

export const POINT_VALUES: Record<VehicleType, number> = {
  car: 10,
  motorcycle: 20,
  truck: 100,
};

export function getPoints(vehicle: VehicleType, action: ScoreAction): number {
  const base = POINT_VALUES[vehicle];
  return action === 'pass' ? base : -base;
}

export function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : `${points}`;
}

export function vehicleEmoji(vehicle: VehicleType): string {
  switch (vehicle) {
    case 'car':
      return '🚗';
    case 'truck':
      return '🚛';
    case 'motorcycle':
      return '🏍️';
    default: {
      const _exhaustive: never = vehicle;
      return _exhaustive;
    }
  }
}
