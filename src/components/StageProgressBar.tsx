import React from 'react';
import { usePdp } from '../context/PdpContext';
import { PdpStatus, Role } from '../types/pdp';
import {
  Check,
  Clock,
  UserCheck,
  Sparkles,
  FileSpreadsheet,
  GraduationCap,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface StageDef {
  status: PdpStatus;
  order: number;
  label: string;
  shortLabel: string;
  role: Role;
  roleLabel: string;
  description: string;
}

const STAGES: StageDef[] = [
  {
    status: 'NOT_STARTED',
    order: 0,
    label: 'HR Release',
    shortLabel: 'Release',
    role: 'HR_ADMIN',
    roleLabel: 'HR / Admin',
    description: 'Configure cycle and release to employees',
  },
  {
    status: 'PENDING_EMPLOYEE_EVALUATION',
    order: 1,
    label: 'Employee Evaluation',
    shortLabel: 'Employee',
    role: 'EMPLOYEE',
    roleLabel: 'Employee',
    description: 'Self-evaluate all 14 competencies',
  },
  {
    status: 'PENDING_MANAGER_REVIEW',
    order: 2,
    label: 'Manager Review & Selection',
    shortLabel: 'Manager Eval',
    role: 'MANAGER',
    roleLabel: 'Manager',
    description: 'Evaluate 14 competencies & select 5 with objectives',
  },
  {
    status: 'PENDING_HR_INITIATION',
    order: 3,
    label: 'HR Initiation',
    shortLabel: 'HR Initiate',
    role: 'HR_ADMIN',
    roleLabel: 'HR / Admin',
    description: 'Review manager evaluation and initiate PDP',
  },
  {
    status: 'PDP_PLANNING_MANAGER',
    order: 4,
    label: 'Manager Roadmap',
    shortLabel: 'Roadmap',
    role: 'MANAGER',
    roleLabel: 'Manager',
    description: 'Define development activities & timelines',
  },
  {
    status: 'PENDING_LNA_TEAM',
    order: 5,
    label: 'LNA Training Plan',
    shortLabel: 'LNA Plan',
    role: 'LNA_TEAM',
    roleLabel: 'LNA Team',
    description: 'Assign certified learning & training interventions',
  },
  {
    status: 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT',
    order: 6,
    label: 'Employee Acknowledgement',
    shortLabel: 'Sign-Off',
    role: 'EMPLOYEE',
    roleLabel: 'Employee',
    description: 'Review full PDP and digitally acknowledge',
  },
  {
    status: 'ACTIVE',
    order: 7,
    label: 'Active PDP',
    shortLabel: 'Active',
    role: 'EMPLOYEE',
    roleLabel: 'All Roles',
    description: 'PDP is operational for 2026/27 cycle',
  },
];

const getStatusOrder = (status: PdpStatus): number => {
  const match = STAGES.find((s) => s.status === status);
  return match ? match.order : 1;
};

export const StageProgressBar: React.FC = () => {
  const { status, currentRole, setCurrentRole, loadStagePreset } = usePdp();
  const currentOrder = getStatusOrder(status);

  // We show steps 1 through 7 (Employee Evaluation to Active)
  const displayStages = STAGES.slice(1);

  return (
    <div className="glass-panel-subtle rounded-2xl p-5 mb-8 border border-slate-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
            PDP
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Connected PDP Workflow Progression
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end lifecycle from Employee self-evaluation through Manager roadmap & LNA training to Active status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Jump to Stage:</span>
          <select
            value={status}
            onChange={(e) => loadStagePreset(e.target.value as PdpStatus)}
            aria-label="Simulation Stage Jump Selector"
            className="text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="PENDING_EMPLOYEE_EVALUATION">1. Employee Evaluation</option>
            <option value="PENDING_MANAGER_REVIEW">2. Manager Review (Select 5)</option>
            <option value="PENDING_HR_INITIATION">3. HR Initiation</option>
            <option value="PDP_PLANNING_MANAGER">4. Manager Roadmap Plan</option>
            <option value="PENDING_LNA_TEAM">5. LNA Training Assignment</option>
            <option value="PENDING_EMPLOYEE_ACKNOWLEDGEMENT">6. Employee Acknowledgement</option>
            <option value="ACTIVE">7. Active PDP</option>
            <option value="HR_VIEW">8. HR View</option>
          </select>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {displayStages.map((step) => {
          const isCompleted = currentOrder > step.order || (status === 'ACTIVE' && step.status === 'ACTIVE');
          const isCurrent = status === step.status;
          const isUpcoming = currentOrder < step.order;

          return (
            <div
              key={step.status}
              onClick={() => {
                // Clicking on step switches to appropriate role if convenient
                setCurrentRole(step.role);
              }}
              className={`flex flex-col p-3 rounded-xl border transition-all cursor-pointer relative ${
                isCurrent
                  ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : isCompleted
                  ? 'bg-slate-800/60 border-emerald-900/60 text-slate-300 hover:border-slate-600'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-indigo-500 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.order}
                </span>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isCurrent
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-800/50 text-slate-500'
                  }`}
                >
                  {step.roleLabel}
                </span>
              </div>

              <div className="font-semibold text-xs text-white truncate" title={step.label}>
                {step.shortLabel}
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5" title={step.description}>
                {isCurrent ? '● In Progress' : isCompleted ? 'Completed' : 'Pending'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
