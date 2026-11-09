import React from 'react';
import {
  ArrowLeft,
  Trophy,
  Check,
  Coins,
  Sparkles,
  Lock,
  Search,
  Compass,
  Award,
  Shield,
  Flame,
  Crown,
  Brain,
  Lightbulb,
  Calendar,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../data/achievements';
import { PlayerSaveData } from '../../types/game';
import { sound } from '../../utils/sound';

interface AchievementsScreenProps {
  saveData: PlayerSaveData;
  onClaimReward: (achievementId: string, rewardCoins: number) => void;
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  saveData,
  onClaimReward,
  onBack,
}) => {
  // Compute progress for each achievement
  const getProgress = (id: string, max: number): number => {
    switch (id) {
      case 'first_mystery':
        return Math.min(1, saveData.completedLevels.length);
      case 'beginner_detective':
        return Math.min(10, saveData.completedLevels.length);
      case 'smart_investigator':
        return Math.min(25, saveData.completedLevels.length);
      case 'mystery_hunter':
        return Math.min(50, saveData.completedLevels.length);
      case 'expert_detective':
        return Math.min(100, saveData.completedLevels.length);
      case 'master_investigator':
        return Math.min(150, saveData.completedLevels.length);
      case 'ultimate_detective':
        return Math.min(200, saveData.completedLevels.length);
      case 'perfect_thinker': {
        const withoutHints = Object.values(saveData.levelStats).filter(
          (s) => s.hintsUsed === 0
        ).length;
        return Math.min(10, withoutHints);
      }
      case 'hint_explorer': {
        const totalHintsBought = Object.values(saveData.unlockedHints).reduce(
          (acc, list) => acc + list.length,
          0
        );
        return Math.min(10, totalHintsBought);
      }
      case 'daily_detective':
        return Math.min(7, saveData.dailyStreak);
      case 'chapter_master': {
        // Complete any chapter of 20 levels
        let completedAny = 0;
        for (let ch = 1; ch <= 10; ch++) {
          const chCompleted = saveData.completedLevels.filter(
            (lvl) => lvl >= (ch - 1) * 20 + 1 && lvl <= ch * 20
          ).length;
          if (chCompleted === 20) {
            completedAny = 1;
            break;
          }
        }
        return completedAny;
      }
      case 'question_expert':
        return Math.min(500, saveData.totalQuestionsAsked);
      default:
        return 0;
    }
  };

  const getIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Search':
        return <Search {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Brain':
        return <Brain {...props} />;
      case 'Lightbulb':
        return <Lightbulb {...props} />;
      case 'Calendar':
        return <Calendar {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'HelpCircle':
        return <HelpCircle {...props} />;
      default:
        return <Trophy {...props} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101426] text-white px-4 pt-3 pb-24 max-w-md mx-auto w-full select-none">
      {/* Top Bar */}
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

        <h2 className="text-base font-extrabold uppercase tracking-wider text-[#FFC857] flex items-center gap-1.5">
          <Trophy className="w-4 h-4" />
          <span>Achievements</span>
        </h2>

        <div className="flex items-center gap-1 bg-[#1A2140] px-2.5 py-1 rounded-full text-xs font-bold text-[#FFC857]">
          <Coins className="w-3.5 h-3.5" />
          <span>{saveData.coins}</span>
        </div>
      </header>

      {/* Overview Card */}
      <div className="bg-gradient-to-r from-amber-900/40 to-purple-900/40 rounded-2xl p-3.5 border border-[#FFC857]/30 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
            Detective Honors
          </span>
          <h3 className="text-lg font-black text-white">Medals & Badges</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/60">Unlocked</span>
          <div className="text-base font-extrabold text-[#FFC857]">
            {
              ACHIEVEMENTS.filter((a) => getProgress(a.id, a.maxProgress) >= a.maxProgress)
                .length
            }{' '}
            / {ACHIEVEMENTS.length}
          </div>
        </div>
      </div>

      {/* Achievement list */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        {ACHIEVEMENTS.map((ach) => {
          const currentProgress = getProgress(ach.id, ach.maxProgress);
          const isCompleted = currentProgress >= ach.maxProgress;
          const isClaimed = saveData.achievements[ach.id]?.claimed;
          const percent = Math.min(100, Math.round((currentProgress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-[#1A2140] border-[#FFC857]/40 shadow-md'
                  : 'bg-[#1A2140]/50 border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#FFC857] text-[#101426] shadow-md shadow-amber-500/20'
                        : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {getIcon(ach.icon)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      {ach.title}
                      {isCompleted && <Check className="w-3.5 h-3.5 text-[#35C98B]" />}
                    </h4>
                    <p className="text-xs text-white/70 mt-0.5">{ach.description}</p>
                  </div>
                </div>

                {/* Claim / Reward Button */}
                <div className="flex-shrink-0">
                  {isClaimed ? (
                    <span className="text-[10px] font-bold text-[#35C98B] bg-[#35C98B]/20 px-2.5 py-1 rounded-full">
                      CLAIMED
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        if (saveData.settings.soundEffects) sound.playAchievement();
                        onClaimReward(ach.id, ach.rewardCoins);
                      }}
                      className="text-xs font-black bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#101426] px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1 animate-pulse"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      +{ach.rewardCoins} Claim
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-white/40 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      +{ach.rewardCoins} 🪙
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/60 mb-1 font-semibold">
                  <span>
                    Progress: {currentProgress} / {ach.maxProgress}
                  </span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: isCompleted ? '#FFC857' : '#8257FF',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
