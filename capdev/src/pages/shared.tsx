import React from 'react';
import { Landmark, BriefcaseBusiness, GraduationCap, HeartPulse, Sprout, Users, FlaskConical } from 'lucide-react';

const GLYPHS = [Landmark, BriefcaseBusiness, GraduationCap, HeartPulse, Sprout, Users];

export function AxeGlyph({ index }: { index: number }) {
  const Icon = GLYPHS[index] || FlaskConical;
  return <span className="axe-glyph"><Icon /></span>;
}

export const initials = (name: string) =>
  name.replace(/[·.]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
