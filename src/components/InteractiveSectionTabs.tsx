import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { SoftwareTool } from '../types';

export interface ProgramModule {
  module: string;
  details: string[];
}

export interface TabSectionItem {
  id: string; // 'description' | 'objectifs' | 'public' | 'programme' | 'admission' | 'pedagogie' | 'financement' | 'sinscrire'
  label: string;
  intro?: string;
  items?: string[];
  programModules?: ProgramModule[];
  content?: React.ReactNode;
  softwareTools?: SoftwareTool[];
  extraDetails?: { label: string; value: string }[];
}

interface InteractiveSectionTabsProps {
  description?: string;
  sections: TabSectionItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  title?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export default function InteractiveSectionTabs({
  description,
  sections,
  defaultTabId,
  activeTabId: externalActiveTabId,
  onTabChange,
  title,
  onActionClick,
  actionLabel = "S'inscrire / Demander un devis"
}: InteractiveSectionTabsProps) {
  const initialTab = externalActiveTabId || defaultTabId || (sections[0]?.id || 'description');
  const [internalTabId, setInternalTabId] = useState<string>(initialTab);

  useEffect(() => {
    if (externalActiveTabId !== undefined) {
      setInternalTabId(externalActiveTabId);
    }
  }, [externalActiveTabId]);

  const currentTabId = externalActiveTabId !== undefined ? externalActiveTabId : internalTabId;
  const activeSection = sections.find(s => s.id === currentTabId) || sections[0];

  const handleTabClick = (sectionId: string) => {
    setInternalTabId(sectionId);
    if (onTabChange) {
      onTabChange(sectionId);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl font-sans">
      
      {/* Side-by-side Layout: Details on LEFT (wide and screen-adapted), Burgundy Menu on RIGHT (narrow) */}
      <div className="flex flex-col-reverse md:flex-row items-stretch">
        
        {/* LEFT COLUMN: ACTIVE SECTION DETAILS (Agrandis et adaptés à la taille de l'écran) */}
        <div className="flex-1 min-w-0 p-5 sm:p-7 lg:p-9 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            {/* Header of Active Section with color badge and title (Suppressed on S'INSCRIRE) */}
            {activeSection.id !== 'sinscrire' && (
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8A1A24]"></span>
                  <h3 className="font-display font-extrabold text-sm sm:text-base lg:text-lg text-slate-900 dark:text-white uppercase tracking-wider">
                    {activeSection.label}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                  Cabinet CICEXF &bull; Ingénierie
                </span>
              </div>
            )}

            {/* DESCRIPTION: If on the description tab, show the presentation text prominently on white background */}
            {activeSection.id === 'description' && description && (
              <div className="p-6 sm:p-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                {title && (
                  <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white uppercase tracking-wider">
                    {title}
                  </h4>
                )}
                <p className="text-[13.5px] sm:text-[14.5px] text-slate-850 dark:text-slate-100 font-sans font-normal leading-[1.7] text-justify break-words [overflow-wrap:anywhere]">
                  {description}
                </p>
              </div>
            )}

            {/* Section Introduction text (Suppressed on DESCRIPTION tab) */}
            {activeSection.id !== 'description' && activeSection.intro && (
              <p className="text-[14px] sm:text-[15.5px] font-sans font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
                {activeSection.intro}
              </p>
            )}

