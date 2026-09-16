import React, { useState } from 'react';
import { usePdp } from '../../context/PdpContext';
import {
  Shield,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  FileCheck,
  Bell,
  Eye,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { TEAM_MEMBERS_OVERVIEW } from '../../data/mockData';
import { getStatusBadgeInfo } from '../EmployeeHeaderCard';

interface HrAdminPdpDashboardProps {
  onOpenPdpForm: () => void;
}

export const HrAdminPdpDashboard: React.FC<HrAdminPdpDashboardProps> = ({ onOpenPdpForm }) => {
  const {
    cycleConfig,
    releasePdpCycle,
    status,
    employee,
    initiatePdpByHr,
    sendReminder,
  } = usePdp();

  const [assessmentName, setAssessmentName] = useState(cycleConfig.assessmentName);
  const [cycleYear, setCycleYear] = useState(cycleConfig.cycleYear);
  const [empDeadline, setEmpDeadline] = useState(cycleConfig.employeeDeadline);
  const [mgrDeadline, setMgrDeadline] = useState(cycleConfig.managerDeadline);
  const [lnaDeadline, setLnaDeadline] = useState(cycleConfig.lnaDeadline);
  const [targetGroup, setTargetGroup] = useState(cycleConfig.targetGroup);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    releasePdpCycle({
      assessmentName,
      cycleYear,
      employeeDeadline: empDeadline,
      managerDeadline: mgrDeadline,
      lnaDeadline,
      targetGroup,
    });
    setIsReleaseModalOpen(false);
  };

  const isHrInitiationActive = status === 'PENDING_HR_INITIATION';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a5075] via-[#104060] to-[#0d2f47] p-5 sm:p-6 text-white shadow-[0_12px_36px_-6px_rgba(26,80,117,0.35)] border border-white/20 backdrop-blur-xl">
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                HR / Talent & L&D Directorate
              </span>
              <span className="text-sky-200 text-xs font-mono">{cycleConfig.cycleYear} Cycle</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Professional Development Plan (PDP) Administration
            </h1>
            <p className="text-xs text-sky-100/90 mt-0.5 font-light">
              Cycle Configuration • Release Governance • Employee Stage Tracking
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsReleaseModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Configure & Release Cycle</span>
            </button>
          </div>
        </div>
      </div>

      {/* HR Action Pending Banner */}
      {isHrInitiationActive && (
        <div className="p-4 bg-purple-950/60 border border-purple-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-purple-200 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">PDP Requires HR Formal Initiation</h3>
              <p className="text-slate-300 mt-0.5">
                Line Manager has completed evaluation and selected 5 development priorities for <strong>{employee.name}</strong>. Click below to initiate the roadmap planning phase.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenPdpForm}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
            >
              Review Evaluation
            </button>
            <button
              type="button"
              onClick={() => initiatePdpByHr()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95"
            >
              Initiate PDP
            </button>
          </div>
        </div>
      )}

      {/* Cycle Configuration Overview Card */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0275a8]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active PDP Cycle Configuration
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            ● {cycleConfig.status} ({cycleConfig.cycleYear})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block font-medium">Assessment Title:</span>
            <div className="font-bold text-white leading-snug">{cycleConfig.assessmentName}</div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block font-medium">Employee Due Date:</span>
            <div className="font-mono font-bold text-amber-300">{cycleConfig.employeeDeadline}</div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block font-medium">Manager Due Date:</span>
            <div className="font-mono font-bold text-indigo-300">{cycleConfig.managerDeadline}</div>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] block font-medium">LNA Team Due Date:</span>
            <div className="font-mono font-bold text-cyan-300">{cycleConfig.lnaDeadline}</div>
          </div>
        </div>
      </div>

      {/* Employee Organization PDP Stage Monitoring Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Organizational PDP Cycle Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Live tracking across Employee, Manager, HR, and LNA stages
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Position & Grade</th>
                <th className="py-3 px-4">Line Manager</th>
                <th className="py-3 px-4 text-center">Stage Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-slate-300">
              {/* Primary Tariq row reflecting live state */}
              <tr className="bg-indigo-950/30 hover:bg-indigo-950/50 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-indigo-400">1</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{employee.name}</div>
                  <div className="text-[10px] font-mono text-slate-400">{employee.staffId} • {employee.department}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-200">{employee.position}</div>
                  <div className="text-[10px] text-indigo-300">{employee.grade}</div>
                </td>
                <td className="py-3 px-4 text-slate-300">{employee.lineManager}</td>
                <td className="py-3 px-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeInfo(status).bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadgeInfo(status).dot}`} />
                    {getStatusBadgeInfo(status).label}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenPdpForm}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                    {isHrInitiationActive && (
                      <button
                        type="button"
                        onClick={() => initiatePdpByHr()}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer"
                      >
                        Initiate
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              {/* Other organization members */}
              {TEAM_MEMBERS_OVERVIEW.slice(1).map((member, idx) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500">{idx + 2}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200 text-xs">{member.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{member.id} • {member.department}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{member.role}</div>
                    <div className="text-[10px] text-slate-500">{member.grade}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{member.manager}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {member.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => sendReminder('MANAGER', member.manager)}
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

      {/* Cycle Release / Configuration Modal */}
      {isReleaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm">Configure & Release PDP Cycle</h3>
              </div>
              <button
                onClick={() => setIsReleaseModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRelease} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Assessment Cycle Name:</label>
                <input
                  type="text"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cycle Year:</label>
                  <input
                    type="text"
                    value={cycleYear}
                    onChange={(e) => setCycleYear(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Group:</label>
                  <input
                    type="text"
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">Employee Due:</label>
                  <input
                    type="text"
                    value={empDeadline}
                    onChange={(e) => setEmpDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">Manager Due:</label>
                  <input
                    type="text"
                    value={mgrDeadline}
                    onChange={(e) => setMgrDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] font-bold mb-1">LNA Due:</label>
                  <input
                    type="text"
                    value={lnaDeadline}
                    onChange={(e) => setLnaDeadline(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReleaseModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer shadow-md"
                >
                  Release to Employees
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
