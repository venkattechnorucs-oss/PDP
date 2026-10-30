import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { PdpStatus } from '../types/pdp';

export interface EmployeeDashboardViewProps {
  onNavigateToPdp: () => void;
  pdpSubmission?: any | null;
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  onNavigateToPdp,
  pdpSubmission,
}) => {
  const { employee, status } = usePdp();

  // Resolve active status: priority to pdpSubmission?.status if provided, else current context status
  const currentStatus: PdpStatus = pdpSubmission?.status || status;

  // Determine PDP Status Badge properties and Action label
  const getPdpStatusBadgeAndAction = (stat: PdpStatus) => {
    switch (stat) {
      case 'NOT_STARTED':
      case 'PENDING_EMPLOYEE_EVALUATION':
        return {
          label: 'Not Started',
          pillClass: 'bg-slate-100 text-slate-700 border border-slate-200',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 inline-block" />,
          actionLabel: 'Start',
        };
      case 'PENDING_MANAGER_REVIEW':
      case 'PENDING_HR_INITIATION':
      case 'PDP_PLANNING_MANAGER':
      case 'PENDING_LNA_TEAM':
        return {
          label: 'Pending Approval',
          pillClass: 'bg-[#211E4E]/10 text-[#211E4E] border border-[#C8A977]/40',
          icon: <Clock className="w-3 h-3 text-[#C8A977] shrink-0" />,
          actionLabel: 'View',
        };
      case 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT':
        return {
          label: 'Pending Sign-Off',
          pillClass: 'bg-indigo-50 text-indigo-900 border border-indigo-200',
          icon: <Clock className="w-3 h-3 text-indigo-600 shrink-0" />,
          actionLabel: 'Review',
        };
      case 'ACTIVE':
      case 'COMPLETED':
        return {
          label: 'Completed',
          pillClass: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />,
          actionLabel: 'View',
        };
      default:
        return {
          label: 'Returned for Revisions',
          pillClass: 'bg-amber-50 text-amber-800 border border-amber-300',
          icon: <RotateCcw className="w-3 h-3 text-amber-700 shrink-0" />,
          actionLabel: 'Edit',
        };
    }
  };

  const pdpStatusConfig = getPdpStatusBadgeAndAction(currentStatus);

  return (
    <div className="space-y-5 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 2. Welcome Glass Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Welcome, {employee.name}
        </h1>
      </section>

      {/* 3. Table Card Container */}
      <section className="bg-white rounded-2xl border border-white/80 shadow-[0_8px_30px_rgb(33,30,78,0.05)] overflow-hidden">
        {/* 4. Card Header Bar */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <GraduationCap className="w-4 h-4 text-[#C8A977]" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Professional Development Plan (PDP)
          </h2>
        </div>

        {/* Inner Card Body with Table */}
        <div className="p-4 sm:p-5 bg-white">
          <div className="rounded-xl overflow-hidden border border-slate-200/80">
            <table className="w-full text-xs text-left border-collapse">
              {/* 5. Table Headers */}
              <thead>
                <tr className="bg-[#211E4E] text-[#E6D5B8] select-none border-b border-[#211E4E]">
                  <th className="p-3 text-center text-[11px] font-extrabold uppercase tracking-wider w-32">
                    YEAR
                  </th>
                  <th className="p-3 text-center text-[11px] font-extrabold uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="p-3 text-center text-[11px] font-extrabold uppercase tracking-wider">
                    MANAGER
                  </th>
                  <th className="p-3 text-center text-[11px] font-extrabold uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="p-3 text-center text-[11px] font-extrabold uppercase tracking-wider w-32">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* 6. Table Body Rows & Cells */}
              <tbody className="divide-y divide-slate-100 bg-white">
                {/* Current 2026 Cycle */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#211E4E] text-white font-bold text-xs shadow-2xs">
                      2026
                    </span>
                  </td>
                  <td className="p-3 text-center text-slate-700 font-medium text-xs">
                    15 Jan 2026
                  </td>
                  <td className="p-3 text-center text-slate-800 font-medium text-xs">
                    {employee.lineManager}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${pdpStatusConfig.pillClass}`}
                    >
                      {pdpStatusConfig.icon}
                      <span>{pdpStatusConfig.label}</span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={onNavigateToPdp}
                      className="text-xs font-extrabold text-[#211E4E] hover:text-[#C8A977] transition-colors cursor-pointer underline-offset-4 hover:underline"
                    >
                      {pdpStatusConfig.actionLabel}
                    </button>
                  </td>
                </tr>

                {/* Historical 2025 Cycle */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-800 text-xs">
                    2025
                  </td>
                  <td className="p-3 text-center text-slate-700 font-medium text-xs">
                    15 Nov 2025
                  </td>
                  <td className="p-3 text-center text-slate-800 font-medium text-xs">
                    {employee.lineManager}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Completed</span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={onNavigateToPdp}
                      className="text-xs font-extrabold text-[#211E4E] hover:text-[#C8A977] transition-colors cursor-pointer underline-offset-4 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>

                {/* Historical 2024 Cycle */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-800 text-xs">
                    2024
                  </td>
                  <td className="p-3 text-center text-slate-700 font-medium text-xs">
                    18 Nov 2024
                  </td>
                  <td className="p-3 text-center text-slate-800 font-medium text-xs">
                    {employee.lineManager}
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Completed</span>
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={onNavigateToPdp}
                      className="text-xs font-extrabold text-[#211E4E] hover:text-[#C8A977] transition-colors cursor-pointer underline-offset-4 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
