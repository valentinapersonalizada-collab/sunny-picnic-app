import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Turtle, Rabbit, X, CheckCircle2, Sparkles } from 'lucide-react';
import { VocabularyWord } from '../data/storybookData';
import { FoodSvgIcon } from './FoodSvgIcons';
import { soundEngine } from '../utils/soundAndSpeech';

interface VocabularyModalProps {
  wordData: VocabularyWord | null;
  onClose: () => void;
  isMastered: boolean;
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  wordData,
  onClose,
  isMastered,
}) => {
  const [speakingMode, setSpeakingMode] = useState<'normal' | 'slow' | 'sentence' | null>(null);

  if (!wordData) return null;

  const handleSpeak = (text: string, rate: number, mode: 'normal' | 'slow' | 'sentence') => {
    setSpeakingMode(mode);
    soundEngine.playWordChime();
    soundEngine.speakWord(text, rate, () => {
      setSpeakingMode(null);
    });
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-2xl p-6 sm:p-7"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                <FoodSvgIcon type={wordData.id} className="w-16 h-16" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="text-amber-800">{wordData.category} Vocabulary</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular text-slate-700">{wordData.phonetic}</span>
                  {isMastered && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Explored
                      </span>
                    </>
                  )}
                </div>
                <h2 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900 capitalize font-display">
                  {wordData.word}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close word definition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Syllable Breakdown & Pronunciation Controls */}
          <div className="mt-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Syllable Breakdown (Tap to hear):
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {wordData.syllables.map((syl, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        type="button"
                        onClick={() => soundEngine.speakWord(syl, 0.8)}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 hover:border-amber-500 text-lg font-bold text-slate-900 shadow-2xs active:scale-95 transition-transform cursor-pointer"
                      >
                        {syl}
                      </button>
                      {idx < wordData.syllables.length - 1 && (
                        <span className="text-amber-700 font-bold text-lg" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSpeak(wordData.word, 1.0, 'normal')}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                    speakingMode === 'normal'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Rabbit className="w-4 h-4 shrink-0" />
                  <span>Say Word</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeak(wordData.word, 0.65, 'slow')}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 border transition-colors cursor-pointer whitespace-nowrap ${
                    speakingMode === 'slow'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-300'
                  }`}
                  title="Listen slowly for clear phonics"
                >
                  <Turtle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Slow</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kid-Friendly 2nd Grade Definition */}
          <div className="mt-5 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500">What It Means:</h3>
              <p className="mt-1 text-xl sm:text-2xl font-semibold text-slate-900 leading-relaxed">
                {wordData.definition}
              </p>
            </div>

            {/* Story Example Sentence with Audio */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500">In a Sentence:</span>
                <p className="mt-0.5 text-base sm:text-lg font-medium text-slate-800 italic">
                  “{wordData.exampleSentence}”
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSpeak(wordData.exampleSentence, 0.95, 'sentence')}
                className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Listen to example sentence"
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
              </button>
            </div>

            {/* Fun Nutrition / Food Fact */}
            <div className="flex items-start gap-2.5 text-sm text-slate-700 pt-1">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-900">Did You Know?</strong> {wordData.funFact}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-base font-bold transition-colors cursor-pointer"
            >
              Awesome! Keep Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
