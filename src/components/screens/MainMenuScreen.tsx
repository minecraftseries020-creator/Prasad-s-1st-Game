import React from 'react';
import {
  Play,
  Calendar,
  Layers,
  BookOpen,
  Trophy,
  BarChart3,
  Settings as SettingsIcon,
  Coins,
  Sparkles,
} from 'lucide-react';
import { DetectiveAlex } from '../DetectiveAlex';
import { PlayerSaveData, ScreenType } from '../../types/game';
import { sound } from '../../utils/sound';

interface MainMenuScreenProps {
  saveData: PlayerSaveData;
  onNavigate: (screen: ScreenType) => void;
  onPlayNext: () => void;
  onToggleCharacterActive?: () => void;
  onSwitchDetective?: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  saveData,
  onNavigate,
  onPlayNext,
  onToggleCharacterActive,
  onSwitchDetective,
}) => {
  const playerLevel = Math.max(1, Math.floor(saveData.completedLevels.length / 5) + 1);

  const handleAction = (cb: () => void) => {
    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(25);
    cb();
  };

  const currentDetective = saveData.settings.selectedDetective || 'alex';

  return (
    <div className="flex flex-col min-h-screen bg-[#101426] text-white px-4 pt-3 pb-24 max-w-md mx-auto w-full select-none">
      {/* TOP SECTION */}
      <header className="flex items-center justify-between py-2 border-b border-white/10 mb-3">
        {/* Left: Detective Alex small avatar, Player name, level */}
        <button
          onClick={() => handleAction(() => onNavigate('profile'))}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-[#141C34] border-2 border-[#FFC857] overflow-hidden flex items-center justify-center p-0.5 shadow-md">
            <DetectiveAlex
              size={40}
              pose="idle"
              variant="avatar"
              character={currentDetective}
              isActive={saveData.settings.characterActive}
              animate={false}
            />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">
              {saveData.playerName}
            </div>
            <div className="text-sm font-extrabold text-[#FFC857] flex items-center gap-1">
              <span>Level {playerLevel}</span>
              <span className="text-[10px] text-white/50 font-normal">
                ({saveData.completedLevels.length}/200)
              </span>
            </div>
          </div>
        </button>

        {/* Right: Gold coin icon, coin balance, settings gear icon */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#1A2140] border border-[#FFC857]/40 px-3 py-1.5 rounded-full shadow-inner">
            <Coins className="w-4 h-4 text-[#FFC857] fill-[#FFC857]/30 animate-pulse" />
            <span className="font-extrabold text-sm text-[#FFC857] tabular-nums">
              {saveData.coins.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => handleAction(() => onNavigate('settings'))}
            className="w-10 h-10 rounded-full bg-[#1A2140] border border-white/10 flex items-center justify-center hover:bg-white/10 active:rotate-45 transition-all text-white/80"
            title="Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CENTER LOGO & DETECTIVE ALEX */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-1">
        {/* Large game logo */}
        <div className="relative mb-0.5">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#8257FF]/30 via-[#388BFF]/20 to-[#FFC857]/30 blur-xl rounded-full" />
          <h1 className="relative font-display text-4xl sm:text-5xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-white to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            YES / NO
          </h1>
          <div className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest text-[#8257FF] drop-shadow-md">
            MYSTERY
          </div>
        </div>

        <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#FFC857] uppercase mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THINK. QUESTION. DISCOVER THE TRUTH.</span>
          <Sparkles className="w-3.5 h-3.5" />
        </p>

        {/* Realistic Detective Character Showcase */}
        <div
          className="my-1 cursor-pointer flex flex-col items-center"
          onClick={() =>
            handleAction(() => {
              if (saveData.settings.soundEffects) sound.playQuestion();
            })
          }
        >
          <DetectiveAlex
            size={185}
            pose="idle"
            variant="card"
            character={currentDetective}
            isActive={saveData.settings.characterActive}
            onToggleActive={onToggleCharacterActive}
            onSwitchCharacter={onSwitchDetective}
            speechText={
              saveData.settings.characterActive
                ? currentDetective === 'alex'
                  ? 'Examine every clue. The truth is hidden in details.'
                  : 'A fresh case file! What questions will you ask?'
                : undefined
            }
            animate={true}
          />

          {/* Quick Dual Detective Switcher & Active Status */}
          <div className="mt-2 flex items-center gap-2">
            {onSwitchDetective && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onSwitchDetective);
                }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1A2140] border border-[#FFC857]/30 hover:border-[#FFC857] text-[#FFC857] transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span>Switch:</span>
                <span className="text-white underline">
                  {currentDetective === 'alex' ? 'Chief Vance' : 'Detective Alex'}
                </span>
              </button>
            )}

            {onToggleCharacterActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onToggleCharacterActive);
                }}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#141C34] border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    saveData.settings.characterActive ? 'bg-emerald-400' : 'bg-red-400'
                  }`}
                />
                <span>{saveData.settings.characterActive ? 'Visible' : 'Hidden'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN BUTTONS LIST */}
      <div className="space-y-2.5 w-full mt-auto">
        {/* 1. PLAY GAME (Large purple gradient, white bold text, magnifying glass icon, full-width) */}
        <button
          onClick={() => handleAction(onPlayNext)}
          className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8257FF] via-[#7547FA] to-[#388BFF] text-white font-extrabold text-lg shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-purple-400/30"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>PLAY GAME</span>
          <span className="text-xs bg-black/30 font-semibold px-2 py-0.5 rounded-full ml-1">
            Level {saveData.currentLevel}
          </span>
        </button>

        {/* 2. DAILY MYSTERY (Blue button, calendar icon) */}
        <button
          onClick={() => handleAction(() => onNavigate('daily'))}
          className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#388BFF] text-white font-bold text-base shadow-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between border border-blue-400/30"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5" />
            <span>DAILY MYSTERY</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-black/25 px-2.5 py-1 rounded-full font-semibold">
            {saveData.dailyStreak > 0 && <span>🔥 {saveData.dailyStreak} streak</span>}
            <span className="text-[#FFC857]">+25 🪙</span>
          </div>
        </button>

        {/* 3. GAME MODES (Dark blue button, puzzle icon) */}
        <button
          onClick={() => handleAction(() => onNavigate('modes'))}
          className="w-full min-h-[48px] py-3 px-5 rounded-xl bg-[#1A2140] hover:bg-[#202950] text-white font-bold text-base shadow-sm border border-white/10 active:scale-[0.98] transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#388BFF]" />
            <span>GAME MODES</span>
          </div>
          <span className="text-xs text-white/50 font-normal">Timed · Endless · 2P</span>
        </button>

        {/* Grid for Chapters & Achievements */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 4. CHAPTERS (Purple outlined button, book icon) */}
          <button
            onClick={() => handleAction(() => onNavigate('chapters'))}
            className="min-h-[48px] py-2.5 px-3 rounded-xl bg-[#1A2140]/60 border-2 border-[#8257FF] text-white font-bold text-sm hover:bg-[#8257FF]/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#8257FF]" />
            <span>CHAPTERS</span>
          </button>

          {/* 5. ACHIEVEMENTS (Golden outlined button, trophy icon) */}
          <button
            onClick={() => handleAction(() => onNavigate('achievements'))}
            className="min-h-[48px] py-2.5 px-3 rounded-xl bg-[#1A2140]/60 border-2 border-[#FFC857] text-[#FFC857] font-bold text-sm hover:bg-[#FFC857]/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-[#FFC857]" />
            <span>TROPHIES</span>
          </button>
        </div>

        {/* 6. STATISTICS (Blue outlined button, chart icon) */}
        <button
          onClick={() => handleAction(() => onNavigate('statistics'))}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1A2140]/60 border border-[#388BFF]/60 text-blue-300 font-semibold text-xs hover:bg-[#388BFF]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-4 h-4 text-[#388BFF]" />
          <span>DETECTIVE RECORD & STATISTICS</span>
        </button>
      </div>
    </div>
  );
};
