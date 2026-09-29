import React, { useState } from 'react';
import { ShieldCheck, UserPlus, RotateCcw, X, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { VOCABULARY_DICTIONARY } from '../data/storybookData';
import { ReadingSpeed } from '../utils/soundAndSpeech';

export interface StudentProfile {
  id: string;
  name: string;
  gradeLabel: string;
  pagesCompleted: number[]; // page numbers 1..20
  exploredWords: string[]; // vocabIds
  comprehensionPassed: number[];
  chapterGameScores: Record<number, number>; // chapterNumber -> score out of 5
  sceneInteractionsCount: number;
  minutesRead: number;
  lastActiveDate: string;
}

export interface ParentalSettings {
  defaultSpeed: ReadingSpeed;
  autoNarrate: boolean;
  soundEffects: boolean;
  dailyGoalMinutes: number;
}

interface ParentalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: StudentProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (name: string) => void;
  onResetProfileProgress: (id: string) => void;
  settings: ParentalSettings;
  onUpdateSettings: (newSettings: ParentalSettings) => void;
}

export const ParentalDashboardModal: React.FC<ParentalDashboardModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onResetProfileProgress,
  settings,
  onUpdateSettings,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateError, setGateError] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const allVocab = Object.values(VOCABULARY_DICTIONARY);
  const fruitTotal = allVocab.filter((w) => w.category === 'Fruit').length;
  const foodTotal = allVocab.filter((w) => w.category === 'Food').length;
  const drinkTotal = allVocab.filter((w) => w.category === 'Drink').length;

  const fruitExplored = activeProfile.exploredWords.filter(
    (id) => VOCABULARY_DICTIONARY[id]?.category === 'Fruit'
  ).length;
  const foodExplored = activeProfile.exploredWords.filter(
    (id) => VOCABULARY_DICTIONARY[id]?.category === 'Food'
  ).length;
  const drinkExplored = activeProfile.exploredWords.filter(
    (id) => VOCABULARY_DICTIONARY[id]?.category === 'Drink'
  ).length;

  const chaptersCompletedCount = Object.keys(activeProfile.chapterGameScores).length;

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gateAnswer.trim() === '24') {
      setIsUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddProfile(newStudentName.trim());
    setNewStudentName('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Parental Control &amp; Individual Progress Dashboard
              </h2>
              <p className="text-xs text-slate-600">
                Track reading progress, vocabulary mastery, and customize audio settings per child
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer"
            aria-label="Close parental dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          {/* Parent Verification Gate for modifying settings */}
          {!isUnlocked ? (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Parent Gate: Unlock Settings &amp; Profile Management</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  To edit settings or add/reset profiles, solve: <strong>What is 6 × 4?</strong>
                </p>
              </div>

              <form onSubmit={handleUnlockSubmit} className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  value={gateAnswer}
                  onChange={(e) => setGateAnswer(e.target.value)}
                  placeholder="Answer (24)"
                  className={`w-28 min-h-[40px] px-3 rounded-xl border text-sm font-mono-tabular bg-white ${
                    gateError ? 'border-rose-500' : 'border-slate-300'
                  }`}
                />
                <button
                  type="submit"
                  className="min-h-[40px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setIsUnlocked(true)}
                  className="min-h-[40px] px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Quick Parent Unlock
                </button>
              </form>
            </div>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-2 font-semibold">
                <Unlock className="w-4 h-4 text-emerald-700" />
                Parent Controls Unlocked — You can manage student profiles and reading settings.
              </span>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="underline font-semibold cursor-pointer"
              >
                Lock Gate
              </button>
            </div>
          )}

          {/* Section 1: Individual Reader Profiles */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  01. Individual Reader Profiles
                </h3>
                <p className="text-xs text-slate-500">
                  Select a 2nd-grade reader to inspect their individual progress
                </p>
              </div>

              {isUnlocked && (
                <form onSubmit={handleCreateProfile} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="New child’s name..."
                    className="min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                  <button
                    type="submit"
                    className="min-h-[40px] px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Reader</span>
                  </button>
                </form>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {profiles.map((prof) => {
                const isSelected = prof.id === activeProfile.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => {
                      onSelectProfile(prof.id);
                      setConfirmReset(false);
                    }}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold border transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{prof.name}</span>
                    <span
                      className={`text-xs font-mono-tabular ${
                        isSelected ? 'text-amber-300' : 'text-slate-400'
                      }`}
                    >
                      {prof.pagesCompleted.length}/20 pages
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Individual Progress Metrics for Active Child */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                02. Progress Summary for {activeProfile.name}
              </h3>
              <span className="text-xs text-slate-500">
                {activeProfile.gradeLabel} · Last active {activeProfile.lastActiveDate}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500">Storybook Pages Read</span>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono-tabular">
                  {activeProfile.pagesCompleted.length} / 20
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {Math.round((activeProfile.pagesCompleted.length / 20) * 100)}% of book completed
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500">Vocabulary Explored</span>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono-tabular">
                  {activeProfile.exploredWords.length} / {allVocab.length}
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Fruits: {fruitExplored}/{fruitTotal} · Foods: {foodExplored}/{foodTotal} · Drinks:{' '}
                  {drinkExplored}/{drinkTotal}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500">Chapter Word Games</span>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono-tabular">
                  {chaptersCompletedCount} / 4
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  End-of-chapter spelling games
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-500">Active Reading Time</span>
                <div className="mt-1 text-2xl font-bold text-slate-900 font-mono-tabular">
                  {activeProfile.minutesRead} min
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Daily Goal: {settings.dailyGoalMinutes} min
                </p>
              </div>
            </div>

            {/* Chapter Word Game Breakdown Table */}
            <div className="mt-5 p-4 rounded-2xl bg-white border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-500 mb-3">
                End-of-Chapter Word Completion Game Scores
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { ch: 1, name: 'Ch 1: Happy Fruits' },
                  { ch: 2, name: 'Ch 2: Breakfast' },
                  { ch: 3, name: 'Ch 3: Picnic Lunch' },
                  { ch: 4, name: 'Ch 4: Cool Drinks' },
                ].map((item) => {
                  const chScore = activeProfile.chapterGameScores[item.ch];
                  const hasPlayed = typeof chScore === 'number';
                  return (
                    <div
                      key={item.ch}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-800">{item.name}</span>
                      <span className="text-xs font-mono-tabular font-bold text-slate-900 flex items-center gap-1">
                        {hasPlayed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {chScore}/5
                          </>
                        ) : (
                          <span className="text-slate-400">Not played</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Parental Reading & Audio Settings */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              03. Reading Level &amp; Narration Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Adjustable Reading Speed */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-sm font-bold text-slate-900">
                  Default Narration Speed
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Adjust voice speed to match your 2nd grader’s English reading comfort
                </p>
                <div className="mt-3 flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
                  {(
                    [
                      { speed: 0.75 as ReadingSpeed, label: '0.75x Slow' },
                      { speed: 1.0 as ReadingSpeed, label: '1.0x Normal' },
                      { speed: 1.2 as ReadingSpeed, label: '1.2x Fast' },
                    ]
                  ).map((opt) => (
                    <button
                      key={opt.speed}
                      type="button"
                      onClick={() =>
                        onUpdateSettings({ ...settings, defaultSpeed: opt.speed })
                      }
                      className={`flex-1 min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        settings.defaultSpeed === opt.speed
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Narration & Sound Effects Toggles */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Auto-Read Page on Turn
                    </div>
                    <div className="text-xs text-slate-600">
                      Automatically start cheerful narration when flipping to a new page
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoNarrate}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, autoNarrate: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-3 cursor-pointer pt-2 border-t border-slate-200">
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      Interactive Sound Effects
                    </div>
                    <div className="text-xs text-slate-600">
                      Play chimes, pops, and page-turn audio feedback
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEffects}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, soundEffects: e.target.checked })
                    }
                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Reset Student Progress */}
            {isUnlocked && (
              <div className="mt-4 flex items-center justify-between pt-3">
                {!confirmReset ? (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="min-h-[40px] px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Progress for {activeProfile.name}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-rose-700">
                      Confirm resetting {activeProfile.name}’s progress?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetProfileProgress(activeProfile.id);
                        setConfirmReset(false);
                      }}
                      className="min-h-[36px] px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Yes, Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
