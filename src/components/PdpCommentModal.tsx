import React, { useState, useEffect } from 'react';
import { usePdp } from '../context/PdpContext';
import { MessageSquare, Clock, ShieldCheck, GraduationCap } from 'lucide-react';
import { CommentMessage } from '../types/pdp';

interface PdpCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdpCommentModal: React.FC<PdpCommentModalProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    employee,
    commentHistory,
    addCommentMessage,
    employeeDevelopmentThoughts,
    updateEmployeeDevelopmentThoughts,
    managerRemarks,
    updateManagerRemarks,
    addToast,
  } = usePdp();

  const isManager = currentRole === 'MANAGER';
  const initialText = isManager ? managerRemarks : employeeDevelopmentThoughts;
  const [inputText, setInputText] = useState(initialText || '');

  // Keep in sync when modal opens
  useEffect(() => {
    if (isOpen) {
      const base = isManager ? managerRemarks : employeeDevelopmentThoughts;
      setInputText(base || '');
    }
  }, [isOpen, isManager, managerRemarks, employeeDevelopmentThoughts]);

  if (!isOpen) return null;

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (trimmed.length > 0) {
      if (isManager) {
        updateManagerRemarks(trimmed);
      } else {
        updateEmployeeDevelopmentThoughts(trimmed);
      }

      // Check if this text is already the latest message in history to prevent duplicate entry
      const lastMsg = commentHistory[commentHistory.length - 1];
      if (!lastMsg || lastMsg.text !== trimmed) {
        addCommentMessage({
          sender: isManager ? 'manager' : 'employee',
          senderName: isManager ? (employee.lineManager || 'Suresh Nair') : (employee.name || 'Vivekanandan'),
          text: trimmed,
        });
      }

      addToast('success', 'Comments Submitted', 'Your comments have been recorded successfully.');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar - Exactly matches reference image: Dark navy, Icon + "Comment History", NO X MARK, NO EXTRA INFO */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center gap-2.5 select-none border-b border-[#C8A977]/30">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-[#C8A977]/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-[#C8A977]" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
            Comment History
          </h2>
        </div>

        {/* Comment History Thread (Chat Canvas with Dot Matrix Pattern) */}
        <div
          className="p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[160px] max-h-[260px] flex-1"
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

        {/* Development Thoughts / Remarks Section */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-4 sm:p-5 bg-white/95 border-t border-slate-200/90">
            <div className="space-y-2">
              <label
                htmlFor="modal-comment-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-800"
              >
                DEVELOPMENT THOUGHTS / REMARKS
              </label>
              <textarea
                id="modal-comment-input"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter development thoughts, sign-off comments, or developmental remarks here..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50/70 focus:bg-white focus:border-[#211E4E] focus:ring-2 focus:ring-[#C8A977]/20 text-slate-900 placeholder:text-slate-400 transition-all resize-y leading-relaxed font-normal"
              />
            </div>
          </div>

          {/* Modal Footer - Exactly matches user instruction:
              "instead of Close keep Submit near that another button for cancel no x mark" */}
          <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end gap-3 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#211E4E] hover:bg-[#161435] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
