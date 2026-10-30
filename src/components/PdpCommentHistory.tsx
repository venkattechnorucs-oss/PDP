import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  MessageSquare,
  Clock,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { CommentMessage } from '../types/pdp';

interface PdpCommentHistoryProps {
  className?: string;
}

export const PdpCommentHistory: React.FC<PdpCommentHistoryProps> = ({ className = '' }) => {
  const {
    currentRole,
    status,
    employee,
    commentHistory,
    employeeDevelopmentThoughts,
    updateEmployeeDevelopmentThoughts,
    managerRemarks,
    updateManagerRemarks,
  } = usePdp();

  const isEmployeeEval =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_EVALUATION';
  const isEmployeeSignOff =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';
  const isEmployeeEditing = isEmployeeEval || isEmployeeSignOff;

  const isManagerEditing =
    currentRole === 'MANAGER' && status === 'PENDING_MANAGER_REVIEW';
  const isReadOnly = !isEmployeeEditing && !isManagerEditing;

  // Extract 2-letter uppercase initials from name
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Resolve input values & handlers based on role
  const isEmployeeMode = isEmployeeEditing;
  const isManagerMode = isManagerEditing;

  const inputValue = isEmployeeMode
    ? employeeDevelopmentThoughts
    : isManagerMode
    ? managerRemarks
    : '';

  const handleInputChange = (val: string) => {
    if (isEmployeeMode) {
      updateEmployeeDevelopmentThoughts(val);
    } else if (isManagerMode) {
      updateManagerRemarks(val);
    }
  };

  const inputLabel = isEmployeeSignOff
    ? 'Development Thoughts / Comments'
    : isEmployeeEval
    ? 'Development Thoughts'
    : isManagerMode
    ? 'REMARKS'
    : 'Development Thoughts / Remarks';

  const placeholderText = isEmployeeSignOff
    ? 'Enter your development thoughts, sign-off comments, or return feedback here...'
    : isEmployeeEval
    ? 'Enter your development thoughts, notes, or developmental remarks here...'
    : isManagerMode
    ? 'Enter remarks or developmental feedback here...'
    : 'This discussion thread is finalized and development thoughts are locked.';

  return (
    <section
      className={`rounded-2xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(26,80,117,0.05)] overflow-hidden flex flex-col ${className}`}
    >
      {/* 2. Header Bar */}
      <div className="bg-[#211E4E] border-b border-[#C8A977]/30 px-5 py-3.5 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-[#C8A977]/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-[#C8A977]" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Comment History
          </h2>
        </div>
      </div>

      {/* 3. Comment History Thread (Chat Canvas with Dot Matrix Pattern) */}
      <div
        className="p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[160px] max-h-[320px]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(200, 169, 119, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {commentHistory.length === 0 ? (
          <div className="h-full min-h-[130px] flex items-center justify-center text-center text-xs text-slate-400">
            No previous comment history for this cycle. Enter your thoughts below.
          </div>
        ) : (
          commentHistory.map((msg: CommentMessage) => {
            const isEmp = msg.sender === 'employee';
            const initials = getInitials(msg.senderName);

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isEmp ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Circular Avatar (DP) with Mini Role Badge */}
                <div className="relative shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shadow-2xs ${
                      isEmp
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white'
                        : 'bg-[#211E4E] text-[#C8A977] ring-2 ring-[#C8A977]/30'
                    }`}
                  >
                    {initials}
                  </div>
                  {/* Mini Role Badge */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs ${
                      isEmp
                        ? 'bg-emerald-800 text-white border border-emerald-400'
                        : 'bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/60'
                    }`}
                    title={isEmp ? 'Employee' : 'Manager'}
                  >
                    {isEmp ? (
                      <GraduationCap className="w-2.5 h-2.5" />
                    ) : (
                      <ShieldCheck className="w-2.5 h-2.5" />
                    )}
                  </div>
                </div>

                {/* Chat Bubble */}
                <div
                  className={`p-3 max-w-[85%] sm:max-w-[75%] shadow-2xs ${
                    isEmp
                      ? 'bg-gradient-to-br from-[#eafaf1] to-[#daf5e4] text-slate-900 border border-[#bbf7b8] rounded-2xl rounded-tl-xs'
                      : 'bg-[#211E4E]/5 text-slate-900 border border-[#C8A977]/30 rounded-2xl rounded-tr-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span
                      className={`text-[11px] font-bold ${
                        isEmp ? 'text-emerald-800' : 'text-[#211E4E]'
                      }`}
                    >
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="text-[12px] whitespace-pre-wrap leading-relaxed text-slate-800 font-normal">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Input Area (Below the History Thread) */}
      <div className="p-4 sm:p-5 bg-white/95 border-t border-slate-200/90">
        <div className="space-y-2">
          {/* Dynamic Label with Red Asterisk matching image */}
          <label
            htmlFor="comment-history-input"
            className="block text-xs font-bold uppercase tracking-wider text-slate-800"
          >
            {inputLabel}
            {!isReadOnly && <span className="text-red-500 font-bold ml-1">*</span>}
          </label>

          {/* Textarea */}
          <textarea
            id="comment-history-input"
            rows={3}
            disabled={isReadOnly}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholderText}
            className={`w-full text-xs p-3 rounded-xl border transition-all resize-y leading-relaxed font-normal ${
              isReadOnly
                ? 'bg-slate-100/70 border-slate-200 text-slate-500 cursor-not-allowed italic'
                : 'border-slate-300 bg-slate-50/70 focus:bg-white focus:border-[#211E4E] focus:ring-2 focus:ring-[#C8A977]/20 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>
      </div>
    </section>
  );
};
