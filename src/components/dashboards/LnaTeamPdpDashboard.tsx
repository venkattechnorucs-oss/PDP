import React from 'react';
import { usePdp } from '../../context/PdpContext';
import {
  GraduationCap,
  BookOpen,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  Search,
} from 'lucide-react';
import { LNA_RECOMMENDED_COURSES, TEAM_MEMBERS_OVERVIEW } from '../../data/mockData';
import { getStatusBadgeInfo } from '../EmployeeHeaderCard';

interface LnaTeamPdpDashboardProps {
  onOpenPdpForm: () => void;
}

export const LnaTeamPdpDashboard: React.FC<LnaTeamPdpDashboardProps> = ({ onOpenPdpForm }) => {
  const { employee, status, cycleConfig, roadmapItems } = usePdp();
  const isLnaPending = status === 'PENDING_LNA_TEAM';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Learning Needs & Training Lead
              </span>
              <span className="text-cyan-200 text-xs font-mono">Cycle {cycleConfig.cycleYear}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              LNA Learning & Training Solutions Portal
            </h1>
            <p className="text-xs text-sky-100/90 mt-0.5 font-light">
              Competency-to-Curriculum Alignment • Certified Training Intervention Assignment
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-950/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>
              {isLnaPending ? 'Assign Tariq’s Training Plan' : 'Open Training Plan Editor'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LNA Pending Notification */}
      {isLnaPending && (
        <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-cyan-200 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Action Required: Training Interventions</h3>
              <p className="text-slate-300 mt-0.5">
                Line Manager has completed the 5 development objectives for <strong>{employee.name}</strong>. Please assign formal training courses, workshops, or certifications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
          >
            Assign Learning Plan
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending LNA Assignment</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-2">
            {isLnaPending ? '1 Queue Item' : '0 Pending'}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Accredited Catalog</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            28+ Programs
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Activated PDPs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {status === 'ACTIVE' ? '2 Ready' : '1 Ready'}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">LNA Due Date</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono mt-2">
            {cycleConfig.lnaDeadline}
          </div>
        </div>
      </div>

      {/* LNA Queue Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              LNA Learning Plan Work Queue
            </h3>
            <p className="text-xs text-slate-400">
              Employees ready for formal training course assignment
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="bg-cyan-950/30 hover:bg-cyan-950/50 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-cyan-400">1</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{employee.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{employee.staffId} • {employee.position}</div>
                </td>
                <td className="py-3 px-4 text-slate-300">{employee.department}</td>
                <td className="py-3 px-4 text-slate-300">{employee.lineManager}</td>
                <td className="py-3 px-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeInfo(status).bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeInfo(status).dot}`} />
                    {getStatusBadgeInfo(status).label}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={onOpenPdpForm}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isLnaPending ? 'Assign Plan' : 'Review Plan'}</span>
                  </button>
                </td>
              </tr>

              {TEAM_MEMBERS_OVERVIEW.slice(1).map((member, idx) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500">{idx + 2}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200 text-xs">{member.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{member.id} • {member.role}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{member.department}</td>
                  <td className="py-3 px-4 text-slate-400">{member.manager}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {member.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] text-slate-500 italic">In Progression</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
