import React from 'react';
import { usePdp } from '../context/PdpContext';
import { ProficiencyLevel, CompetencyItem } from '../types/pdp';
import {
  CheckCircle2,
  Award,
  Target,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { PdpCommentHistory } from './PdpCommentHistory';

const PROFICIENCY_OPTIONS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const getProficiencyBadgeStyle = (level?: ProficiencyLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-[#211E4E]/10 text-[#211E4E] border-[#211E4E]/40 font-bold shadow-2xs';
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
    employeeDevelopmentThoughts,
    updateEmployeeDevelopmentThoughts,
    updateEmployeeEvaluation,
    resetEmployeeEvaluationForm,
    updateManagerEvaluation,
    submitEmployeeEvaluation,
    toggleCompetencySelection,
    updateCompetencyPriority,
    updateManagerObjective,
    submitManagerEvaluation,
    returnToEmployee,
    returnToManager,
    initiatePdpByHr,
    selectedCompetenciesCount,
    isEmployeeEvalComplete,
    isManagerEvalComplete,
  } = usePdp();

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

  // Only show 14 Competencies Proficiency Evaluation during Employee Evaluation and Manager Review (NOT in HR Initiation as requested)
  const showEvaluationTable =
    status === 'PENDING_EMPLOYEE_EVALUATION' ||
    status === 'PENDING_MANAGER_REVIEW' ||
    status === 'NOT_STARTED';

  // Development Objectives shown during Manager Review and HR Initiation
  const showDevelopmentObjectives =
    showPriorityColumn &&
    (status === 'PENDING_MANAGER_REVIEW' || status === 'PENDING_HR_INITIATION');

  if (!showEvaluationTable && !showDevelopmentObjectives) return null;

  // Behavioural FIRST, Functional SECOND
  const behaviouralComps = competencies.filter((c) => c.category === 'Behavioural');
  const functionalComps = competencies.filter((c) => c.category === 'Functional');

  // Find priority list among selected (1 to 5) sorted by priorityRank
  const selectedList = competencies
    .filter((c) => c.isSelectedForPdp)
    .sort((a, b) => (a.priorityRank || 99) - (b.priorityRank || 99));

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
                  ? 'bg-[#211E4E]/10 text-[#211E4E]'
                  : 'bg-[#C8A977]/20 text-[#211E4E]'
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

          {/* Competency Name */}
          <td className={`py-2.5 px-3.5 border-r border-slate-200/80 ${showManagerColumn ? 'w-5/12' : 'w-1/2'}`}>
            <div className="font-semibold text-slate-900 text-xs leading-snug">
              {comp.name}
            </div>
          </td>

          {/* Ideal Proficiency */}
          <td className={`py-2 px-2 text-center border-r border-slate-200/80 align-middle ${showManagerColumn ? 'w-32' : 'w-36'}`}>
            <span
              className={`inline-block px-2.5 py-0.5 rounded text-[11px] border font-semibold ${getProficiencyBadgeStyle(
                comp.idealProficiency
              )}`}
            >
              {comp.idealProficiency}
            </span>
          </td>

          {/* Employee Evaluation */}
          <td className={`py-2 px-2 text-center border-r border-slate-200/80 align-middle ${showManagerColumn ? 'w-36' : 'w-44'}`}>
            {isEmployeeEditing ? (
              <select
                value={comp.employeeEvaluation || ''}
                onChange={(e) =>
                  updateEmployeeEvaluation(comp.id, e.target.value as ProficiencyLevel)
                }
                className={`w-full max-w-[160px] mx-auto text-xs font-semibold py-1 px-2 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  comp.employeeEvaluation
                    ? 'bg-white text-slate-900 border-[#211E4E]'
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
                className={`inline-block px-2.5 py-0.5 rounded text-[11px] border font-semibold ${
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
                  className={`w-full max-w-[160px] mx-auto text-xs font-semibold py-1 px-2 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    comp.managerEvaluation
                      ? 'bg-white text-slate-900 border-[#211E4E]'
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
                  className={`inline-block px-2.5 py-0.5 rounded text-[11px] border font-semibold ${
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

          {/* Priority Column: Priority selection (1, 2, 3, 4, 5) - Selected priority cannot be re-selected in other competencies */}
          {showPriorityColumn && (
            <td className="py-1.5 px-2 text-center align-middle w-28">
              {isManagerEditing ? (() => {
                const takenByOthers = new Set(
                  competencies
                    .filter((c) => c.id !== comp.id && typeof c.priorityRank === 'number' && c.priorityRank >= 1 && c.priorityRank <= 5)
                    .map((c) => c.priorityRank as number)
                );
                const availablePriorities = [1, 2, 3, 4, 5].filter((rank) => !takenByOthers.has(rank));

                return (
                  <div className="flex items-center justify-center">
                    <select
                      value={comp.priorityRank || ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                        updateCompetencyPriority(comp.id, val);
                      }}
                      className={`w-full text-xs font-bold py-1 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                        comp.priorityRank
                          ? 'bg-[#211E4E] text-[#C8A977] border-[#C8A977] shadow-xs ring-1 ring-[#C8A977]/30'
                          : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                      }`}
                      title={
                        availablePriorities.length === 0 && !comp.priorityRank
                          ? 'All 5 priorities are already assigned to other competencies'
                          : 'Select Priority (1 to 5)'
                      }
                    >
                      <option value="" className="bg-white text-slate-700 font-normal">--</option>
                      {availablePriorities.map((rank) => (
                        <option key={rank} value={rank} className="bg-white text-slate-900 font-bold">
                          Priority {rank}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })() : comp.priorityRank ? (
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-xs bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/40 shadow-2xs whitespace-nowrap">
                    Priority {comp.priorityRank}
                  </span>
                </div>
              ) : isSelected ? (
                <div className="flex items-center justify-center">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-xs bg-[#211E4E] text-[#C8A977] border border-[#C8A977]/40 shadow-2xs whitespace-nowrap">
                    Priority
                  </span>
                </div>
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
      {/* 1. Upside Evaluation Table (Only during Employee Evaluation, Manager Review, Not Started) */}
      {showEvaluationTable && (
        <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
          {/* Section Header Banner */}
          <div className="bg-[#211E4E] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C8A977]" />
              <span>Competency Proficiency Evaluation</span>
            </div>

            {/* Priority Selection Counter - Only shown in this one place as requested */}
            {showPriorityColumn && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-colors shadow-xs ${
                    selectedCompetenciesCount === 5
                      ? 'bg-[#C8A977] text-[#211E4E] font-bold'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {selectedCompetenciesCount} / 5 Priorities Selected
                </span>
              </div>
            )}
          </div>

          {/* Evaluation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#211E4E] text-[#E6D5B8] border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-1 text-center w-9 border-r border-slate-700/60">Type</th>
                  <th className="py-2.5 px-1 text-center w-8 border-r border-slate-700/60">#</th>
                  <th className="py-2.5 px-3.5 border-r border-slate-700/60">
                    Competency
                  </th>
                  <th className={`py-2.5 px-2 text-center border-r border-slate-700/60 ${showManagerColumn ? 'w-32' : 'w-36'}`}>
                    Ideal Proficiency
                  </th>
                  <th className={`py-2.5 px-2 text-center border-r border-slate-700/60 ${showManagerColumn ? 'w-36' : 'w-44'}`}>
                    Employee Evaluation
                  </th>
                  {showManagerColumn && (
                    <th className="py-2.5 px-2 text-center w-36 border-r border-slate-700/60">
                      Manager Evaluation
                    </th>
                  )}
                  {showPriorityColumn && (
                    <th className="py-2.5 px-2 text-center w-28">Priority</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70">
                {renderTableGroup(behaviouralComps, 0, 'Behavioural', true)}
                {renderTableGroup(functionalComps, 7, 'Functional', false)}
              </tbody>
            </table>
          </div>

        </section>
      )}

      {/* 2. Employee Evaluation: Comment History & Submit Footer */}
      {(status === 'PENDING_EMPLOYEE_EVALUATION' || status === 'NOT_STARTED') && (
        <div className="space-y-4">
          <PdpCommentHistory />

          {/* Employee Action Bar with Reset Form & Submit Button */}
          {isEmployeeEditing && (
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {!isEmployeeEvalComplete ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Please evaluate all 14 competencies in the table above before submitting.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    All 14 competencies evaluated. Ready to submit self-evaluation and development thoughts.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={resetEmployeeEvaluationForm}
                  className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset Form</span>
                </button>

                <button
                  type="button"
                  onClick={submitEmployeeEvaluation}
                  disabled={!isEmployeeEvalComplete}
                  className={`px-8 py-2.5 font-bold text-xs rounded-lg transition-all shadow-xs ${
                    isEmployeeEvalComplete
                      ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Development Objectives Section (Shown during Manager Review & HR Initiation) */}
      {showDevelopmentObjectives && (
        <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="bg-[#211E4E] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C8A977]" />
            <span>Development Objectives</span>
          </div>

          <div className="p-4 sm:p-5">
            {selectedList.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs italic">
                No priority competencies selected yet. Choose Priority 1 through 5 in the Priority column above to configure development objectives.
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedList.map((comp, idx) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-start gap-3"
                  >
                    {/* Left: Competency Name & Category with Priority Rank */}
                    <div className="md:w-5/12 shrink-0">
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-[#211E4E] text-[#C8A977] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs border border-[#C8A977]/30 whitespace-nowrap">
                          Priority {comp.priorityRank || idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-snug">
                            {comp.name}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              comp.category === 'Behavioural'
                                ? 'bg-[#211E4E]/10 text-[#211E4E] border border-[#211E4E]/30'
                                : 'bg-[#C8A977]/25 text-[#211E4E] border border-[#C8A977]'
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
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#211E4E] focus:border-[#211E4E] shadow-2xs transition-all leading-relaxed"
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
        </section>
      )}

      {/* 4. Manager Review & HR Initiation: Comment History BELOW Development Objectives */}
      {(status === 'PENDING_MANAGER_REVIEW' || status === 'PENDING_HR_INITIATION') && (
        <div className="space-y-4">
          <PdpCommentHistory />

          {/* Manager Action Footer with Return and Submit */}
          {isManagerEditing && (
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs">
                {selectedCompetenciesCount < 5 ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Please assign Priority 1 through 5 in the Priority column above ({selectedCompetenciesCount} of 5 selected).
                  </span>
                ) : !isManagerEvalComplete ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Please define developmental objectives for all 5 selected priorities.
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All 5 priorities selected with objectives. Ready to submit to HR.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => returnToEmployee('Manager returned PDP for self-evaluation revision.')}
                  className="px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Return</span>
                </button>

                <button
                  type="button"
                  onClick={submitManagerEvaluation}
                  disabled={!isManagerEvalComplete}
                  className={`px-7 py-2.5 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                    isManagerEvalComplete
                      ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white shadow-xs'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* HR Review & Initiation Footer with Return to Employee, Return to Manager, and Initiate PDP */}
          {isHrInitiating && (
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs flex items-center justify-end gap-3">
              <div className="flex items-center gap-2.5 flex-wrap justify-end">
                <button
                  type="button"
                  onClick={() => returnToEmployee('HR requested employee revisions.')}
                  className="px-4 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Return to Employee</span>
                </button>

                <button
                  type="button"
                  onClick={() => returnToManager('HR requested manager revisions on development objectives.')}
                  className="px-4 py-2 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-[#211E4E] font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#211E4E]" />
                  <span>Return to Manager</span>
                </button>

                <button
                  type="button"
                  onClick={() => initiatePdpByHr()}
                  className="px-7 py-2.5 bg-[#211E4E] hover:bg-[#161435] text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  Initiate PDP
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
