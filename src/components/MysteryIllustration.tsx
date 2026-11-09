import React from 'react';

interface MysteryIllustrationProps {
  chapterId: number;
  levelId: number;
  className?: string;
}

export const MysteryIllustration: React.FC<MysteryIllustrationProps> = ({
  chapterId,
  levelId,
  className = '',
}) => {
  // Select thematic illustration based on chapter and level
  return (
    <div
      className={`relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden flex items-center justify-center select-none shadow-inner border border-white/10 ${className}`}
      style={{
        background:
          chapterId === 1
            ? 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)'
            : chapterId === 2
            ? 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)'
            : chapterId === 3
            ? 'linear-gradient(135deg, #7C2D12 0%, #0F172A 100%)'
            : chapterId === 4
            ? 'linear-gradient(135deg, #581C87 0%, #0F172A 100%)'
            : chapterId === 5
            ? 'linear-gradient(135deg, #164E63 0%, #0F172A 100%)'
            : chapterId === 6
            ? 'linear-gradient(135deg, #065F46 0%, #0F172A 100%)'
            : chapterId === 7
            ? 'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)'
            : chapterId === 8
            ? 'linear-gradient(135deg, #78350F 0%, #0F172A 100%)'
            : chapterId === 9
            ? 'linear-gradient(135deg, #701A75 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #451A03 0%, #2E1065 60%, #020617 100%)',
      }}
    >
      {/* Background ambient pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="gridPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* Chapter specific central vector iconography */}
      <div className="relative z-10 flex flex-col items-center">
        {chapterId === 1 && (
          <svg className="w-16 h-16 text-emerald-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Magnifying glass over a clue */}
            <circle cx="28" cy="28" r="16" />
            <path d="M40 40 L56 56" strokeWidth="4" strokeLinecap="round" />
            <path d="M22 26 Q 28 20 34 26" stroke="#FFC857" strokeWidth="3" />
            <circle cx="28" cy="33" r="2" fill="#FFC857" />
          </svg>
        )}

        {chapterId === 2 && (
          <svg className="w-16 h-16 text-blue-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* School graduation / open mystery notebook */}
            <path d="M8 20 L32 8 L56 20 L32 32 Z" />
            <path d="M16 25 V42 C16 46 48 46 48 42 V25" />
            <path d="M56 20 V38" strokeWidth="2" />
          </svg>
        )}

        {chapterId === 3 && (
          <svg className="w-16 h-16 text-amber-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Mysterious house with lit window */}
            <path d="M10 32 L32 12 L54 32" strokeLinecap="round" />
            <rect x="16" y="30" width="32" height="24" rx="2" />
            <rect x="26" y="38" width="12" height="16" fill="#FFC857" opacity="0.8" />
          </svg>
        )}

        {chapterId === 4 && (
          <svg className="w-16 h-16 text-purple-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Detective dossier & fingerprint */}
            <rect x="14" y="10" width="36" height="46" rx="4" />
            <circle cx="32" cy="30" r="8" strokeDasharray="3 3" />
            <path d="M22 44 H42" strokeLinecap="round" />
          </svg>
        )}

        {chapterId === 5 && (
          <svg className="w-16 h-16 text-cyan-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Compass rose & travel wind */}
            <circle cx="32" cy="32" r="22" />
            <polygon points="32,16 37,32 32,28 27,32" fill="#38BDF8" />
            <polygon points="32,48 37,32 32,36 27,32" fill="#94A3B8" />
          </svg>
        )}

        {chapterId === 6 && (
          <svg className="w-16 h-16 text-emerald-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Mystery animal paw / eye */}
            <ellipse cx="32" cy="40" rx="12" ry="9" fill="#10B981" />
            <circle cx="20" cy="24" r="5" fill="#10B981" />
            <circle cx="28" cy="18" r="5" fill="#10B981" />
            <circle cx="36" cy="18" r="5" fill="#10B981" />
            <circle cx="44" cy="24" r="5" fill="#10B981" />
          </svg>
        )}

        {chapterId === 7 && (
          <svg className="w-16 h-16 text-blue-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Science atom & flask */}
            <ellipse cx="32" cy="32" rx="24" ry="10" transform="rotate(30 32 32)" />
            <ellipse cx="32" cy="32" rx="24" ry="10" transform="rotate(-30 32 32)" />
            <circle cx="32" cy="32" r="5" fill="#FFC857" />
          </svg>
        )}

        {chapterId === 8 && (
          <svg className="w-16 h-16 text-amber-300 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Ancient parchment scroll & hourglass */}
            <path d="M14 16 C14 12 24 12 24 16 L24 48 C24 52 14 52 14 48 Z" />
            <path d="M24 14 H46 C50 14 50 20 46 20 L24 20" />
            <path d="M24 42 H46 C50 42 50 48 46 48 L24 48" />
          </svg>
        )}

        {chapterId === 9 && (
          <svg className="w-16 h-16 text-fuchsia-400 drop-shadow-md" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Master detective shield & key */}
            <path d="M32 8 L48 14 V28 C48 40 32 52 32 52 C32 52 16 40 16 28 V14 Z" />
            <circle cx="32" cy="24" r="4" fill="#FFC857" />
            <path d="M32 28 V36 M30 32 H34" />
          </svg>
        )}

        {chapterId === 10 && (
          <svg className="w-16 h-16 text-amber-400 drop-shadow-lg animate-pulse" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* The Ultimate Detective Golden Crown & Trophy */}
            <path d="M12 44 L16 20 L28 32 L32 14 L36 32 L48 20 L52 44 Z" fill="url(#goldGrad)" stroke="#B45309" />
            <circle cx="32" cy="14" r="3" fill="#FFFFFF" />
            <circle cx="16" cy="20" r="3" fill="#FFFFFF" />
            <circle cx="52" cy="20" r="3" fill="#FFFFFF" />
            <rect x="12" y="44" width="40" height="6" rx="2" fill="#D97706" />
          </svg>
        )}

        <div className="mt-2 text-[11px] font-bold tracking-widest uppercase text-white/70 bg-black/40 px-2.5 py-0.5 rounded-full border border-white/10">
          Case #{levelId} Dossier
        </div>
      </div>
    </div>
  );
};
