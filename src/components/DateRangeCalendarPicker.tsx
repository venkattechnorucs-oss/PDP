import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';
import { calculatePhaseDates } from '../utils/phaseDateUtils';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function formatPdpDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function parsePdpDate(str?: string): Date {
  if (!str) return new Date(2026, 6, 1);
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parts = str.split(/[\/\-]/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const mStr = parts[1];
    const year = parseInt(parts[2], 10);
    let mIdx = MONTH_NAMES.findIndex((m) => m.toLowerCase() === mStr.toLowerCase());
    if (mIdx === -1) mIdx = parseInt(mStr, 10) - 1;
    if (isNaN(mIdx) || mIdx < 0 || mIdx > 11) mIdx = 6;
    return new Date(year, mIdx, isNaN(day) ? 1 : day);
  }
  return new Date(2026, 6, 1);
}

export function calculateDurationBetween(start: Date, end: Date): string {
  if (end.getTime() < start.getTime()) return 'Custom';
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.round(diffDays / 30.4375);

  if (months <= 1) return `${diffDays} Days`;
  if (months >= 5 && months <= 7) return '6 Months';
  if (months >= 11 && months <= 13) return '1 Year';
  if (months >= 23 && months <= 25) return '2 Years';
  if (months > 12) {
    const yrs = (months / 12).toFixed(1).replace('.0', '');
    return `${yrs} Years`;
  }
  return `${months} Months`;
}

interface DateRangeCalendarPickerProps {
  startDate?: string;
  endDate?: string;
  rowNumber?: number;
  onSelectRange: (startDate: string, endDate: string, durationLabel?: string) => void;
  disabled?: boolean;
}

