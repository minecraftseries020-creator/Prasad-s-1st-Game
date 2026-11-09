import React, { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  Check,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Home,
  Search,
  Compass,
  Bird,
  FlaskConical,
  Hourglass,
  Award,
  Crown,
} from 'lucide-react';
import { CHAPTERS } from '../../data/chapters';
import { getLevelsByChapter } from '../../data/levels';
import { PlayerSaveData } from '../../types/game';
import { sound } from '../../utils/sound';

interface ChaptersScreenProps {
  saveData: PlayerSaveData;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export const ChaptersScreen: React.FC<ChaptersScreenProps> = ({
  saveData,
  onSelectLevel,
  onBack,
}) => {
  // Initially show either the chapter of current level or chapter 1
  const currentChapterId = Math.min(
    10,
    Math.max(1, Math.ceil(saveData.currentLevel / 20))
  );
  const [activeChapterId, setActiveChapterId] = useState<number>(currentChapterId);

  const selectedChapter = CHAPTERS.find((c) => c.id === activeChapterId) || CHAPTERS[0];
  const chapterLevels = getLevelsByChapter(activeChapterId);

  // Chapter unlock condition:
  // Chapter 1 is unlocked by default.
  // Chapter N is unlocked if level (N-1)*20 has been completed, OR currentLevel > (N-1)*20
  const isChapterUnlocked = (chId: number) => {
    if (chId === 1) return true;
    const requiredLevel = (chId - 1) * 20;
    return (
      saveData.completedLevels.includes(requiredLevel) ||
      saveData.currentLevel > requiredLevel
    );
  };

  const getChapterIcon = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6', style: { color } };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'GraduationCap':
        return <GraduationCap {...props} />;
      case 'Home':
        return <Home {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Bird':
        return <Bird {...props} />;
      case 'FlaskConical':
        return <FlaskConical {...props} />;
      case 'Hourglass':
        return <Hourglass {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      default:
        return <Search {...props} />;
    }
  };

  const handleTileClick = (levelId: number) => {
    const isCompleted = saveData.completedLevels.includes(levelId);
    const isCurrent = levelId === saveData.currentLevel;
    const isUnlocked = isCompleted || isCurrent || levelId <= saveData.currentLevel;

    if (!isUnlocked) {
      if (saveData.settings.soundEffects) sound.playNo();
      if (saveData.settings.vibration) sound.triggerHaptic(50);
      return;
    }

    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(20);
    onSelectLevel(levelId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101426] text-white px-4 pt-3 pb-24 max-w-md mx-auto w-full select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between py-2 border-b border-white/10 mb-3">
        <button
          onClick={() => {
            if (saveData.settings.soundEffects) sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A2140] hover:bg-[#252f5c] text-white/90 text-sm font-semibold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h2 className="text-base font-extrabold uppercase tracking-wider text-purple-300">
          Case Files & Chapters
        </h2>
        <div className="text-xs bg-[#1A2140] px-2.5 py-1 rounded-full text-[#FFC857] font-bold">
          {saveData.completedLevels.length}/200 Solved
        </div>
      </header>

      {/* TWIN CARDS FROM SCREENSHOT STRUCTURE */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div className="bg-[#141C34] border border-[#222E54] rounded-2xl py-2.5 px-3 text-center shadow">
          <div className="font-display font-black text-xs sm:text-sm text-white tracking-wide uppercase">
            CHAPTER SELECT
          </div>
          <div className="text-[11px] font-semibold text-[#8E9BB5]">
            10 chapters
          </div>
        </div>
        <div className="bg-[#141C34] border border-[#222E54] rounded-2xl py-2.5 px-3 text-center shadow">
          <div className="font-display font-black text-xs sm:text-sm text-white tracking-wide uppercase">
            LEVEL SELECT
          </div>
          <div className="text-[11px] font-semibold text-[#8E9BB5]">
            200 levels
          </div>
        </div>
      </div>

      {/* Chapter Carousel / Pills Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-3 -mx-2 px-2">
        {CHAPTERS.map((ch) => {
          const unlocked = isChapterUnlocked(ch.id);
          const isSelected = ch.id === activeChapterId;
          const completedInChapter = chapterLevels.filter((lvl) =>
            lvl.chapterId === ch.id && saveData.completedLevels.includes(lvl.id)
          ).length;

          return (
            <button
              key={ch.id}
              onClick={() => {
                if (saveData.settings.soundEffects) sound.playClick();
                setActiveChapterId(ch.id);
              }}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-[#1A2140] text-white shadow-md'
                  : 'bg-[#101426] text-white/60 hover:text-white/80 border-white/5'
              }`}
              style={{
                borderColor: isSelected ? ch.color : 'rgba(255,255,255,0.1)',
              }}
            >
              {!unlocked && <Lock className="w-3 h-3 text-white/40" />}
              <span>Ch. {ch.id}</span>
              {completedInChapter === 20 && (
                <Check className="w-3 h-3 text-[#35C98B]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Chapter Banner Card */}
      <div
        className="rounded-2xl p-4 mb-4 relative overflow-hidden border shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${selectedChapter.color}22 0%, #1A2140 100%)`,
          borderColor: `${selectedChapter.color}55`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner"
              style={{ backgroundColor: `${selectedChapter.color}33` }}
            >
              {getChapterIcon(selectedChapter.iconName, selectedChapter.color)}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-white/60">
                Chapter {selectedChapter.id} · {selectedChapter.difficulty}
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                {selectedChapter.title}
              </h3>
              <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                {selectedChapter.description}
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Progress Bar */}
        {(() => {
          const completedCount = chapterLevels.filter((l) =>
            saveData.completedLevels.includes(l.id)
          ).length;
          const percent = Math.round((completedCount / 20) * 100);
          return (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-semibold text-white/80">
                Progress: {completedCount}/20 Completed
              </span>
              <span className="font-extrabold" style={{ color: selectedChapter.color }}>
                {percent}%
              </span>
            </div>
          );
        })()}
      </div>

      {/* Level Grid Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-white/60">
            Cases {selectedChapter.startLevel} – {selectedChapter.endLevel}
          </span>
          <span className="text-[11px] text-white/40">Tap any case to start</span>
        </div>

        {/* 20 Levels Grid: 4 columns x 5 rows */}
        <div className="grid grid-cols-4 gap-2.5 pb-6">
          {chapterLevels.map((level) => {
            const isCompleted = saveData.completedLevels.includes(level.id);
            const isCurrent = level.id === saveData.currentLevel;
            const chapterUnlocked = isChapterUnlocked(selectedChapter.id);
            const isUnlocked =
              chapterUnlocked &&
              (isCompleted || isCurrent || level.id <= saveData.currentLevel);

            return (
              <button
                key={level.id}
                onClick={() => handleTileClick(level.id)}
                disabled={!isUnlocked}
                className={`relative min-h-[58px] rounded-2xl flex flex-col items-center justify-center p-2 font-display transition-all ${
                  isCompleted
                    ? 'bg-[#35C98B] text-white shadow-md shadow-emerald-900/30 hover:brightness-110 active:scale-95'
                    : isCurrent
                    ? 'bg-[#8257FF] text-white border-2 border-[#FFC857] shadow-lg shadow-yellow-500/30 glow-gold-pulse active:scale-95'
                    : isUnlocked
                    ? 'bg-[#8257FF] text-white shadow-md shadow-purple-900/40 hover:brightness-110 active:scale-95'
                    : 'bg-[#1A2140]/60 text-white/30 border border-white/5 cursor-not-allowed'
                }`}
              >
                {/* NEW badge on current level */}
                {isCurrent && !isCompleted && (
                  <span className="absolute -top-1.5 -right-1 bg-[#FFC857] text-[#101426] text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase shadow">
                    NEW
                  </span>
                )}

                {/* Level icon / state */}
                {isCompleted ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3] mb-0.5" />
                    <span className="text-xs font-bold leading-none">{level.id}</span>
                  </>
                ) : isUnlocked ? (
                  <>
                    <span className="text-lg font-black leading-none">{level.id}</span>
                    <span className="text-[9px] uppercase tracking-tighter opacity-80 mt-0.5">
                      Case
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white/30 mb-0.5" />
                    <span className="text-xs font-bold text-white/30">{level.id}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
