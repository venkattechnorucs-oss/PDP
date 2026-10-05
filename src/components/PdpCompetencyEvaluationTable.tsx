import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import { ProficiencyLevel, CompetencyItem } from '../types/pdp';
import {
  CheckCircle2,
  Send,
  Award,
  CheckSquare,
  Square,
  Target,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const PROFICIENCY_OPTIONS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const getProficiencyBadgeStyle = (level?: ProficiencyLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-purple-50 text-purple-800 border-purple-300 font-bold shadow-2xs';
    case 'Advanced':
      return 'bg-blue-50 text-blue-800 border-blue-300 font-bold shadow-2xs';
    case 'Intermediate':
      return 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
    case 'Beginner':
      return 'bg-slate-100 text-slate-700 border-slate-300 font-medium';
    default:
      return 'bg-slate-50 text-slate-400 border-slate-200 italic';
  }
};

export const PdpCompetencyEvaluationTable: React.FC = () => {
  const {
    competencies,
    currentRole,
    status,
    updateEmployeeEvaluation,
    updateManagerEvaluation,
    submitEmployeeEvaluation,
    toggleCompetencySelection,
    updateManagerObjective,
    submitManagerEvaluation,
    initiatePdpByHr,
    selectedCompetenciesCount,
    isEmployeeEvalComplete,
    isManagerEvalComplete,
  } = usePdp();

  const [hrRemarks, setHrRemarks] = useState('');

  const isEmployeeEditing =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_EVALUATION';
  const isManagerEditing =
    currentRole === 'MANAGER' && status === 'PENDING_MANAGER_REVIEW';
  const isHrInitiating =
    currentRole === 'HR_ADMIN' && status === 'PENDING_HR_INITIATION';

  const showManagerColumn =
    status !== 'PENDING_EMPLOYEE_EVALUATION' && status !== 'NOT_STARTED';

  const showPriorityColumn =
    status !== 'PENDING_EMPLOYEE_EVALUATION' && status !== 'NOT_STARTED';

  // Only show 14 Competencies Proficiency Evaluation during Employee Evaluation, Manager Review, and HR Initiation
  const showEvaluationTable =
    status === 'PENDING_EMPLOYEE_EVALUATION' ||
    status === 'PENDING_MANAGER_REVIEW' ||
    status === 'PENDING_HR_INITIATION' ||
    status === 'NOT_STARTED';

  if (!showEvaluationTable) return null;

  // Behavioural FIRST, Functional SECOND
  const behaviouralComps = competencies.filter((c) => c.category === 'Behavioural');
  const functionalComps = competencies.filter((c) => c.category === 'Functional');

  // Find priority list among selected (1 to 5)
  const selectedList = competencies.filter((c) => c.isSelectedForPdp);

  const renderTableGroup = (
    items: CompetencyItem[],
    startIndex: number,
    categoryLabel: string,
    isBehavioural: boolean
  ) => {
    return items.map((comp, idx) => {
      const rowNum = startIndex + idx + 1;
      const isFirstInGroup = idx === 0;
      const isSelected = !!comp.isSelectedForPdp;
      const priorityIndex = selectedList.findIndex((c) => c.id === comp.id);
      const canSelectMore = selectedCompetenciesCount < 5 || isSelected;

      return (
        <tr
          key={comp.id}
          className={`text-xs transition-colors ${
            isSelected
              ? 'bg-sky-50/70 hover:bg-sky-100/50'
              : idx % 2 === 0
              ? 'bg-white'
              : 'bg-[#f9fbfd]'
          } hover:bg-sky-50/40`}
        >
          {/* Vertical Category Side Column */}
          {isFirstInGroup && (
            <td
              rowSpan={items.length}
              className={`p-1.5 font-bold text-center border-r border-slate-200 align-middle w-9 select-none ${
                isBehavioural
                  ? 'bg-[#f4f2f9] text-[#432874]'
                  : 'bg-[#edf5fa] text-[#153f5e]'
              }`}
            >
              <div className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-widest text-[10px] font-bold mx-auto whitespace-nowrap">
                {categoryLabel}
              </div>
            </td>
          )}

          {/* Row Number */}
          <td className="py-2.5 px-2 text-center font-mono text-[11px] font-semibold text-slate-500 border-r border-slate-200/80 w-8">
            {rowNum}
          </td>

          {/* Competency Name (NO code) */}
          <td className="py-2.5 px-3.5 border-r border-slate-200/80">
            <div className="font-semibold text-slate-900 text-xs leading-snug">
              {comp.name}
            </div>
          </td>

          {/* Ideal Proficiency */}
          <td className="py-2.5 px-2 text-center border-r border-slate-200/80 align-middle w-32">
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-[11px] border ${getProficiencyBadgeStyle(
                comp.idealProficiency
              )}`}
            >
              {comp.idealProficiency}
            </span>
          </td>

          {/* Employee Evaluation */}
          <td className="py-2 px-2 text-center border-r border-slate-200/80 align-middle w-36">
            {isEmployeeEditing ? (
              <select
                value={comp.employeeEvaluation || ''}
                onChange={(e) =>
                  updateEmployeeEvaluation(comp.id, e.target.value as ProficiencyLevel)
                }
                className={`w-full text-xs font-semibold py-1 px-2 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  comp.employeeEvaluation
                    ? 'bg-white text-slate-900 border-[#153f5e]'
                    : 'bg-amber-50/80 text-amber-900 border-amber-300'
                }`}
              >
                <option value="" disabled>
                  Select Rating
                </option>
                {PROFICIENCY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[11px] border ${
                  comp.employeeEvaluation
                    ? getProficiencyBadgeStyle(comp.employeeEvaluation)
                    : 'bg-slate-50 text-slate-400 border-slate-200 italic'
                }`}
              >
                {comp.employeeEvaluation || 'Pending'}
              </span>
            )}
          </td>

          {/* Manager Evaluation */}
          {showManagerColumn && (
            <td className="py-2 px-2 text-center border-r border-slate-200/80 align-middle w-36">
              {isManagerEditing ? (
                <select
                  value={comp.managerEvaluation || ''}
                  onChange={(e) =>
                    updateManagerEvaluation(comp.id, e.target.value as ProficiencyLevel)
                  }
                  className={`w-full text-xs font-semibold py-1 px-2 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    comp.managerEvaluation
                      ? 'bg-white text-slate-900 border-[#153f5e]'
                      : 'bg-sky-50/80 text-sky-900 border-sky-300'
                  }`}
                >
                  <option value="" disabled>
                    Select Rating
                  </option>
                  {PROFICIENCY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] border ${
                    comp.managerEvaluation
                      ? getProficiencyBadgeStyle(comp.managerEvaluation)
                      : 'bg-slate-50 text-slate-400 border-slate-200 italic'
                  }`}
                >
                  {comp.managerEvaluation || 'Pending'}
                </span>
              )}
            </td>
          )}

          {/* Upside Priority Selection Column (Objective is NOT shown here) */}
          {showPriorityColumn && (
            <td className="py-2 px-2 text-center align-middle w-36">
              {isManagerEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    if (canSelectMore) toggleCompetencySelection(comp.id);
                  }}
                  disabled={!canSelectMore && !isSelected}
                  title={
                    isSelected
                      ? 'Click to remove priority'
                      : canSelectMore
                      ? 'Click to select as one of 5 priorities'
                      : 'Maximum 5 priorities selected'
                  }
                  className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#153f5e] hover:bg-[#0f2e46] text-white shadow-xs'
                      : canSelectMore
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 hover:border-slate-400'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-sky-300" />
                      <span>Priority #{priorityIndex + 1}</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      <span>Select</span>
                    </>
                  )}
                </button>
              ) : isSelected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#153f5e] text-white shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                  <span>Priority #{priorityIndex + 1}</span>
                </span>
              ) : (
                <span className="text-slate-300 font-mono text-xs">—</span>
              )}
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Upside Evaluation Table */}
      <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
        {/* Section Header Banner */}
        <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-sky-300" />
            <span>Competency Proficiency Evaluation</span>
          </div>

          {/* Priority Selection Counter (Manager Review & HR Initiation) */}
          {showPriorityColumn && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-sky-200 font-medium">Priorities:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  selectedCompetenciesCount === 5
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 shadow-xs'
                    : 'bg-white/15 text-white border border-white/20'
                }`}
              >
                {selectedCompetenciesCount} / 5 Selected
              </span>
            </div>
          )}
        </div>

        {/* Evaluation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f0f6fa] text-[#153f5e] border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-1 text-center w-9 border-r border-slate-200">Type</th>
                <th className="py-2.5 px-1 text-center w-8 border-r border-slate-200">#</th>
                <th className="py-2.5 px-3.5 border-r border-slate-200">Competency</th>
                <th className="py-2.5 px-2 text-center w-32 border-r border-slate-200">
                  Ideal Proficiency
                </th>
                <th className="py-2.5 px-2 text-center w-36 border-r border-slate-200">
                  Employee Evaluation
                </th>
                {showManagerColumn && (
                  <th className="py-2.5 px-2 text-center w-36 border-r border-slate-200">
                    Manager Evaluation
                  </th>
                )}
                {showPriorityColumn && (
                  <th className="py-2.5 px-2 text-center w-36">Priority (Select 5)</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70">
              {/* Behavioural FIRST (rows 1-7) */}
              {renderTableGroup(behaviouralComps, 0, 'Behavioural', true)}
              {/* Functional SECOND (rows 8-14) */}
              {renderTableGroup(functionalComps, 7, 'Functional', false)}
            </tbody>
          </table>
        </div>

        {/* Employee Submit Button (Only in Employee Evaluation Stage) */}
        {isEmployeeEditing && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              {isEmployeeEvalComplete ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All 14 competencies evaluated.
                </span>
              ) : (
                <span className="text-amber-700 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Please select proficiency rating for all 14 competencies.
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={submitEmployeeEvaluation}
              disabled={!isEmployeeEvalComplete}
              className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                isEmployeeEvalComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Evaluation</span>
            </button>
          </div>
        )}
      </section>

      {/* 2. Downside Section: Objectives For the 5 Selected Competencies (Shown during Manager Review & HR Initiation) */}
      {showPriorityColumn && (
        <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
          {/* Header Banner */}
          <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-300" />
              <span>Development Objectives (5 Selected Priorities)</span>
            </div>
            <span className="text-xs text-sky-200 font-medium">
              {selectedCompetenciesCount} / 5 Configured
            </span>
          </div>

          <div className="p-4 sm:p-5">
            {selectedList.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs italic">
                No competencies selected yet. Click &quot;Select&quot; in the Priority column above to choose 5 priority development areas.
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedList.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-start gap-3"
                  >
                    {/* Left: Competency Name & Category (NO code) */}
                    <div className="md:w-5/12 shrink-0">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#153f5e] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-snug">
                            {comp.name}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              comp.category === 'Behavioural'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-sky-50 text-sky-700 border border-sky-200'
                            }`}
                          >
                            {comp.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Objective Input / View */}
                    <div className="flex-1 w-full">
                      {isManagerEditing ? (
                        <textarea
                          rows={2}
                          value={comp.managerObjective || ''}
                          onChange={(e) => updateManagerObjective(comp.id, e.target.value)}
                          placeholder={`Enter developmental objective for ${comp.name}...`}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#153f5e] focus:border-[#153f5e] shadow-2xs transition-all leading-relaxed"
                        />
                      ) : (
                        <div className="text-xs text-slate-800 p-2.5 bg-white border border-slate-200 rounded-lg leading-relaxed font-normal">
                          {comp.managerObjective || (
                            <span className="text-slate-400 italic">No objective entered.</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manager Submit Action Footer */}
          {isManagerEditing && (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                {selectedCompetenciesCount < 5 ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Please select {5 - selectedCompetenciesCount} more {5 - selectedCompetenciesCount === 1 ? 'competency' : 'competencies'} in the table above.
                  </span>
                ) : !isManagerEvalComplete ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Please define developmental objectives for all 5 selected competencies.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All 5 priorities selected with objectives. Ready to submit to HR.
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
                <span>Submit Review to HR</span>
              </button>
            </div>
          )}

          {/* HR Review & Initiation Footer */}
          {isHrInitiating && (
            <div className="p-3.5 bg-sky-50/70 border-t border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#153f5e]">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <span>HR Initiation Required</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Review the 5 developmental objectives defined by the manager. Click Initiate PDP to begin detailed 4-row development roadmap planning.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={hrRemarks}
                  onChange={(e) => setHrRemarks(e.target.value)}
                  placeholder="Optional HR note..."
                  className="text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#153f5e] flex-1 sm:w-48"
                />
                <button
                  type="button"
                  onClick={() => initiatePdpByHr(hrRemarks)}
                  className="px-5 py-2 bg-[#153f5e] hover:bg-[#0f2e46] text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
                >
                  <span>Initiate PDP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
