import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  History,
  X,
  User,
  Users,
  Shield,
  GraduationCap,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Role } from '../types/pdp';

interface PdpAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getRoleIcon = (role: Role) => {
  switch (role) {
    case 'EMPLOYEE':
      return <User className="w-3.5 h-3.5 text-sky-400" />;
    case 'MANAGER':
      return <Users className="w-3.5 h-3.5 text-[#C8A977]" />;
    case 'HR_ADMIN':
      return <Shield className="w-3.5 h-3.5 text-[#C8A977]" />;
    case 'LNA_TEAM':
      return <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />;
  }
};

export const PdpAuditLogModal: React.FC<PdpAuditLogModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = usePdp();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col text-white shadow-2xl animate-in zoom-in-95 text-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/30 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">PDP Audit Trail & Lifecycle History</h3>
              <p className="text-[11px] text-slate-400">Timestamped record of all workflow events and state transitions</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Timeline list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {auditLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 italic">
              No audit records logged yet.
            </div>
          ) : (
            auditLogs.map((log, index) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 transition-all hover:bg-slate-800"
              >
                <div className="mt-0.5 w-7 h-7 rounded-xl bg-slate-700/60 flex items-center justify-center shrink-0 border border-slate-600">
                  {getRoleIcon(log.actorRole)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-white text-xs">{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-normal leading-relaxed">{log.details}</p>

                  <div className="mt-2 flex items-center gap-2 text-[10px]">
                    <span className="text-slate-400">Actor:</span>
                    <strong className="text-sky-300 font-semibold">{log.actorName}</strong>
                    <span className="text-slate-600">•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-mono">
                      {log.actorRole}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Total Records: {auditLogs.length}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
