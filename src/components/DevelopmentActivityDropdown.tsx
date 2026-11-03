import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, BookOpen } from 'lucide-react';
import { DEVELOPMENT_ACTIVITIES_LIST } from '../data/developmentActivitiesData';

interface DevelopmentActivityDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
  rowNumber?: number;
  placeholder?: string;
  disabled?: boolean;
}

export const DevelopmentActivityDropdown: React.FC<DevelopmentActivityDropdownProps> = ({
  value,
  onChange,
  rowNumber,
  placeholder = 'Select Development Activity...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      // Auto-focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Clean value (normalize colons if any)
  const normalizedValue = value ? value.replace(/:$/, '').trim() : '';

  // Filter options based on search query
  const filteredOptions = DEVELOPMENT_ACTIVITIES_LIST.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            setSearchQuery('');
          }
        }}
        className={`w-full max-w-full min-h-[42px] px-3 py-2 text-left rounded-lg border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs select-none ${
          disabled
            ? 'bg-slate-100/80 border-slate-200 text-slate-500 cursor-not-allowed'
            : isOpen
            ? 'bg-white border-[#211E4E] ring-2 ring-[#211E4E]/15 text-slate-900 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-300 text-slate-800 hover:border-slate-400'
        }`}
        title={normalizedValue || placeholder}
      >
        <div className="min-w-0 flex-1">
          {normalizedValue ? (
            <span className="text-slate-900 font-bold leading-snug break-words text-xs block text-left">
              {normalizedValue}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic block text-xs">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#211E4E]' : ''
          }`}
        />
      </button>

      {/* Scrollable Dropdown Menu with Search */}
      {isOpen && (
        <div
          className={`absolute left-0 ${
            rowNumber && rowNumber >= 4 ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-50 w-full min-w-[280px] sm:min-w-[320px] bg-white border border-slate-300 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search development activities..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
              />
            </div>
          </div>

          {/* Scrollable List Container */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100/70 py-1 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching activities found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = normalizedValue.toLowerCase() === option.toLowerCase();

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100/80 text-[#211E4E] font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex-1 leading-snug">{option}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0F845C] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
