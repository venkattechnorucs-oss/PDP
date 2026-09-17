import React from 'react';
import { usePdp } from '../context/PdpContext';
import { CheckSquare, Square, Send, ArrowRight, AlertCircle, Target } from 'lucide-react';

export const PdpManagerSelectionSection: React.FC = () => {
  const {
    competencies,
    currentRole,
    status,
    toggleCompetencySelection,
    updateManagerObjective,
    submitManagerEvaluation,
    initiatePdpByHr,
    selectedCompetenciesCount,
    isManagerEvalComplete,
  } = usePdp();

  const isManagerEvaluating =
    currentRole === 'MANAGER' && status === 'PENDING_MANAGER_REVIEW';
  const isHrReviewing =
    currentRole === 'HR_ADMIN' && status === 'PENDING_HR_INITIATION';
  
  // Only show this selection section during Manager Review (2) and HR Initiation (3)
  const showSection =
    status === 'PENDING_MANAGER_REVIEW' || status === 'PENDING_HR_INITIATION';

  if (!showSection) return null;

  const selectedCompetencies = competencies.filter((c) => c.isSelectedForPdp);

  return (
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Section Header */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
        <Target className="w-3.5 h-3.5 text-sky-300" />
        <span>Priority Development Selection</span>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Step 1: Competency Checklist (If Manager is evaluating) */}
        {isManagerEvaluating && (
          <div>
            <div className="text-xs font-bold text-[#153f5e] uppercase tracking-wide mb-2.5 flex items-center justify-between">
              <span>Select 5 Development Priorities:</span>
              <span className="text-[11px] font-semibold text-slate-600">
                {selectedCompetenciesCount} / 5 Selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {competencies.map((comp) => {
                const isSelected = !!comp.isSelectedForPdp;
                const canSelectMore = selectedCompetenciesCount < 5 || isSelected;

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      if (canSelectMore) toggleCompetencySelection(comp.id);
                    }}
                    className={`p-3 rounded-xl border transition-all text-xs flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/80 border-[#153f5e] text-slate-900 font-semibold shadow-xs ring-1 ring-[#153f5e]/20'
                        : canSelectMore
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#153f5e]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{comp.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Objectives for Selected 5 Competencies */}
        <div>
          <div className="text-xs font-bold text-[#153f5e] uppercase tracking-wide mb-2.5">
            Objectives:
          </div>

          {selectedCompetencies.length === 0 ? (
            <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200 text-center text-slate-500 text-xs italic">
              No competencies selected yet. Click on competencies above to choose 5 priority areas.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedCompetencies.map((comp, idx) => (
                <div
                  key={comp.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="sm:w-2/5 shrink-0 flex items-center gap-2.5 text-xs font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-md bg-[#153f5e] text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{comp.name}</span>
                  </div>

                  <div className="flex-1 w-full">
                    {isManagerEvaluating ? (
                      <textarea
                        rows={2}
                        value={comp.managerObjective || ''}
                        onChange={(e) => updateManagerObjective(comp.id, e.target.value)}
                        placeholder="Enter objective..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
                      />
                    ) : (
                      <div className="w-full p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
                        {comp.managerObjective || <span className="text-slate-400 italic">No objective entered.</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manager Submit Button */}
        {isManagerEvaluating && (
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <div className="text-xs">
              {isManagerEvalComplete ? null : selectedCompetenciesCount < 5 ? (
                <span className="text-amber-700 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Please select {5 - selectedCompetenciesCount} more {5 - selectedCompetenciesCount === 1 ? 'competency' : 'competencies'}.
                </span>
              ) : (
                <span className="text-amber-700 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Please enter objectives for all 5 selected competencies.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={submitManagerEvaluation}
              disabled={!isManagerEvalComplete}
              className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isManagerEvalComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>
        )}

        {/* HR Initiation Button */}
        {isHrReviewing && (
          <div className="pt-3 flex items-center justify-end border-t border-slate-200">
            <button
              type="button"
              onClick={() => initiatePdpByHr()}
              className="px-6 py-2 bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Initiate PDP</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
