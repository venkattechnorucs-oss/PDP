import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import {
  UserCheck,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';

interface PdpEmployeeAcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdpEmployeeAcknowledgmentModal: React.FC<PdpEmployeeAcknowledgmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { employee, cycleConfig, acknowledgePdpByEmployee } = usePdp();
  const [hasConfirmedCheckbox, setHasConfirmedCheckbox] = useState(false);
  const [employeeComments, setEmployeeComments] = useState('');

  if (!isOpen) return null;

  const handleConfirmAcknowledgment = () => {
    if (!hasConfirmedCheckbox) return;
    acknowledgePdpByEmployee(employeeComments.trim());
    onClose();
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#153f5e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/20">
              <UserCheck className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">
                Employee Acknowledgement
              </h3>
              <p className="text-[10px] text-sky-200/90 font-mono">
                Cycle {cycleConfig.cycleYear}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-slate-700">
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Roadmap Confirmation</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed font-normal">
              Confirm your 5 development competencies and training plan for {cycleConfig.cycleYear}.
            </p>
          </div>

          {/* Employee Sign-off Meta Summary */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 text-[11px]">
            <div>
              <span className="text-slate-500 block font-medium text-[10px] uppercase tracking-wider">Employee Name</span>
              <strong className="text-slate-900 font-semibold">{employee.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium text-[10px] uppercase tracking-wider">Staff ID</span>
              <strong className="text-slate-900 font-mono font-semibold">{employee.staffId}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium text-[10px] uppercase tracking-wider">Date</span>
              <strong className="text-slate-900 font-mono font-semibold">{currentDateFormatted}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium text-[10px] uppercase tracking-wider">Program Duration</span>
              <strong className="text-slate-900 font-semibold">{employee.programDuration}</strong>
            </div>
          </div>

          {/* Optional remarks */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Comments (Optional):
            </label>
            <textarea
              rows={2}
              value={employeeComments}
              onChange={(e) => setEmployeeComments(e.target.value)}
              placeholder="Add comments..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
            />
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl cursor-pointer select-none transition-colors hover:bg-sky-50">
            <input
              type="checkbox"
              checked={hasConfirmedCheckbox}
              onChange={(e) => setHasConfirmedCheckbox(e.target.checked)}
              className="w-4 h-4 text-[#153f5e] border-slate-300 rounded focus:ring-[#153f5e] mt-0.5 cursor-pointer shrink-0"
            />
            <span className="font-semibold text-xs text-slate-900 leading-snug">
              I have reviewed and agreed to my Professional Development Plan.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAcknowledgment}
            disabled={!hasConfirmedCheckbox}
            className={`px-6 py-2 text-xs font-bold rounded-lg transition-all shadow-xs ${
              hasConfirmedCheckbox
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-[0.99]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
