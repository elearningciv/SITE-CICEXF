import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'motion/react';

// Motion vocabulary of the site: one easing curve, short rises, staggered groups.
export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: { children: React.ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -60px 0px' }} transition={{ duration: 0.8, ease: EASE, delay }}>
      {children}
    </M>
  );
}

export const staggerParent = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
export const staggerChild = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -40px 0px' }}>
      {children}
    </motion.div>
  );
}

export function Item({ children, className, ...rest }: React.ComponentProps<typeof motion.div>) {
  return <motion.div className={className} variants={staggerChild} {...rest}>{children}</motion.div>;
}

/** Counts up to the value when it scrolls into view ("1350" → 0…1 350) */
export function Counter({ value, locale }: { value: string; locale: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const target = parseFloat(value.replace(/[^\d.]/g, ''));
  const suffix = value.replace(/[\d.,\s]/g, '');
  const [n, setN] = useState(isNaN(target) || reduce ? target : 0);
  useEffect(() => {
    if (!inView || isNaN(target) || reduce) return;
    const ctl = animate(0, target, { duration: 1.8, ease: EASE, onUpdate: v => setN(v) });
    return () => ctl.stop();
  }, [inView, target, reduce]);
  if (isNaN(target)) return <b ref={ref as React.Ref<HTMLElement>}>{value}</b>;
  return <b ref={ref as React.Ref<HTMLElement>}>{Math.round(n).toLocaleString(locale)}{suffix}</b>;
}

const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Animated research network: nodes drift, nearby nodes link up, the pointer attracts them.
 * Colours are read from the palette on each frame, so a palette change is reflected live.
 */
export function NetworkCanvas({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, raf = 0, frame = 0;
    const pointer = { x: -9999, y: -9999 };
    type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };
    let nodes: Node[] = [];
    let colors = { line: '', node: '', hub: '' };
    const readColors = () => { colors = { line: cssVar('--on-deep'), node: cssVar('--primary'), hub: cssVar('--accent') }; };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 14000) * density);
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: i % 9 === 0 ? 3.2 : 1.6 + Math.random() * 1.2, hub: i % 9 === 0
      }));
    };

    const draw = () => {
      if (frame++ % 30 === 0) readColors();
      ctx.clearRect(0, 0, w, h);
      const max = 130;
      for (const n of nodes) {
        if (!reduce) {
          const dx = pointer.x - n.x, dy = pointer.y - n.y, d = Math.hypot(dx, dy);
          if (d < 180 && d > 1) { n.vx += (dx / d) * 0.012; n.vy += (dy / d) * 0.012; }
          n.vx *= 0.992; n.vy *= 0.992;
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            ctx.globalAlpha = (1 - d / max) * 0.22;
            ctx.strokeStyle = a.hub || b.hub ? colors.hub : colors.line;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.globalAlpha = n.hub ? 0.95 : 0.7;
        ctx.fillStyle = n.hub ? colors.hub : colors.node;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        if (n.hub) {
          ctx.globalAlpha = 0.15;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3.2 + Math.sin(frame / 30 + n.x) * 1.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
    const onLeave = () => { pointer.x = pointer.y = -9999; };
    readColors(); resize(); draw();
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(); });
    ro.observe(canvas);
    canvas.parentElement?.addEventListener('pointermove', onMove);
    canvas.parentElement?.addEventListener('pointerleave', onLeave);
    // Pause when the hero is off-screen
    const io = new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting && !reduce) raf = requestAnimationFrame(draw); });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); canvas.parentElement?.removeEventListener('pointermove', onMove); canvas.parentElement?.removeEventListener('pointerleave', onLeave); };
  }, [reduce, density]);
  return <canvas ref={ref} aria-hidden="true" />;
}

/** Contour lines drifting slowly behind inner-page titles (like a topographic or density map) */
export function ContourLines() {
  const reduce = useReducedMotion();
  const paths = Array.from({ length: 9 }, (_, i) => {
    const y = 40 + i * 34;
    return `M -50 ${y} C 200 ${y - 60 + i * 6}, 420 ${y + 70 - i * 4}, 700 ${y} S 1150 ${y - 50}, 1500 ${y + 20}`;
  });
  return (
    <svg className="lines" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke={i % 3 === 0 ? 'var(--accent)' : 'var(--on-deep)'} strokeOpacity={i % 3 === 0 ? 0.45 : 0.14} strokeWidth={i % 3 === 0 ? 1.4 : 1}
          initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1, x: reduce ? 0 : [0, -30, 0] }}
          transition={{ pathLength: { duration: 2.2, ease: EASE, delay: i * 0.08 }, x: { duration: 18 + i * 2, repeat: Infinity, ease: 'easeInOut' } }} />
      ))}
    </svg>
  );
}
