import React from 'react';
import { usePdp } from '../../context/PdpContext';
import {
  Award,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { getStatusBadgeInfo } from '../EmployeeHeaderCard';

interface EmployeePdpDashboardProps {
  onOpenPdpForm: () => void;
}

export const EmployeePdpDashboard: React.FC<EmployeePdpDashboardProps> = ({ onOpenPdpForm }) => {
  const { employee, cycleConfig, status, competencies, roadmapItems } = usePdp();
  const statusInfo = getStatusBadgeInfo(status);

  // Determine the next step required from Employee
  const isActionRequired =
    status === 'PENDING_EMPLOYEE_EVALUATION' || status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';

  const completedEvals = competencies.filter((c) => c.employeeEvaluation).length;

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
                Employee Self-Service
              </span>
              <span className="text-sky-200 text-xs font-mono">Cycle {cycleConfig.cycleYear}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Welcome, {employee.name}
            </h1>
            <p className="text-xs text-sky-100/90 mt-0.5 font-light">
              Professional Development Plan (PDP) • {employee.position} ({employee.grade})
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>
              {status === 'PENDING_EMPLOYEE_EVALUATION'
                ? 'Start Self-Evaluation'
                : status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
                ? 'Review & Acknowledge PDP'
                : 'Open My PDP Form'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Notification Card if action is required */}
      {isActionRequired && (
        <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0 text-amber-300">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Action Required From You</h3>
              <p className="text-slate-300 mt-0.5">
                {status === 'PENDING_EMPLOYEE_EVALUATION'
                  ? 'Complete your self-evaluation for all 14 competencies and submit for Line Manager review.'
                  : 'Your Line Manager and LNA Team have completed your Development Roadmap. Please review and provide formal acknowledgement.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPdpForm}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
          >
            {status === 'PENDING_EMPLOYEE_EVALUATION' ? 'Evaluate Now' : 'Sign-Off Now'}
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PDP Status */}
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">PDP Status</span>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.bg}`}>
              {statusInfo.label}
            </div>
          </div>
          <div className="text-xl font-bold text-white mt-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>{status === 'ACTIVE' ? 'Active Plan' : 'In Cycle Progress'}</span>
          </div>
        </div>

        {/* Card 2: Self-Evaluation Progress */}
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Self-Evaluation</span>
            <span className="font-mono text-xs font-bold text-indigo-400">{completedEvals} / 14</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white">{Math.round((completedEvals / 14) * 100)}% Completed</span>
              <span className="text-slate-400 text-[10px]">14 Competencies</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(completedEvals / 14) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Line Manager */}
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Line Manager</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="font-extrabold text-sm text-white truncate">{employee.lineManager}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{employee.lineManagerTitle}</div>
          </div>
        </div>

        {/* Card 4: Deadline */}
        <div className="glass-panel-subtle p-4.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Submission Deadline</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="font-extrabold text-sm text-white font-mono">{cycleConfig.employeeDeadline}</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">Annual Strategic Cycle 2026/27</div>
          </div>
        </div>
      </div>

      {/* Active Roadmap Snapshot if available */}
      {roadmapItems.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                My 5 Priority Development Focus Areas
              </h3>
            </div>

            <button
              type="button"
              onClick={onOpenPdpForm}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {roadmapItems.map((item, idx) => (
              <div
                key={item.competencyId}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {item.phaseMonths}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs leading-snug line-clamp-1" title={item.competencyName}>
                  {item.competencyName}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed" title={item.objective}>
                  {item.objective || 'Objective assigned by Line Manager.'}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-medium">Training Intervention:</span>
                  <span className="font-bold text-indigo-300 truncate max-w-[140px]" title={item.learningTrainingPlan}>
                    {item.learningTrainingPlan || 'Pending LNA Team'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
