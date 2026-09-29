import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Square,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Turtle,
  Rabbit,
  Zap,
  WifiOff,
  Smile,
  Type,
} from 'lucide-react';
import {
  STORYBOOK_PAGES,
  VOCABULARY_DICTIONARY,
  COVER_IMAGE_URL,
  VocabularyWord,
  StoryPage,
} from './data/storybookData';
import { soundEngine, ReadingSpeed, CheerfulVoiceStyle } from './utils/soundAndSpeech';
import { InteractiveSceneStage } from './components/InteractiveSceneStage';
import { VocabularyModal } from './components/VocabularyModal';
import { ChapterWordGame } from './components/ChapterWordGame';
import { PictureDictionaryModal } from './components/PictureDictionaryModal';
import {
  ParentalDashboardModal,
  StudentProfile,
  ParentalSettings,
} from './components/ParentalDashboardModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { useOnlineStatus } from './components/usePWAInstall';
import { FoodSvgIcon } from './components/FoodSvgIcons';

const STORAGE_PROFILES_KEY = 'sunny_picnic_profiles_v1';
const STORAGE_ACTIVE_PROFILE_KEY = 'sunny_picnic_active_profile_v1';
const STORAGE_SETTINGS_KEY = 'sunny_picnic_settings_v1';

const INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'mia-grade2',
    name: 'Mia',
    gradeLabel: '2nd Grade Reader',
    pagesCompleted: [1, 2],
    exploredWords: ['apple', 'banana', 'strawberry'],
    comprehensionPassed: [],
    chapterGameScores: {},
    sceneInteractionsCount: 4,
    minutesRead: 8,
    lastActiveDate: 'Today',
  },
  {
    id: 'leo-grade2',
    name: 'Leo',
    gradeLabel: '2nd Grade Reader',
    pagesCompleted: [1],
    exploredWords: ['apple', 'orange'],
    comprehensionPassed: [],
    chapterGameScores: {},
    sceneInteractionsCount: 2,
    minutesRead: 5,
    lastActiveDate: 'Today',
  },
];

const INITIAL_SETTINGS: ParentalSettings = {
  defaultSpeed: 1.0,
  autoNarrate: false,
  soundEffects: true,
  dailyGoalMinutes: 15,
};

