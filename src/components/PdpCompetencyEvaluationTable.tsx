import React from 'react';
import { usePdp } from '../context/PdpContext';
import { ProficiencyLevel, CompetencyItem } from '../types/pdp';
import { CheckCircle2, Send, Award, Sparkles } from 'lucide-react';

const PROFICIENCY_OPTIONS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const getProficiencyBadgeStyle = (level?: ProficiencyLevel) => {
  switch (level) {
    case 'Expert':
      return 'bg-purple-50 text-purple-800 border-purple-300 font-bold shadow-xs';
    case 'Advanced':
      return 'bg-blue-50 text-blue-800 border-blue-300 font-bold shadow-xs';
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
    isEmployeeEvalComplete,
  } = usePdp();

  const isEmployeeEditing =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_EVALUATION';
  const isManagerEditing =
    currentRole === 'MANAGER' && status === 'PENDING_MANAGER_REVIEW';
  const showManagerColumn = status !== 'PENDING_EMPLOYEE_EVALUATION' && status !== 'NOT_STARTED';

  // Only show 14 Competencies Proficiency Evaluation during Employee Evaluation and Manager Review
  const showEvaluationTable =
    status === 'PENDING_EMPLOYEE_EVALUATION' ||
    status === 'PENDING_MANAGER_REVIEW' ||
    status === 'NOT_STARTED';

  if (!showEvaluationTable) return null;

  const functionalComps = competencies.filter((c) => c.category === 'Functional');
  const behaviouralComps = competencies.filter((c) => c.category === 'Behavioural');

  const renderTableGroup = (items: CompetencyItem[], startIndex: number, categoryLabel: string, isFunctional: boolean) => {
    return items.map((comp, idx) => {
      const rowNum = startIndex + idx + 1;
      const isFirstInGroup = idx === 0;

      return (
        <tr
          key={comp.id}
          className={`text-xs transition-colors ${
            idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fbfd]'
          } hover:bg-sky-50/60`}
        >
          {/* Vertical Category Side Column */}
          {isFirstInGroup && (
            <td
              rowSpan={items.length}
              className={`p-1.5 font-bold text-center border-r border-slate-200 align-middle w-9 select-none ${
                isFunctional ? 'bg-[#edf5fa] text-[#153f5e]' : 'bg-[#f4f2f9] text-[#432874]'
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
            <td className="py-2 px-2 text-center align-middle w-36">
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
        </tr>
      );
    });
  };

  return (
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Section Header */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
        <Award className="w-3.5 h-3.5 text-sky-300" />
        <span>Competency Proficiency Evaluation</span>
      </div>

      {/* Table */}
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
                <th className="py-2.5 px-2 text-center w-36">Manager Evaluation</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70">
            {renderTableGroup(functionalComps, 0, 'Functional', true)}
            {renderTableGroup(behaviouralComps, 7, 'Behavioural', false)}
          </tbody>
        </table>
      </div>

      {/* Employee Submit Button Footer */}
      {isEmployeeEditing && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {isEmployeeEvalComplete && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All 14 competencies evaluated.
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
            <span>Submit</span>
          </button>
        </div>
      )}
    </section>
  );
};
