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
  const { employee, status, cycleConfig } = usePdp();
  const isTalentPending = status === 'PENDING_TALENT_MANAGEMENT' || status === 'PENDING_LNA_TEAM';
  const pdpYears = cycleConfig.pdpDurationYears || 1;
  const checkInMilestone = pdpYears === 1 ? '6-Month Mid-Year Check-In' : '1-Year Mid-Cycle Check-In';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#211E4E] p-5 sm:p-6 text-white shadow-xl border border-[#C8A977]/30">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-[#C8A977]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-[#C8A977]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/10 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-white/20">
                Talent Management & Training Solutions Lead
              </span>
              <span className="text-[#C8A977] text-xs font-mono">Cycle {cycleConfig.cycleYear}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Talent Management & Progress Check-In Portal
            </h1>
            <p className="text-xs text-slate-200 mt-0.5 font-light">
              Competency Alignment • Learning Interventions • {checkInMilestone} Progress Feedback
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-5 py-2.5 bg-[#C8A977] hover:bg-[#bfa06d] text-[#211E4E] font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
          >
            <GraduationCap className="w-4 h-4 text-[#211E4E]" />
            <span>
              {isTalentPending ? `Assign ${employee.name}’s Plan` : 'Open Training & Check-In Plan'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Talent Management Pending Notification */}
      {isTalentPending && (
        <div className="p-4 bg-[#211E4E]/80 border border-[#C8A977]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C8A977]/20 text-[#C8A977] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#C8A977]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Action Required: Training & Check-In Preparation</h3>
              <p className="text-slate-300 mt-0.5">
                Line Manager has completed the 5 development objectives for <strong>{employee.name}</strong>. Please assign formal training courses and set up the {checkInMilestone} milestones.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-4 py-2 bg-[#C8A977] hover:bg-[#bfa06d] text-[#211E4E] font-black rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
          >
            Assign Learning Plan
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending Talent Review</span>
            <span className="w-2 h-2 rounded-full bg-[#C8A977] animate-pulse" />
          </div>
          <div className="text-2xl font-black text-[#C8A977] mt-2">
            {isTalentPending ? '1 Queue Item' : '0 Pending'}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Accredited Catalog</span>
            <BookOpen className="w-4 h-4 text-[#C8A977]" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            28+ Programs
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Mid-Year Check-In Schedule</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-base font-black text-emerald-400 mt-2">
            {checkInMilestone}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Talent Deadline</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono mt-2">
            {cycleConfig.talentManagementDeadline || cycleConfig.lnaDeadline}
          </div>
        </div>
      </div>

      {/* Talent Management Queue Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Talent Management Work Queue
            </h3>
            <p className="text-xs text-slate-400">
              Employees ready for formal training course assignment & mid-year check-in
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
              <tr className="bg-[#211E4E]/40 hover:bg-[#211E4E]/60 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-[#C8A977]">1</td>
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
                    className="px-3.5 py-1.5 bg-[#C8A977] hover:bg-[#bfa06d] text-[#211E4E] font-extrabold rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#211E4E]" />
                    <span>{isTalentPending ? 'Assign Plan' : 'Review Plan'}</span>
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
