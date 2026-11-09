import React from 'react';
import { Home, BookOpen, Trophy, User } from 'lucide-react';
import { ScreenType } from '../types/game';
import { sound } from '../utils/sound';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  soundEnabled,
  vibrationEnabled,
}) => {
  // Do not show bottom nav on gameplay, loading, or victory screens to give maximum room to story and deduction
  if (['gameplay', 'loading', 'victory'].includes(currentScreen)) {
    return null;
  }

  const navItems = [
    { id: 'menu' as ScreenType, label: 'Home', icon: Home },
    { id: 'chapters' as ScreenType, label: 'Chapters', icon: BookOpen },
    { id: 'achievements' as ScreenType, label: 'Rewards', icon: Trophy },
    { id: 'profile' as ScreenType, label: 'Profile', icon: User },
  ];

  const handleNav = (screen: ScreenType) => {
    if (soundEnabled) sound.playClick();
    if (vibrationEnabled) sound.triggerHaptic(20);
    onNavigate(screen);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141933]/95 backdrop-blur-md border-t border-white/10 max-w-md mx-auto shadow-2xl safe-area-bottom select-none">
      <div className="grid grid-cols-4 h-16 items-center px-2">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.id === 'profile' && currentScreen === 'statistics');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#8257FF] font-black scale-105'
                  : 'text-white/50 hover:text-white/80 active:scale-95 font-semibold'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#8257FF]/15 text-[#8257FF]' : ''
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
