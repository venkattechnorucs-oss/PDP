import React from 'react';
import { usePdp } from '../context/PdpContext';
import { PdpStatus } from '../types/pdp';
import {
  User,
  BadgeCheck,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  ShieldCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const getStatusBadgeInfo = (status: PdpStatus) => {
  switch (status) {
    case 'NOT_STARTED':
      return {
        label: 'Not Started',
        bg: 'bg-slate-700/60 text-slate-300 border-slate-600',
        dot: 'bg-slate-400',
      };
    case 'PENDING_EMPLOYEE_EVALUATION':
      return {
        label: 'Pending Employee Evaluation',
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400 animate-pulse',
      };
    case 'PENDING_MANAGER_REVIEW':
      return {
        label: 'Pending Manager Review',
        bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        dot: 'bg-blue-400 animate-pulse',
      };
    case 'PENDING_HR_INITIATION':
      return {
        label: 'Pending HR Initiation',
        bg: 'bg-[#C8A977]/20 text-[#C8A977] border-[#C8A977]/40',
        dot: 'bg-[#C8A977] animate-pulse',
      };
    case 'PDP_PLANNING_MANAGER':
      return {
        label: 'PDP Planning – Manager',
        bg: 'bg-[#211E4E] text-[#C8A977] border-[#C8A977]/40',
        dot: 'bg-[#C8A977] animate-pulse',
      };
    case 'PENDING_LNA_TEAM':
      return {
        label: 'Pending LNA Team',
        bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        dot: 'bg-cyan-400 animate-pulse',
      };
    case 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT':
      return {
        label: 'Pending Employee Acknowledgement',
        bg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
        dot: 'bg-orange-400 animate-pulse',
      };
    case 'ACTIVE':
      return {
        label: 'Active PDP',
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
  }
};

export const EmployeeHeaderCard: React.FC = () => {
  const { employee, status, cycleConfig } = usePdp();
  const statusInfo = getStatusBadgeInfo(status);

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden mb-8">
      {/* Background subtle ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C8A977]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#211E4E]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Profile Details */}
        <div className="flex items-start sm:items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#211E4E] border-2 border-[#C8A977] flex items-center justify-center text-[#C8A977] font-bold text-xl sm:text-2xl shadow-lg">
              {employee.avatarInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white" title="Active Employee">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {employee.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {employee.staffId}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/40">
                {employee.erpNo}
              </span>
            </div>

            <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#C8A977]" />
              {employee.position}
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">{employee.grade}</span>
            </p>
          </div>
        </div>

        {/* Status and Cycle Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-700/50">
          <div className="flex flex-col gap-1.5 sm:text-right">
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              Current PDP Status
            </span>
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </div>
          </div>
        </div>
      </div>

      {/* Structured HR Field Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500" /> Division
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate" title={employee.division}>
            {employee.division}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-500" /> Department / Section
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate" title={employee.department}>
            {employee.department}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-slate-500" /> Line Manager
          </span>
          <span className="text-xs font-semibold text-indigo-300 truncate" title={employee.lineManager}>
            {employee.lineManager}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date of Joining
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {employee.dateOfJoining} ({employee.serviceLength})
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Program Duration
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {employee.programDuration}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Cycle Year
          </span>
          <span className="text-xs font-semibold text-cyan-300 font-mono">
            {cycleConfig.cycleYear}
          </span>
        </div>
      </div>
    </div>
  );
};