export const DateRangeCalendarPicker: React.FC<DateRangeCalendarPickerProps> = ({
  startDate = '01/Jul/2026',
  endDate = '31/Dec/2026',
  rowNumber = 1,
  onSelectRange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial parsed dates
  const initialStart = parsePdpDate(startDate);
  const initialEnd = parsePdpDate(endDate);

  // Calendar view navigation (month & year)
  const [viewYear, setViewYear] = useState<number>(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialStart.getMonth());

  // In-flight selection state
  // null endDate indicates user has clicked start and now needs to click end
  const [tempStart, setTempStart] = useState<Date>(initialStart);
  const [tempEnd, setTempEnd] = useState<Date | null>(initialEnd);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectionStep, setSelectionStep] = useState<'pick-start' | 'pick-end'>('pick-start');

  // Sync with props when opened
  useEffect(() => {
    if (isOpen) {
      const s = parsePdpDate(startDate);
      const e = parsePdpDate(endDate);
      setTempStart(s);
      setTempEnd(e);
      setViewYear(s.getFullYear());
      setViewMonth(s.getMonth());
      setSelectionStep('pick-start');
      setHoverDate(null);
    }
  }, [isOpen, startDate, endDate]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // If start and end are valid, apply them before closing
        if (tempStart && tempEnd) {
          const sStr = formatPdpDate(tempStart);
          const eStr = formatPdpDate(tempEnd);
          const dur = calculateDurationBetween(tempStart, tempEnd);
          onSelectRange(sStr, eStr, dur);
        }
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, tempStart, tempEnd, onSelectRange]);

  // Navigate months
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Preset button click (e.g. 6 Months, 1 Year, 2 Years from tempStart)
  const applyPreset = (duration: '6 Months' | '1 Year' | '2 Years') => {
    const sStr = formatPdpDate(tempStart);
    const dateInfo = calculatePhaseDates(duration, rowNumber, sStr);
    const newEnd = parsePdpDate(dateInfo.endDate);
    setTempEnd(newEnd);
    setSelectionStep('pick-start');
    onSelectRange(sStr, dateInfo.endDate, dateInfo.duration);
  };

  // Day click handler
  const handleDayClick = (clickedDate: Date) => {
    if (selectionStep === 'pick-start') {
      // First click: select start date, keep calendar OPEN, prompt for end date
      setTempStart(clickedDate);
      setTempEnd(null);
      setSelectionStep('pick-end');
    } else {
      // Second click: select end date in the same calendar!
      if (clickedDate.getTime() < tempStart.getTime()) {
        // User clicked a date before the start date: make that the new start date
        setTempStart(clickedDate);
        setTempEnd(null);
        setSelectionStep('pick-end');
      } else {
        // Valid end date selected!
        setTempEnd(clickedDate);
        setSelectionStep('pick-start');
        setHoverDate(null);
        const sStr = formatPdpDate(tempStart);
        const eStr = formatPdpDate(clickedDate);
        const dur = calculateDurationBetween(tempStart, clickedDate);
        onSelectRange(sStr, eStr, dur);
      }
    }
  };

  // Build calendar matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Prev month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(viewYear, viewMonth - 1, prevMonthDays - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(viewYear, viewMonth, i);
    calendarDays.push({ date: d, isCurrentMonth: true });
  }

  // Next month padding to fill complete grid of 35 or 42
  const totalSlots = calendarDays.length <= 35 ? 35 : 42;
  const remaining = totalSlots - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(viewYear, viewMonth + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Derived effective end for highlighting while hovering
  const effectiveEnd = tempEnd || hoverDate;

  const currentDurationLabel = calculateDurationBetween(
    tempStart,
    tempEnd || parsePdpDate(endDate)
  );

  return (
    <div className="relative inline-block w-full text-center" ref={containerRef}>
      {/* Calendar Button Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full group flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-md border text-left transition-all cursor-pointer shadow-2xs ${
          isOpen
            ? 'border-[#211E4E] ring-2 ring-[#211E4E]/15 bg-white'
            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        title="Click to select start and end dates from calendar"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded bg-[#211E4E]/5 text-[#211E4E] flex items-center justify-center shrink-0 border border-[#211E4E]/10 group-hover:bg-[#211E4E] group-hover:text-[#C8A977] transition-colors">
            <CalendarIcon className="w-3 h-3" />
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-[10.5px] font-bold text-[#211E4E] font-mono truncate leading-tight">
              {startDate} – {endDate}
            </span>
            <span className="text-[9.5px] text-slate-500 font-medium leading-none mt-0.5">
              {currentDurationLabel}
            </span>
          </div>
        </div>
      </button>

      {/* Popover Date Range Calendar */}
      {isOpen && (
        <div
          className={`absolute z-50 ${rowNumber >= 3 ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} right-0 w-[310px] bg-white border border-slate-300 rounded-xl shadow-2xl p-3 text-left animate-in fade-in zoom-in-95 duration-100`}
          style={{ boxShadow: '0 12px 36px rgba(33, 30, 78, 0.16)' }}
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-[#C8A977]" />
              <span className="text-xs font-bold text-[#211E4E]">
                Select Activity Date Range
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets Bar (Instant single-click duration setup) */}
          <div className="my-2 flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/70">
            <span className="text-[9px] font-bold text-slate-500 uppercase px-1 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-[#C8A977]" /> Presets:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyPreset('6 Months')}
                className="px-2 py-0.5 text-[10px] font-bold rounded bg-white hover:bg-[#211E4E] hover:text-white text-[#211E4E] border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                6 Months
              </button>
              <button
                type="button"
                onClick={() => applyPreset('1 Year')}
                className="px-2 py-0.5 text-[10px] font-bold rounded bg-white hover:bg-[#211E4E] hover:text-white text-[#211E4E] border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                1 Year
              </button>
              <button
                type="button"
                onClick={() => applyPreset('2 Years')}
                className="px-2 py-0.5 text-[10px] font-bold rounded bg-white hover:bg-[#211E4E] hover:text-white text-[#211E4E] border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                2 Years
              </button>
            </div>
          </div>

          {/* Month / Year Navigator */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1 text-xs font-bold text-[#211E4E]">
              <span>{FULL_MONTH_NAMES[viewMonth]}</span>
              <span>{viewYear}</span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
            {DAY_LABELS.map((label) => (
              <div key={label} className="py-0.5">
                {label}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
            {calendarDays.map((slot, idx) => {
              const { date, isCurrentMonth } = slot;
              const dateMs = date.getTime();
              const startMs = tempStart ? tempStart.getTime() : null;
              const endMs = effectiveEnd ? effectiveEnd.getTime() : null;

              const isStart =
                startMs !== null &&
                date.getFullYear() === tempStart.getFullYear() &&
                date.getMonth() === tempStart.getMonth() &&
                date.getDate() === tempStart.getDate();

              const isEnd =
                endMs !== null &&
                date.getFullYear() === effectiveEnd!.getFullYear() &&
                date.getMonth() === effectiveEnd!.getMonth() &&
                date.getDate() === effectiveEnd!.getDate();

              const isInRange =
                startMs !== null &&
                endMs !== null &&
                dateMs > startMs &&
                dateMs < endMs;

              return (
                <button
                  key={`${date.toISOString()}-${idx}`}
                  type="button"
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => {
                    if (selectionStep === 'pick-end' && tempStart) {
                      setHoverDate(date);
                    }
                  }}
                  className={`h-7 w-full flex items-center justify-center text-[11px] font-medium transition-colors cursor-pointer relative ${
                    !isCurrentMonth ? 'text-slate-300' : 'text-slate-700'
                  } ${
                    isInRange
                      ? 'bg-[#211E4E]/10 text-[#211E4E] font-bold'
                      : ''
                  } ${
                    isStart
                      ? 'bg-[#211E4E] text-white font-bold rounded-l-md shadow-xs z-10'
                      : ''
                  } ${
                    isEnd
                      ? 'bg-[#211E4E] text-white font-bold rounded-r-md shadow-xs z-10'
                      : ''
                  } ${
                    isStart && isEnd ? 'rounded-md' : ''
                  } ${
                    !isStart && !isEnd && !isInRange
                      ? 'hover:bg-slate-100 rounded-md'
                      : ''
                  }`}
                >
                  <span>{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          {/* Footer with Apply button */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                const finalEnd = tempEnd || tempStart;
                const sStr = formatPdpDate(tempStart);
                const eStr = formatPdpDate(finalEnd);
                const dur = calculateDurationBetween(tempStart, finalEnd);
                onSelectRange(sStr, eStr, dur);
                setIsOpen(false);
              }}
              className="px-4 py-1.5 bg-[#211E4E] hover:bg-[#161435] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-[#C8A977]" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
