import React from 'react';
import {
  ArrowLeft,
  Clock,
  Shuffle,
  Users,
  Flame,
  Play,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { GameMode, PlayerSaveData } from '../../types/game';
import { sound } from '../../utils/sound';

interface GameModesScreenProps {
  saveData: PlayerSaveData;
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

export const GameModesScreen: React.FC<GameModesScreenProps> = ({
  saveData,
  onSelectMode,
  onBack,
}) => {
  const handleSelect = (mode: GameMode) => {
    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(25);
    onSelectMode(mode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101426] text-white px-4 pt-3 pb-24 max-w-md mx-auto w-full select-none">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b border-white/10 mb-4">
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
          Investigation Modes
        </h2>
        <div className="w-12" />
      </header>

      {/* Intro */}
      <div className="bg-[#1A2140]/60 p-3 rounded-2xl border border-white/10 mb-4 text-xs text-white/70">
        Choose your detective challenge. All modes are completely free and 100% offline!
      </div>

      {/* Modes list */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {/* 1. Classic Mode */}
        <div
          onClick={() => handleSelect('classic')}
          className="bg-gradient-to-r from-purple-900/40 to-[#1A2140] p-4 rounded-2xl border border-[#8257FF]/40 shadow-md hover:border-[#8257FF] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#8257FF]/20 border border-[#8257FF]/40 flex items-center justify-center text-[#8257FF]">
              <Play className="w-6 h-6 fill-[#8257FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-white">Classic Journey</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-bold">
                  200 Levels
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Progress through 10 handcrafted chapters from beginner to master.
              </p>
            </div>
          </div>
          <span className="text-xs text-purple-300 font-bold ml-2">Resume →</span>
        </div>

        {/* 2. Timed Mode (5-min challenge) */}
        <div
          onClick={() => handleSelect('timed')}
          className="bg-gradient-to-r from-blue-900/40 to-[#1A2140] p-4 rounded-2xl border border-[#388BFF]/40 shadow-md hover:border-[#388BFF] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#388BFF]/20 border border-[#388BFF]/40 flex items-center justify-center text-[#388BFF]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-white">Timed Challenge</h3>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
                  5 Min Limit
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Crack the case against the ticking clock. Sharp deductive speed test.
              </p>
            </div>
          </div>
          <span className="text-xs text-blue-300 font-bold ml-2">Start →</span>
        </div>

        {/* 3. Endless / Random Mode */}
        <div
          onClick={() => handleSelect('endless')}
          className="bg-gradient-to-r from-emerald-900/40 to-[#1A2140] p-4 rounded-2xl border border-[#35C98B]/40 shadow-md hover:border-[#35C98B] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#35C98B]/20 border border-[#35C98B]/40 flex items-center justify-center text-[#35C98B]">
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-white">Endless Mystery</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Infinite Replay
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Random continuous case files pulled from unlocked mysteries.
              </p>
            </div>
          </div>
          <span className="text-xs text-emerald-300 font-bold ml-2">Play →</span>
        </div>

        {/* 4. Pass-and-Play (2 Players on 1 device) */}
        <div
          onClick={() => handleSelect('pass_and_play')}
          className="bg-gradient-to-r from-amber-900/40 to-[#1A2140] p-4 rounded-2xl border border-[#FFC857]/40 shadow-md hover:border-[#FFC857] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFC857]/20 border border-[#FFC857]/40 flex items-center justify-center text-[#FFC857]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-white">Pass & Play (2P)</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  Local Duo
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Two investigators take turns asking YES/NO questions on one phone.
              </p>
            </div>
          </div>
          <span className="text-xs text-amber-300 font-bold ml-2">2 Players →</span>
        </div>

        {/* 5. Expert Mode */}
        <div
          onClick={() => handleSelect('expert')}
          className="bg-gradient-to-r from-red-900/40 to-[#1A2140] p-4 rounded-2xl border border-[#FF626C]/40 shadow-md hover:border-[#FF626C] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF626C]/20 border border-[#FF626C]/40 flex items-center justify-center text-[#FF626C]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base text-white">Expert Mode</h3>
                <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold">
                  Hard Only
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Tackle only high-difficulty cases from Science, History, and Master chapters.
              </p>
            </div>
          </div>
          <span className="text-xs text-red-300 font-bold ml-2">Trial →</span>
        </div>
      </div>
    </div>
  );
};
