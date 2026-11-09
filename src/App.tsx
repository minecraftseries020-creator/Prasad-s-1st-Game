/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ScreenType,
  GameMode,
  PlayerSaveData,
  GameSettings,
} from './types/game';
import { ALL_LEVELS, getLevelById } from './data/levels';
import {
  loadSaveData,
  saveGameData,
  resetSaveData,
  getLevelReward,
  CHAPTER_BONUS_COINS,
} from './utils/storage';
import { ACHIEVEMENTS } from './data/achievements';
import { sound } from './utils/sound';

// Components & Screens
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { ChaptersScreen } from './components/screens/ChaptersScreen';
import { GameplayScreen } from './components/screens/GameplayScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';
import { DailyMysteryScreen } from './components/screens/DailyMysteryScreen';
import { GameModesScreen } from './components/screens/GameModesScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { BottomNav } from './components/BottomNav';
import { PauseModal } from './components/PauseModal';

export default function App() {
  const [saveData, setSaveData] = useState<PlayerSaveData>(() => loadSaveData());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('loading');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [activeMode, setActiveMode] = useState<GameMode>('classic');

  // Victory screen state
  const [lastVictoryStats, setLastVictoryStats] = useState<{
    questionsCount: number;
    hintsUsed: number;
    timeTakenSec: number;
  }>({ questionsCount: 0, hintsUsed: 0, timeTakenSec: 0 });
  const [lastEarnedCoins, setLastEarnedCoins] = useState<number>(0);
  const [lastChapterBonus, setLastChapterBonus] = useState<number>(0);

  // Pause modal
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);

  // Sync state to local storage automatically
  useEffect(() => {
    saveGameData(saveData);
  }, [saveData]);

  // Global play time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSaveData((prev) => ({
        ...prev,
        totalPlayTimeSeconds: prev.totalPlayTimeSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Android Back navigation handler
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (currentScreen !== 'menu') {
        e.preventDefault();
        if (currentScreen === 'gameplay') {
          setIsPauseOpen(true);
        } else {
          setCurrentScreen('menu');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScreen]);

  // Navigate helper with browser history push for Android back button support
  const navigateTo = useCallback((screen: ScreenType) => {
    window.history.pushState({ screen }, '');
    setCurrentScreen(screen);
  }, []);

  // Start Level helper
  const startLevel = useCallback(
    (levelId: number, mode: GameMode = 'classic') => {
      setActiveLevelId(levelId);
      setActiveMode(mode);
      setIsPauseOpen(false);
      navigateTo('gameplay');
    },
    [navigateTo]
  );

  // Play next unfinished level
  const handlePlayNext = useCallback(() => {
    // Find next unfinished level or active currentLevel
    const nextUnfinished =
      ALL_LEVELS.find((l) => !saveData.completedLevels.includes(l.id))?.id ||
      saveData.currentLevel ||
      1;
    startLevel(Math.min(200, nextUnfinished), 'classic');
  }, [saveData.completedLevels, saveData.currentLevel, startLevel]);

  // Buy hint handler
  const handleBuyHint = useCallback(
    (hintNum: number, cost: number): boolean => {
      if (saveData.coins < cost) return false;
      const currentHints = saveData.unlockedHints[activeLevelId] || [];
      if (currentHints.includes(hintNum)) return true;

      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins - cost,
        unlockedHints: {
          ...prev.unlockedHints,
          [activeLevelId]: [...currentHints, hintNum],
        },
      }));
      return true;
    },
    [activeLevelId, saveData.coins, saveData.unlockedHints]
  );

  // Level Solved handler
  const handleSolveLevel = useCallback(
    (stats: { questionsCount: number; hintsUsed: number; timeTakenSec: number }) => {
      const isAlreadyCompleted = saveData.completedLevels.includes(activeLevelId);
      const reward = isAlreadyCompleted ? 0 : getLevelReward(activeLevelId);

      // Check chapter bonus (Level 20, 40, 60, ... 200)
      const isChapterEnd = activeLevelId % 20 === 0;
      const chapterBonus = isChapterEnd && !isAlreadyCompleted ? CHAPTER_BONUS_COINS : 0;
      const totalReward = reward + chapterBonus;

      const nextLevelNumber = Math.min(200, Math.max(saveData.currentLevel, activeLevelId + 1));
      const newCompleted = isAlreadyCompleted
        ? saveData.completedLevels
        : [...saveData.completedLevels, activeLevelId];

      setLastVictoryStats(stats);
      setLastEarnedCoins(reward);
      setLastChapterBonus(chapterBonus);

      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins + totalReward,
        currentLevel: nextLevelNumber,
        completedLevels: newCompleted,
        totalQuestionsAsked: prev.totalQuestionsAsked + stats.questionsCount,
        levelStats: {
          ...prev.levelStats,
          [activeLevelId]: {
            questionsAsked: stats.questionsCount,
            hintsUsed: stats.hintsUsed,
            timeTakenSec: stats.timeTakenSec,
            completedAt: new Date().toISOString(),
          },
        },
      }));

      navigateTo('victory');
    },
    [activeLevelId, navigateTo, saveData.completedLevels, saveData.currentLevel]
  );

  // Daily Solved handler
  const handleSolveDaily = useCallback(
    (earnedCoins: number) => {
      const todayStr = new Date().toISOString().split('T')[0];
      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins + earnedCoins,
        dailyStreak: prev.dailyStreak + 1,
        lastDailyDate: todayStr,
        dailyMysteryCompleted: true,
      }));
    },
    []
  );

  // Victory screen next level action
  const handleVictoryNext = useCallback(() => {
    if (activeLevelId < 200) {
      const nextId = activeLevelId + 1;
      startLevel(nextId, activeMode);
    } else {
      navigateTo('menu');
    }
  }, [activeLevelId, activeMode, navigateTo, startLevel]);

  // Mode selection launcher
  const handleSelectMode = useCallback(
    (mode: GameMode) => {
      if (mode === 'classic') {
        handlePlayNext();
      } else if (mode === 'daily') {
        navigateTo('daily');
      } else if (mode === 'timed') {
        // Pick an interesting mystery
        const randomUnsolved =
          ALL_LEVELS.find((l) => !saveData.completedLevels.includes(l.id)) ||
          ALL_LEVELS[0];
        startLevel(randomUnsolved.id, 'timed');
      } else if (mode === 'endless') {
        const randomLvl = ALL_LEVELS[Math.floor(Math.random() * ALL_LEVELS.length)];
        startLevel(randomLvl.id, 'endless');
      } else if (mode === 'pass_and_play') {
        startLevel(saveData.currentLevel || 1, 'pass_and_play');
      } else if (mode === 'expert') {
        // Start from Chapter 7+
        startLevel(121, 'expert');
      }
    },
    [handlePlayNext, navigateTo, saveData.completedLevels, saveData.currentLevel, startLevel]
  );

  // Claim achievement reward
  const handleClaimAchievement = useCallback(
    (achId: string, rewardCoins: number) => {
      setSaveData((prev) => ({
        ...prev,
        coins: prev.coins + rewardCoins,
        achievements: {
          ...prev.achievements,
          [achId]: {
            unlocked: true,
            claimed: true,
            unlockedAt: new Date().toISOString(),
          },
        },
      }));
    },
    []
  );

  const currentLevelData = useMemo(() => {
    return getLevelById(activeLevelId);
  }, [activeLevelId]);

  // Text scaling class for accessibility
  const textSizeClass =
    saveData.settings.textSize === 'small'
      ? 'text-[13px]'
      : saveData.settings.textSize === 'large'
      ? 'text-[16px]'
      : 'text-[14px]';

  return (
    <div
      className={`min-h-screen bg-[#101426] text-white flex flex-col justify-between selection:bg-[#8257FF] selection:text-white ${textSizeClass}`}
    >
      {/* 1. Loading Screen */}
      {currentScreen === 'loading' && (
        <LoadingScreen
          onLoaded={() => setCurrentScreen('menu')}
          targetLevel={saveData.currentLevel}
          characterActive={saveData.settings.characterActive}
        />
      )}

      {/* 2. Main Menu Screen */}
      {currentScreen === 'menu' && (
        <MainMenuScreen
          saveData={saveData}
          onNavigate={navigateTo}
          onPlayNext={handlePlayNext}
          onToggleCharacterActive={() => {
            setSaveData((prev) => ({
              ...prev,
              settings: {
                ...prev.settings,
                characterActive: !prev.settings.characterActive,
              },
            }));
          }}
          onSwitchDetective={() => {
            setSaveData((prev) => ({
              ...prev,
              settings: {
                ...prev.settings,
                selectedDetective:
                  (prev.settings.selectedDetective || 'alex') === 'alex' ? 'vance' : 'alex',
              },
            }));
          }}
        />
      )}

      {/* 3. Chapters & Level Selection */}
      {currentScreen === 'chapters' && (
        <ChaptersScreen
          saveData={saveData}
          onSelectLevel={(lvlId) => startLevel(lvlId, 'classic')}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* 4. Gameplay Screen */}
      {currentScreen === 'gameplay' && (
        <GameplayScreen
          level={currentLevelData}
          saveData={saveData}
          onSolve={handleSolveLevel}
          onBack={() => navigateTo('chapters')}
          onOpenPause={() => setIsPauseOpen(true)}
          onBuyHint={handleBuyHint}
        />
      )}

      {/* 5. Victory Screen */}
      {currentScreen === 'victory' && (
        <VictoryScreen
          level={currentLevelData}
          stats={lastVictoryStats}
          earnedCoins={lastEarnedCoins}
          chapterBonus={lastChapterBonus}
          saveData={saveData}
          onNextLevel={handleVictoryNext}
          onReplayLevel={() => startLevel(activeLevelId, activeMode)}
          onBackToChapters={() => navigateTo('chapters')}
          onGoHome={() => navigateTo('menu')}
        />
      )}

      {/* 6. Daily Mystery Screen */}
      {currentScreen === 'daily' && (
        <DailyMysteryScreen
          saveData={saveData}
          onSolveDaily={handleSolveDaily}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* 7. Game Modes Screen */}
      {currentScreen === 'modes' && (
        <GameModesScreen
          saveData={saveData}
          onSelectMode={handleSelectMode}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* 8. Achievements Screen */}
      {currentScreen === 'achievements' && (
        <AchievementsScreen
          saveData={saveData}
          onClaimReward={handleClaimAchievement}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* 9. Profile & Statistics */}
      {(currentScreen === 'profile' || currentScreen === 'statistics') && (
        <ProfileScreen
          saveData={saveData}
          onUpdateName={(name) => setSaveData((prev) => ({ ...prev, playerName: name }))}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* 10. Settings Screen */}
      {currentScreen === 'settings' && (
        <SettingsScreen
          saveData={saveData}
          onUpdateSettings={(newSettings) =>
            setSaveData((prev) => ({ ...prev, settings: newSettings }))
          }
          onResetData={() => {
            const fresh = resetSaveData();
            setSaveData(fresh);
            navigateTo('menu');
          }}
          onImportData={(data) => {
            setSaveData(data);
            navigateTo('menu');
          }}
          onBack={() => navigateTo('menu')}
        />
      )}

      {/* Pause Menu Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onRestart={() => {
          setIsPauseOpen(false);
          startLevel(activeLevelId, activeMode);
        }}
        onOpenSettings={() => {
          setIsPauseOpen(false);
          navigateTo('settings');
        }}
        onHome={() => {
          setIsPauseOpen(false);
          navigateTo('menu');
        }}
      />

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        soundEnabled={saveData.settings.soundEffects}
        vibrationEnabled={saveData.settings.vibration}
      />
    </div>
  );
}
