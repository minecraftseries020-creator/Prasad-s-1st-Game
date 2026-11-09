import React from 'react';
import { DetectivePose } from '../types/game';
import { Trophy, HelpCircle, Sparkles, UserX, Search, CheckCircle2 } from 'lucide-react';

interface DetectiveAlexProps {
  pose?: DetectivePose;
  size?: number; // width/height in px
  className?: string;
  speechText?: string;
  animate?: boolean;
  variant?: 'card' | 'avatar' | 'compact';
  isActive?: boolean;
  character?: 'alex' | 'vance' | 'auto';
  onToggleActive?: () => void;
  onSwitchCharacter?: () => void;
}

export const DetectiveAlex: React.FC<DetectiveAlexProps> = ({
  pose = 'idle',
  size = 180,
  className = '',
  speechText,
  animate = true,
  variant = 'card',
  isActive = true,
  character = 'auto',
  onToggleActive,
  onSwitchCharacter,
}) => {
  // If character is deactivated
  if (!isActive) {
    return (
      <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
        {speechText && (
          <div className="mb-2 max-w-[260px] bg-[#141C34] border border-white/20 text-white/70 text-xs font-medium px-3 py-1.5 rounded-xl text-center shadow">
            {speechText}
          </div>
        )}
        <div
          style={{ width: `${size * 0.8}px`, height: `${size * 0.8}px` }}
          className="rounded-2xl bg-[#141C34] border border-white/10 flex flex-col items-center justify-center p-3 text-center text-white/40 cursor-pointer hover:border-white/30 transition-all"
          onClick={onToggleActive}
          title="Detective character is currently deactivated. Tap to activate."
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-1.5">
            <UserX className="w-5 h-5 text-white/40" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
            Character Deactivated
          </span>
          <span className="text-[9px] text-[#8257FF] hover:underline mt-0.5">
            Tap to activate
          </span>
        </div>
      </div>
    );
  }

  // Determine active detective image & name:
  // Alex: Young, sharp investigator in brown trench coat & fedora with magnifying glass
  // Vance: Veteran smiling investigator in brown trench coat & fedora with solved casebook
  const isVance =
    character === 'vance' ||
    (character === 'auto' && (pose === 'victory' || pose === 'happy'));

  const imageSrc = isVance
    ? '/detective_real_solved.jpg'
    : '/detective_real_thinking.jpg';

  const detectiveTitle = isVance ? 'Chief Vance' : 'Detective Alex';
  const detectiveSubtitle = isVance ? 'Senior Investigator' : 'Lead Detective';

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {speechText && (
        <div className="mb-2 max-w-[280px] bg-[#141C34] border-2 border-[#FFC857]/60 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-2xl shadow-xl relative text-center z-20">
          <p className="leading-snug text-white/95">{speechText}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#FFC857]/60" />
        </div>
      )}

      {/* Main Detective Presentation */}
      <div
        className={`relative ${
          animate ? 'transition-transform duration-300 hover:scale-105' : ''
        }`}
      >
        {variant === 'avatar' ? (
          /* Circular avatar style */
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-full bg-[#101426] border-2 border-[#FFC857] overflow-hidden flex items-center justify-center shadow-lg relative"
          >
            <img
              src={imageSrc}
              alt={detectiveTitle}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/30 pointer-events-none" />
          </div>
        ) : variant === 'compact' ? (
          /* Compact rounded square for question cards */
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-2xl bg-[#101426] border border-[#FFC857]/50 overflow-hidden shadow-md relative"
          >
            <img
              src={imageSrc}
              alt={detectiveTitle}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          </div>
        ) : (
          /* Premium realistic portrait card */
          <div
            style={{ width: `${size}px` }}
            className="rounded-3xl bg-gradient-to-b from-[#1C2442] to-[#12162B] border-2 border-[#FFC857]/60 shadow-2xl p-2 flex flex-col items-center overflow-hidden relative"
          >
            {/* Image Frame */}
            <div
              style={{ width: '100%', height: `${size * 0.95}px` }}
              className="rounded-2xl overflow-hidden relative shadow-inner bg-black/40"
            >
              <img
                src={imageSrc}
                alt={detectiveTitle}
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
              {/* Subtle vignette gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Detective Name Tag Bar */}
              <div className="absolute bottom-1.5 inset-x-2 bg-black/75 backdrop-blur-sm border border-white/10 rounded-xl px-2 py-1 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-extrabold text-[#FFC857] leading-none">
                    {detectiveTitle}
                  </div>
                  <div className="text-[9px] text-white/60 font-medium">
                    {detectiveSubtitle}
                  </div>
                </div>

                {onSwitchCharacter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwitchCharacter();
                    }}
                    className="text-[9px] bg-[#8257FF] hover:bg-[#7042f4] active:scale-95 text-white font-bold px-1.5 py-0.5 rounded-md transition-colors"
                    title="Switch between Detective Alex and Chief Vance"
                  >
                    Switch
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pose Badges & Status Indicators */}
        {pose === 'victory' && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white flex items-center justify-center shadow-lg animate-bounce z-10">
            <Trophy className="w-4 h-4 text-[#101426] fill-[#101426]" />
          </div>
        )}

        {pose === 'thinking' && (
          <div className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-[#8257FF] border-2 border-white flex items-center justify-center shadow-lg text-white font-black text-xs animate-pulse z-10">
            ?
          </div>
        )}

        {pose === 'investigating' && (
          <div className="absolute -top-2 -left-1 w-7 h-7 rounded-full bg-[#388BFF] border-2 border-white flex items-center justify-center shadow-lg text-white z-10">
            <Search className="w-3.5 h-3.5 text-white" />
          </div>
        )}

        {pose === 'confused' && (
          <div className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-[#FFC857] border-2 border-[#101426] flex items-center justify-center shadow-lg text-[#101426] font-black text-xs z-10">
            <HelpCircle className="w-3.5 h-3.5 text-[#101426]" />
          </div>
        )}

        {pose === 'happy' && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#35C98B] border-2 border-white flex items-center justify-center shadow-lg text-white z-10">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};
