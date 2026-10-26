import React from 'react';
import { usePdp } from '../../context/PdpContext';
import {
  Users,
  CheckSquare,
  Clock,
  Send,
  Eye,
  AlertCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { TEAM_MEMBERS_OVERVIEW } from '../../data/mockData';
import { getStatusBadgeInfo } from '../EmployeeHeaderCard';

interface ManagerPdpDashboardProps {
  onOpenPdpForm: () => void;
}

export const ManagerPdpDashboard: React.FC<ManagerPdpDashboardProps> = ({ onOpenPdpForm }) => {
  const { employee, status, cycleConfig, sendReminder } = usePdp();

  // Compute stats
  const isManagerActionActive =
    status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                Line Manager Workspace
              </span>
              <span className="text-sky-200 text-xs font-mono">Division: Operations & Technical Services</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              {employee.lineManager}
            </h1>
            <p className="text-xs text-sky-100/90 mt-0.5 font-light">
              Team PDP Management • {employee.lineManagerTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-5 py-2.5 bg-[#211E4E] hover:bg-[#161435] text-white font-extrabold text-xs rounded-xl shadow-md border border-[#C8A977]/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
          >
            <CheckSquare className="w-4 h-4 text-[#C8A977]" />
            <span>
              {status === 'PENDING_MANAGER_REVIEW'
                ? `Review ${employee.name}’s Evaluation`
                : status === 'PDP_PLANNING_MANAGER'
                ? 'Plan Development Roadmap'
                : 'Open Active PDP'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C8A977]" />
          </button>
        </div>
      </div>

      {/* Action Notification if manager action needed */}
      {isManagerActionActive && (
        <div className="p-4 bg-[#211E4E] border border-[#C8A977]/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#161435] text-[#C8A977] flex items-center justify-center shrink-0 border border-[#C8A977]/40">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Line Manager Task Pending</h3>
              <p className="text-slate-200 mt-0.5">
                {status === 'PENDING_MANAGER_REVIEW'
                  ? `Evaluate ${employee.name} across all 14 competencies and select 5 priority development areas.`
                  : `HR has initiated ${employee.name}'s PDP. Please define practical development activities and phase timelines.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-4 py-2 bg-[#161435] hover:bg-[#2c2866] text-[#C8A977] font-extrabold rounded-xl text-xs cursor-pointer shadow-md border border-[#C8A977]/50 transition-all active:scale-95 shrink-0"
          >
            {status === 'PENDING_MANAGER_REVIEW' ? 'Review & Select 5' : 'Detail Roadmap'}
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Direct Reports</span>
            <Users className="w-4 h-4 text-[#C8A977]" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {TEAM_MEMBERS_OVERVIEW.length} Engineers
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pending Manager Action</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {isManagerActionActive ? '1 Action' : '0 Pending'}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Completed / Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {status === 'ACTIVE' ? '2 Active' : '1 Active'}
          </div>
        </div>

        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Manager Review Due</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono mt-2">
            {cycleConfig.managerDeadline}
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Direct Reports PDP Status List
            </h3>
            <p className="text-xs text-slate-400">
              Overview of team members undergoing the 2026/27 Strategic PDP cycle
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Position & Grade</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-slate-300">
              {/* Primary Ravi row reflecting live state */}
              <tr className="bg-[#211E4E]/40 hover:bg-[#211E4E]/60 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-[#C8A977]">1</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{employee.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{employee.staffId}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{employee.position}</div>
                  <div className="text-[10px] text-[#C8A977]">{employee.grade}</div>
                </td>
                <td className="py-3 px-4 text-slate-300">{employee.department}</td>
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
                    className="px-3 py-1.5 bg-[#211E4E] hover:bg-[#161435] text-white font-bold rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs border border-[#C8A977]/50"
                  >
                    <Eye className="w-3 h-3 text-[#C8A977]" />
                    <span>Open PDP</span>
                  </button>
                </td>
              </tr>

              {/* Other mock team members */}
              {TEAM_MEMBERS_OVERVIEW.slice(1).map((member, idx) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500">{idx + 2}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200 text-xs">{member.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{member.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{member.role}</div>
                    <div className="text-[10px] text-slate-500">{member.grade}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{member.department}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {member.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => sendReminder('EMPLOYEE', member.name)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Bell className="w-3 h-3 text-sky-400" />
                      <span>Remind</span>
                    </button>
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
