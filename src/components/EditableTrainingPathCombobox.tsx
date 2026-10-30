import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, GraduationCap } from 'lucide-react';
import { COMPETENCY_4_ROW_PRESETS } from '../data/mockData';

// General fallback training paths
const GENERAL_TRAINING_PATHS: string[] = [
  'Strategic Leadership & Cross-Functional Project Execution (Executive Certificate)',
  'Advanced Problem Solving & Root-Cause Analysis (Lean Six Sigma)',
  'High-Performance Team Leadership & Stakeholder Management',
  'Data-Driven Decision Making & Operational KPI Modeling',
  'Risk Management & Operational Compliance Masterclass',
  'Professional Technical Writing & Executive Communication',
  'Agile Methodologies & Change Navigation in Modern Enterprises',
];

// Additional rich courses tailored to specific competency categories
const EXTRA_TRAINING_BY_COMPETENCY: Record<string, string[]> = {
  'comp-b-1': [ // Adaptability
    'Prosci® Certified Change Management Practitioner (3 Days)',
    'Leading Through Ambiguity & Organizational Agility Lab',
    'Adaptive Leadership & Contingency Planning in Fast-Paced Operations',
    'Agile Mindset & Operational Resilience in Energy Transitions',
  ],
  'comp-b-2': [ // Teamwork & Collaboration
    'Cross-Functional Synergy & High-Impact Collaborative Networks',
    'Managing Interdepartmental Conflicts & Stakeholder Alignment',
    'Psychological Safety & High-Trust Team Building (ILM Certified)',
    'Constructive Conflict Management & Cross-Departmental Win-Win Alignment',
  ],
  'comp-b-3': [ // Result Orientation
    'Execution Excellence: Transforming Strategic Goals into Measurable Results',
    'Operational Productivity & Critical Path Management',
    'Six Sigma Green Belt Certification (DMAIC Methodology)',
    'Strategic Decision-Making Under High Operational Uncertainty (Harvard Case Lab)',
  ],
  'comp-b-4': [ // Customer Centricity
    'Strategic Client Relationship & Stakeholder Experience Management',
    'Service Design Thinking & Customer Journey Optimization',
    'Internal Customer Service Excellence for Operations & Corporate Functions',
    'Mastering Technical Mentorship & Workplace Coaching (ILM Certified)',
  ],
  'comp-b-5': [ // Effective Communication
    'Executive Presentation Mastery & High-Stakes Stakeholder Briefings',
    'Influence Without Authority & Negotiation Fundamentals',
    'Technical Storytelling: Translating Complex Data into Actionable Insights',
    'Leading Technical Presentation Series & Executive Briefing Lab',
  ],
  'comp-b-6': [ // Accountability
    'Personal & Team Accountability in Mission-Critical Environments',
    'Ethical Governance, Compliance & Decision Ownership',
    'Operating Integrity & Risk Mitigation Protocols',
    'Governance, Risk, and Compliance (GRC) Executive Workshop',
  ],
  'comp-b-7': [ // Learning Agility
    'Self-Directed Learning Mastery & Rapid Skill Acquisition',
    'Applied AI & Digital Tools for Modern Workflow Automation',
    'Continuous Improvement & Innovation in Daily Operations',
    'Strategic Negotiation & Dispute Resolution for Plant Engineering Leads',
  ],
};

interface EditableTrainingPathComboboxProps {
  value: string;
  onChange: (value: string) => void;
  competencyId: string;
  rowNumber: number;
  placeholder?: string;
}

export const EditableTrainingPathCombobox: React.FC<EditableTrainingPathComboboxProps> = ({
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
  const presetTraining = presetRows.map((r) => r.trainingPath).filter(Boolean);
  const extraTraining = EXTRA_TRAINING_BY_COMPETENCY[competencyId] || [];

  // Combine and deduplicate
  const suggestions = Array.from(
    new Set([...presetTraining, ...extraTraining, ...GENERAL_TRAINING_PATHS])
  ).slice(0, 8);

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="space-y-0.5 relative" ref={containerRef}>
      {/* Top Label - Compact Training Path label */}
      <div className="text-[10.5px] font-semibold text-slate-700 flex items-center leading-tight">
        Training Path {rowNumber}
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
              ? "Select course/certification from dropdown or type your own..."
              : "Optional: select or enter custom training program...")
          }
          className="w-full text-xs p-1.5 pr-8 rounded border border-slate-200 bg-white hover:border-slate-300 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-snug break-words resize-y min-h-[36px]"
        />

        {/* Distinct, clearly visible dropdown button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Click to select from training dropdown"
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
          } bg-white border border-slate-300 rounded-lg shadow-xl p-1 text-left text-xs max-h-[220px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100`}
          style={{ boxShadow: '0 10px 28px rgba(33, 30, 78, 0.16)' }}
        >
          {/* Options List without header, dots or checkmarks */}
          <div className="space-y-0.5">
            {suggestions.map((option, idx) => {
              const isSelected = value.trim() === option.trim();
              return (
                <button
                  key={`${option}-${idx}`}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-all cursor-pointer text-xs leading-snug ${
                    isSelected
                      ? 'bg-[#211E4E] text-white font-medium shadow-2xs'
                      : 'hover:bg-[#211E4E]/5 hover:text-[#211E4E] text-slate-700'
                  }`}
                >
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
