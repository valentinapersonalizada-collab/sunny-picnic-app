// Offline-First Friendly, Gentle & Crystal-Clear Speech Synthesis + Soft Audio Engine

export type ReadingSpeed = 0.75 | 1.0 | 1.2;
export type CheerfulVoiceStyle = 'happy-kid' | 'sunny-storyteller';

class SoundAndSpeechEngine {
  private audioCtx: AudioContext | null = null;
  private primaryGentleVoice: SpeechSynthesisVoice | null = null;
  private secondaryClearVoice: SpeechSynthesisVoice | null = null;
  private fallbackTimer: number | null = null;
  private activeTimeouts: number[] = [];
  public soundEnabled: boolean = true;
  public voiceStyle: CheerfulVoiceStyle = 'happy-kid';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;

    // Filter to clear standard English voices (preferring US, UK, AU, CA, IE)
    const englishVoices = voices.filter(
      (v) =>
        v.lang.startsWith('en-US') ||
        v.lang.startsWith('en-GB') ||
        v.lang.startsWith('en-AU') ||
        v.lang.startsWith('en-CA') ||
        v.lang.startsWith('en-IE') ||
        v.lang.startsWith('en')
    );

    // Exclude novelty or robotic voices that reduce clarity
    const noveltyNames = [
      'Albert',
      'Bad News',
      'Bahh',
      'Bells',
      'Boing',
      'Bubbles',
      'Cellos',
      'Deranged',
      'Good News',
      'Hysterical',
      'Junior',
      'Organ',
      'Superstar',
      'Trinoids',
      'Whisper',
      'Wobble',
      'Zarvox',
      'Microsoft Ana', // Avoid thin synthetic child voice
    ];

    const cleanEnglishVoices = englishVoices.filter(
      (v) => !noveltyNames.some((bad) => v.name.includes(bad))
    );

    // Priority list of the warmest, gentlest, clearest natural English voices across platforms
    const gentlePriorityNames = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Jenny',
      'Google US English',
      'Samantha (Enhanced)',
      'Samantha',
      'Ava (Premium)',
      'Ava (Enhanced)',
      'Ava',
      'Microsoft Aria Online (Natural)',
      'Microsoft Aria',
      'Allison (Enhanced)',
      'Allison',
      'Google UK English Female',
      'Karen',
      'Moira',
      'Tessa',
      'Victoria',
      'Serena',
      'Microsoft Zira',
    ];

    const matchedVoices: SpeechSynthesisVoice[] = [];
    for (const name of gentlePriorityNames) {
      const match = cleanEnglishVoices.find((v) => v.name.includes(name));
      if (match && !matchedVoices.includes(match)) {
        matchedVoices.push(match);
      }
    }

    // Fallback to any en-US voice if none of the named voices matched
    const enUSFallback = cleanEnglishVoices.filter((v) => v.lang.startsWith('en-US'));
    const pool = matchedVoices.length
      ? matchedVoices
      : enUSFallback.length
      ? enUSFallback
      : cleanEnglishVoices.length
      ? cleanEnglishVoices
      : voices;

    this.primaryGentleVoice = pool[0] || null;
    this.secondaryClearVoice = pool[1] || pool[0] || null;
  }

  private getActiveVoice(): SpeechSynthesisVoice | null {
    if (!this.primaryGentleVoice) {
      this.initVoices();
    }
    if (this.voiceStyle === 'sunny-storyteller' && this.secondaryClearVoice) {
      return this.secondaryClearVoice;
    }
    return this.primaryGentleVoice;
  }

  // Natural, undistorted pitch (1.0 - 1.03) keeps the voice warm, gentle, and 100% crystal-clear
  private getGentlePitch(): number {
    return this.voiceStyle === 'happy-kid' ? 1.03 : 0.98;
  }

  // Slightly unhurried rate ensures every consonant and vowel is clearly articulated for 2nd graders
  private getClearRate(requestedRate: number): number {
    const clarityFactor = this.voiceStyle === 'happy-kid' ? 0.92 : 0.88;
    return Math.max(0.65, Math.min(1.15, Number((requestedRate * clarityFactor).toFixed(2))));
  }

  private getAudioContext(): AudioContext | null {
    if (!this.soundEnabled || typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Soft, warm two-note chime that finishes quickly so it never covers up the voice
  public playWordChime() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25]; // Soft C5 -> E5 warm interval
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.045);

      gain.gain.setValueAtTime(0.001, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.04, now + idx * 0.045 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.13);
    });
  }

  // Gentle, soft tactile sound when interacting with animated scene items
  public playPopSound(variant: 'pop' | 'splash' | 'crunch' = 'pop') {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (variant === 'pop') {
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.09);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (variant === 'splash') {
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.11);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else {
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.08);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  public playPageTurnSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.11);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playSuccessFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  public playGentleBump() {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.14);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  public stopSpeech() {
    if (this.fallbackTimer) {
      window.clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    this.activeTimeouts.forEach((id) => window.clearTimeout(id));
    this.activeTimeouts = [];
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Speak a single vocabulary word or short phrase with a gentle, friendly, crystal-clear voice
  public speakWord(text: string, rate: number = 0.95, onEnd?: () => void) {
    this.stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Wait briefly so any soft tap chime finishes first, keeping the spoken word 100% clear
    const speakDelay = window.setTimeout(() => {
      const cleanText = text.replace(/!/g, '.');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voice = this.getActiveVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.pitch = this.getGentlePitch();
      utterance.rate = this.getClearRate(rate);
      utterance.volume = 1.0;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    }, 110);

    this.activeTimeouts.push(speakDelay);
  }

  // Speak full page narration with a warm, gentle, friendly voice and live word-by-word highlighting
  public speakPageNarration(
    text: string,
    speed: ReadingSpeed,
    onWordIndexChange: (charIndex: number) => void,
    onComplete: () => void
  ) {
    this.stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onComplete();
      return;
    }

    // Soft gentle intro note before narration starts
    this.playWordChime();

    const startTimeout = window.setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getActiveVoice();
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.pitch = this.getGentlePitch();
      const effectiveRate = this.getClearRate(speed);
      utterance.rate = effectiveRate;
      utterance.volume = 1.0;

      let boundaryFired = false;

      utterance.onboundary = (event) => {
        if (event.name === 'word' || typeof event.charIndex === 'number') {
          boundaryFired = true;
          onWordIndexChange(event.charIndex);
        }
      };

      // Smooth fallback estimator for mobile browsers where onboundary doesn't fire on every word
      const charsPerSecond = 11.0 * effectiveRate;
      let estimatedChar = 0;
      this.fallbackTimer = window.setInterval(() => {
        if (!boundaryFired) {
          estimatedChar = Math.min(
            text.length - 1,
            Math.floor(estimatedChar + charsPerSecond * 0.12)
          );
          onWordIndexChange(estimatedChar);
        }
      }, 120);

      utterance.onend = () => {
        if (this.fallbackTimer) {
          window.clearInterval(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        onComplete();
      };

      utterance.onerror = () => {
        if (this.fallbackTimer) {
          window.clearInterval(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        onComplete();
      };

      window.speechSynthesis.speak(utterance);
    }, 200);

    this.activeTimeouts.push(startTimeout);
  }
}

export const soundEngine = new SoundAndSpeechEngine();
