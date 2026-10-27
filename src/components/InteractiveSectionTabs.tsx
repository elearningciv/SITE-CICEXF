import React, { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { SoftwareTool } from '../types';

export interface TabSectionItem {
  id: 'objectifs' | 'public' | 'programme' | 'accessibilite' | 'pedagogie' | 'financement' | string;
  label: string; // ex: 'OBJECTIFS', 'PUBLIC', 'PROGRAMME', 'ACCESSIBILITÉ', 'PÉDAGOGIE', 'FINANCEMENT'
  intro?: string;
  items?: string[];
  content?: React.ReactNode;
  softwareTools?: SoftwareTool[];
  extraDetails?: { label: string; value: string }[];
}

interface InteractiveSectionTabsProps {
  description: string;
  sections: TabSectionItem[];
  defaultTabId?: string;
  title?: string;
  onActionClick?: () => void;
  actionLabel?: string;
}

export default function InteractiveSectionTabs({
  description,
  sections,
  defaultTabId,
  title,
  onActionClick,
  actionLabel = "S'inscrire / Demander un devis"
}: InteractiveSectionTabsProps) {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabId || (sections[0]?.id || 'objectifs'));

  const activeSection = sections.find(s => s.id === activeTabId) || sections[0];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md font-sans">
      
      {/* 1. DESCRIPTION TEXT AT TOP */}
      {description && (
        <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {title && (
            <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mb-2 tracking-tight">
              {title}
            </h3>
          )}
          <p className="text-[14px] sm:text-[15px] text-slate-800 dark:text-slate-200 font-sans font-normal leading-[1.68] text-justify">
            {description}
          </p>
        </div>
      )}

      {/* 2. BURGUNDY VERTICAL MENU LIST AS SHOWN IN THE USER'S SCREENSHOT */}
      <div className="bg-[#8A1A24] dark:bg-[#6D141C] p-0 flex flex-col shadow-inner">
        {sections.map((section) => {
          const isActive = section.id === activeTabId;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveTabId(section.id)}
              className={`w-full text-left py-3.5 sm:py-4 px-6 sm:px-7 uppercase tracking-wider font-extrabold text-[13.5px] sm:text-[14.5px] transition-all cursor-pointer flex items-center justify-between border-b border-white/10 last:border-b-0 ${
                isActive
                  ? 'bg-white text-[#0A2540] border-l-[6px] border-[#F25C05] shadow-xs pl-5 sm:pl-6'
                  : 'text-white hover:bg-black/10 hover:text-amber-100 text-opacity-95'
              }`}
            >
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. DETAILS OF THE CLICKED ELEMENT ONLY */}
      {activeSection && (
        <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
          
          {/* Section Introduction */}
          {activeSection.intro && (
            <p className="text-[14px] sm:text-[15px] font-sans font-normal text-slate-850 dark:text-slate-100 mb-4 leading-relaxed">
              {activeSection.intro}
            </p>
          )}

          {/* Items with the concentric orange circle icon (matching user's screenshot) */}
          {activeSection.items && activeSection.items.length > 0 && (
            <div className="space-y-3 font-sans">
              {activeSection.items.map((item, idx) => (
                <div key={idx} className="flex items-start text-slate-850 dark:text-slate-200 text-[13.5px] sm:text-[14px] leading-relaxed">
                  {/* Concentric orange circle marker */}
                  <span className="w-[18px] h-[18px] rounded-full border-2 border-[#F25C05] flex items-center justify-center shrink-0 mt-0.5 mr-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F25C05]"></span>
                  </span>
                  <span className="font-normal text-justify">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Software Tools if present in this section */}
          {activeSection.softwareTools && activeSection.softwareTools.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                Logiciels &amp; Outils mobilisés :
              </span>
              <div className="flex flex-wrap gap-2">
                {activeSection.softwareTools.map((tool, tIdx) => (
                  <div
                    key={tIdx}
                    className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
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

          {/* Extra Details key/values if present */}
          {activeSection.extraDetails && activeSection.extraDetails.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              {activeSection.extraDetails.map((det, dIdx) => (
                <div key={dIdx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
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

          {/* Custom Node Content if provided */}
          {activeSection.content && (
            <div className="mt-4">
              {activeSection.content}
            </div>
          )}

          {/* Action Button */}
          {onActionClick && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onActionClick}
                className="px-5 py-2.5 bg-[#8A1A24] hover:bg-[#6D141C] text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-md active:scale-95"
              >
                <span>{actionLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
