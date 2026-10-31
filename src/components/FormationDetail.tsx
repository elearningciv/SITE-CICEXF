import React, { useState } from 'react';
import { Clock, GraduationCap, HelpCircle, MapPin, UserCheck } from 'lucide-react';
import { Formation } from '../types';
import InteractiveSectionTabs from './InteractiveSectionTabs';
import { buildFormationTabSections } from '../lib/interactiveTabsHelper';

// Placeholder text typed while testing in the admin (e.g. "XXXX") is not shown to visitors
const isPlaceholderText = (text: string) => /(.)\1{7,}/i.test(text.replace(/\s/g, ''));

interface FormationDetailProps {
  formation: Formation;
  /** Active section tab, when the parent needs to control it */
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  /** Extra buttons shown just before "S'inscrire" (e.g. the catalogue on news pages) */
  extraActions?: React.ReactNode;
}

/** Full presentation of a formation: header with key facts, section tabs (with registration) and FAQ */
export default function FormationDetail({ formation, activeTab, onTabChange, extraActions }: FormationDetailProps) {
  const [localTab, setLocalTab] = useState('description');
  const tab = activeTab ?? localTab;
  const setTab = onTabChange ?? setLocalTab;

  const goToRegistration = () => {
    setTab('sinscrire');
    setTimeout(() => {
      const el = document.getElementById('registration-form-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const desc = [formation.shortDescription, formation.context].find(t => t && !isPlaceholderText(t));

  return (
    <>
      {/* Course Header: title, description, then the key facts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden relative shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-6 sm:p-8 items-start lg:items-center relative z-10">
          <div className="w-full lg:w-7/12 min-w-0 flex-1 space-y-5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white break-words">
              {formation.title}
            </h1>

            {desc && (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-emerald dark:text-orange-300">Description de la formation</p>
                <p className="mt-2 whitespace-pre-line text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-[10]">{desc}</p>
              </div>
            )}

            {/* Key facts and registration on one line */}
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-5 mt-2 text-xs dark:border-slate-800">
              <span className="flex items-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-brand-emerald mr-1.5 shrink-0" />
                {formation.duration}
              </span>
              <span className="flex items-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <GraduationCap className="w-3.5 h-3.5 text-brand-emerald mr-1.5 shrink-0" />
                Niveau {formation.level}
              </span>
              <span className="flex items-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-brand-emerald mr-1.5 shrink-0" />
                Mode {formation.modality}
              </span>
              <span className="flex items-center font-bold text-white bg-[#8A1A24] px-2.5 py-1.5 rounded-lg">
                {formation.price || '450 000 FCFA'}
              </span>
              {extraActions}
              <button
                type="button"
                onClick={goToRegistration}
                className="px-5 py-2 bg-[#8A1A24] hover:bg-[#6D141C] text-white font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center space-x-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span>S'inscrire</span>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-5/12 min-w-0 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden shadow-md ring-1 ring-slate-200 dark:ring-slate-800 bg-slate-100 dark:bg-slate-950">
            <img
              src={formation.featuredImage}
              alt={formation.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Core Syllabus - Full Width for Maximum Space */}
      <div className="w-full space-y-6">
        <InteractiveSectionTabs
          title={formation.title}
          description={formation.shortDescription || formation.context}
          sections={buildFormationTabSections(formation)}
          defaultTabId="description"
          activeTabId={tab}
          onTabChange={setTab}
          onActionClick={goToRegistration}
          actionLabel="S'inscrire à cette certification"
        />

        {/* FAQ if available */}
        {formation.faq && formation.faq.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Foire Aux Questions (FAQ)
            </h3>
            <div className="space-y-3 text-xs font-sans">
              {formation.faq.map((item, fIdx) => (
                <div key={fIdx} className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-emerald mr-2 shrink-0" />
                    <span>{item.question}</span>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed pl-5 font-normal text-[11.5px]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
