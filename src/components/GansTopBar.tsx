import React, { useState, useRef, useEffect } from 'react';
import { usePdp } from '../context/PdpContext';
import {
  RotateCcw,
  ChevronDown,
  Layers,
  Check,
} from 'lucide-react';
import { PdpStatus } from '../types/pdp';

const STAGES: { key: PdpStatus; label: string; num: number; category?: string }[] = [
  { key: 'PENDING_EMPLOYEE_EVALUATION', label: 'Employee Evaluation', num: 1 },
  { key: 'PENDING_MANAGER_REVIEW', label: 'Manager Review', num: 2 },
  { key: 'PENDING_HR_INITIATION', label: 'HR Initiation', num: 3 },
  { key: 'PDP_PLANNING_MANAGER', label: 'Manager Roadmap', num: 4 },
  { key: 'PENDING_LNA_TEAM', label: 'LNA Training Plan', num: 5 },
  { key: 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT', label: 'Employee Sign-Off', num: 6 },
  { key: 'ACTIVE', label: 'Active PDP', num: 7 },
  { key: 'HR_VIEW', label: 'HR View', num: 8 },
];

export const GansTopBar: React.FC = () => {
  const {
    status,
    resetAllData,
    loadStagePreset,
  } = usePdp();

  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPresetsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStageObj = STAGES.find((s) => s.key === status);

  return (
    <header className="w-full bg-[#153f5e] text-white sticky top-0 z-40 select-none shadow-md border-b border-white/10 print:hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* App Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/25 to-white/10 border border-white/25 flex items-center justify-center font-black text-xs tracking-wider shadow-inner text-white">
            PDP
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-wide uppercase leading-tight text-white">
              Professional Development Plan
            </h1>
          </div>
        </div>

        {/* Right Tools: Stage Selector, Reset */}
        <div className="flex items-center gap-2.5">
          {/* Stage selector dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-sky-300" />
              <span>{currentStageObj ? currentStageObj.label : 'Workflow Stage'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-sky-200 transition-transform duration-200 ${showPresetsMenu ? 'rotate-180' : ''}`} />
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 top-10 w-64 bg-slate-900/98 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Workflow Stage</span>
                  <span className="text-[9px] text-sky-400 font-mono">8 Stages</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {STAGES.map((s) => {
                    const isSelected = status === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => {
                          loadStagePreset(s.key);
                          setShowPresetsMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a5075] text-white font-bold shadow-xs'
                            : s.key === 'HR_VIEW'
                            ? 'hover:bg-sky-950/70 text-sky-300 font-semibold border-t border-slate-800 mt-1 pt-2'
                            : s.key === 'ACTIVE'
                            ? 'hover:bg-emerald-950/70 text-emerald-300 font-semibold'
                            : 'hover:bg-slate-800 text-slate-200 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-md text-[10px] font-mono flex items-center justify-center font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {s.num}
                          </span>
                          <span className="truncate">{s.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => resetAllData()}
            title="Reset All Data"
            className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/25 hover:border-rose-400/40 text-rose-200 hover:text-rose-100 border border-white/15 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
