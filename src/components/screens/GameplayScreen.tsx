import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Coins,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Pause,
  Clock,
  Sparkles,
  Info,
  ClipboardList,
  Pin,
  Check,
  RefreshCw,
  Zap,
  Users,
  Compass,
  FileText,
} from 'lucide-react';
import { MysteryLevel, PlayerSaveData, QuestionHistoryItem, AnswerType, DetectivePose } from '../../types/game';
import { CHAPTERS } from '../../data/chapters';
import { DetectiveAlex } from '../DetectiveAlex';
import { MysteryIllustration } from '../MysteryIllustration';
import { evaluateQuestion, checkSolution } from '../../utils/qaEngine';
import { sound } from '../../utils/sound';
import { HINT_COSTS } from '../../utils/storage';

interface GameplayScreenProps {
  level: MysteryLevel;
  saveData: PlayerSaveData;
  onSolve: (stats: { questionsCount: number; hintsUsed: number; timeTakenSec: number }) => void;
  onBack: () => void;
  onOpenPause: () => void;
  onBuyHint: (hintNumber: number, cost: number) => boolean;
}

type QuestionCategory = 'all' | 'motive' | 'people' | 'scene' | 'cause';

export const GameplayScreen: React.FC<GameplayScreenProps> = ({
  level,
  saveData,
  onSolve,
  onBack,
  onOpenPause,
  onBuyHint,
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [history, setHistory] = useState<QuestionHistoryItem[]>([]);
  const [latestAnswer, setLatestAnswer] = useState<{
    answer: AnswerType;
    question: string;
    detail: string;
  } | null>(null);

  // Active Detective: can switch between Alex and Vance
  const [currentDetective, setCurrentDetective] = useState<'alex' | 'vance'>(
    saveData.settings.selectedDetective || 'alex'
  );

  // Character pose & speech feedback
  const [alexPose, setAlexPose] = useState<DetectivePose>('idle');
  const [alexSpeech, setAlexSpeech] = useState<string>('Examine the clues carefully, detective!');

  // Solution Modal
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solutionInput, setSolutionInput] = useState('');
  const [solutionFeedback, setSolutionFeedback] = useState<string | null>(null);

  // Hints Modal
  const [isHintsModalOpen, setIsHintsModalOpen] = useState(false);

  // Clues & Evidence Board Modal
  const [isClueBoardOpen, setIsClueBoardOpen] = useState(false);

  // Active inquiry category filter
  const [activeCategory, setActiveCategory] = useState<QuestionCategory>('all');

  // Timer
  const [timerSec, setTimerSec] = useState(0);
  const unlockedLevelHints = saveData.unlockedHints[level.id] || [];

  const chapter = CHAPTERS.find((c) => c.id === level.chapterId) || CHAPTERS[0];

  useEffect(() => {
    // Reset state for new level
    setHistory([]);
    setLatestAnswer(null);
    setQuestionInput('');
    setSolutionInput('');
    setSolutionFeedback(null);
    setTimerSec(0);
    setAlexPose('idle');
    setAlexSpeech(
      currentDetective === 'alex'
        ? 'Case open! What question should we test first?'
        : 'Inspection started! Let us verify the facts.'
    );
  }, [level.id, currentDetective]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle between Detective Alex and Chief Vance
  const handleToggleDetective = () => {
    const next = currentDetective === 'alex' ? 'vance' : 'alex';
    setCurrentDetective(next);
    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(30);
  };

  // Confirmed YES clues & Eliminated NO clues
  const confirmedClues = useMemo(
    () => history.filter((h) => h.answer === 'YES'),
    [history]
  );
  const eliminatedClues = useMemo(
    () => history.filter((h) => h.answer === 'NO'),
    [history]
  );

  // Estimated deduction readiness (0 to 100%)
  const deductionProgress = useMemo(() => {
    const base = Math.min(60, confirmedClues.length * 20);
    const hintsBonus = unlockedLevelHints.length * 15;
    return Math.min(100, base + hintsBonus);
  }, [confirmedClues.length, unlockedLevelHints.length]);

  // Categorized smart questions
  const categoryQuestions = useMemo(() => {
    const baseQuestions = level.suggestedQuestions || [];
    const motiveList = [
      'Was money or greed the primary motive?',
      'Was this an intentional crime or accident?',
      'Was revenge involved in this situation?',
    ];
    const peopleList = [
      'Was anyone else present at the scene?',
      'Was the person completely alone when this occurred?',
      'Did an animal or pet play a part in this?',
      'Was an eyewitness or stranger involved?',
    ];
    const sceneList = [
      'Did this take place indoors?',
      'Did weather or time of day influence what happened?',
      'Was there forced entry into the location?',
      'Was something physically moved from its place?',
    ];
    const causeList = [
      'Did a physical weapon cause this?',
      'Was a mechanical malfunction responsible?',
      'Did a misunderstanding trigger the event?',
    ];

    if (activeCategory === 'motive') return motiveList;
    if (activeCategory === 'people') return peopleList;
    if (activeCategory === 'scene') return sceneList;
    if (activeCategory === 'cause') return causeList;
    return baseQuestions.length > 0 ? baseQuestions : motiveList.slice(0, 3);
  }, [activeCategory, level.suggestedQuestions]);

  const handleAskQuestion = (qText?: string) => {
    const query = qText || questionInput;
    if (!query.trim()) return;

    if (saveData.settings.soundEffects) sound.playQuestion();
    if (saveData.settings.vibration) sound.triggerHaptic(20);

    const result = evaluateQuestion(query, level);

    // Realistic detective reaction speech
    if (result.answer === 'YES') {
      setAlexPose('happy');
      setAlexSpeech(
        currentDetective === 'alex'
          ? 'Yes! That directly aligns with our deduction theory!'
          : 'Spot on! That crucial detail goes straight into the case log!'
      );
      if (saveData.settings.soundEffects) sound.playYes();
    } else if (result.answer === 'NO') {
      setAlexPose('thinking');
      setAlexSpeech(
        currentDetective === 'alex'
          ? 'No! That angle leads away from the truth.'
          : 'Negative, my friend. We must discard that theory.'
      );
      if (saveData.settings.soundEffects) sound.playNo();
    } else if (result.answer === 'NOT RELEVANT') {
      setAlexPose('confused');
      setAlexSpeech(
        currentDetective === 'alex'
          ? 'That detail is not relevant to the core mystery.'
          : 'Off track! That detail will only distract our investigation.'
      );
      if (saveData.settings.soundEffects) sound.playNotRelevant();
    } else {
      setAlexPose('confused');
      setAlexSpeech('Can you phrase that question more specifically?');
      if (saveData.settings.soundEffects) sound.playNotRelevant();
    }

    const newItem: QuestionHistoryItem = {
      id: `${Date.now()}_${Math.random()}`,
      question: query.trim(),
      answer: result.answer,
      detail: result.detail,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newItem, ...prev]);
    setLatestAnswer({
      answer: result.answer,
      question: query.trim(),
      detail: result.detail,
    });

    setQuestionInput('');
  };

  const handleSubmitSolution = () => {
    if (!solutionInput.trim()) return;

    const result = checkSolution(solutionInput, level);
    if (result.isCorrect) {
      if (saveData.settings.soundEffects) sound.playVictory();
      if (saveData.settings.vibration) sound.triggerHaptic(80);
      setIsSolutionModalOpen(false);
      onSolve({
        questionsCount: history.length,
        hintsUsed: unlockedLevelHints.length,
        timeTakenSec: timerSec,
      });
    } else {
      if (saveData.settings.soundEffects) sound.playWrong();
      if (saveData.settings.vibration) sound.triggerHaptic(50);
      setAlexPose('confused');
      setAlexSpeech('Not quite right yet! Re-check our confirmed evidence.');
      setSolutionFeedback(result.message);
    }
  };

  const handleBuyHint = (hintNum: number) => {
    const cost = HINT_COSTS[hintNum - 1] || 10;
    const ok = onBuyHint(hintNum, cost);
    if (ok) {
      if (saveData.settings.soundEffects) sound.playVictory();
    } else {
      if (saveData.settings.soundEffects) sound.playWrong();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#101426] text-white px-4 pt-3 pb-24 max-w-md mx-auto w-full select-none">
      {/* TOP HEADER */}
      <header className="flex items-center justify-between py-2 border-b border-white/10 mb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (saveData.settings.soundEffects) sound.playClick();
              onBack();
            }}
            className="w-9 h-9 rounded-xl bg-[#1A2140] hover:bg-[#252f5c] border border-white/10 flex items-center justify-center text-white/90 active:scale-95 transition-all"
            title="Back to Cases"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (saveData.settings.soundEffects) sound.playClick();
              onOpenPause();
            }}
            className="w-9 h-9 rounded-xl bg-[#1A2140] hover:bg-[#252f5c] border border-white/10 flex items-center justify-center text-white/90 active:scale-95 transition-all"
            title="Pause Menu"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>

        {/* Case Info */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-purple-300 font-bold truncate max-w-[130px]">
            {chapter.title}
          </div>
          <div className="text-sm font-black text-white flex items-center justify-center gap-1">
            <span>Case #{level.id}</span>
            <span className="text-[10px] text-[#FFC857] font-semibold bg-[#FFC857]/10 px-1.5 rounded">
              {level.difficulty}
            </span>
          </div>
        </div>

        {/* Coin & Clue Board Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (saveData.settings.soundEffects) sound.playClick();
              setIsClueBoardOpen(true);
            }}
            className="flex items-center gap-1 bg-[#1A2140] hover:bg-[#242f5c] border border-[#FFC857]/40 px-2 py-1.5 rounded-xl text-xs font-bold text-[#FFC857] shadow-sm active:scale-95 transition-all"
            title="View Evidence & Clues Pinboard"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#FFC857]" />
            <span>Clues ({confirmedClues.length})</span>
          </button>

          <div className="flex items-center gap-1 bg-[#1A2140] border border-white/10 px-2 py-1.5 rounded-xl">
            <Coins className="w-3.5 h-3.5 text-[#FFC857] fill-[#FFC857]/30" />
            <span className="font-extrabold text-xs text-[#FFC857] tabular-nums">
              {saveData.coins}
            </span>
          </div>
        </div>
      </header>

      {/* STATUS & TIMER BAR */}
      <div className="flex items-center justify-between text-xs font-semibold text-white/70 bg-[#1A2140]/60 px-3 py-1.5 rounded-xl mb-2.5 border border-white/5">
        <div className="flex items-center gap-1.5 text-white/80">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>{history.length} Questions Asked</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/80 tabular-nums">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatTime(timerSec)}</span>
        </div>
        <div className="flex items-center gap-1 text-[#35C98B] font-bold">
          <span>{confirmedClues.length} Confirmed</span>
        </div>
      </div>

      {/* STORY CARD WITH REALISTIC DETECTIVE */}
      <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-purple-500/20 shadow-lg mb-3">
        {/* Mystery scene banner */}
        <MysteryIllustration chapterId={level.chapterId} levelId={level.id} className="mb-2.5" />

        {/* Title & Realistic Detective Avatar Switcher */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h1 className="font-display text-lg sm:text-xl font-black text-white leading-tight">
              {level.title}
            </h1>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              {level.category}
            </div>
          </div>

          {/* Realistic Detective Portrait (tap to toggle between Alex and Vance) */}
          <div
            className="flex-shrink-0 cursor-pointer flex flex-col items-center group"
            onClick={handleToggleDetective}
            title={`Active: ${currentDetective === 'alex' ? 'Detective Alex' : 'Chief Vance'} (Tap to switch)`}
          >
            <div className="relative">
              <DetectiveAlex
                size={54}
                pose={alexPose}
                variant="avatar"
                character={currentDetective}
                isActive={saveData.settings.characterActive}
                animate={true}
              />
              <div className="absolute -bottom-1 -right-1 bg-[#101426] border border-[#FFC857] text-[8px] font-extrabold text-[#FFC857] px-1 rounded-full shadow">
                {currentDetective === 'alex' ? 'ALEX' : 'VANCE'}
              </div>
            </div>
          </div>
        </div>

        {/* Full Mystery Description */}
        <p className="text-sm text-white/90 leading-relaxed font-normal bg-[#101426]/70 p-3 rounded-xl border border-white/5">
          {level.story}
        </p>

        {/* Realistic Detective Speech Reaction */}
        <div className="mt-2 text-xs font-medium text-amber-300 flex items-center justify-between bg-[#FFC857]/10 px-2.5 py-1.5 rounded-lg border border-[#FFC857]/20">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC857] flex-shrink-0" />
            <span className="truncate">
              {saveData.settings.characterActive
                ? `${currentDetective === 'alex' ? 'Alex' : 'Chief Vance'}: "${alexSpeech}"`
                : `Deduction Note: ${alexSpeech}`}
            </span>
          </div>

          <button
            onClick={handleToggleDetective}
            className="text-[9px] text-[#FFC857] hover:underline flex-shrink-0 ml-1 font-bold"
          >
            Switch Detective
          </button>
        </div>
      </div>

      {/* LATEST ANSWER DISPLAY CARD */}
      {latestAnswer && (
        <div
          className={`rounded-2xl p-3 mb-3 border shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
            latestAnswer.answer === 'YES'
              ? 'bg-[#35C98B]/15 border-[#35C98B] text-emerald-200'
              : latestAnswer.answer === 'NO'
              ? 'bg-[#FF626C]/15 border-[#FF626C] text-red-200'
              : latestAnswer.answer === 'NOT RELEVANT'
              ? 'bg-[#388BFF]/15 border-[#388BFF] text-blue-200'
              : 'bg-[#FFC857]/15 border-[#FFC857] text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70 truncate max-w-[200px]">
              Q: "{latestAnswer.question}"
            </span>
            <div className="flex items-center gap-1.5 font-display font-black text-sm">
              {latestAnswer.answer === 'YES' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#35C98B]" />
                  <span className="text-[#35C98B]">YES</span>
                </>
              )}
              {latestAnswer.answer === 'NO' && (
                <>
                  <XCircle className="w-5 h-5 text-[#FF626C]" />
                  <span className="text-[#FF626C]">NO</span>
                </>
              )}
              {latestAnswer.answer === 'NOT RELEVANT' && (
                <>
                  <Info className="w-5 h-5 text-[#388BFF]" />
                  <span className="text-[#388BFF]">NOT RELEVANT</span>
                </>
              )}
              {latestAnswer.answer === 'AMBIGUOUS' && (
                <>
                  <HelpCircle className="w-5 h-5 text-[#FFC857]" />
                  <span className="text-[#FFC857]">REPHRASE</span>
                </>
              )}
            </div>
          </div>
          <p className="text-xs mt-1 text-white/90">{latestAnswer.detail}</p>
        </div>
      )}

      {/* QUESTION SECTION */}
      <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10 mb-3 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="mystery-question-input"
            className="text-xs uppercase font-extrabold tracking-wider text-purple-300"
          >
            ASK YOUR QUESTION
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (saveData.settings.soundEffects) sound.playClick();
                setIsHintsModalOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-bold text-[#FFC857] bg-[#FFC857]/15 px-2.5 py-1 rounded-lg hover:bg-[#FFC857]/25 active:scale-95 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints ({unlockedLevelHints.length}/3)</span>
            </button>
          </div>
        </div>

        {/* Input box */}
        <div className="relative mb-2">
          <input
            id="mystery-question-input"
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAskQuestion();
              }
            }}
            placeholder="Type your YES/NO question here..."
            className="w-full bg-[#101426] border border-white/20 rounded-xl px-3.5 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8257FF] focus:ring-1 focus:ring-[#8257FF]"
          />
        </div>

        {/* ASK QUESTION BUTTON */}
        <button
          onClick={() => handleAskQuestion()}
          disabled={!questionInput.trim()}
          className="w-full min-h-[48px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8257FF] to-[#6C3AE6] text-white font-extrabold text-sm shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>ASK QUESTION (YES / NO)</span>
        </button>

        {/* Category Inquiry Tabs */}
        <div className="mt-3 pt-2.5 border-t border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-white/50 font-medium">
              🔍 Inquiry Angle:
            </span>
            <span className="text-[10px] text-[#FFC857] font-semibold">Tap to ask</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2 scrollbar-none">
            {(
              [
                { id: 'all', label: 'All', icon: Zap },
                { id: 'motive', label: 'Motive', icon: Sparkles },
                { id: 'people', label: 'People', icon: Users },
                { id: 'scene', label: 'Scene', icon: Compass },
                { id: 'cause', label: 'Cause', icon: FileText },
              ] as const
            ).map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition-all flex-shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-[#8257FF] text-white shadow'
                      : 'bg-[#101426] text-white/50 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Questions List */}
          <div className="flex flex-wrap gap-1.5">
            {categoryQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAskQuestion(q)}
                className="text-[11px] bg-[#101426] hover:bg-purple-900/40 text-purple-200 border border-purple-500/30 px-2.5 py-1 rounded-lg active:scale-95 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL ANSWER SECTION (Submit Final Solution CTA) */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (saveData.settings.soundEffects) sound.playClick();
            setIsSolutionModalOpen(true);
          }}
          className="w-full min-h-[52px] py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FFC857] via-[#FFB300] to-[#F59E0B] text-[#101426] font-black text-base shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-amber-300/40"
        >
          <Sparkles className="w-5 h-5 fill-[#101426]" />
          <span>SUBMIT FINAL SOLUTION</span>
        </button>
      </div>

      {/* INVESTIGATION HISTORY SECTION */}
      <div className="flex-1 bg-[#1A2140]/70 rounded-2xl p-3.5 border border-white/10 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-white/70">
            Case Inquiry History ({history.length})
          </span>
          {history.length > 0 && (
            <span className="text-[10px] text-white/40">Latest at top</span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-white/40">
            <HelpCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-medium">No questions asked yet.</p>
            <p className="text-[11px]">Tap an inquiry angle or type your own question!</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-60 pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-[#101426] p-2.5 rounded-xl border border-white/5 flex items-start justify-between gap-2"
              >
                <div className="text-xs flex-1">
                  <div className="font-semibold text-white/90">
                    <span className="text-purple-400 font-bold mr-1">Q:</span>
                    {item.question}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {item.answer === 'YES' && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#35C98B]/20 text-[#35C98B] border border-[#35C98B]/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      YES
                    </span>
                  )}
                  {item.answer === 'NO' && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#FF626C]/20 text-[#FF626C] border border-[#FF626C]/40 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      NO
                    </span>
                  )}
                  {item.answer === 'NOT RELEVANT' && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#388BFF]/20 text-[#388BFF] border border-[#388BFF]/40 flex items-center gap-0.5">
                      <Info className="w-2.5 h-2.5" />
                      NOT RELEVANT
                    </span>
                  )}
                  {item.answer === 'AMBIGUOUS' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/40">
                      REPHRASE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EVIDENCE & CLUES PINBOARD MODAL (NEW FEATURE) */}
      {isClueBoardOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border-2 border-[#FFC857]/70 w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#FFC857]" />
                <div>
                  <h3 className="font-display font-black text-base text-white">
                    Evidence Pinboard
                  </h3>
                  <span className="text-[10px] text-white/50">Case #{level.id} Dossier</span>
                </div>
              </div>
              <button
                onClick={() => setIsClueBoardOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Deduction Readiness Progress Bar */}
            <div className="bg-[#101426] p-3 rounded-xl border border-white/10 mb-3">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-white/80">Deduction Readiness</span>
                <span className="text-[#FFC857]">{deductionProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8257FF] to-[#35C98B] rounded-full transition-all duration-300"
                  style={{ width: `${deductionProgress}%` }}
                />
              </div>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {/* Confirmed Facts (YES) */}
              <div>
                <span className="text-[11px] font-black uppercase text-[#35C98B] flex items-center gap-1 mb-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Confirmed Facts ({confirmedClues.length})
                </span>
                {confirmedClues.length === 0 ? (
                  <p className="text-xs text-white/40 italic bg-[#101426] p-2 rounded-lg">
                    No confirmed facts yet. Ask questions that get a YES!
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {confirmedClues.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#101426] p-2 rounded-lg border border-[#35C98B]/30 text-xs text-emerald-200 flex items-start gap-1.5"
                      >
                        <Pin className="w-3.5 h-3.5 text-[#35C98B] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-white">{c.question}</div>
                          <div className="text-[10px] text-emerald-300/80">{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Debunked Leads (NO) */}
              <div>
                <span className="text-[11px] font-black uppercase text-[#FF626C] flex items-center gap-1 mb-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  Debunked False Leads ({eliminatedClues.length})
                </span>
                {eliminatedClues.length === 0 ? (
                  <p className="text-xs text-white/40 italic bg-[#101426] p-2 rounded-lg">
                    No leads eliminated yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {eliminatedClues.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#101426] p-2 rounded-lg border border-[#FF626C]/20 text-xs text-red-200 line-through opacity-80"
                      >
                        {c.question}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setIsClueBoardOpen(false);
                  setIsSolutionModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#101426] font-black text-xs shadow"
              >
                READY TO SOLVE MYSTERY
              </button>
              <button
                onClick={() => setIsClueBoardOpen(false)}
                className="w-full py-1.5 text-xs text-white/60 hover:text-white"
              >
                Back to Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOLUTION SUBMISSION MODAL */}
      {isSolutionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border-2 border-[#FFC857] w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFC857]" />
                Submit Final Solution
              </h3>
              <button
                onClick={() => setIsSolutionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 mb-3">
              Explain in your own words what actually happened in Case #{level.id}. Mention the key factor or truth!
            </p>

            {solutionFeedback && (
              <div className="mb-3 p-2.5 rounded-xl bg-[#FF626C]/20 border border-[#FF626C]/40 text-red-200 text-xs font-semibold">
                {solutionFeedback}
              </div>
            )}

            <textarea
              value={solutionInput}
              onChange={(e) => setSolutionInput(e.target.value)}
              placeholder="E.g., The man was actually..."
              rows={3}
              className="w-full bg-[#101426] border border-white/20 rounded-xl p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#FFC857] mb-4"
            />

            <div className="space-y-2">
              <button
                onClick={handleSubmitSolution}
                className="w-full min-h-[48px] py-3 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#101426] font-extrabold text-sm shadow-md active:scale-95 transition-transform"
              >
                CHECK MY SOLUTION
              </button>
              <button
                onClick={() => {
                  setIsSolutionModalOpen(false);
                  setIsHintsModalOpen(true);
                }}
                className="w-full py-2 text-xs text-[#FFC857] hover:underline font-semibold"
              >
                Need a clue first? Open Hints
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HINTS MODAL */}
      {isHintsModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border-2 border-[#8257FF] w-full max-w-sm rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#FFC857]" />
                Investigation Hints
              </h3>
              <button
                onClick={() => setIsHintsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/70 mb-3">
              Unlock clues with your Mystery Coins. Purchased hints remain unlocked forever!
            </p>

            <div className="space-y-3 mb-4">
              {/* Hint 1 */}
              <div className="bg-[#101426] p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white/80">HINT 1: Small Clue</span>
                  {unlockedLevelHints.includes(1) ? (
                    <span className="text-[10px] font-bold text-[#35C98B] bg-[#35C98B]/20 px-2 py-0.5 rounded">
                      UNLOCKED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyHint(1)}
                      disabled={saveData.coins < 10}
                      className="text-xs font-extrabold text-[#FFC857] bg-[#FFC857]/15 hover:bg-[#FFC857]/30 px-2.5 py-1 rounded-lg border border-[#FFC857]/30 disabled:opacity-40"
                    >
                      10 🪙 Unlock
                    </button>
                  )}
                </div>
                {unlockedLevelHints.includes(1) ? (
                  <p className="text-xs text-white/90 font-medium">{level.hints[0]}</p>
                ) : (
                  <p className="text-xs text-white/40 italic">A gentle pointer to nudge your deduction.</p>
                )}
              </div>

              {/* Hint 2 */}
              <div className="bg-[#101426] p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white/80">HINT 2: More Useful Clue</span>
                  {unlockedLevelHints.includes(2) ? (
                    <span className="text-[10px] font-bold text-[#35C98B] bg-[#35C98B]/20 px-2 py-0.5 rounded">
                      UNLOCKED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyHint(2)}
                      disabled={saveData.coins < 20}
                      className="text-xs font-extrabold text-[#FFC857] bg-[#FFC857]/15 hover:bg-[#FFC857]/30 px-2.5 py-1 rounded-lg border border-[#FFC857]/30 disabled:opacity-40"
                    >
                      20 🪙 Unlock
                    </button>
                  )}
                </div>
                {unlockedLevelHints.includes(2) ? (
                  <p className="text-xs text-white/90 font-medium">{level.hints[1]}</p>
                ) : (
                  <p className="text-xs text-white/40 italic">A sharper observation about the crime scene.</p>
                )}
              </div>

              {/* Hint 3 */}
              <div className="bg-[#101426] p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white/80">HINT 3: Strong Clue</span>
                  {unlockedLevelHints.includes(3) ? (
                    <span className="text-[10px] font-bold text-[#35C98B] bg-[#35C98B]/20 px-2 py-0.5 rounded">
                      UNLOCKED
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuyHint(3)}
                      disabled={saveData.coins < 30}
                      className="text-xs font-extrabold text-[#FFC857] bg-[#FFC857]/15 hover:bg-[#FFC857]/30 px-2.5 py-1 rounded-lg border border-[#FFC857]/30 disabled:opacity-40"
                    >
                      30 🪙 Unlock
                    </button>
                  )}
                </div>
                {unlockedLevelHints.includes(3) ? (
                  <p className="text-xs text-white/90 font-medium">{level.hints[2]}</p>
                ) : (
                  <p className="text-xs text-white/40 italic">A major breakthrough revealing the truth.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsHintsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