export default function App() {
  // Page 0 = Cover Page, Pages 1..20 = 20 Storybook Pages
  const [currentPageNum, setCurrentPageNum] = useState<number>(0);
  const [pageDirection, setPageDirection] = useState<1 | -1>(1);

  // Profiles & Parental Settings (Persisted in localStorage for Offline Mode)
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_PROFILE_KEY) || INITIAL_PROFILES[0].id;
    } catch {
      return INITIAL_PROFILES[0].id;
    }
  });

  const [settings, setSettings] = useState<ParentalSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [readingSpeed, setReadingSpeed] = useState<ReadingSpeed>(settings.defaultSpeed);
  const [voiceStyle, setVoiceStyle] = useState<CheerfulVoiceStyle>('happy-kid');
  const [extraGiantText, setExtraGiantText] = useState<boolean>(true);
  const [isNarrating, setIsNarrating] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(-1);

  // Modals & Interactive States
  const [selectedVocab, setSelectedVocab] = useState<VocabularyWord | null>(null);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [coverImgError, setCoverImgError] = useState(false);

  // Touch Swipe Tracking for Mobile / Tablet Page Flipping
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const isOnline = useOnlineStatus();
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const currentStoryPage: StoryPage | undefined =
    currentPageNum > 0 ? STORYBOOK_PAGES[currentPageNum - 1] : undefined;

  // Sync localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    } catch {
      // ignore
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_PROFILE_KEY, activeProfileId);
    } catch {
      // ignore
    }
  }, [activeProfileId]);

  useEffect(() => {
    soundEngine.soundEnabled = settings.soundEffects;
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Increment reading timer every 60 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfileId ? { ...p, minutesRead: p.minutesRead + 1 } : p
        )
      );
    }, 60000);
    return () => window.clearInterval(timer);
  }, [activeProfileId]);

  // Handle page changes: mark page read, optionally auto-narrate
  useEffect(() => {
    soundEngine.stopSpeech();
    setIsNarrating(false);
    setActiveCharIndex(-1);

    if (currentPageNum > 0) {
      setProfiles((prev) =>
        prev.map((p) => {
          if (p.id !== activeProfileId) return p;
          const updatedPages = p.pagesCompleted.includes(currentPageNum)
            ? p.pagesCompleted
            : [...p.pagesCompleted, currentPageNum];
          return {
            ...p,
            pagesCompleted: updatedPages,
            lastActiveDate: 'Today',
          };
        })
      );

      if (settings.autoNarrate && currentStoryPage) {
        const timeout = window.setTimeout(() => {
          startPageNarration(currentStoryPage.plainNarrationText, readingSpeed);
        }, 350);
        return () => window.clearTimeout(timeout);
      }
    }
  }, [currentPageNum]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedVocab || isDictionaryOpen || isParentModalOpen) return;
      if (e.key === 'ArrowRight' && currentPageNum < 20) {
        goToPage(currentPageNum + 1);
      } else if (e.key === 'ArrowLeft' && currentPageNum > 0) {
        goToPage(currentPageNum - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageNum, selectedVocab, isDictionaryOpen, isParentModalOpen]);

  const goToPage = (targetPage: number) => {
    const clamped = Math.max(0, Math.min(20, targetPage));
    if (clamped === currentPageNum) return;
    setPageDirection(clamped > currentPageNum ? 1 : -1);
    soundEngine.playPageTurnSound();
    setCurrentPageNum(clamped);
  };

  const startPageNarration = (text: string, speed: ReadingSpeed) => {
    setIsNarrating(true);
    setActiveCharIndex(0);
    soundEngine.speakPageNarration(
      text,
      speed,
      (charIdx) => {
        setActiveCharIndex(charIdx);
      },
      () => {
        setIsNarrating(false);
        setActiveCharIndex(-1);
      }
    );
  };

  const handleToggleNarration = () => {
    if (!currentStoryPage) return;
    if (isNarrating) {
      soundEngine.stopSpeech();
      setIsNarrating(false);
      setActiveCharIndex(-1);
    } else {
      startPageNarration(currentStoryPage.plainNarrationText, readingSpeed);
    }
  };

  const handleSpeedChange = (newSpeed: ReadingSpeed) => {
    setReadingSpeed(newSpeed);
    if (isNarrating && currentStoryPage) {
      startPageNarration(currentStoryPage.plainNarrationText, newSpeed);
    }
  };

  const handleVoiceStyleToggle = () => {
    const nextStyle: CheerfulVoiceStyle =
      voiceStyle === 'happy-kid' ? 'sunny-storyteller' : 'happy-kid';
    setVoiceStyle(nextStyle);
    soundEngine.voiceStyle = nextStyle;
    if (currentStoryPage) {
      startPageNarration(currentStoryPage.plainNarrationText, readingSpeed);
    }
  };

  const handleVocabWordClick = (vocabId: string) => {
    const wordData = VOCABULARY_DICTIONARY[vocabId];
    if (!wordData) return;

    setIsNarrating(false);
    setActiveCharIndex(-1);
    soundEngine.playWordChime();
    soundEngine.speakWord(wordData.word, 0.95);
    setSelectedVocab(wordData);

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;
        const nextWords = p.exploredWords.includes(vocabId)
          ? p.exploredWords
          : [...p.exploredWords, vocabId];
        return { ...p, exploredWords: nextWords };
      })
    );
  };

  const handlePropInteract = () => {
    setIsNarrating(false);
    setActiveCharIndex(-1);
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? { ...p, sceneInteractionsCount: p.sceneInteractionsCount + 1 }
          : p
      )
    );
  };

  const handleGameComplete = (chapterNumber: number, score: number, masteredWords: string[]) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== activeProfileId) return p;
        const mergedWords = Array.from(new Set([...p.exploredWords, ...masteredWords]));
        return {
          ...p,
          exploredWords: mergedWords,
          chapterGameScores: {
            ...p.chapterGameScores,
            [chapterNumber]: score,
          },
        };
      })
    );
  };

  const handleAddProfile = (name: string) => {
    const newId = `reader-${Date.now()}`;
    const newProfile: StudentProfile = {
      id: newId,
      name,
      gradeLabel: '2nd Grade Reader',
      pagesCompleted: [],
      exploredWords: [],
      comprehensionPassed: [],
      chapterGameScores: {},
      sceneInteractionsCount: 0,
      minutesRead: 1,
      lastActiveDate: 'Today',
    };
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newId);
  };

  const handleResetProfileProgress = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              pagesCompleted: [],
              exploredWords: [],
              comprehensionPassed: [],
              chapterGameScores: {},
              sceneInteractionsCount: 0,
              minutesRead: 0,
            }
          : p
      )
    );
  };

  // Touch Gesture Handlers for Natural Book Page Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0 && currentPageNum < 20) {
        goToPage(currentPageNum + 1);
      } else if (deltaX > 0 && currentPageNum > 0) {
        goToPage(currentPageNum - 1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Render the 1-2 short basic sentences printed directly on the right book leaf
  const renderStorySegments = (page: StoryPage) => {
    if (!page.segments) return null;
    let runningCharCount = 0;

    return page.segments.map((seg, idx) => {
      const segStart = runningCharCount;
      const segEnd = segStart + seg.text.length;
      runningCharCount = segEnd;

      const isCurrentlySpoken =
        isNarrating && activeCharIndex >= segStart && activeCharIndex <= segEnd + 3;

      if (seg.vocabId) {
        const vocab = VOCABULARY_DICTIONARY[seg.vocabId];
        const isExplored = activeProfile.exploredWords.includes(seg.vocabId);

        const categoryStyles =
          vocab?.category === 'Fruit'
            ? 'bg-rose-100/95 hover:bg-rose-200 text-rose-950 border-rose-500'
            : vocab?.category === 'Drink'
            ? 'bg-sky-100/95 hover:bg-sky-200 text-sky-950 border-sky-500'
            : 'bg-amber-100/95 hover:bg-amber-200 text-amber-950 border-amber-500';

        return (
          <button
            key={idx}
            type="button"
            onClick={() => handleVocabWordClick(seg.vocabId!)}
            className={`inline-flex items-center gap-1.5 mx-1 my-0.5 px-2.5 py-0.5 rounded-2xl border-b-4 font-extrabold transition-transform active:scale-95 cursor-pointer align-middle shadow-2xs ${categoryStyles} ${
              isCurrentlySpoken ? 'ring-4 ring-amber-400 scale-105' : ''
            }`}
            title={`Tap to hear "${seg.text}" and see its definition`}
          >
            <FoodSvgIcon type={seg.vocabId} className="w-6 h-6 sm:w-7 sm:h-7 inline-block shrink-0" />
            <span>{seg.text}</span>
            <Volume2 className="w-4 h-4 opacity-80 shrink-0" />
            {isExplored && (
              <CheckCircle2
                className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                aria-label="Word explored"
              />
            )}
          </button>
        );
      }

      return (
        <span
          key={idx}
          className={`transition-colors duration-150 rounded-lg px-0.5 ${
            isCurrentlySpoken ? 'bg-amber-200/80 text-slate-950' : ''
          }`}
        >
          {seg.text}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden flex flex-col bg-[#F3EDE2] text-slate-900">
      {/* STRICT 3-ZONE TOP BAR CONTRACT (Compact h-12 so book gets maximum height) */}
      <header className="shrink-0 h-12 px-4 sm:px-6 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-200/80 flex items-center justify-between gap-4 z-30">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            goToPage(0);
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0"
        >
          Sunny Picnic
        </a>

        {/* Zone 2: 5 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => goToPage(1)}
            className={`hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum >= 1 && currentPageNum <= 5
                ? 'text-slate-900 font-semibold underline'
                : ''
            }`}
          >
            01. Fruits
          </button>
          <button
            type="button"
            onClick={() => goToPage(6)}
            className={`hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum >= 6 && currentPageNum <= 10
                ? 'text-slate-900 font-semibold underline'
                : ''
            }`}
          >
            02. Breakfast
          </button>
          <button
            type="button"
            onClick={() => goToPage(11)}
            className={`hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum >= 11 && currentPageNum <= 15
                ? 'text-slate-900 font-semibold underline'
                : ''
            }`}
          >
            03. Picnic Lunch
          </button>
          <button
            type="button"
            onClick={() => goToPage(16)}
            className={`hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum >= 16 && currentPageNum <= 20
                ? 'text-slate-900 font-semibold underline'
                : ''
            }`}
          >
            04. Drinks
          </button>
          <button
            type="button"
            onClick={() => setIsDictionaryOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            Picture Dictionary
          </button>
        </nav>

        {/* Zone 3: 2 Primary Actions */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
          <button
            type="button"
            onClick={() => setIsParentModalOpen(true)}
            className="min-h-[36px] px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Parents ({activeProfile.name})</span>
          </button>
        </div>
      </header>

      {/* MAIN REALISTIC OPEN BOOK STAGE — FITS 100% IN DESKTOP VIEWPORT WITHOUT CLIPPING */}
      <main
        className="flex-1 min-h-0 w-full max-w-[1360px] mx-auto px-2 sm:px-5 py-1.5 flex flex-col justify-between book-perspective"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 min-h-0 w-full flex items-stretch justify-center">
          <AnimatePresence mode="wait" custom={pageDirection}>
            {currentPageNum === 0 ? (
              /* ==========================================
                 OPEN HARDCOVER BOOK: COVER SPREAD (Page 0)
                 Left Page = Cover Illustration | Right Page = Title, Reader & Start
                 ========================================== */
              <motion.div
                key="cover-page"
                custom={pageDirection}
                initial={{ opacity: 0, rotateY: pageDirection * 12, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: pageDirection * -12, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full rounded-[22px] p-2 sm:p-2.5 book-hardcover flex flex-col"
              >
                <div className="relative flex-1 min-h-0 w-full rounded-[16px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-inner">
                  {/* LEFT PAGE OF REAL BOOK: Full Cover Art */}
                  <div className="book-leaf-left p-3 sm:p-4 flex flex-col justify-between md:border-r border-amber-900/20 min-h-0">
                    <div className="relative flex-1 min-h-[160px] rounded-2xl overflow-hidden border-2 border-amber-200/90 shadow-sm bg-amber-100">
                      {!coverImgError ? (
                        <img
                          src={COVER_IMAGE_URL}
                          alt="Two happy 2nd grade kids having a sunny picnic with fruits, sandwiches, and lemonade"
                          referrerPolicy="no-referrer"
                          onError={() => setCoverImgError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-50">
                          <FoodSvgIcon type="apple" className="w-20 h-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-[11px] font-semibold">
                          20 Interactive Pages · 4 Chapters · 28 Food, Fruit &amp; Drink Words
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono-tabular shrink-0">
                      <span>Illustrated Edition</span>
                      <span>Cover</span>
                    </div>
                  </div>

                  {/* RIGHT PAGE OF REAL BOOK: Storybook Title, Reader Selection & Start Buttons */}
                  <div className="book-leaf-right p-4 sm:p-6 flex flex-col justify-between min-h-0 overflow-y-auto">
                    {/* Top Kicker */}
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-800 shrink-0">
                      <span>2nd Grade Easy English Storybook</span>
                      <button
                        type="button"
                        onClick={() => setIsDictionaryOpen(true)}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>All 28 Words</span>
                      </button>
                    </div>

                    {/* Center Content: Sized so everything fits comfortably in 100% of viewport */}
                    <div className="my-auto py-1 space-y-2.5 sm:space-y-3">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight font-display">
                        Yummy Food &amp; Happy Fruits!
                      </h1>

                      <p className="text-sm sm:text-base text-slate-700 leading-snug font-medium">
                        Read 1 or 2 easy sentences on every page! Tap the big food, fruit, and drink
                        words to hear a happy voice read with you.
                      </p>

                      {/* Compact Single-Row Reader Selector */}
                      <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-700">
                            Reader:
                          </span>
                          {profiles.map((prof) => (
                            <button
                              key={prof.id}
                              type="button"
                              onClick={() => {
                                setActiveProfileId(prof.id);
                                soundEngine.playWordChime();
                                soundEngine.speakWord(`Hi ${prof.name}! Let us read!`, 1.0);
                              }}
                              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                prof.id === activeProfile.id
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white hover:bg-amber-100 text-slate-800 border-amber-300'
                              }`}
                            >
                              {prof.name}
                            </button>
                          ))}
                        </div>

                        <span className="text-[11px] text-slate-600 font-mono-tabular">
                          {activeProfile.pagesCompleted.length}/20 pages ·{' '}
                          {activeProfile.exploredWords.length}/28 words
                        </span>
                      </div>

                      {/* Open Book Primary Action Buttons */}
                      <div className="pt-0.5 flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => goToPage(1)}
                          className="min-h-[42px] px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base font-bold shadow-sm flex items-center gap-2 transition-transform active:scale-98 cursor-pointer"
                        >
                          <span>Open Book (Page 1)</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        {activeProfile.pagesCompleted.length > 1 && (
                          <button
                            type="button"
                            onClick={() => goToPage(Math.max(...activeProfile.pagesCompleted))}
                            className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                          >
                            Continue Page {Math.max(...activeProfile.pagesCompleted)}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bottom Folio */}
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono-tabular shrink-0">
                      <span>English Only · Grade 2</span>
                      <span>Swipe or Click Start Page 1 →</span>
                    </div>
                  </div>

                  {/* Center Spine Line on Desktop */}
                  <div
                    className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-amber-950/25 via-amber-900/40 to-amber-950/25 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            ) : currentStoryPage ? (
              /* ==========================================
                 REALISTIC OPEN HARDCOVER BOOK (Pages 1 to 20)
                 LEFT PAGE = Interactive Illustration
                 RIGHT PAGE = Giant 1-2 Sentence Story Text (Never Clipped)
                 ========================================== */
              <motion.div
                key={`page-${currentPageNum}`}
                custom={pageDirection}
                initial={{ opacity: 0, rotateY: pageDirection * 14, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: pageDirection * -14, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full rounded-[22px] p-2 sm:p-2.5 book-hardcover flex flex-col"
              >
                <div className="relative flex-1 min-h-0 w-full rounded-[16px] grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-inner">
                  {/* LEFT PAGE OF OPEN BOOK: Interactive Scene Illustration */}
                  <div className="book-leaf-left p-3 sm:p-4 flex flex-col justify-between md:border-r border-amber-900/20 min-h-0">
                    {/* Left Page Top Running Header */}
                    <div className="pb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 shrink-0">
                      <span className="truncate">{currentStoryPage.chapterTitle}</span>
                      <span className="font-mono-tabular text-amber-800 shrink-0 ml-2">
                        Picture Stage
                      </span>
                    </div>

                    {/* Full-Height Interactive Illustration Container */}
                    <div className="flex-1 min-h-0 w-full">
                      <InteractiveSceneStage
                        illustrationUrl={currentStoryPage.illustrationUrl}
                        title={currentStoryPage.title}
                        interactivePrompt={currentStoryPage.interactivePrompt}
                        propsList={currentStoryPage.interactiveProps}
                        onPropInteract={handlePropInteract}
                      />
                    </div>

                    {/* Left Page Bottom Folio */}
                    <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono-tabular shrink-0">
                      <span>Page {currentStoryPage.pageNumber}</span>
                      <span>{currentStoryPage.title}</span>
                    </div>
                  </div>

                  {/* RIGHT PAGE OF OPEN BOOK: Unified Top Bar + Giant 1-2 Sentence Text */}
                  <div className="book-leaf-right p-3 sm:p-5 lg:px-7 lg:py-4 flex flex-col justify-between min-h-0 overflow-y-auto">
                    {currentStoryPage.pageType === 'game' && currentStoryPage.gamePuzzles ? (
                      <ChapterWordGame
                        chapterNumber={currentStoryPage.chapterNumber}
                        title={currentStoryPage.title}
                        puzzles={currentStoryPage.gamePuzzles}
                        savedScore={
                          activeProfile.chapterGameScores[currentStoryPage.chapterNumber]
                        }
                        readerName={activeProfile.name}
                        onGameComplete={handleGameComplete}
                        onNextPage={() => goToPage(currentPageNum + 1)}
                      />
                    ) : (
                      <>
                        {/* Unified Compact Top Control Bar */}
                        <div className="shrink-0 pb-2 border-b border-amber-200/70 flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleToggleNarration}
                              className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs ${
                                isNarrating
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                  : 'bg-amber-600 hover:bg-amber-700 text-white'
                              }`}
                            >
                              {isNarrating ? (
                                <>
                                  <Square className="w-3 h-3 fill-current shrink-0" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>Read Aloud!</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleVoiceStyleToggle}
                              className="min-h-[34px] px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              title="Switch gentle & clear voice tone"
                            >
                              <Smile className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>
                                {voiceStyle === 'happy-kid' ? 'Gentle Voice' : 'Calm Teacher'}
                              </span>
                            </button>

                            {/* Compact Speed Selector */}
                            <div className="flex items-center gap-0.5 p-0.5 bg-white rounded-lg border border-amber-200">
                              <button
                                type="button"
                                onClick={() => handleSpeedChange(0.75)}
                                className={`min-h-[26px] px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer whitespace-nowrap ${
                                  readingSpeed === 0.75
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                                title="Slow reading speed"
                              >
                                <Turtle className="w-3 h-3 shrink-0" />
                                <span>Slow</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSpeedChange(1.0)}
                                className={`min-h-[26px] px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer whitespace-nowrap ${
                                  readingSpeed === 1.0
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                                title="Normal cheerful reading speed"
                              >
                                <Rabbit className="w-3 h-3 shrink-0" />
                                <span>Normal</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSpeedChange(1.2)}
                                className={`min-h-[26px] px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer whitespace-nowrap ${
                                  readingSpeed === 1.2
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                                title="Fast reading speed"
                              >
                                <Zap className="w-3 h-3 shrink-0" />
                                <span>Fast</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExtraGiantText((prev) => !prev)}
                              className="text-[11px] font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                              title="Switch between Big and Mega text size"
                            >
                              <Type className="w-3 h-3 text-amber-600" />
                              <span>{extraGiantText ? 'Mega' : 'Big'}</span>
                            </button>
                            <span className="text-slate-300" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-[11px] font-bold text-amber-900 font-mono-tabular">
                              Page {currentStoryPage.pageNumber}/20
                            </span>
                          </div>
                        </div>

                        {/* CENTER OF RIGHT PAGE: Page Title + Giant 1-2 Sentence Story Text */}
                        <div className="my-auto py-2 flex flex-col justify-center">
                          <h2 className="text-lg sm:text-2xl font-bold text-amber-900 font-display mb-2">
                            {currentStoryPage.title}
                          </h2>

                          <div
                            className={`font-bold text-slate-900 tracking-tight ${
                              extraGiantText
                                ? 'text-xl sm:text-2xl lg:text-[30px] xl:text-[34px] leading-[1.55]'
                                : 'text-lg sm:text-xl lg:text-[24px] leading-[1.5]'
                            }`}
                          >
                            {renderStorySegments(currentStoryPage)}
                          </div>
                        </div>

                        {/* Right Page Bottom Folio & Vocabulary Tap Hint */}
                        <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
                          <span className="flex items-center gap-1.5 font-medium truncate">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            Tap any colored word box to hear it &amp; see its meaning!
                          </span>
                          <button
                            type="button"
                            onClick={() => setIsDictionaryOpen(true)}
                            className="font-semibold text-amber-800 hover:underline shrink-0 cursor-pointer"
                          >
                            All 28 Words
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Realistic Center Book Spine Crease on Desktop */}
                  <div
                    className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-r from-amber-950/25 via-amber-900/40 to-amber-950/25 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* COMPACT BOTTOM BOOK NAVIGATION BAR */}
        <footer className="shrink-0 mt-1.5 flex items-center justify-between gap-3 px-2">
          <button
            type="button"
            disabled={currentPageNum === 0}
            onClick={() => goToPage(currentPageNum - 1)}
            className={`min-h-[36px] px-3.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum === 0
                ? 'bg-slate-200/70 text-slate-400 cursor-not-allowed'
                : 'bg-white hover:bg-amber-50 text-slate-900 border border-slate-300 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          {/* Page Dots / Quick Jump */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => goToPage(0)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentPageNum === 0 ? 'w-6 bg-amber-700' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title="Cover Page"
              aria-label="Go to Cover Page"
            />
            {STORYBOOK_PAGES.map((p) => {
              const isCurrent = currentPageNum === p.pageNumber;
              const isGame = p.pageType === 'game';
              return (
                <button
                  key={p.pageNumber}
                  type="button"
                  onClick={() => goToPage(p.pageNumber)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-amber-700'
                      : isGame
                      ? 'w-2.5 bg-emerald-500/70 hover:bg-emerald-600'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Page ${p.pageNumber}: ${p.title}`}
                  aria-label={`Go to Page ${p.pageNumber}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPageNum === 20}
            onClick={() => goToPage(currentPageNum + 1)}
            className={`min-h-[36px] px-3.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              currentPageNum === 20
                ? 'bg-slate-200/70 text-slate-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
            }`}
          >
            <span>{currentPageNum === 0 ? 'Start Page 1' : 'Next Page'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </main>

      {/* Non-intrusive Offline Mode Toast */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
          <WifiOff className="w-4 h-4 text-amber-400" />
          <span>Offline Mode Active — Storybook &amp; Audio Ready</span>
        </div>
      )}

      {/* Interactive Word Definition & Pronunciation Modal */}
      <VocabularyModal
        wordData={selectedVocab}
        onClose={() => setSelectedVocab(null)}
        isMastered={
          selectedVocab ? activeProfile.exploredWords.includes(selectedVocab.id) : false
        }
      />

      {/* All 28 Words Picture Dictionary Modal */}
      <PictureDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        exploredWords={activeProfile.exploredWords}
        onSelectWord={(word) => {
          setIsDictionaryOpen(false);
          setSelectedVocab(word);
          if (!activeProfile.exploredWords.includes(word.id)) {
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === activeProfileId
                  ? { ...p, exploredWords: [...p.exploredWords, word.id] }
                  : p
              )
            );
          }
        }}
      />

      {/* Parental Control & Individual Progress Dashboard */}
      <ParentalDashboardModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfile.id}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onAddProfile={handleAddProfile}
        onResetProfileProgress={handleResetProfileProgress}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          setReadingSpeed(newSettings.defaultSpeed);
        }}
      />
    </div>
  );
}
