import { ReactNode, useEffect, useRef, useState, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: ReactNode;
  /** Number of slides visible at once, per breakpoint */
  perView?: { base: number; sm?: number; lg?: number };
  /** Auto-advance delay in ms (0 disables) */
  autoplay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  /** Arrow/dot colours for light or dark backgrounds */
  tone?: 'light' | 'dark';
  /** Endless rotation: keeps sliding even when all items fit on screen */
  loop?: boolean;
  label: string;
}

const usePerView = (perView: CarouselProps['perView']) => {
  const compute = () => {
    if (typeof window === 'undefined') return perView!.base;
    if (window.innerWidth >= 1024 && perView!.lg) return perView!.lg;
    if (window.innerWidth >= 640 && perView!.sm) return perView!.sm;
    return perView!.base;
  };
  const [value, setValue] = useState(compute);
  useEffect(() => {
    const onResize = () => setValue(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return value;
};

/** Sliding carousel: auto-advance, pause on hover/focus, arrows, dots and swipe. */
export default function Carousel({
  children,
  perView = { base: 1, sm: 2, lg: 3 },
  autoplay = 5000,
  showArrows = true,
  showDots = true,
  tone = 'light',
  loop = false,
  label
}: CarouselProps) {
  const slides = Children.toArray(children);
  const visible = usePerView(perView);
  // In loop mode the first slides are repeated at the end, so the track can slide one
  // step past the last item and then jump back to the start without a visible break
  const looping = loop && slides.length > 1;
  // Repeat the list until there is more than one screenful, so the rotation never shows a gap
  let base = slides;
  while (looping && base.length <= visible) base = base.concat(slides);
  const items = looping ? [...base, ...base.slice(0, visible)] : slides;
  const pages = looping ? base.length : Math.max(1, slides.length - visible + 1);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => { if (index > pages) setIndex(0); }, [pages, index]);

  useEffect(() => {
    if (!autoplay || paused || pages <= 1 || reducedMotion) return;
    const timer = setInterval(() => go(1), autoplay);
    return () => clearInterval(timer);
  }, [autoplay, paused, pages, reducedMotion, looping]);

  // Re-enable the slide transition after an instant jump back to the start
  useEffect(() => {
    if (animate) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const go = (delta: number) => {
    setAnimate(true);
    if (looping) {
      setIndex(i => {
        if (delta < 0 && i === 0) return pages - 1;
        return Math.min(i + delta, pages);
      });
    } else {
      setIndex(i => (i + delta + pages) % pages);
    }
  };

  // Once the slide onto the repeated items has finished, jump back to the real start.
  // A timer (not transitionend) is used: transitions do not run in background tabs.
  useEffect(() => {
    if (!looping || index < pages) return;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, 550);
    return () => clearTimeout(timer);
  }, [looping, index, pages]);

  // One dot per real item (the loop's repeated items share the dots of their originals)
  const dotCount = looping ? slides.length : pages;
  const activeDot = index % dotCount;

  const arrowClass = tone === 'dark'
    ? 'bg-white/90 text-slate-900 hover:bg-white'
    : 'bg-white text-slate-900 shadow-md ring-1 ring-slate-200 hover:bg-slate-50';
  const dotOff = tone === 'dark' ? 'bg-white/50' : 'bg-slate-300';
  const dotOn = tone === 'dark' ? 'bg-white' : 'bg-brand-emerald';

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touchStart.current !== null) {
          const dx = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }
        touchStart.current = null;
        setPaused(false);
      }}
    >
      <div className="overflow-hidden">
        <ul
          className={`flex ${animate ? 'transition-transform duration-500 ease-out' : ''}`}
          style={{ transform: `translateX(-${(index * 100) / visible}%)` }}
        >
          {items.map((slide, i) => (
            <li
              key={i}
              className="shrink-0 px-3"
              style={{ width: `${100 / visible}%` }}
              aria-hidden={i < index || i >= index + visible}
            >
              {slide}
            </li>
          ))}
        </ul>
      </div>

      {showArrows && pages > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Précédent"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer ${arrowClass}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Suivant"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors cursor-pointer ${arrowClass}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {showDots && pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setAnimate(true); setIndex(i); }}
              aria-label={`Aller à la diapositive ${i + 1}`}
              aria-current={i === activeDot}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeDot ? `w-7 ${dotOn}` : `w-2.5 ${dotOff}`}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
