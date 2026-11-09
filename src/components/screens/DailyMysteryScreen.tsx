import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Coins,
  Flame,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Info,
} from 'lucide-react';
import { ALL_LEVELS } from '../../data/levels';
import { PlayerSaveData, QuestionHistoryItem, AnswerType, DetectivePose } from '../../types/game';
import { DetectiveAlex } from '../DetectiveAlex';
import { MysteryIllustration } from '../MysteryIllustration';
import { evaluateQuestion, checkSolution } from '../../utils/qaEngine';
import { sound } from '../../utils/sound';

interface DailyMysteryScreenProps {
  saveData: PlayerSaveData;
  onSolveDaily: (earnedCoins: number) => void;
  onBack: () => void;
}

export const DailyMysteryScreen: React.FC<DailyMysteryScreenProps> = ({
  saveData,
  onSolveDaily,
  onBack,
}) => {
  // Deterministic daily mystery index derived from current calendar date
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const dailyMystery = useMemo(() => {
    // Generate a pseudo-random hash from date string
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % ALL_LEVELS.length;
    return ALL_LEVELS[index];
  }, [todayStr]);

  const isAlreadyCompletedToday =
    saveData.lastDailyDate === todayStr && saveData.dailyMysteryCompleted;

  const [questionInput, setQuestionInput] = useState('');
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [alexPose, setAlexPose] = useState<DetectivePose>('idle');
  const [alexSpeech, setAlexSpeech] = useState<string>(
    isAlreadyCompletedToday
      ? "You've already solved today's mystery! Come back tomorrow for more streak!"
      : "Today's daily case is ready. Let's solve it!"
  );

  const [solutionInput, setSolutionInput] = useState('');
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionFeedback, setSolutionFeedback] = useState<string | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const handleAskQuestion = (qText?: string) => {
    const q = qText || questionInput;
    if (!q.trim()) return;

    if (saveData.settings.soundEffects) sound.playQuestion();
    if (saveData.settings.vibration) sound.triggerHaptic(20);

    const res = evaluateQuestion(q, dailyMystery);

    if (res.answer === 'YES') {
      setAlexPose('happy');
      setAlexSpeech('Yes! Sharp inquiry!');
      if (saveData.settings.soundEffects) sound.playYes();
    } else if (res.answer === 'NO') {
      setAlexPose('thinking');
      setAlexSpeech('No, that is not the case.');
      if (saveData.settings.soundEffects) sound.playNo();
    } else {
      setAlexPose('confused');
      setAlexSpeech('That detail is not relevant.');
      if (saveData.settings.soundEffects) sound.playNotRelevant();
    }

    setHistory((prev) => [
      {
        id: `${Date.now()}_${Math.random()}`,
        question: q.trim(),
        answer: res.answer,
        detail: res.detail,
        timestamp: Date.now(),
      },
      ...prev,
    ]);

    setQuestionInput('');
  };

  const handleSubmitSolution = () => {
    if (!solutionInput.trim()) return;
    const res = checkSolution(solutionInput, dailyMystery);

    if (res.isCorrect) {
      if (saveData.settings.soundEffects) sound.playVictory();
      if (saveData.settings.vibration) sound.triggerHaptic(80);
      setIsSolutionModalOpen(false);
      onSolveDaily(25);
    } else {
      if (saveData.settings.soundEffects) sound.playWrong();
      if (saveData.settings.vibration) sound.triggerHaptic(50);
      setAlexPose('sad');
      setAlexSpeech('Not quite! Keep questioning.');
      setSolutionFeedback(res.message);
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

        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
          <Calendar className="w-4 h-4 text-[#388BFF]" />
          <span>Daily Mystery</span>
        </div>

        <div className="flex items-center gap-1 bg-[#1A2140] border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-extrabold text-[#FFC857]">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{saveData.dailyStreak} streak</span>
        </div>
      </header>

      {/* Date & Reward Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-blue-400/30 rounded-2xl p-3.5 mb-3 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">
            {todayFormatted}
          </span>
          <h3 className="font-display font-black text-lg text-white">
            Daily Detective Brief
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-white/60 block">Daily Bounty</span>
          <span className="text-sm font-black text-[#FFC857] flex items-center gap-1">
            +25 🪙 Coins
          </span>
        </div>
      </div>

      {isAlreadyCompletedToday ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#1A2140] rounded-3xl border border-emerald-500/30 shadow-xl my-4">
          <CheckCircle2 className="w-16 h-16 text-[#35C98B] mb-3 animate-pulse" />
          <h2 className="text-2xl font-black text-white mb-1">Solved Today!</h2>
          <p className="text-sm text-white/80 max-w-[260px] mb-4">
            You solved today's mystery and claimed 25 coins! Your streak is currently{' '}
            <strong className="text-[#FFC857]">{saveData.dailyStreak} days</strong>.
          </p>
          <DetectiveAlex size={120} pose="victory" speechText="See you tomorrow, detective!" />
          <button
            onClick={() => {
              if (saveData.settings.soundEffects) sound.playClick();
              onBack();
            }}
            className="mt-6 w-full py-3 rounded-xl bg-[#388BFF] text-white font-bold text-sm"
          >
            Return to Menu
          </button>
        </div>
      ) : (
        <>
          {/* Mystery Story Card */}
          <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10 mb-3 shadow-lg">
            <MysteryIllustration
              chapterId={dailyMystery.chapterId}
              levelId={dailyMystery.id}
              className="mb-3"
            />

            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-display text-lg font-black text-white">
                  {dailyMystery.title}
                </h2>
                <div className="text-[11px] font-bold text-[#FFC857] uppercase">
                  {dailyMystery.category}
                </div>
              </div>
              <DetectiveAlex size={54} pose={alexPose} animate={true} />
            </div>

            <p className="text-sm text-white/90 leading-relaxed font-normal bg-[#101426]/70 p-3 rounded-xl border border-white/5">
              {dailyMystery.story}
            </p>

            <div className="mt-2 text-xs text-amber-300 font-medium bg-[#FFC857]/10 p-2 rounded-lg border border-[#FFC857]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC857] flex-shrink-0" />
              <span className="truncate">Alex: {alexSpeech}</span>
            </div>
          </div>

          {/* Three Free Daily Hints Pill Selector */}
          <div className="bg-[#1A2140] rounded-xl p-2.5 mb-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/70 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-[#FFC857]" />
                Daily Free Hints:
              </span>
              <span className="text-[10px] text-white/40">Tap to view</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (saveData.settings.soundEffects) sound.playClick();
                    setActiveHintIndex(activeHintIndex === idx ? null : idx);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                    activeHintIndex === idx
                      ? 'bg-[#FFC857] text-[#101426] border-[#FFC857]'
                      : 'bg-[#101426] text-white/70 border-white/10'
                  }`}
                >
                  Hint {idx + 1}
                </button>
              ))}
            </div>
            {activeHintIndex !== null && (
              <p className="text-xs text-amber-200 mt-2 bg-[#101426] p-2.5 rounded-lg border border-[#FFC857]/30 animate-in fade-in">
                💡 {dailyMystery.hints[activeHintIndex]}
              </p>
            )}
          </div>

          {/* Question Box */}
          <div className="bg-[#1A2140] rounded-2xl p-3 border border-white/10 mb-3">
            <input
              type="text"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskQuestion();
              }}
              placeholder="Ask a YES/NO question..."
              className="w-full bg-[#101426] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#388BFF] mb-2"
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={!questionInput.trim()}
              className="w-full py-2.5 rounded-xl bg-[#388BFF] text-white font-extrabold text-sm shadow hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>ASK QUESTION</span>
            </button>
          </div>

          {/* Submit Final Solution Button */}
          <button
            onClick={() => {
              if (saveData.settings.soundEffects) sound.playClick();
              setIsSolutionModalOpen(true);
            }}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#101426] font-black text-sm shadow-lg mb-3 active:scale-98"
          >
            SUBMIT FINAL SOLUTION
          </button>

          {/* Investigation History */}
          <div className="flex-1 bg-[#1A2140]/60 rounded-2xl p-3 border border-white/10 overflow-y-auto max-h-48">
            <div className="text-xs font-bold text-white/60 mb-2">
              Question Log ({history.length})
            </div>
            {history.length === 0 ? (
              <div className="text-center py-4 text-xs text-white/40">
                Ask questions to solve today's riddle!
              </div>
            ) : (
              <div className="space-y-1.5">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="bg-[#101426] p-2 rounded-lg border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="truncate max-w-[220px]">Q: {h.question}</span>
                    <span
                      className={`font-black text-[10px] px-2 py-0.5 rounded ${
                        h.answer === 'YES'
                          ? 'bg-[#35C98B]/20 text-[#35C98B]'
                          : h.answer === 'NO'
                          ? 'bg-[#FF626C]/20 text-[#FF626C]'
                          : 'bg-[#388BFF]/20 text-[#388BFF]'
                      }`}
                    >
                      {h.answer}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Solution Modal */}
      {isSolutionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border-2 border-[#FFC857] w-full max-w-sm rounded-3xl p-5 shadow-2xl">
            <h3 className="font-display font-black text-lg text-white mb-2">
              Submit Daily Solution
            </h3>
            <p className="text-xs text-white/70 mb-3">
              Describe what happened to solve today's case:
            </p>
            {solutionFeedback && (
              <div className="mb-2 p-2 bg-[#FF626C]/20 border border-[#FF626C]/40 text-red-200 text-xs rounded-lg">
                {solutionFeedback}
              </div>
            )}
            <textarea
              value={solutionInput}
              onChange={(e) => setSolutionInput(e.target.value)}
              placeholder="Your deduction..."
              rows={3}
              className="w-full bg-[#101426] border border-white/20 rounded-xl p-3 text-sm text-white mb-3 focus:outline-none focus:border-[#FFC857]"
            />
            <div className="space-y-2">
              <button
                onClick={handleSubmitSolution}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#101426] font-extrabold text-sm shadow-md"
              >
                CHECK SOLUTION (+25 🪙)
              </button>
              <button
                onClick={() => setIsSolutionModalOpen(false)}
                className="w-full py-2 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
