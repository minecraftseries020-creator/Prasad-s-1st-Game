import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Music,
  Smartphone,
  Type,
  Sun,
  Moon,
  Globe,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react';
import { GameSettings, PlayerSaveData } from '../../types/game';
import { exportSaveString, importSaveString } from '../../utils/storage';
import { sound } from '../../utils/sound';

interface SettingsScreenProps {
  saveData: PlayerSaveData;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onImportData: (data: PlayerSaveData) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  saveData,
  onUpdateSettings,
  onResetData,
  onImportData,
  onBack,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupString, setBackupString] = useState('');
  const [importStringInput, setImportStringInput] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const toggleSound = () => {
    const next = !saveData.settings.soundEffects;
    onUpdateSettings({ ...saveData.settings, soundEffects: next });
    if (next) sound.playClick();
  };

  const toggleMusic = () => {
    const next = !saveData.settings.music;
    onUpdateSettings({ ...saveData.settings, music: next });
    if (next) {
      sound.startMusic();
    } else {
      sound.stopMusic();
    }
  };

  const toggleVibration = () => {
    const next = !saveData.settings.vibration;
    onUpdateSettings({ ...saveData.settings, vibration: next });
    if (next) sound.triggerHaptic(40);
  };

  const setTextSize = (size: 'small' | 'medium' | 'large') => {
    onUpdateSettings({ ...saveData.settings, textSize: size });
    if (saveData.settings.soundEffects) sound.playClick();
  };

  const setTheme = (theme: 'dark' | 'light') => {
    onUpdateSettings({ ...saveData.settings, theme: theme });
    if (saveData.settings.soundEffects) sound.playClick();
  };

  const setLanguage = (lang: 'en' | 'hi') => {
    onUpdateSettings({ ...saveData.settings, language: lang });
    if (saveData.settings.soundEffects) sound.playClick();
  };

  const toggleCharacterActive = () => {
    const next = !saveData.settings.characterActive;
    onUpdateSettings({ ...saveData.settings, characterActive: next });
    if (saveData.settings.soundEffects) sound.playClick();
  };

  const setDetectivePersona = (persona: 'alex' | 'vance') => {
    onUpdateSettings({ ...saveData.settings, selectedDetective: persona });
    if (saveData.settings.soundEffects) sound.playClick();
    if (saveData.settings.vibration) sound.triggerHaptic(25);
  };

  const handleOpenExport = () => {
    const str = exportSaveString(saveData);
    setBackupString(str);
    setShowBackupModal(true);
  };

  const handleCopyBackup = () => {
    navigator.clipboard?.writeText(backupString);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDoImport = () => {
    if (!importStringInput.trim()) return;
    const imported = importSaveString(importStringInput.trim());
    if (imported) {
      onImportData(imported);
      setShowBackupModal(false);
      setImportStringInput('');
      setImportError(null);
      if (saveData.settings.soundEffects) sound.playVictory();
    } else {
      setImportError('Invalid backup code. Please check and retry.');
    }
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
          Game Settings
        </h2>
        <div className="w-12" />
      </header>

      {/* Settings Options List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {/* Audio & Haptics Section */}
        <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10 space-y-3">
          <span className="text-[11px] uppercase font-extrabold tracking-wider text-purple-300 block">
            Audio & Haptics
          </span>

          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {saveData.settings.soundEffects ? (
                <Volume2 className="w-5 h-5 text-[#35C98B]" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/40" />
              )}
              <div>
                <div className="text-sm font-bold text-white">Sound Effects</div>
                <div className="text-xs text-white/50">Audio feedback for answers and clues</div>
              </div>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                saveData.settings.soundEffects ? 'bg-[#8257FF]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  saveData.settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Ambient Noir Synth */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Music
                className={`w-5 h-5 ${
                  saveData.settings.music ? 'text-[#FFC857]' : 'text-white/40'
                }`}
              />
              <div>
                <div className="text-sm font-bold text-white">Ambient Music</div>
                <div className="text-xs text-white/50">Procedural detective noir chords</div>
              </div>
            </div>
            <button
              onClick={toggleMusic}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                saveData.settings.music ? 'bg-[#8257FF]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  saveData.settings.music ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibration */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2.5">
              <Smartphone
                className={`w-5 h-5 ${
                  saveData.settings.vibration ? 'text-[#388BFF]' : 'text-white/40'
                }`}
              />
              <div>
                <div className="text-sm font-bold text-white">Tactile Vibration</div>
                <div className="text-xs text-white/50">Haptic feedback on Android touch</div>
              </div>
            </div>
            <button
              onClick={toggleVibration}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                saveData.settings.vibration ? 'bg-[#8257FF]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  saveData.settings.vibration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Accessibility & Display Section */}
        <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10 space-y-3">
          <span className="text-[11px] uppercase font-extrabold tracking-wider text-purple-300 block">
            Accessibility & Display
          </span>

          {/* Detective Character Toggle */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              {saveData.settings.characterActive ? (
                <UserCheck className="w-5 h-5 text-[#35C98B]" />
              ) : (
                <UserX className="w-5 h-5 text-amber-400" />
              )}
              <div>
                <div className="text-sm font-bold text-white">Detective Character</div>
                <div className="text-xs text-white/50">
                  {saveData.settings.characterActive
                    ? 'Active (Detective Alex visible)'
                    : 'Deactivated (Minimal text mode)'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleCharacterActive}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                saveData.settings.characterActive ? 'bg-[#35C98B]' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                  saveData.settings.characterActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Detective Persona Selector */}
          {saveData.settings.characterActive && (
            <div className="pt-2 border-t border-white/5">
              <span className="text-xs font-bold text-white block mb-2">
                Choose Detective Character:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Alex */}
                <button
                  onClick={() => setDetectivePersona('alex')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    (saveData.settings.selectedDetective || 'alex') === 'alex'
                      ? 'bg-[#101426] border-[#FFC857] shadow-md shadow-amber-900/30 ring-1 ring-[#FFC857]'
                      : 'bg-[#101426]/60 border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src="/detective_real_thinking.jpg"
                    alt="Detective Alex"
                    className="w-10 h-10 rounded-lg object-cover object-top border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Detective Alex</div>
                    <div className="text-[10px] text-[#FFC857]">Lead Detective</div>
                  </div>
                </button>

                {/* Vance */}
                <button
                  onClick={() => setDetectivePersona('vance')}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all ${
                    saveData.settings.selectedDetective === 'vance'
                      ? 'bg-[#101426] border-[#FFC857] shadow-md shadow-amber-900/30 ring-1 ring-[#FFC857]'
                      : 'bg-[#101426]/60 border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src="/detective_real_solved.jpg"
                    alt="Chief Vance"
                    className="w-10 h-10 rounded-lg object-cover object-top border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Chief Vance</div>
                    <div className="text-[10px] text-[#FFC857]">Veteran Inspector</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Text Size */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Type className="w-4 h-4 text-[#FFC857]" />
              <span className="text-xs font-bold text-white">Story Font Size</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setTextSize(sz)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    saveData.settings.textSize === sz
                      ? 'bg-[#8257FF] text-white border-[#8257FF] shadow'
                      : 'bg-[#101426] text-white/60 border-white/10 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Language Architecture */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-[#388BFF]" />
              <span className="text-xs font-bold text-white">Game Language</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  saveData.settings.language === 'en'
                    ? 'bg-[#8257FF] text-white border-[#8257FF]'
                    : 'bg-[#101426] text-white/60 border-white/10'
                }`}
              >
                English (Default)
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  saveData.settings.language === 'hi'
                    ? 'bg-[#8257FF] text-white border-[#8257FF]'
                    : 'bg-[#101426] text-white/60 border-white/10'
                }`}
              >
                हिन्दी (Hindi Ready)
              </button>
            </div>
          </div>
        </div>

        {/* Data & Backup Section */}
        <div className="bg-[#1A2140] rounded-2xl p-3.5 border border-white/10 space-y-3">
          <span className="text-[11px] uppercase font-extrabold tracking-wider text-purple-300 block">
            Save Data Management
          </span>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#35C98B]" />
            <span className="text-xs text-white/80">Local Offline Save: Verified Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleOpenExport}
              className="py-2.5 px-3 rounded-xl bg-[#101426] border border-white/10 text-white font-bold text-xs hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Backup / Export</span>
            </button>
            <button
              onClick={() => {
                setShowBackupModal(true);
                setBackupString('');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#101426] border border-white/10 text-white font-bold text-xs hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Restore Save</span>
            </button>
          </div>

          {/* Reset Game Data Button */}
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-bold text-xs hover:bg-red-950/70 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Reset All Game Progress</span>
            </button>
          </div>
        </div>

        {/* App Info Footer */}
        <div className="text-center text-[11px] text-white/40 py-2">
          YES / NO MYSTERY · Version 1.0.0 (Android 13 Ready)
          <br />
          100% Free · 100% Offline · No Ads · No Logins
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border-2 border-[#FF626C] w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-[#FF626C] mx-auto mb-2 animate-bounce" />
            <h3 className="font-display font-black text-lg text-white mb-1">
              Reset Progress?
            </h3>
            <p className="text-xs text-white/70 mb-4">
              Are you sure you want to reset all 200 levels, coins, and achievements? This action
              cannot be undone.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="w-full py-3 rounded-xl bg-[#FF626C] text-white font-black text-sm"
              >
                YES, RESET EVERYTHING
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-2 text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup / Export / Import Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A2140] border border-white/20 w-full max-w-sm rounded-3xl p-5 shadow-2xl">
            <h3 className="font-display font-black text-lg text-white mb-2">
              Save Data Backup
            </h3>

            {backupString ? (
              <>
                <p className="text-xs text-white/70 mb-2">
                  Copy this backup code to keep your progress safe or transfer devices:
                </p>
                <textarea
                  readOnly
                  value={backupString}
                  rows={4}
                  className="w-full bg-[#101426] border border-white/20 rounded-xl p-2.5 text-[11px] font-mono text-purple-200 mb-3 select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyBackup}
                  className="w-full py-2.5 rounded-xl bg-[#8257FF] text-white font-extrabold text-xs mb-3 flex items-center justify-center gap-1.5"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <span>Copy Backup Code</span>
                  )}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-white/70 mb-2">
                  Paste your backup code below to restore your progress:
                </p>
                {importError && (
                  <div className="mb-2 p-2 bg-red-900/40 text-red-200 text-xs rounded-lg">
                    {importError}
                  </div>
                )}
                <textarea
                  value={importStringInput}
                  onChange={(e) => setImportStringInput(e.target.value)}
                  placeholder="Paste backup code here..."
                  rows={4}
                  className="w-full bg-[#101426] border border-white/20 rounded-xl p-2.5 text-[11px] font-mono text-white mb-3 focus:outline-none focus:border-[#8257FF]"
                />
                <button
                  onClick={handleDoImport}
                  className="w-full py-2.5 rounded-xl bg-[#35C98B] text-white font-extrabold text-xs mb-3 flex items-center justify-center gap-1.5"
                >
                  <span>Restore Save Data</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowBackupModal(false);
                setImportError(null);
              }}
              className="w-full py-2 text-xs text-white/60 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
