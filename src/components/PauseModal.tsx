import React, { useState } from 'react';
import { Play, RotateCcw, Settings as SettingsIcon, Home, AlertCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenSettings,
  onHome,
}) => {
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#1A2140] border-2 border-[#8257FF] w-full max-w-xs rounded-3xl p-5 shadow-2xl text-center animate-in zoom-in-95 duration-150">
        <h3 className="font-display font-black text-2xl text-white mb-1">
          GAME PAUSED
        </h3>
        <p className="text-xs text-white/60 mb-5">
          Investigation suspended. Progress is saved.
        </p>

        {showRestartConfirm ? (
          <div className="bg-[#101426] p-3 rounded-2xl border border-white/10 mb-4">
            <AlertCircle className="w-8 h-8 text-[#FFC857] mx-auto mb-2" />
            <p className="text-xs font-semibold text-white/90 mb-3">
              Restart this case? Questions asked in this attempt will be cleared.
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowRestartConfirm(false);
                  onRestart();
                }}
                className="w-full py-2 rounded-xl bg-[#FF626C] text-white font-bold text-xs"
              >
                Yes, Restart Case
              </button>
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="w-full py-1.5 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 mb-2">
            {/* 1. RESUME */}
            <button
              onClick={() => {
                sound.playClick();
                onResume();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#8257FF] to-[#388BFF] text-white font-black text-sm shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>RESUME</span>
            </button>

            {/* 2. RESTART LEVEL */}
            <button
              onClick={() => setShowRestartConfirm(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101426] border border-white/10 hover:bg-white/10 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>RESTART LEVEL</span>
            </button>

            {/* 3. SETTINGS */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101426] border border-white/10 hover:bg-white/10 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <SettingsIcon className="w-4 h-4 text-blue-400" />
              <span>SETTINGS</span>
            </button>

            {/* 4. RETURN TO HOME */}
            <button
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#101426] border border-white/10 hover:bg-white/10 text-white font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-purple-400" />
              <span>RETURN TO HOME</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
