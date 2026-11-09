export type AnswerType = 'YES' | 'NO' | 'NOT RELEVANT' | 'AMBIGUOUS';

export type DetectivePose = 'idle' | 'thinking' | 'investigating' | 'happy' | 'confused' | 'sad' | 'victory';

export interface QuestionHistoryItem {
  id: string;
  question: string;
  answer: AnswerType;
  detail?: string;
  timestamp: number;
}

export interface MysteryLevel {
  id: number;
  chapterId: number;
  title: string;
  story: string;
  solution: string;
  hints: [string, string, string];
  category: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert';
  keywords: string[]; // key phrases/words to identify correct solution
  positiveFacts: string[]; // statements/questions that are true (YES)
  negativeFacts: string[]; // statements/questions that are false (NO)
  irrelevantFacts?: string[]; // statements that are unrelated (NOT RELEVANT)
  suggestedQuestions: string[]; // helpful starter questions for mobile players
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  color: string; // primary accent
  bgGradient: string;
  startLevel: number;
  endLevel: number;
  difficulty: string;
  iconName: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  maxProgress: number;
  rewardCoins: number;
}

export interface GameSettings {
  soundEffects: boolean;
  music: boolean;
  vibration: boolean;
  textSize: 'small' | 'medium' | 'large';
  theme: 'dark' | 'light';
  language: 'en' | 'hi';
  characterActive: boolean;
  selectedDetective: 'alex' | 'vance';
}

export interface LevelStat {
  questionsAsked: number;
  hintsUsed: number;
  timeTakenSec: number;
  completedAt: string;
}

export interface PlayerSaveData {
  version: number;
  playerName: string;
  coins: number;
  currentLevel: number;
  completedLevels: number[];
  levelStats: Record<number, LevelStat>;
  unlockedHints: Record<number, number[]>; // levelId -> [1, 2, 3]
  dailyStreak: number;
  lastDailyDate: string;
  dailyMysteryCompleted: boolean;
  totalPlayTimeSeconds: number;
  totalQuestionsAsked: number;
  achievements: Record<string, { unlocked: boolean; unlockedAt?: string; claimed?: boolean }>;
  settings: GameSettings;
}

export type ScreenType =
  | 'loading'
  | 'menu'
  | 'chapters'
  | 'gameplay'
  | 'victory'
  | 'daily'
  | 'modes'
  | 'achievements'
  | 'statistics'
  | 'profile'
  | 'settings';

export type GameMode = 'classic' | 'daily' | 'timed' | 'endless' | 'pass_and_play' | 'expert';