            {/* PROGRAM MODULES: Module in BOLD, details unbolded (no mention of "sous point") */}
            {activeSection.programModules && activeSection.programModules.length > 0 && (
              <div className="space-y-4 font-sans">
                {activeSection.programModules.map((mod, mIdx) => (
                  <div key={mIdx} className="space-y-2 border-b border-slate-100 dark:border-slate-800/60 pb-3.5 last:border-b-0 last:pb-0">
                    <div className="flex items-start text-slate-900 dark:text-white text-[14px] sm:text-[15px] leading-snug">
                      <span className="w-[18px] h-[18px] rounded-full border-2 border-[#F25C05] flex items-center justify-center shrink-0 mt-0.5 mr-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F25C05]"></span>
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {mod.module}
                      </span>
                    </div>

                    {mod.details && mod.details.length > 0 && (
                      <div className="pl-7 sm:pl-8 space-y-1.5">
                        {mod.details.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start text-slate-700 dark:text-slate-300 text-[13px] sm:text-[13.5px] leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-2 mr-2.5"></span>
                            <span className="font-normal text-justify">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STANDARD ITEMS (for other tabs) with concentric orange circle (Suppressed on DESCRIPTION tab) */}
            {activeSection.id !== 'description' && (!activeSection.programModules || activeSection.programModules.length === 0) && activeSection.items && activeSection.items.length > 0 && (
              <div className="space-y-3 font-sans">
                {activeSection.items.map((item, idx) => (
                  <div key={idx} className="flex items-start text-slate-850 dark:text-slate-200 text-[13.5px] sm:text-[14px] leading-relaxed">
                    <span className="w-[18px] h-[18px] rounded-full border-2 border-[#F25C05] flex items-center justify-center shrink-0 mt-0.5 mr-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F25C05]"></span>
                    </span>
                    <span className="font-normal text-justify">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Software Tools if present */}
            {activeSection.softwareTools && activeSection.softwareTools.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Logiciels &amp; Outils mobilisés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSection.softwareTools.map((tool, tIdx) => (
                    <div
                      key={tIdx}
                      className="inline-flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
                    >
                      {tool.iconUrl ? (
                        <img
                          src={tool.iconUrl}
                          alt={tool.name}
                          className="w-4 h-4 object-contain shrink-0"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-[#F25C05]"></span>
                      )}
                      <span className="text-slate-800 dark:text-slate-200">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Details key/values if present (Suppressed on DESCRIPTION tab) */}
            {activeSection.id !== 'description' && activeSection.extraDetails && activeSection.extraDetails.length > 0 && (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {activeSection.extraDetails.map((det, dIdx) => (
                  <div key={dIdx} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 mb-0.5">
                      {det.label}
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      {det.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Content slot (Grand Plan Registration Form when on S'INSCRIRE) */}
            {activeSection.content && (
              <div
                id="interactive-tab-custom-content"
                className={activeSection.id === 'sinscrire' ? "mt-2 pt-1" : "mt-6 pt-5 border-t-2 border-slate-200 dark:border-slate-800"}
              >
                {activeSection.content}
              </div>
            )}
          </div>

          {/* Action Button: redirect to sinscrire tab */}
          {activeSection.id !== 'sinscrire' && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (onActionClick) {
                    onActionClick();
                  } else {
                    setInternalTabId('sinscrire');
                    if (onTabChange) onTabChange('sinscrire');
                  }
                }}
                className="px-5 py-2.5 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md active:scale-95"
              >
                <span>{actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BURGUNDY VERTICAL MENU (#8A1A24) (Pas large, aligné à droite) */}
        <div className="w-full md:w-56 lg:w-64 xl:w-72 shrink-0 bg-[#8A1A24] dark:bg-[#6D141C] flex flex-col justify-start border-b md:border-b-0 md:border-l border-white/10 shadow-md">
          <div className="py-2.5 px-4 bg-black/20 text-white/90 border-b border-white/10 text-center">
            <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-widest text-amber-200">
              Rubriques &bull; Navigation
            </span>
          </div>
          {sections.map((section) => {
            const isActive = section.id === currentTabId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleTabClick(section.id)}
                className={`w-full text-left py-3.5 sm:py-4 px-5 uppercase tracking-wider font-extrabold text-[12px] sm:text-[13px] transition-all cursor-pointer flex items-center justify-between border-b border-white/10 last:border-b-0 ${
                  isActive
                    ? 'bg-white text-[#0A2540] border-l-[5px] border-[#F25C05] shadow-xs'
                    : 'text-white hover:bg-black/15 hover:text-amber-100 text-opacity-95'
                }`}
              >
                <span className="truncate pr-1">{section.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isActive ? 'text-[#F25C05] translate-x-1' : 'text-white/60'}`} />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
