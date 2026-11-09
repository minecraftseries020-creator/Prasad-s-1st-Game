import { Chapter } from '../types/game';

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Easy Mysteries',
    subtitle: 'The Beginner Detective',
    color: '#35C98B', // Green
    bgGradient: 'from-emerald-900/60 to-slate-900',
    startLevel: 1,
    endLevel: 20,
    difficulty: 'Very Easy to Easy',
    iconName: 'Sparkles',
    description: 'Learn the ropes of deduction with everyday curiosities and friendly cases.',
  },
  {
    id: 2,
    title: 'School Mysteries',
    subtitle: 'Hallway Inquiries',
    color: '#388BFF', // Blue
    bgGradient: 'from-blue-900/60 to-slate-900',
    startLevel: 21,
    endLevel: 40,
    difficulty: 'Easy',
    iconName: 'GraduationCap',
    description: 'Unravel baffling occurrences in classrooms, libraries, and schoolyards.',
  },
  {
    id: 3,
    title: 'House Mysteries',
    subtitle: 'Domestic Curiosities',
    color: '#FF9E3B', // Orange
    bgGradient: 'from-amber-900/60 to-slate-900',
    startLevel: 41,
    endLevel: 60,
    difficulty: 'Easy to Medium',
    iconName: 'Home',
    description: 'Peculiar happenings behind closed doors, kitchens, and attics.',
  },
  {
    id: 4,
    title: 'Detective Cases',
    subtitle: 'The Sleuth’s Dossier',
    color: '#8257FF', // Purple
    bgGradient: 'from-purple-900/60 to-slate-900',
    startLevel: 61,
    endLevel: 80,
    difficulty: 'Medium',
    iconName: 'Search',
    description: 'Traditional detective puzzles requiring sharp eyes and critical thinking.',
  },
  {
    id: 5,
    title: 'Travel Mysteries',
    subtitle: 'Wanderer’s Enigmas',
    color: '#06B6D4', // Cyan
    bgGradient: 'from-cyan-900/60 to-slate-900',
    startLevel: 81,
    endLevel: 100,
    difficulty: 'Medium',
    iconName: 'Compass',
    description: 'Mysterious events on trains, flights, road trips, and strange foreign hotels.',
  },
  {
    id: 6,
    title: 'Animal Mysteries',
    subtitle: 'Creature Curiosities',
    color: '#10B981', // Green
    bgGradient: 'from-teal-900/60 to-slate-900',
    startLevel: 101,
    endLevel: 120,
    difficulty: 'Medium to Hard',
    iconName: 'Bird',
    description: 'Puzzling animal behaviors, optical nature illusions, and wildlife riddles.',
  },
  {
    id: 7,
    title: 'Science Mysteries',
    subtitle: 'Natural Phenomena',
    color: '#3B82F6', // Blue
    bgGradient: 'from-indigo-900/60 to-slate-900',
    startLevel: 121,
    endLevel: 140,
    difficulty: 'Hard',
    iconName: 'FlaskConical',
    description: 'Phenomena rooted in physics, optical refraction, chemistry, and pressure.',
  },
  {
    id: 8,
    title: 'Historical Mysteries',
    subtitle: 'Echoes of the Past',
    color: '#FFC857', // Gold
    bgGradient: 'from-yellow-900/60 to-slate-900',
    startLevel: 141,
    endLevel: 160,
    difficulty: 'Hard',
    iconName: 'Hourglass',
    description: 'Relics, ancient manuscripts, old architecture, and centuries of secrets.',
  },
  {
    id: 9,
    title: 'Master Detective',
    subtitle: 'High Deduction Trials',
    color: '#D946EF', // Red-Purple
    bgGradient: 'from-fuchsia-900/60 to-slate-900',
    startLevel: 161,
    endLevel: 180,
    difficulty: 'Very Hard',
    iconName: 'Award',
    description: 'Complex situational paradoxes demanding lateral thinking and strict logic.',
  },
  {
    id: 10,
    title: 'The Final Mystery',
    subtitle: 'The Ultimate Truth',
    color: '#F59E0B', // Gold and Dark Purple
    bgGradient: 'from-amber-900/80 via-purple-950/80 to-slate-950',
    startLevel: 181,
    endLevel: 200,
    difficulty: 'Expert',
    iconName: 'Crown',
    description: 'The pinnacle of mystery solving. Who will earn the title of Ultimate Detective?',
  },
];
