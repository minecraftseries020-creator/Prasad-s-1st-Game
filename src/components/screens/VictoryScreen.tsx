import React from 'react';
import {
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Home,
  Clock,
  HelpCircle,
  Coins,
  Sparkles,
  Award,
  Crown,
} from 'lucide-react';
import { MysteryLevel, PlayerSaveData } from '../../types/game';
import { CHAPTERS } from '../../data/chapters';
import { DetectiveAlex } from '../DetectiveAlex';
import { ParticleCelebration } from '../ParticleCelebration';
import { sound } from '../../utils/sound';

interface VictoryScreenProps {
  level: MysteryLevel;
  stats: {
    questionsCount: number;
    hintsUsed: number;
    timeTakenSec: number;
  };
  earnedCoins: number;
  chapterBonus: number;
  saveData: PlayerSaveData;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onBackToChapters: () => void;
  onGoHome: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  level,
  stats,
  earnedCoins,
  chapterBonus,
  saveData,
  onNextLevel,
  onReplayLevel,
  onBackToChapters,
  onGoHome,
}) => {
  const chapter = CHAPTERS.find((c) => c.id === level.chapterId) || CHAPTERS[0];
  const isFinalLevel = level.id === 200;
  const isChapterEnd = level.id % 20 === 0 && !isFinalLevel;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  const handleAction = (cb: () => void) => {
    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(30);
    cb();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#2A154D] via-[#1A2140] to-[#101426] text-white px-4 pt-6 pb-24 flex flex-col items-center justify-between max-w-md mx-auto w-full select-none overflow-x-hidden">
      {/* Particle burst */}
      <ParticleCelebration type={isFinalLevel ? 'trophy' : 'coins'} />

      {/* Subtle radial golden glow in background */}
      <div className="absolute top-10 w-72 h-72 bg-[#FFC857]/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP: Animated Golden Trophy & Alex */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2">
        {isFinalLevel ? (
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl border-4 border-[#FFC857] animate-bounce">
              <Crown className="w-14 h-14 text-[#101426]" />
            </div>
          </div>
        ) : (
          <div className="relative mb-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl border-2 border-[#FFC857] animate-bounce">
              <Trophy className="w-11 h-11 text-[#101426]" />
            </div>
          </div>
        )}

        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-[#FFC857] drop-shadow-lg">
          {isFinalLevel ? 'CONGRATULATIONS!' : 'MYSTERY SOLVED!'}
        </h1>
        <p className="text-sm font-bold text-purple-200 mt-0.5">
          {isFinalLevel
            ? 'YOU ARE THE ULTIMATE DETECTIVE!'
            : 'Excellent detective work!'}
        </p>

        {/* Realistic Detective Victory Pose */}
        <div className="my-2">
          <DetectiveAlex
            size={160}
            pose="victory"
            variant="card"
            character={saveData.settings.selectedDetective || 'auto'}
            isActive={saveData.settings.characterActive}
            speechText={
              isFinalLevel
                ? 'You solved all 200 mysteries! Outstanding!'
                : isChapterEnd
                ? 'Chapter complete! Amazing detective work!'
                : 'Another mystery solved!'
            }
          />
        </div>
      </div>

      {/* CASE DETAILS & SOLUTION CARD (Styled like the dark gold VICTORY SCREEN card in screenshot) */}
      <div className="relative z-10 w-full bg-[#242111] border border-[#FFC857]/40 backdrop-blur-md rounded-3xl p-4 shadow-2xl my-2">
        <div className="text-center pb-2 border-b border-[#FFC857]/20 mb-2.5">
          <h2 className="font-display font-black text-lg text-[#FFC857] tracking-wider uppercase">
            VICTORY SCREEN
          </h2>
          <p className="text-[11px] font-semibold text-[#D6BA64]">
            Rewards · Coins · Next Level · Replay
          </p>
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-purple-300 font-bold">
              {chapter.title}
            </div>
            <h2 className="text-base font-extrabold text-white">
              Case #{level.id}: {level.title}
            </h2>
          </div>
          <span className="text-xs bg-[#35C98B]/20 text-[#35C98B] font-extrabold px-2.5 py-1 rounded-full border border-[#35C98B]/40">
            SOLVED
          </span>
        </div>

        {/* Official Solution */}
        <div className="bg-[#101426] p-3 rounded-2xl border border-white/5 mb-3">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#FFC857] block mb-1">
            Verified Solution:
          </span>
          <p className="text-xs text-white/90 leading-relaxed font-normal">
            {level.solution}
          </p>
        </div>

        {/* Performance metrics grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-white/80 mb-3">
          <div className="bg-[#101426]/70 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-white/50">Questions Asked</div>
              <div className="text-sm font-black text-white">{stats.questionsCount}</div>
            </div>
          </div>

          <div className="bg-[#101426]/70 p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-white/50">Time Taken</div>
              <div className="text-sm font-black text-white">{formatTime(stats.timeTakenSec)}</div>
            </div>
          </div>
        </div>

        {/* REWARD CARD with gold coin highlight */}
        <div className="bg-gradient-to-r from-[#FFC857]/20 via-[#FFB300]/10 to-transparent p-3 rounded-2xl border border-[#FFC857]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FFC857] flex items-center justify-center text-[#101426] shadow-md font-black">
              🪙
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#FFC857] uppercase tracking-wide">
                Rewards Earned
              </div>
              <div className="text-base font-black text-white">
                +{earnedCoins}{' '}
                {chapterBonus > 0 && (
                  <span className="text-xs text-[#35C98B] font-bold">
                    (+{chapterBonus} Ch. Bonus!)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-white/50">Total Coins</div>
            <div className="text-sm font-extrabold text-[#FFC857] tabular-nums">
              {saveData.coins.toLocaleString()} 🪙
            </div>
          </div>
        </div>

        {/* Chapter completion banner if level % 20 === 0 */}
        {isChapterEnd && (
          <div className="mt-2.5 bg-gradient-to-r from-purple-900/60 to-blue-900/60 p-2.5 rounded-xl border border-purple-400/40 text-center">
            <span className="text-xs font-black text-purple-200 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC857]" />
              Chapter {chapter.id} Complete! Next Chapter Unlocked!
            </span>
          </div>
        )}
      </div>

      {/* BUTTONS STACK */}
      <div className="relative z-10 w-full space-y-2 mt-auto pt-2">
        {/* 1. NEXT LEVEL / ULTIMATE FINISH */}
        {isFinalLevel ? (
          <button
            onClick={() => handleAction(onGoHome)}
            className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FFC857] via-[#FFB300] to-[#F59E0B] text-[#101426] font-black text-base shadow-xl shadow-amber-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <Crown className="w-6 h-6 fill-[#101426]" />
            <span>ULTIMATE DETECTIVE FINISHED!</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction(onNextLevel)}
            className="w-full min-h-[58px] py-3 px-6 rounded-2xl bg-[#0D3822] border-2 border-[#35C98B]/60 text-white shadow-xl shadow-emerald-950/50 hover:bg-[#12482c] active:scale-[0.98] transition-all flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-2 text-[#35C98B] font-display font-black text-lg tracking-wide uppercase">
              <span>NEXT LEVEL</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-200/80 -mt-0.5">
              Automatically load the next mystery
            </span>
          </button>
        )}

        {/* Action Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* 2. REPLAY LEVEL */}
          <button
            onClick={() => handleAction(onReplayLevel)}
            className="py-2.5 px-2 rounded-xl bg-[#1A2140] border border-white/10 hover:bg-white/10 text-white/90 text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>

          {/* 3. BACK TO CHAPTER */}
          <button
            onClick={() => handleAction(onBackToChapters)}
            className="py-2.5 px-2 rounded-xl bg-[#1A2140] border border-white/10 hover:bg-white/10 text-white/90 text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chapters</span>
          </button>

          {/* 4. HOME */}
          <button
            onClick={() => handleAction(onGoHome)}
            className="py-2.5 px-2 rounded-xl bg-[#1A2140] border border-white/10 hover:bg-white/10 text-white/90 text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
