import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, RotateCcw, Award, Sparkles, ArrowRight } from 'lucide-react';
import { WordPuzzleItem, VOCABULARY_DICTIONARY } from '../data/storybookData';
import { FoodSvgIcon } from './FoodSvgIcons';
import { soundEngine } from '../utils/soundAndSpeech';

interface ChapterWordGameProps {
  chapterNumber: number;
  title: string;
  puzzles: WordPuzzleItem[];
  savedScore?: number;
  readerName: string;
  onGameComplete: (chapterNumber: number, score: number, masteredWords: string[]) => void;
  onNextPage: () => void;
}

export const ChapterWordGame: React.FC<ChapterWordGameProps> = ({
  chapterNumber,
  title,
  puzzles,
  savedScore,
  readerName,
  onGameComplete,
  onNextPage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [firstTrySuccess, setFirstTrySuccess] = useState(true);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  const currentPuzzle = puzzles[currentIndex];
  const vocabEntry = currentPuzzle ? VOCABULARY_DICTIONARY[currentPuzzle.vocabId] : null;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedLetter(null);
    setStatus('playing');
    setScore(0);
    setFirstTrySuccess(true);
    setCompletedWords([]);
  }, [chapterNumber]);

  if (!currentPuzzle || !vocabEntry) return null;

  const handleLetterClick = (letter: string) => {
    if (status === 'correct' || status === 'finished') return;

    const targetLetter = currentPuzzle.missingLetters[0];
    setSelectedLetter(letter);

    if (letter.toUpperCase() === targetLetter.toUpperCase()) {
      setStatus('correct');
      soundEngine.playSuccessFanfare();
      soundEngine.speakWord(`Great job! ${vocabEntry.word}!`, 1.0);

      const newScore = firstTrySuccess ? score + 1 : score;
      const updatedWords = Array.from(new Set([...completedWords, currentPuzzle.vocabId]));
      setScore(newScore);
      setCompletedWords(updatedWords);
    } else {
      setStatus('wrong');
      setFirstTrySuccess(false);
      soundEngine.playGentleBump();
      soundEngine.speakWord('Try another letter!', 1.0);
    }
  };

  const handleNextWord = () => {
    if (currentIndex + 1 < puzzles.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedLetter(null);
      setStatus('playing');
      setFirstTrySuccess(true);
    } else {
      setStatus('finished');
      const finalScore = Math.max(score, savedScore || 0);
      onGameComplete(chapterNumber, finalScore, completedWords);
      soundEngine.playSuccessFanfare();
      soundEngine.speakWord(
        `Hooray ${readerName}! You finished the Chapter ${chapterNumber} word game!`,
        1.0
      );
    }
  };

  const handleResetGame = () => {
    setCurrentIndex(0);
    setSelectedLetter(null);
    setStatus('playing');
    setScore(0);
    setFirstTrySuccess(true);
    setCompletedWords([]);
  };

  if (status === 'finished') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center mb-2">
          <Award className="w-7 h-7 text-amber-600" />
        </div>

        <p className="text-[11px] font-semibold text-amber-800">
          Chapter {chapterNumber} Word Challenge Complete
        </p>
        <h3 className="mt-0.5 text-xl sm:text-2xl font-bold text-slate-900 font-display">
          Great Spelling, {readerName}!
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-700 max-w-md">
          You scored{' '}
          <span className="font-mono-tabular font-bold text-emerald-700">
            {score} / {puzzles.length}
          </span>{' '}
          on your first try!
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {puzzles.map((p) => {
            const w = VOCABULARY_DICTIONARY[p.vocabId];
            return (
              <button
                key={p.vocabId}
                type="button"
                onClick={() => soundEngine.speakWord(w.word, 0.95)}
                className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white border border-amber-300 flex items-center gap-1.5 shadow-2xs hover:bg-amber-50 cursor-pointer"
              >
                <FoodSvgIcon type={p.vocabId} className="w-5 h-5" />
                <span className="text-xs font-bold text-slate-900 capitalize">{w.word}</span>
                <Volume2 className="w-3 h-3 text-amber-600" />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={handleResetGame}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Play Again</span>
          </button>

          {chapterNumber < 4 && (
            <button
              type="button"
              onClick={onNextPage}
              className="min-h-[38px] px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Start Chapter {chapterNumber + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-0 flex flex-col justify-between p-3 sm:p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90">
      {/* Top Game Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-200/80 shrink-0">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">{title}</h3>
        </div>
        <div className="text-xs font-semibold text-slate-600 font-mono-tabular">
          Word {currentIndex + 1}/{puzzles.length} · Score: {score}
        </div>
      </div>

      {/* Center Picture Clue & Word Slots */}
      <div className="my-auto py-1.5 flex flex-col items-center text-center">
        <div className="relative flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
          <FoodSvgIcon type={currentPuzzle.vocabId} className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
          <div className="text-left max-w-xs">
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              “{currentPuzzle.hint}”
            </p>
            <button
              type="button"
              onClick={() => soundEngine.speakWord(vocabEntry.word, 0.85)}
              className="mt-1 min-h-[28px] px-2.5 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-3 h-3" />
              <span>Hear Word</span>
            </button>
          </div>
        </div>

        {/* Letter Slots */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
          {currentPuzzle.displayPattern.map((char, idx) => {
            if (char === ' ') {
              return <div key={idx} className="w-2.5 sm:w-3" />;
            }

            const isMissingSlot = currentPuzzle.missingIndices.includes(idx);
            const displayChar = isMissingSlot
              ? status === 'correct'
                ? currentPuzzle.missingLetters[0]
                : selectedLetter || '?'
              : char;

            return (
              <motion.div
                key={idx}
                animate={
                  isMissingSlot && status === 'correct'
                    ? { scale: [1, 1.15, 1] }
                    : isMissingSlot && status === 'wrong'
                    ? { x: [0, -5, 5, -3, 0] }
                    : {}
                }
                transition={{ duration: 0.22 }}
                className={`w-9 h-10 sm:w-10 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold font-mono-tabular border-2 ${
                  isMissingSlot
                    ? status === 'correct'
                      ? 'bg-emerald-100 border-emerald-600 text-emerald-900'
                      : status === 'wrong'
                      ? 'bg-rose-100 border-rose-500 text-rose-900'
                      : 'bg-amber-100/90 border-amber-500 border-dashed text-amber-900'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {displayChar}
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Letter Choices */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
            Tap the missing letter:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {currentPuzzle.distractorLetters.map((letter) => {
              const isChosen = selectedLetter === letter;
              const isRightChoice =
                letter.toUpperCase() === currentPuzzle.missingLetters[0].toUpperCase();

              return (
                <button
                  key={letter}
                  type="button"
                  disabled={status === 'correct'}
                  onClick={() => handleLetterClick(letter)}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] rounded-xl text-lg sm:text-xl font-bold font-mono-tabular border-2 transition-transform active:scale-95 flex items-center justify-center cursor-pointer ${
                    status === 'correct' && isRightChoice
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                      : isChosen && status === 'wrong'
                      ? 'bg-rose-100 text-rose-800 border-rose-400'
                      : 'bg-white hover:bg-amber-50 text-slate-900 border-slate-300 shadow-2xs'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action / Feedback Row */}
      <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between gap-2 min-h-[38px] shrink-0">
        {status === 'correct' ? (
          <>
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Awesome! “{vocabEntry.word.toUpperCase()}”!</span>
            </div>
            <button
              type="button"
              onClick={handleNextWord}
              className="min-h-[34px] px-3.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>{currentIndex + 1 < puzzles.length ? 'Next Word' : 'Finish Game'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : status === 'wrong' ? (
          <div className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Almost! Try another letter tile.</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-600">
            Tap <strong>Hear Word</strong> for a sound clue!
          </div>
        )}
      </div>
    </div>
  );
};
