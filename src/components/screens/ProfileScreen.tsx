import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Coins,
  Trophy,
  HelpCircle,
  Clock,
  Flame,
  Lightbulb,
  CheckCircle,
  BarChart2,
  Edit2,
  Check,
  Award,
} from 'lucide-react';
import { DetectiveAlex } from '../DetectiveAlex';
import { CHAPTERS } from '../../data/chapters';
import { PlayerSaveData } from '../../types/game';
import { ACHIEVEMENTS } from '../../data/achievements';
import { sound } from '../../utils/sound';

interface ProfileScreenProps {
  saveData: PlayerSaveData;
  onUpdateName: (newName: string) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  saveData,
  onUpdateName,
  onBack,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(saveData.playerName);

  const completedCount = saveData.completedLevels.length;
  const overallPercent = Math.round((completedCount / 200) * 100);
  const playerLevel = Math.max(1, Math.floor(completedCount / 5) + 1);

  const totalHintsUsed = Object.values(saveData.unlockedHints).reduce(
    (acc, list) => acc + list.length,
    0
  );

  const avgQuestions =
    completedCount > 0
      ? (saveData.totalQuestionsAsked / Math.max(1, completedCount)).toFixed(1)
      : '0';

  const totalPlayMinutes = Math.floor(saveData.totalPlayTimeSeconds / 60);
  const highestChapter = Math.min(10, Math.ceil(saveData.currentLevel / 20));

  const unlockedAchievementsCount = ACHIEVEMENTS.filter((ach) => {
    return saveData.completedLevels.length >= ach.maxProgress;
  }).length;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
      if (saveData.settings.soundEffects) sound.playClick();
    }
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
          Detective Dossier
        </h2>
        <div className="w-12" />
      </header>

      {/* Main Avatar Card */}
      <div className="bg-[#1A2140] rounded-3xl p-4 border border-[#8257FF]/30 shadow-xl mb-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#8257FF]/20 to-transparent pointer-events-none" />

        <div className="flex flex-col items-center">
            <DetectiveAlex
              size={90}
              pose="happy"
              variant="avatar"
              character={saveData.settings.selectedDetective || 'alex'}
              isActive={saveData.settings.characterActive}
              animate={false}
              className="mb-2"
            />

          {/* Name Editor */}
          {isEditingName ? (
            <div className="flex items-center gap-1.5 mb-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={20}
                className="bg-[#101426] border border-[#8257FF] rounded-lg px-2.5 py-1 text-sm text-center font-bold text-white focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="w-8 h-8 rounded-lg bg-[#8257FF] flex items-center justify-center text-white"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-display font-black text-xl text-white">
                {saveData.playerName}
              </h3>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-white/40 hover:text-white p-1"
                title="Edit Name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Rank: Master Sleuth (Level {playerLevel})
            </span>
            <span className="text-xs bg-amber-500/20 text-[#FFC857] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Ch. {highestChapter} Active
            </span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10">
          <div className="bg-[#101426]/70 p-2 rounded-xl">
            <div className="text-[10px] text-white/50 uppercase">Solved</div>
            <div className="text-base font-black text-[#35C98B]">
              {completedCount} <span className="text-[10px] text-white/40">/200</span>
            </div>
          </div>
          <div className="bg-[#101426]/70 p-2 rounded-xl">
            <div className="text-[10px] text-white/50 uppercase">Coins</div>
            <div className="text-base font-black text-[#FFC857] tabular-nums">
              {saveData.coins.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#101426]/70 p-2 rounded-xl">
            <div className="text-[10px] text-white/50 uppercase">Completion</div>
            <div className="text-base font-black text-purple-300">
              {overallPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Statistics Section */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-purple-300 mb-2.5 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            Performance Metrics
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-white/50">Total Questions</div>
                <div className="text-sm font-black text-white">
                  {saveData.totalQuestionsAsked}
                </div>
              </div>
            </div>

            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-[10px] text-white/50">Questions / Case</div>
                <div className="text-sm font-black text-white">{avgQuestions}</div>
              </div>
            </div>

            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] text-white/50">Total Play Time</div>
                <div className="text-sm font-black text-white">{totalPlayMinutes} min</div>
              </div>
            </div>

            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-[10px] text-white/50">Daily Streak</div>
                <div className="text-sm font-black text-[#FFC857]">
                  {saveData.dailyStreak} days
                </div>
              </div>
            </div>

            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-[10px] text-white/50">Hints Unlocked</div>
                <div className="text-sm font-black text-white">{totalHintsUsed}</div>
              </div>
            </div>

            <div className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-white/50">Achievements</div>
                <div className="text-sm font-black text-white">
                  {unlockedAchievementsCount} / {ACHIEVEMENTS.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Chapters Breakdown */}
        <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-purple-300 mb-2.5">
            Chapter Progression (10 Chapters)
          </h4>

          <div className="space-y-2">
            {CHAPTERS.map((ch) => {
              const chCompleted = saveData.completedLevels.filter(
                (lvl) => lvl >= ch.startLevel && lvl <= ch.endLevel
              ).length;
              const chPercent = Math.round((chCompleted / 20) * 100);

              return (
                <div key={ch.id} className="bg-[#101426] p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ch.color }}
                      />
                      Ch. {ch.id}: {ch.title}
                    </span>
                    <span className="font-extrabold text-[11px]" style={{ color: ch.color }}>
                      {chCompleted}/20 ({chPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${chPercent}%`, backgroundColor: ch.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
