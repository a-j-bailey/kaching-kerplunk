import {
  formatPoints,
  getPoints,
  POINT_VALUES,
  vehicleEmoji,
} from '../constants/points';

describe('POINT_VALUES', () => {
  test('matches the Ka-Ching Kerplunk scoring table', () => {
    expect(POINT_VALUES).toEqual({
      car: 10,
      motorcycle: 20,
      truck: 100,
    });
  });
});

describe('getPoints', () => {
  test.each([
    ['car', 'pass', 10],
    ['car', 'passed', -10],
    ['motorcycle', 'pass', 20],
    ['motorcycle', 'passed', -20],
    ['truck', 'pass', 100],
    ['truck', 'passed', -100],
  ] as const)('%s %s returns %i', (vehicle, action, expected) => {
    expect(getPoints(vehicle, action)).toBe(expected);
  });
});

describe('formatPoints', () => {
  test('prefixes positive values with +', () => {
    expect(formatPoints(10)).toBe('+10');
    expect(formatPoints(100)).toBe('+100');
  });

  test('keeps zero and negatives without a plus', () => {
    expect(formatPoints(0)).toBe('0');
    expect(formatPoints(-20)).toBe('-20');
  });
});

describe('vehicleEmoji', () => {
  test('returns an emoji for each vehicle', () => {
    expect(vehicleEmoji('car')).toBe('🚗');
    expect(vehicleEmoji('truck')).toBe('🚛');
    expect(vehicleEmoji('motorcycle')).toBe('🏍️');
  });
});
