import { describe, it, expect } from 'vitest';
import { calculateHomeStats } from './stats.utils';

describe('Pruebas de Estadísticas (Home)', () => {
  it('debe retornar valores en cero cuando no hay partidos', () => {
    const stats = calculateHomeStats([]);
    expect(stats.winRate).toBe(0);
    expect(stats.avgGoals).toBe("0.0");
  });

  it('debe calcular correctamente el % de victorias', () => {
    const mockMatches = [
      { result: 'WON', goalsFor: 2 },
      { result: 'LOST', goalsFor: 1 },
    ] as any;
    const stats = calculateHomeStats(mockMatches);
    expect(stats.winRate).toBe(50);
  });
});