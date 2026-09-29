import React, { useState } from 'react';
import { Volume2, CheckCircle2, X, BookOpen } from 'lucide-react';
import { VOCABULARY_DICTIONARY, VocabCategory, VocabularyWord } from '../data/storybookData';
import { FoodSvgIcon } from './FoodSvgIcons';
import { soundEngine } from '../utils/soundAndSpeech';

interface PictureDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  exploredWords: string[];
  onSelectWord: (word: VocabularyWord) => void;
}

export const PictureDictionaryModal: React.FC<PictureDictionaryModalProps> = ({
  isOpen,
  onClose,
  exploredWords,
  onSelectWord,
}) => {
  const [filter, setFilter] = useState<'All' | VocabCategory>('All');

  if (!isOpen) return null;

  const allWords = Object.values(VOCABULARY_DICTIONARY);
  const filteredWords =
    filter === 'All' ? allWords : allWords.filter((w) => w.category === filter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-[#FFFDF9] border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                2nd Grade Food, Fruit &amp; Drink Picture Dictionary
              </h2>
              <p className="text-xs text-slate-600">
                Tap any card to hear its pronunciation and see its full definition ·{' '}
                <span className="font-mono-tabular font-semibold text-emerald-700">
                  {exploredWords.length} of {allWords.length} words explored
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented Category Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {(['All', 'Fruit', 'Food', 'Drink'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    filter === cat
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All (28)' : `${cat}s`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              aria-label="Close dictionary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Grid of 28 Vocabulary Items */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredWords.map((item) => {
            const isExplored = exploredWords.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  soundEngine.speakWord(item.word, 0.95);
                  onSelectWord(item);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    soundEngine.speakWord(item.word, 0.95);
                    onSelectWord(item);
                  }
                }}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 transition-colors flex items-start gap-3.5 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <FoodSvgIcon type={item.id} className="w-11 h-11" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs text-slate-500">
                      {item.category} · <span className="font-mono-tabular">{item.phonetic}</span>
                    </span>
                    {isExplored && (
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-600 shrink-0"
                        aria-label="Explored"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 capitalize font-display truncate">
                      {item.word}
                    </h3>
                    <Volume2 className="w-4 h-4 text-amber-600 opacity-80 group-hover:opacity-100 shrink-0" />
                  </div>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
