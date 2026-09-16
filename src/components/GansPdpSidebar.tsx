import React from 'react';
import { usePdp } from '../context/PdpContext';
import { Role } from '../types/pdp';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CheckSquare,
  Award,
  Calendar,
  Layers,
  GraduationCap,
  Users,
  Shield,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  UserCheck,
} from 'lucide-react';

interface GansPdpSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const GansPdpSidebar: React.FC<GansPdpSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentRole, status, cycleConfig, selectedCompetenciesCount } = usePdp();

  return (
    <aside className="w-60 bg-white/70 backdrop-blur-xl border-r border-slate-200/80 flex shrink-0 min-h-[calc(100vh-100px)] shadow-[2px_0_12px_rgba(0,0,0,0.02)] select-none">
      <div className="flex-1 flex flex-col py-4 px-3 text-xs space-y-4">
        
        {/* EMPLOYEE VIEW NAVIGATION */}
        {currentRole === 'EMPLOYEE' && (
          <div className="space-y-4">
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#0275a8]" />
                  My Development
                </span>
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>PDP Dashboard</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('form')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'form'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className={`w-4 h-4 ${currentTab === 'form' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>My PDP Assessment</span>
                  </div>
                  {status === 'PENDING_EMPLOYEE_EVALUATION' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  {status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-900 animate-bounce">
                      Sign
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Cycle Milestones</span>
              </div>
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-[11px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Evaluation Due:</span>
                  <span className="font-bold text-slate-800">{cycleConfig.employeeDeadline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Manager Due:</span>
                  <span className="font-bold text-slate-800">{cycleConfig.managerDeadline}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANAGER VIEW NAVIGATION */}
        {currentRole === 'MANAGER' && (
          <div className="space-y-4">
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#0275a8]" />
                  Team Management
                </span>
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>Team PDP Overview</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('form')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'form'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className={`w-4 h-4 ${currentTab === 'form' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Active PDP Review</span>
                  </div>
                  {(status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER') && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 animate-pulse">
                      Action
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 uppercase flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Selected Focus</span>
              </div>
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Dev Competencies:</span>
                  <span className="font-extrabold text-[#0275a8]">{selectedCompetenciesCount} / 5 Selected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR / ADMIN VIEW NAVIGATION */}
        {currentRole === 'HR_ADMIN' && (
          <div className="space-y-4">
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0275a8]" />
                  HR Administration
                </span>
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>PDP Control Room</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('form')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'form'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className={`w-4 h-4 ${currentTab === 'form' ? 'text-white' : 'text-indigo-600'}`} />
                    <span>PDP Document View</span>
                  </div>
                  {status === 'PENDING_HR_INITIATION' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900 animate-pulse">
                      Initiate
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LNA TEAM VIEW NAVIGATION */}
        {currentRole === 'LNA_TEAM' && (
          <div className="space-y-4">
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[#1a5075] uppercase flex items-center justify-between border-b border-slate-200/80 pb-1.5 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#0275a8]" />
                  LNA Training Solutions
                </span>
              </div>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'dashboard'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#0275a8]'}`} />
                    <span>LNA Task Dashboard</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTab('form')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-left transition-all cursor-pointer ${
                    currentTab === 'form'
                      ? 'bg-gradient-to-r from-[#1a5075] to-[#0275a8] text-white shadow-[0_4px_12px_rgba(2,117,168,0.25)] font-bold'
                      : 'text-slate-700 hover:bg-white/80 hover:text-[#0275a8]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className={`w-4 h-4 ${currentTab === 'form' ? 'text-white' : 'text-cyan-600'}`} />
                    <span>Training Plan Editor</span>
                  </div>
                  {status === 'PENDING_LNA_TEAM' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 animate-pulse">
                      Pending
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
