import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { getSmartDescriptionsForActivity } from '../data/smartActivityDescriptionsData';
import { COMPETENCY_4_ROW_PRESETS } from '../data/mockData';

// Fallback general activities if no custom category is provided
const GENERAL_ACTIVITIES: string[] = [
  'Lead a cross-functional process improvement initiative to streamline workflows.',
  'Conduct operational risk assessments and implement preventative control measures.',
  'Standardize technical operating procedures (SOP) and best-practice documentation.',
  'Facilitate monthly stakeholder alignment reviews to track performance milestones.',
  'Shadow senior department specialists on critical turnaround and audit reviews.',
  'Design and deliver a knowledge-sharing workshop for junior team members.',
  'Pilot and evaluate new digital tools or methodologies to optimize asset productivity.',
];

interface EditableActivityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  competencyId: string;
  rowNumber: number;
  activityCategory?: string;
  placeholder?: string;
}

export const EditableActivityCombobox: React.FC<EditableActivityComboboxProps> = ({
  value,
  onChange,
  competencyId,
  rowNumber,
  activityCategory,
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

  // Aggregate SMART suggestions specific to the selected Development Activity
  const smartDescriptions = getSmartDescriptionsForActivity(activityCategory);

  // Fallback to presets only if no smart descriptions match
  const presetRows = COMPETENCY_4_ROW_PRESETS[competencyId]?.rows || [];
  const presetActivities = presetRows.map((r) => r.activity).filter(Boolean);

  const suggestions: string[] =
    smartDescriptions.length > 0
      ? smartDescriptions
      : Array.from(new Set([...presetActivities, ...GENERAL_ACTIVITIES])).slice(0, 5);

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Editable Text Area with distinct visible dropdown trigger button */}
      <div className="relative">
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder ||
            'Select a description sample from dropdown or type your own...'
          }
          className="w-full text-xs p-2.5 pr-11 rounded-lg border border-slate-200 bg-white hover:border-slate-300 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-relaxed break-words resize-none min-h-[46px]"
        />

        {/* Distinct, compact square dropdown toggle button positioned cleanly at top-right */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Click to select from SMART description samples"
          className={`absolute right-2 top-2 w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer border shadow-2xs ${
            isOpen
              ? 'bg-[#211E4E] text-[#C8A977] border-[#211E4E]'
              : 'bg-slate-50 hover:bg-[#211E4E] text-slate-500 hover:text-[#C8A977] border-slate-300 hover:border-[#211E4E]'
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-[#C8A977]' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu showing the SMART description samples */}
      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 ${
            rowNumber >= 4 ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden text-left text-xs max-h-[250px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 scrollbar-thin`}
          style={{ boxShadow: '0 12px 32px rgba(33, 30, 78, 0.18)' }}
        >
          {/* Options List directly without any header */}
          <div className="divide-y divide-slate-100 py-1">
            {suggestions.map((option, idx) => {
              const isSelected = value.trim() === option.trim();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left px-3.5 py-2.5 transition-all cursor-pointer text-xs leading-relaxed flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-[#211E4E] text-white font-medium shadow-2xs'
                      : 'hover:bg-[#211E4E]/5 hover:text-[#211E4E] text-slate-700'
                  }`}
                >
                  <span className="flex-1 break-words font-normal">
                    {option}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C8A977]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
