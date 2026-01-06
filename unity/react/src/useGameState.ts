import { useState, useCallback } from 'react';

interface GameState {
  energy: number;
  hunger: number;
  happiness: number;
  money: number;
  day: number;
  hour: number;
  isGameOver: boolean;
  gameOverReason: string | null;
}

export interface GameAction {
  name: string;
  label: string;
  energyChange: number;
  hungerChange: number;
  happinessChange: number;
  moneyChange: number;
  timeCost: number;
  color: string;
}

export const ACTIONS: GameAction[] = [
  { name: 'work', label: 'Work', energyChange: -20, hungerChange: -10, happinessChange: -5, moneyChange: 50, timeCost: 4, color: '#27ae60' },
  { name: 'eat', label: 'Eat', energyChange: 0, hungerChange: 30, happinessChange: 5, moneyChange: -10, timeCost: 1, color: '#e67e22' },
  { name: 'sleep', label: 'Sleep', energyChange: 40, hungerChange: -5, happinessChange: 5, moneyChange: 0, timeCost: 6, color: '#9b59b6' },
  { name: 'socialize', label: 'Socialize', energyChange: -10, hungerChange: -5, happinessChange: 25, moneyChange: -5, timeCost: 2, color: '#e91e63' },
  { name: 'rest', label: 'Rest', energyChange: 10, hungerChange: -5, happinessChange: 10, moneyChange: 0, timeCost: 1, color: '#3498db' },
];

const INITIAL_STATE: GameState = {
  energy: 70, hunger: 70, happiness: 70, money: 100,
  day: 1, hour: 8, isGameOver: false, gameOverReason: null,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const performAction = useCallback((action: GameAction) => {
    setState((prev) => {
      if (prev.isGameOver) return prev;

      const energy = clamp(prev.energy + action.energyChange, 0, 100);
      const hunger = clamp(prev.hunger + action.hungerChange, 0, 100);
      const happiness = clamp(prev.happiness + action.happinessChange, 0, 100);
      const money = prev.money + action.moneyChange;

      let hour = prev.hour + action.timeCost;
      let day = prev.day;
      while (hour >= 24) { hour -= 24; day += 1; }

      let isGameOver = false;
      let gameOverReason: string | null = null;

      if (energy <= 0) { isGameOver = true; gameOverReason = 'You collapsed from exhaustion!'; }
      else if (hunger <= 0) { isGameOver = true; gameOverReason = 'You starved!'; }
      else if (happiness <= 0) { isGameOver = true; gameOverReason = 'You fell into deep depression!'; }
      else if (money < 0) { isGameOver = true; gameOverReason = 'You went bankrupt!'; }

      return { energy, hunger, happiness, money, day, hour, isGameOver, gameOverReason };
    });
  }, []);

  const resetGame = useCallback(() => setState(INITIAL_STATE), []);

  const canPerformAction = useCallback((action: GameAction) => {
    if (state.isGameOver) return false;
    if (action.moneyChange < 0 && state.money + action.moneyChange < 0) return false;
    return true;
  }, [state.isGameOver, state.money]);

  return { state, performAction, resetGame, canPerformAction };
}
