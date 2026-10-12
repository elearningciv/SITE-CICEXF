import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface SheetItem {
  id: string;
  number: number;
  tag: string;
  title: string;
  subtitle?: string;
  quote?: string;
  paragraphs?: string[]; // Paragraphes narratifs
  valuesList?: Array<{
    name: string;
    description: string;
  }>; // Liste des valeurs réunies sur une seule page avec descriptif
  footerNote?: string;
  stamp?: string;
  colorScheme?: 'emerald' | 'blue' | 'purple' | 'amber' | 'brown';
}

interface FlippingSheetProps {
  items: SheetItem[];
  bookTitle?: string;
  bookSubtitle?: string;
  documentRef?: string;
}

export default function FlippingSheet({
  items,
  bookTitle = 'CICEXF',
  bookSubtitle = 'Charte d’Excellence',
  documentRef = 'CICEXF/CHARTE-OFFICIELLE'
}: FlippingSheetProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);

  // Audio synthesis for realistic, audible paper flip / rustle sound
  const audioContextRef = useRef<AudioContext | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const playPaperTurnSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.32; // 320ms rich paper flip

      // 1. Friction & Paper Rustle Layer (Filtered Noise)
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.04 * white) / 1.04;
        const fade = Math.sin((i / bufferSize) * Math.PI);
        output[i] = (lastOut * 0.7 + white * 0.15) * fade;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Resonant bandpass sweep simulating paper sliding across paper
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + duration);
      filter.Q.setValueAtTime(2.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.65, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);

      // 2. Paper Air Whoosh / Body Thud Layer
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

      oscGain.gain.setValueAtTime(0.0, now);
      oscGain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);

      // Light haptic vibration on mobile
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate?.([20, 30, 15]);
        } catch {
          // ignore
        }
      }
    } catch (e) {
      console.warn('Audio note:', e);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('forward');
    playPaperTurnSound();
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, items.length, playPaperTurnSound]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('backward');
    playPaperTurnSound();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, items.length, playPaperTurnSound]);

  const handleSelectPage = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'forward' : 'backward');
    playPaperTurnSound();
    setCurrentIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentItem = items[currentIndex];
  const nextPreviewIndex = (currentIndex + 1) % items.length;
  const prevPreviewIndex = (currentIndex - 1 + items.length) % items.length;
  const nextItem = items[nextPreviewIndex];
  const prevItem = items[prevPreviewIndex];

  // Color schemes mapper
  const getColorStyles = (scheme: SheetItem['colorScheme'] = 'emerald') => {
    switch (scheme) {
      case 'blue':
        return {
          accent: 'text-sky-600 dark:text-sky-400',
          badge: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
          borderAccent: 'border-sky-500/40'
        };
      case 'purple':
        return {
          accent: 'text-purple-600 dark:text-purple-400',
          badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
          borderAccent: 'border-purple-500/40'
        };
      case 'amber':
      case 'brown':
        return {
          accent: 'text-amber-700 dark:text-amber-400',
          badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
          borderAccent: 'border-amber-500/40'
        };
      case 'emerald':
      default:
        return {
          accent: 'text-brand-emerald dark:text-emerald-400',
          badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
          borderAccent: 'border-brand-emerald/40'
        };
    }
  };

  const colors = getColorStyles(currentItem?.colorScheme);

  // Dynamic 3D Paper Flip & Rolling Scroll Motion
  const sheetMotionVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? 50 : -50,
      rotateX: dir === 'forward' ? 2 : -2,
      x: dir === 'forward' ? 80 : -80,
      opacity: 0,
      scale: 0.96,
      transformOrigin: dir === 'forward' ? 'left center' : 'right center',
      boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.35)'
    }),
    animate: {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: 'center center',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      transition: {
        duration: 0.58,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? -75 : 75,
      rotateX: dir === 'forward' ? -3 : 3,
      x: dir === 'forward' ? -90 : 90,
      opacity: 0,
      scale: 0.94,
      transformOrigin: dir === 'forward' ? 'left center' : 'right center',
      boxShadow: '0 40px 70px -10px rgba(0, 0, 0, 0.45)',
      transition: {
        duration: 0.48,
        ease: [0.32, 0, 0.67, 0]
      }
    })
  };

  return (
    <div className="w-full my-4 select-none">
      
      {/* Top Pagination & Numbered Pills */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 px-1 sm:px-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Feuille <strong className="text-brand-emerald text-base font-black">{currentIndex + 1}</strong> sur {items.length}
          </span>
        </div>

        {/* Quick Current Page Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 max-w-full">
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => handleSelectPage(idx)}
              disabled={isAnimating}
              className={`h-7 px-3 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                currentIndex === idx
                  ? 'bg-brand-emerald text-white shadow-md ring-2 ring-brand-emerald/30 scale-105'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{idx + 1}.</span>
              <span>{it.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FULL-INTERFACE ADAPTIVE SHEET CONTAINER */}
      <div 
        className="relative w-full overflow-hidden sm:overflow-visible px-0.5 sm:px-4 md:px-16 lg:px-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* BOUTON CÔTÉ GAUCHE (Feuille Précédente - Mobile / Tablette / Desktop) */}
        <div className="flex absolute left-1 sm:left-2 md:left-2 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handlePrev}
            onMouseEnter={() => setHoverSide('left')}
            onMouseLeave={() => setHoverSide(null)}
            disabled={isAnimating}
            aria-label="Feuille précédente"
            className={`w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl border-2 ${
              isAnimating
                ? 'opacity-50 cursor-not-allowed bg-white dark:bg-slate-800 border-slate-200'
                : 'bg-white/95 dark:bg-slate-850/95 text-slate-800 dark:text-white border-brand-emerald/40 hover:bg-brand-emerald hover:text-white hover:border-brand-emerald hover:scale-110 active:scale-95 ring-4 ring-brand-emerald/15 hover:ring-brand-emerald/30 backdrop-blur-md'
            }`}
            title={`Tourner vers la feuille précédente (${prevItem.title})`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
        </div>

        {/* BOUTON CÔTÉ DROIT (Feuille Suivante - Mobile / Tablette / Desktop) */}
        <div className="flex absolute right-1 sm:right-2 md:right-2 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handleNext}
            onMouseEnter={() => setHoverSide('right')}
            onMouseLeave={() => setHoverSide(null)}
            disabled={isAnimating}
            aria-label="Feuille suivante"
            className={`w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl border-2 ${
              isAnimating
                ? 'opacity-50 cursor-not-allowed bg-white dark:bg-slate-800 border-slate-200'
                : 'bg-brand-emerald text-white border-brand-emerald hover:bg-[#007a52] hover:scale-110 active:scale-95 ring-4 ring-brand-emerald/25 hover:ring-brand-emerald/50 shadow-brand-emerald/30 backdrop-blur-md'
            }`}
            title={`Tourner vers la feuille suivante (${nextItem.title})`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 3D Perspective Viewport */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl"
          style={{
            perspective: '2500px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Paper stack thickness shadows underneath */}
          <div className="absolute inset-0 translate-y-1.5 sm:translate-y-2 rounded-2xl sm:rounded-3xl bg-slate-200/80 dark:bg-slate-800/60 -z-10 shadow-sm pointer-events-none scale-[0.99]"></div>
          <div className="absolute inset-0 translate-y-3 sm:translate-y-4 rounded-2xl sm:rounded-3xl bg-slate-300/40 dark:bg-slate-900/40 -z-20 shadow-md pointer-events-none scale-[0.98]"></div>

          {/* ACTIVE FLIPPING SHEET */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentItem.id}
              custom={direction}
              variants={sheetMotionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-7 md:p-9 lg:p-11 shadow-xl sm:shadow-2xl flex flex-col justify-between overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Dynamic top ambient lighting */}
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{
                  background:
                    'radial-gradient(ellipse at top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)'
                }}
              ></div>

              {/* Elegant Curled Corner on top right */}
              <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 pointer-events-none overflow-hidden z-20">
                <motion.div
                  animate={{
                    scale: hoverSide === 'right' ? 1.25 : 1,
                    x: hoverSide === 'right' ? -2 : 0,
                    y: hoverSide === 'right' ? 2 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full"
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] sm:border-t-[60px] border-t-slate-200/90 dark:border-t-slate-800 border-l-[48px] sm:border-l-[60px] border-l-transparent drop-shadow-md"></div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[45px] sm:border-t-[57px] border-t-white dark:border-t-slate-900 border-l-[45px] sm:border-l-[57px] border-l-transparent"></div>
                  <div className="absolute -top-1 -right-1 w-7 sm:w-9 h-7 sm:h-9 bg-gradient-to-br from-black/20 to-transparent dark:from-black/50 rotate-45 transform origin-top-right"></div>
                </motion.div>
              </div>

              {/* Watermark Logo in background */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 pointer-events-none opacity-5 dark:opacity-10 select-none z-0">
                <span className="font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter">CICEXF</span>
              </div>

              {/* MAIN CONTENT */}
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                
                {/* Header of the Sheet */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                        {documentRef} • FEUILLE {currentItem.number.toString().padStart(2, '0')}/{items.length.toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] sm:text-xs font-extrabold uppercase px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full tracking-wider shadow-xs ${colors.badge}`}>
                        {currentItem.tag}
                      </span>
                    </div>
                  </div>

                  {/* Body Presentation without icons */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
                        {currentItem.title}
                      </h2>
                      {currentItem.subtitle && (
                        <p className={`text-xs sm:text-sm lg:text-base font-bold uppercase tracking-wide mt-1 ${colors.accent}`}>
                          {currentItem.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Central Quote / Principle Box */}
                    {currentItem.quote && (
                      <div className="bg-slate-50 dark:bg-slate-950/80 border-l-4 border-brand-emerald p-3 sm:p-4 rounded-r-2xl shadow-xs">
                        <p className="font-display text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white leading-relaxed italic">
                          {currentItem.quote}
                        </p>
                      </div>
                    )}

                    {/* CASE 1: Standard Narrative Paragraphs (Vision, Mission, À propos) */}
                    {currentItem.paragraphs && currentItem.paragraphs.length > 0 && (
                      <div className="space-y-2.5 sm:space-y-3 pt-1">
                        {currentItem.paragraphs.map((paragraphText, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-xs sm:text-[13.5px] lg:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans"
                          >
                            {paragraphText}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* CASE 2: Single Page for Values (Excellence, Rigueur, Transparence, Redevabilité, Innovation avec descriptif) */}
                    {currentItem.valuesList && currentItem.valuesList.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
                        {currentItem.valuesList.map((val, vIdx) => (
                          <div
                            key={vIdx}
                            className={`p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 shadow-2xs ${
                              vIdx === 4 ? 'sm:col-span-2' : ''
                            }`}
                          >
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-brand-emerald">
                              {val.name}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                              {val.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer of the Sheet */}
                <div className="pt-3 sm:pt-4 mt-4 sm:mt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                    <span>{currentItem.footerNote || 'Engagement institutionnel certifié CICEXF'}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-[10px] sm:text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse"></span>
                      <span>{currentItem.stamp || 'CERTIFIÉ CONFORME'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Responsive Navigation Controls Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-emerald text-slate-700 dark:text-slate-300 hover:text-brand-emerald transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 text-brand-emerald" />
              <span>Précédent ({prevItem.title})</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 font-bold px-3 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emerald-dark text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Suivant ({nextItem.title})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] text-slate-400 inline font-medium text-center sm:text-left">
            Glissez avec le doigt sur mobile ou utilisez les flèches du clavier
          </span>
        </div>

      </div>
    </div>
  );
}
