import React, { useState, useRef, useEffect } from 'react';
import { usePdp } from '../context/PdpContext';
import {
  RotateCcw,
  ChevronDown,
  Layers,
  Check,
  Search,
  Bell,
  MessageSquare,
  Settings,
  HelpCircle,
  Grid,
} from 'lucide-react';
import { PdpStatus } from '../types/pdp';
import { YasHoldingLogo } from './YasHoldingLogo';

const STAGES: { key: PdpStatus; label: string; num: number }[] = [
  { key: 'PENDING_EMPLOYEE_EVALUATION', label: 'Employee Evaluation', num: 1 },
  { key: 'PENDING_MANAGER_REVIEW', label: 'Manager Review', num: 2 },
  { key: 'PENDING_HR_INITIATION', label: 'HR Initiation', num: 3 },
  { key: 'PDP_PLANNING_MANAGER', label: 'Manager Roadmap', num: 4 },
  { key: 'PENDING_LNA_TEAM', label: 'LNA Training Plan', num: 5 },
  { key: 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT', label: 'Employee Sign-Off', num: 6 },
  { key: 'ACTIVE', label: 'Active PDP', num: 7 },
  { key: 'HR_VIEW', label: 'HR View', num: 8 },
];

interface GansTopBarProps {}

export const GansTopBar: React.FC<GansTopBarProps> = () => {
  const { status, resetAllData, loadStagePreset, employee } = usePdp();
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
    <header className="w-full sticky top-0 z-40 select-none shadow-xs print:hidden">
      {/* 1. Top SharePoint Navigation Strip (Matching reference image) */}
      <div className="w-full bg-[#1C1844] text-white px-4 py-1.5 flex items-center justify-between gap-4 text-xs">
        {/* Left: 9-Dot Waffle Icon */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/90 hover:text-white cursor-pointer"
            title="App Launcher"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Search across SharePoint input */}
        <div className="flex-1 max-w-md hidden sm:flex items-center">
          <div className="w-full relative flex items-center">
            <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 pointer-events-none" />
            <input
              type="text"
              readOnly
              value=""
              placeholder="Search across SharePoint..."
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-white/50 text-xs rounded-md pl-9 pr-3 py-1 outline-hidden transition-colors cursor-text"
            />
          </div>
        </div>

        {/* Right: Notification, Chat, Settings, Help, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-white/80">
          <button
            type="button"
            className="p-1 hover:bg-white/10 rounded transition-colors hover:text-white cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-white/10 rounded transition-colors hover:text-white cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-white/10 rounded transition-colors hover:text-white cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            className="p-1 hover:bg-white/10 rounded transition-colors hover:text-white cursor-pointer"
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* User profile pill */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/20">
            <span className="text-xs font-semibold text-white hidden md:inline">
              {employee.name}
            </span>
            <div className="w-6 h-6 rounded-full bg-[#C8A977] text-[#1C1844] font-bold text-[10px] flex items-center justify-center shadow-2xs">
              RK
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Header: GANS TALENT MANAGEMENT + Workflow Stages Dropdown */}
      <div className="w-full bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center min-w-0">
          <YasHoldingLogo className="shrink-0" />
          <div className="h-5 w-[1px] bg-slate-300 mx-3 sm:mx-4 shrink-0" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-[#211E4E] whitespace-nowrap">
            TALENT MANAGEMENT
          </span>
        </div>

        {/* Right: Stage Selector Dropdown & Quick Reset */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Stage Selector Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#211E4E] text-xs font-bold border border-slate-300/80 shadow-2xs hover:border-[#C8A977] transition-all cursor-pointer"
              title="Select Workflow Stage"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-[#211E4E] text-[#C8A977] text-[10px] font-bold flex items-center justify-center font-mono">
                  {currentStageObj ? currentStageObj.num : '•'}
                </span>
                <span className="text-slate-500 font-medium hidden sm:inline">Stage:</span>
                <span className="text-[#211E4E] font-bold">{currentStageObj ? currentStageObj.label : 'Select Stage'}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${showPresetsMenu ? 'rotate-180 text-[#211E4E]' : ''}`} />
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 top-10 w-64 bg-[#211E4E] text-white rounded-xl shadow-2xl border border-[#C8A977]/40 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 font-bold text-[10px] text-[#C8A977] uppercase tracking-wider border-b border-slate-700/80 flex items-center justify-between">
                  <span>Workflow Stages</span>
                  <span className="text-[9px] text-[#C8A977] font-mono">8 Stages</span>
                </div>
                <div className="space-y-1 mt-1.5 max-h-80 overflow-y-auto">
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
                            ? 'bg-[#161435] text-[#C8A977] font-bold shadow-xs border border-[#C8A977]/30'
                            : 'hover:bg-[#161435] text-slate-200 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <span className={`w-4 h-4 rounded text-[9px] font-mono flex items-center justify-center font-bold ${
                            isSelected ? 'bg-[#C8A977] text-[#211E4E]' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {s.num}
                          </span>
                          <span className="truncate">{s.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A977] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Reset */}
          <button
            type="button"
            onClick={() => resetAllData()}
            title="Reset All Data"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#211E4E] border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
