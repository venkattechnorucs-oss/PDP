import React from 'react';
import { usePdp } from '../context/PdpContext';
import { ProficiencyLevel, CompetencyItem } from '../types/pdp';
import {
  CheckCircle2,
  Send,
  Award,
  Target,
  AlertCircle,
  ArrowRight,
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

          {/* Priority Column: Just a clean checkbox, no word 'select' */}
          {showPriorityColumn && (
            <td className="py-2 px-2 text-center align-middle w-20">
              {isManagerEditing ? (
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={!canSelectMore && !isSelected}
                    onChange={() => {
                      if (canSelectMore || isSelected) toggleCompetencySelection(comp.id);
                    }}
                    title={
                      isSelected
                        ? 'Priority Selected'
                        : canSelectMore
                        ? 'Select as Priority'
                        : 'Maximum 5 priorities selected'
                    }
                    className="w-4 h-4 text-[#153f5e] rounded border-slate-300 focus:ring-[#153f5e] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all accent-[#153f5e]"
                  />
                </div>
              ) : isSelected ? (
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-[#153f5e] rounded border-slate-300 cursor-default accent-[#153f5e]"
                  />
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
          <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-300" />
              <span>Competency Proficiency Evaluation</span>
            </div>

            {/* Priority Selection Counter - Only shown in this one place as requested */}
            {showPriorityColumn && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-colors shadow-xs ${
                    selectedCompetenciesCount === 5
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/20 text-white'
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
                  {/* Short column name: Priority */}
                  {showPriorityColumn && (
                    <th className="py-2.5 px-2 text-center w-20">Priority</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200/70">
                {renderTableGroup(behaviouralComps, 0, 'Behavioural', true)}
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
                className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  isEmployeeEvalComplete
                    ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. Downside Section: Development Objectives (Shown during Manager Review & HR Initiation) */}
      {showDevelopmentObjectives && (
        <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
          {/* Header Banner - Changed to simply Development Objectives */}
          <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-300" />
            <span>Development Objectives</span>
          </div>

          <div className="p-4 sm:p-5">
            {selectedList.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs italic">
                No competencies selected yet. Select 5 checkboxes in the Priority column above to configure development objectives.
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
                    Please check {5 - selectedCompetenciesCount} more {5 - selectedCompetenciesCount === 1 ? 'competency' : 'competencies'} in the Priority column above.
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
                className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer ${
                  isManagerEvalComplete
                    ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                Submit
              </button>
            </div>
          )}

          {/* HR Review & Initiation Footer */}
          {isHrInitiating && (
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => initiatePdpByHr()}
                className="px-6 py-2.5 bg-[#153f5e] hover:bg-[#0f2e46] text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
              >
                Initiate PDP
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
