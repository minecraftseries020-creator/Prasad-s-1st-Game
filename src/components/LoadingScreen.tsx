import React, { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onLoaded: () => void;
  targetLevel?: number;
  characterActive?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoaded,
  targetLevel,
}) => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(45), 180);
    const t2 = setTimeout(() => setProgress(82), 450);
    const t3 = setTimeout(() => setProgress(100), 750);
    const t4 = setTimeout(() => onLoaded(), 950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onLoaded]);

  return (
    <div className="fixed inset-0 bg-[#0A0E1A] z-50 flex flex-col items-center justify-between py-12 px-6 max-w-md mx-auto w-full select-none">
      {/* Background ambient noir light */}
      <div className="absolute top-1/4 w-64 h-64 bg-[#8257FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 w-72 h-72 bg-[#FFC857]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[10px] uppercase font-bold tracking-widest text-white/30 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          Offline · 200 Mysteries
        </span>
      </div>

      {/* Center Minimal Brand */}
      <div className="flex flex-col items-center text-center my-auto relative z-10">
        {/* Glowing Detective Magnifying Glass Badge */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1C2442] to-[#101426] border border-[#FFC857]/40 flex items-center justify-center shadow-2xl shadow-purple-900/40 relative">
            <Search className="w-10 h-10 text-[#FFC857]" strokeWidth={2.2} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#35C98B] rounded-full ring-2 ring-[#0A0E1A]" />
          </div>
        </div>

        {/* Game Title */}
        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
          YES / NO
        </h1>
        <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-widest text-[#8257FF] -mt-1 drop-shadow">
          MYSTERY
        </div>

        {/* Subtitle */}
        <p className="text-xs font-bold tracking-widest text-[#FFC857] uppercase mt-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span>THINK. QUESTION. DISCOVER.</span>
          <Sparkles className="w-3 h-3" />
        </p>

        {targetLevel && (
          <span className="mt-3 text-xs text-white/60 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Loading Case #{targetLevel}
          </span>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xs text-center space-y-2.5 relative z-10">
        <div className="flex items-center justify-between text-xs font-semibold text-white/60">
          <span>Preparing case files...</span>
          <span className="font-mono font-bold text-[#FFC857]">{progress}%</span>
        </div>

        <div className="w-full h-1.5 bg-[#141C34] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#8257FF] via-[#388BFF] to-[#FFC857] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
