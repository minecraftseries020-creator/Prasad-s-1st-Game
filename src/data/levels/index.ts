import { MysteryLevel } from '../../types/game';
import { CHAPTER_1_LEVELS } from './chapter1';
import { CHAPTER_2_LEVELS } from './chapter2';
import { CHAPTER_3_LEVELS } from './chapter3';
import { CHAPTER_4_LEVELS } from './chapter4';
import { CHAPTER_5_LEVELS } from './chapter5';
import { CHAPTER_6_LEVELS } from './chapter6';
import { CHAPTER_7_LEVELS } from './chapter7';
import { CHAPTER_8_LEVELS } from './chapter8';
import { CHAPTER_9_LEVELS } from './chapter9';
import { CHAPTER_10_LEVELS } from './chapter10';

export const ALL_LEVELS: MysteryLevel[] = [
  ...CHAPTER_1_LEVELS,
  ...CHAPTER_2_LEVELS,
  ...CHAPTER_3_LEVELS,
  ...CHAPTER_4_LEVELS,
  ...CHAPTER_5_LEVELS,
  ...CHAPTER_6_LEVELS,
  ...CHAPTER_7_LEVELS,
  ...CHAPTER_8_LEVELS,
  ...CHAPTER_9_LEVELS,
  ...CHAPTER_10_LEVELS,
];

export function getLevelById(id: number): MysteryLevel {
  const level = ALL_LEVELS.find((l) => l.id === id);
  if (!level) {
    return ALL_LEVELS[0]; // fallback
  }
  return level;
}

export function getLevelsByChapter(chapterId: number): MysteryLevel[] {
  return ALL_LEVELS.filter((l) => l.chapterId === chapterId);
}
