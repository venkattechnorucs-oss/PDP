import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Sparkles, Check } from 'lucide-react';
import { COMPETENCY_4_ROW_PRESETS } from '../data/mockData';

// General fallback activities if competency has custom suggestions
const GENERAL_ACTIVITIES: string[] = [
  'Lead a cross-functional process improvement initiative to streamline workflows.',
  'Conduct operational risk assessments and implement preventative control measures.',
  'Standardize technical operating procedures (SOP) and best-practice documentation.',
  'Facilitate monthly stakeholder alignment reviews to track performance milestones.',
  'Shadow senior department specialists on critical turnaround and audit reviews.',
  'Design and deliver a knowledge-sharing workshop for junior team members.',
  'Pilot and evaluate new digital tools or methodologies to optimize asset productivity.',
];

// Additional rich suggestions tailored to specific competency categories
const EXTRA_SUGGESTIONS_BY_COMPETENCY: Record<string, string[]> = {
  'comp-b-1': [ // Adaptability
    'Lead change navigation sessions for team during new system rollouts.',
    'Formulate contingency protocols for high-variance operational shifts.',
    'Facilitate post-implementation retrospective to capture agility improvements.',
  ],
  'comp-b-2': [ // Teamwork & Collaboration
    'Establish cross-departmental communication channels for multi-team projects.',
    'Coordinate collaborative peer review sessions across operations and maintenance.',
    'Lead joint task force to resolve inter-departmental scheduling bottlenecks.',
  ],
  'comp-b-3': [ // Result Orientation
    'Implement weekly KPI tracking scorecard with root-cause variance analysis.',
    'Drive efficiency sprint reducing turnaround milestone completion time by 15%.',
    'Benchmark department deliverable quality against regional operational standards.',
  ],
  'comp-b-4': [ // Customer Centricity
    'Establish a structured stakeholder feedback mechanism with monthly action reviews.',
    'Conduct service quality audits to eliminate repetitive client or internal friction.',
    'Author internal customer service standard guide for frontline operators.',
  ],
  'comp-b-5': [ // Effective Communication
    'Deliver monthly executive project status briefings with concise data visualizations.',
    'Standardize handover communication templates for shift supervisory teams.',
    'Lead technical presentation series explaining complex system changes to non-technical teams.',
  ],
  'comp-b-6': [ // Accountability
    'Implement a transparent responsibility matrix (RACI) across team workflows.',
    'Establish self-auditing routines to verify deliverable compliance before deadlines.',
    'Author escalation guidelines to swiftly address operational SLA deviations.',
  ],
  'comp-b-7': [ // Learning Agility
    'Complete independent research on industry-leading automation tools and present findings.',
    'Establish a quarterly skill gap review process with self-directed study milestones.',
    'Pilot new software platform and train team members on core functionalities.',
  ],
};

interface EditableActivityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  competencyId: string;
  rowNumber: number;
  placeholder?: string;
}

export const EditableActivityCombobox: React.FC<EditableActivityComboboxProps> = ({
  value,
  onChange,
  competencyId,
  rowNumber,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Aggregate curated suggestions for this competency
  const presetRows = COMPETENCY_4_ROW_PRESETS[competencyId]?.rows || [];
  const presetActivities = presetRows.map((r) => r.activity).filter(Boolean);
  const extraActivities = EXTRA_SUGGESTIONS_BY_COMPETENCY[competencyId] || [];

  // Combine and deduplicate
  const suggestions = Array.from(
    new Set([...presetActivities, ...extraActivities, ...GENERAL_ACTIVITIES])
  ).slice(0, 8);

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="space-y-0.5 relative" ref={containerRef}>
      {/* Top Label - Compact Activity label */}
      <div className="text-[10.5px] font-semibold text-slate-700 flex items-center leading-tight">
        Activity {rowNumber}
        {rowNumber <= 4 && (
          <span className="text-red-500 font-bold ml-0.5">*</span>
        )}
      </div>

      {/* Editable Text Area with distinct visible dropdown button */}
      <div className="relative">
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder ||
            (rowNumber <= 4
              ? "Select an activity from dropdown or type your own..."
              : "Optional: select or enter custom activity...")
          }
          className="w-full text-xs p-1.5 pr-8 rounded border border-slate-200 bg-white hover:border-slate-300 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-snug break-words resize-y min-h-[36px]"
        />

        {/* Distinct, clearly visible dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Click to select from dropdown"
          className={`absolute right-1 top-1 bottom-1 w-5.5 rounded flex items-center justify-center transition-all cursor-pointer border shadow-2xs ${
            isOpen
              ? 'bg-[#211E4E] text-[#C8A977] border-[#211E4E]'
              : 'bg-slate-100 hover:bg-[#211E4E] text-slate-600 hover:text-[#C8A977] border-slate-200 hover:border-[#211E4E]'
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-[#C8A977]' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 ${
            rowNumber >= 4 ? 'bottom-full mb-1' : 'top-full mt-1'
          } bg-white border border-slate-300 rounded-lg shadow-xl p-1.5 text-left text-xs max-h-[220px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100`}
          style={{ boxShadow: '0 10px 28px rgba(33, 30, 78, 0.16)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1 px-1.5 border-b border-slate-100 mb-1">
            <span className="text-[10px] font-bold text-[#211E4E] uppercase tracking-wider">
              Select Activity
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Options List */}
          <div className="space-y-0.5">
            {suggestions.map((option, idx) => {
              const isSelected = value.trim() === option.trim();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left px-2 py-1.5 rounded transition-all cursor-pointer flex items-start gap-1.5 text-[11px] leading-snug group ${
                    isSelected
                      ? 'bg-[#211E4E] text-white font-medium shadow-2xs'
                      : 'hover:bg-[#211E4E]/5 hover:text-[#211E4E] text-slate-700'
                  }`}
                >
                  <span
                    className={`shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#C8A977]' : 'text-slate-400 group-hover:text-[#C8A977]'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span className="font-bold">•</span>
                    )}
                  </span>
                  <span className="break-words">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
