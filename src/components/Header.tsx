import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import { Role, PdpStatus } from '../types/pdp';
import {
  User,
  Users,
  Shield,
  GraduationCap,
  Sparkles,
  RotateCcw,
  FileDown,
  ChevronDown,
  Bell,
  CheckCircle,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';

interface HeaderProps {
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenExport }) => {
  const {
    currentRole,
    setCurrentRole,
    status,
    resetAllData,
    loadStagePreset,
    selectedCompetenciesCount,
    isEmployeeEvalComplete,
    isManagerEvalComplete,
    isManagerRoadmapComplete,
    isLnaPlanComplete,
  } = usePdp();

  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  // Compute actionable notification dots for each role based on status
  const roleBadges: Record<Role, { count: number; activeForStage: boolean }> = {
    EMPLOYEE: {
      count: status === 'PENDING_EMPLOYEE_EVALUATION' || status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' ? 1 : 0,
      activeForStage: status === 'PENDING_EMPLOYEE_EVALUATION' || status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' || status === 'ACTIVE',
    },
    MANAGER: {
      count: status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER' ? 1 : 0,
      activeForStage: status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER',
    },
    HR_ADMIN: {
      count: status === 'PENDING_HR_INITIATION' ? 1 : 0,
      activeForStage: status === 'PENDING_HR_INITIATION' || status === 'NOT_STARTED',
    },
    LNA_TEAM: {
      count: status === 'PENDING_LNA_TEAM' ? 1 : 0,
      activeForStage: status === 'PENDING_LNA_TEAM',
    },
  };

  const rolesList: { role: Role; label: string; subLabel: string; icon: React.ReactNode }[] = [
    {
      role: 'EMPLOYEE',
      label: 'Employee View',
      subLabel: 'Tariq Al-Mansoor (Lead Engineer)',
      icon: <User className="w-4 h-4" />,
    },
    {
      role: 'MANAGER',
      label: 'Manager View',
      subLabel: 'Eng. Khalid Al-Amri (Line Manager)',
      icon: <Users className="w-4 h-4" />,
    },
    {
      role: 'HR_ADMIN',
      label: 'HR / Admin View',
      subLabel: 'Talent & L&D Operations',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      role: 'LNA_TEAM',
      label: 'LNA Team View',
      subLabel: 'Learning Needs & Training Lead',
      icon: <GraduationCap className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
      {/* Top utility alert bar for simulation awareness */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 px-4 py-1.5 text-xs border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-indigo-300">Live Role Simulator:</span>
          <span className="hidden sm:inline text-slate-400">
            Switch views anytime to observe real-time data flow across Employee, Manager, HR, and LNA stages.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => resetAllData()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors text-[11px] font-medium"
            title="Reset prototype to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>

          <span className="text-slate-700">|</span>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 transition-colors text-[11px] font-medium"
          >
            <FileDown className="w-3 h-3" />
            <span>Export / Print PDP</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Enterprise PDP Portal
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026/27 CYCLE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Professional Development Plan System</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">14 Competencies Model</span>
            </p>
          </div>
        </div>

        {/* Role Simulator Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto">
          {rolesList.map(({ role, label, subLabel, icon }) => {
            const isSelected = currentRole === role;
            const badge = roleBadges[role];

            return (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-slate-400'}>
                  {icon}
                </span>
                
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{label}</span>
                    {badge.count > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold animate-bounce">
                        {badge.count}
                      </span>
                    )}
                  </div>
                </div>

                {badge.activeForStage && !isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
