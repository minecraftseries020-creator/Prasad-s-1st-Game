import { PlayerSaveData } from '../types/game';

const SAVE_KEY = 'yes_no_mystery_save_v1';

export const INITIAL_SAVE_DATA: PlayerSaveData = {
  version: 1,
  playerName: 'Detective',
  coins: 100,
  currentLevel: 1,
  completedLevels: [],
  levelStats: {},
  unlockedHints: {},
  dailyStreak: 0,
  lastDailyDate: '',
  dailyMysteryCompleted: false,
  totalPlayTimeSeconds: 0,
  totalQuestionsAsked: 0,
  achievements: {},
  settings: {
    soundEffects: true,
    music: false,
    vibration: true,
    textSize: 'medium',
    theme: 'dark',
    language: 'en',
    characterActive: true,
    selectedDetective: 'alex',
  },
};

export function loadSaveData(): PlayerSaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...INITIAL_SAVE_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SAVE_DATA,
      ...parsed,
      settings: {
        ...INITIAL_SAVE_DATA.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return { ...INITIAL_SAVE_DATA };
  }
}

export function saveGameData(data: PlayerSaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save game data locally', err);
  }
}

export function resetSaveData(): PlayerSaveData {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
  return { ...INITIAL_SAVE_DATA };
}

export function exportSaveString(data: PlayerSaveData): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

export function importSaveString(encoded: string): PlayerSaveData | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    if (typeof parsed.coins === 'number' && Array.isArray(parsed.completedLevels)) {
      const merged = {
        ...INITIAL_SAVE_DATA,
        ...parsed,
        settings: {
          ...INITIAL_SAVE_DATA.settings,
          ...(parsed.settings || {}),
        },
      };
      saveGameData(merged);
      return merged;
    }
    return null;
  } catch {
    return null;
  }
}

// Reward logic per Part 12
export function getLevelReward(levelId: number): number {
  if (levelId === 200) return 1000;
  if (levelId >= 181) return 75;
  if (levelId >= 161) return 60;
  if (levelId >= 141) return 55;
  if (levelId >= 121) return 50;
  if (levelId >= 101) return 45;
  if (levelId >= 81) return 40;
  if (levelId >= 61) return 35;
  if (levelId >= 41) return 30;
  if (levelId >= 21) return 25;
  return 20; // 1-20
}

export const CHAPTER_BONUS_COINS = 200;

export const HINT_COSTS: Record<number, number> = {
  1: 10,
  2: 20,
  3: 30,
};
