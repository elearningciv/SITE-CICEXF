import React from 'react';
import { AxeGlyph } from '../pages/shared';

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Generated illustration in the palette colours, used when no photo has been added */
export function GenCover({ seed, label, glyph }: { seed: string; label?: string; glyph?: number }) {
  const h = hash(seed);
  const lines = Array.from({ length: 8 }, (_, i) => {
    const y = 20 + i * 26 + ((h >>> i) % 14);
    const k = 24 + ((h >>> (i + 3)) % 46);
    return `M -20 ${y} C 110 ${y - k}, 250 ${y + k}, 420 ${y - (k >> 1)}`;
  });
  return (
    <div className="gen-cover">
      <svg viewBox="0 0 400 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="230" fill="var(--deep)" />
        <circle cx={300 + (h % 60)} cy={40 + (h % 50)} r="120" fill="var(--primary)" opacity="0.35" />
        {lines.map((d, i) => <path key={i} d={d} fill="none" stroke={i === 3 ? 'var(--accent)' : 'var(--on-deep)'} strokeOpacity={i === 3 ? 0.75 : 0.13} strokeWidth={i === 3 ? 2 : 1} />)}
      </svg>
      {glyph !== undefined && <span className="gen-glyph"><AxeGlyph index={glyph} /></span>}
      {label && <span className="gen-label">{label}</span>}
    </div>
  );
}
