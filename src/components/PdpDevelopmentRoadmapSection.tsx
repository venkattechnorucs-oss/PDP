import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

const PHASE_OPTIONS = [
  '1 Month',
  '2 Months',
  '3 Months',
  '4 Months',
  '6 Months',
  '9 Months',
  '12 Months',
];

interface PdpDevelopmentRoadmapSectionProps {
  onOpenAcknowledgementModal: () => void;
}

export const PdpDevelopmentRoadmapSection: React.FC<PdpDevelopmentRoadmapSectionProps> = ({
  onOpenAcknowledgementModal,
}) => {
  const {
    roadmapItems,
    currentRole,
    status,
    updateRoadmapObjective,
    updateRoadmapActivity,
    updateRoadmapPhase,
    updateRoadmapRemarks,
    updateLnaTrainingPlan,
    submitManagerRoadmap,
    submitLnaPlan,
    isManagerRoadmapComplete,
    isLnaPlanComplete,
  } = usePdp();

  // HR should NOT see the Development Roadmap table
  if (currentRole === 'HR_ADMIN') return null;

  // During manager planning, only Manager role sees it
  if (status === 'PDP_PLANNING_MANAGER' && currentRole !== 'MANAGER') return null;

  const showRoadmap = [
    'PDP_PLANNING_MANAGER',
    'PENDING_LNA_TEAM',
    'PENDING_EMPLOYEE_ACKNOWLEDGEMENT',
    'ACTIVE',
  ].includes(status);

  if (!showRoadmap || roadmapItems.length === 0) return null;

  const isManagerPlanning =
    currentRole === 'MANAGER' && status === 'PDP_PLANNING_MANAGER';
  const isLnaEditing =
    currentRole === 'LNA_TEAM' && status === 'PENDING_LNA_TEAM';
  const isEmployeeSigning =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';

  return (
    <section className="border-2 border-[#153f5e] rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Centered Blue Header Bar - Exact Match to Official Template */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-sm tracking-wider uppercase text-center border-b border-[#0f2e46]">
        DEVELOPMENT ROADMAP
      </div>

      {/* Exact 6-Column Table Format */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1e4e73] text-white font-bold text-[11px] tracking-wide border-b border-[#0f2e46]">
              {/* Column 1: Competency */}
              <th className="py-2.5 px-3.5 w-44 border-r border-[#2d648f] text-center">
                Competency
              </th>

              {/* Column 2: Objectives */}
              <th className="py-2.5 px-3.5 min-w-[200px] border-r border-[#2d648f] text-center">
                Objectives
              </th>

              {/* Column 3: Development Activities / Projects */}
              <th className="py-2.5 px-3.5 min-w-[240px] border-r border-[#2d648f] text-center">
                Development Activities / Projects
              </th>

              {/* Column 4: Learning / Training Plan */}
              <th className="py-2.5 px-3.5 min-w-[220px] border-r border-[#2d648f] text-center">
                Learning / Training Plan
              </th>

              {/* Column 5: Phase (Months) */}
              <th className="py-2.5 px-3 w-32 border-r border-[#2d648f] text-center whitespace-nowrap">
                Phase<br />(Months)
              </th>

              {/* Column 6: Status/Remarks */}
              <th className="py-2.5 px-3.5 w-36 text-center">
                Status/Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {roadmapItems.map((item, idx) => {
              return (
                <tr
                  key={item.competencyId}
                  className={`transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                  } hover:bg-sky-50/30`}
                >
                  {/* 1. Competency */}
                  <td className="py-3 px-3.5 border-r border-slate-300 align-top">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-[#153f5e] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 leading-snug">
                        {item.competencyName}
                      </span>
                    </div>
                  </td>

                  {/* 2. Objectives */}
                  <td className="py-2.5 px-3 border-r border-slate-300 align-top">
                    {isManagerPlanning ? (
                      <textarea
                        rows={3}
                        value={item.objective || ''}
                        onChange={(e) =>
                          updateRoadmapObjective(item.competencyId, e.target.value)
                        }
                        placeholder="Enter developmental objective..."
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-[#153f5e] transition-all leading-relaxed"
                      />
                    ) : (
                      <div className="text-xs text-slate-800 leading-relaxed font-normal p-1">
                        {item.objective || (
                          <span className="text-slate-400 italic">No objective recorded</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 3. Development Activities / Projects */}
                  <td className="py-2.5 px-3 border-r border-slate-300 align-top">
                    {isManagerPlanning ? (
                      <textarea
                        rows={3}
                        value={item.developmentActivities || ''}
                        onChange={(e) =>
                          updateRoadmapActivity(item.competencyId, e.target.value)
                        }
                        placeholder="Specify on-the-job tasks, assignments, or rotation..."
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-[#153f5e] transition-all leading-relaxed"
                      />
                    ) : (
                      <div className="text-xs text-slate-800 leading-relaxed font-normal p-1">
                        {item.developmentActivities || (
                          <span className="text-slate-400 italic">Pending manager entry</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 4. Learning / Training Plan */}
                  <td className="py-2.5 px-3 border-r border-slate-300 align-top">
                    {isLnaEditing ? (
                      <textarea
                        rows={3}
                        value={
                          item.learningTrainingPlan === 'Pending LNA Team'
                            ? ''
                            : item.learningTrainingPlan || ''
                        }
                        onChange={(e) =>
                          updateLnaTrainingPlan(item.competencyId, e.target.value)
                        }
                        placeholder="Assign formal courses, certifications, workshops..."
                        className="w-full text-xs p-2 bg-white border border-purple-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-600 transition-all leading-relaxed"
                      />
                    ) : (
                      <div className="text-xs text-slate-800 leading-relaxed p-1">
                        {item.learningTrainingPlan && item.learningTrainingPlan !== 'Pending LNA Team' ? (
                          <span className="font-medium text-purple-900">
                            {item.learningTrainingPlan}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending LNA Team</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 5. Phase (Months) */}
                  <td className="py-2.5 px-2.5 border-r border-slate-300 align-top text-center">
                    {isManagerPlanning ? (
                      <select
                        value={item.phaseMonths || '6 Months'}
                        onChange={(e) =>
                          updateRoadmapPhase(item.competencyId, e.target.value)
                        }
                        className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-[#153f5e] cursor-pointer"
                      >
                        {PHASE_OPTIONS.map((ph) => (
                          <option key={ph} value={ph}>
                            {ph}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block font-medium text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                        {item.phaseMonths || '6 Months'}
                      </span>
                    )}
                  </td>

                  {/* 6. Status/Remarks */}
                  <td className="py-2.5 px-2.5 align-top text-center">
                    {isManagerPlanning ? (
                      <input
                        type="text"
                        value={item.statusRemarks || ''}
                        onChange={(e) =>
                          updateRoadmapRemarks(item.competencyId, e.target.value)
                        }
                        placeholder="e.g. Scheduled"
                        className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-[#153f5e]"
                      />
                    ) : (
                      <span className="inline-block text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.statusRemarks || 'Scheduled'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role Actions Footer Bar */}
      <div className="bg-slate-50 border-t border-slate-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {roadmapItems.length} Core priorities assigned to developmental roadmap.
          </span>
        </div>

        {/* Manager Action: Submit Roadmap to LNA */}
        {isManagerPlanning && (
          <div className="flex items-center gap-2">
            {!isManagerRoadmapComplete && (
              <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Please complete all objectives
              </span>
            )}
            <button
              type="button"
              disabled={!isManagerRoadmapComplete}
              onClick={submitManagerRoadmap}
              className="px-4 py-2 bg-[#153f5e] hover:bg-[#0f2e46] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Roadmap to LNA Team</span>
            </button>
          </div>
        )}

        {/* LNA Action: Submit Training Plan to Employee */}
        {isLnaEditing && (
          <div className="flex items-center gap-2">
            {!isLnaPlanComplete && (
              <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Assign all training plans
              </span>
            )}
            <button
              type="button"
              disabled={!isLnaPlanComplete}
              onClick={submitLnaPlan}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Submit LNA Plan to Employee</span>
            </button>
          </div>
        )}

        {/* Employee Action: Acknowledge & Sign */}
        {isEmployeeSigning && (
          <button
            type="button"
            onClick={onOpenAcknowledgementModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Acknowledge & Sign Development Roadmap</span>
          </button>
        )}
      </div>
    </section>
  );
};
