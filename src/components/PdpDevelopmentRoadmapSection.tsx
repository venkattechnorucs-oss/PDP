import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import { BookOpen, Send, UserCheck, CheckCircle2, AlertCircle, Plus, Compass } from 'lucide-react';
import { LNA_RECOMMENDED_COURSES } from '../data/mockData';

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

  const [activeCoursePickerCompId, setActiveCoursePickerCompId] = useState<string | null>(null);

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
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Section Header */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-sky-300" />
          <span>Development Roadmap</span>
        </div>
        <span className="text-[11px] text-sky-200 font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
          {roadmapItems.length} Priority Areas
        </span>
      </div>

      {/* 6-Column Roadmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#153f5e] text-white font-bold border-b border-[#0f2e46] text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3.5 w-44 border-r border-white/15">
                1. Competency
              </th>
              <th className="py-2.5 px-3.5 w-60 border-r border-white/15">
                2. Objectives
              </th>
              <th className="py-2.5 px-3.5 min-w-[200px] border-r border-white/15">
                3. Development Activities / Projects
              </th>
              <th className="py-2.5 px-3.5 min-w-[220px] border-r border-white/15">
                4. Learning / Training Plan
              </th>
              <th className="py-2.5 px-2 text-center w-28 border-r border-white/15">
                5. Phase (Months)
              </th>
              <th className="py-2.5 px-3.5 w-40">
                6. Status / Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70">
            {roadmapItems.map((item, idx) => {
              const recommendedCourses =
                LNA_RECOMMENDED_COURSES[item.competencyId] || [];

              return (
                <tr
                  key={item.competencyId}
                  className={`text-xs transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fbfd]'
                  } hover:bg-sky-50/50`}
                >
                  {/* 1. Competency */}
                  <td className="py-3 px-3.5 border-r border-slate-200/80 align-top">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#153f5e] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 leading-snug">
                        {item.competencyName}
                      </span>
                    </div>
                  </td>

                  {/* 2. Objectives (Editable by Manager) */}
                  <td className="py-3 px-3.5 border-r border-slate-200/80 align-top">
                    {isManagerPlanning ? (
                      <textarea
                        rows={3}
                        value={item.objective || ''}
                        onChange={(e) =>
                          updateRoadmapObjective(item.competencyId, e.target.value)
                        }
                        placeholder="Enter developmental objective..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-medium">
                        {item.objective || (
                          <span className="text-slate-400 italic font-normal">No objective recorded</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 3. Development Activities / Projects */}
                  <td className="py-3 px-3.5 border-r border-slate-200/80 align-top">
                    {isManagerPlanning ? (
                      <textarea
                        rows={3}
                        value={item.developmentActivities || ''}
                        onChange={(e) =>
                          updateRoadmapActivity(item.competencyId, e.target.value)
                        }
                        placeholder="Enter practical on-the-job activities, projects, or mentoring..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-medium">
                        {item.developmentActivities || (
                          <span className="text-slate-400 italic font-normal">Pending manager entry</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 4. Learning / Training Plan */}
                  <td className="py-3 px-3.5 border-r border-slate-200/80 align-top">
                    {isLnaEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={
                            item.learningTrainingPlan === 'Pending LNA Team'
                              ? ''
                              : item.learningTrainingPlan || ''
                          }
                          onChange={(e) =>
                            updateLnaTrainingPlan(item.competencyId, e.target.value)
                          }
                          placeholder="Enter training program or select below..."
                          className="w-full text-xs p-2.5 border border-sky-400 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all shadow-xs"
                        />

                        {recommendedCourses.length > 0 && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveCoursePickerCompId(
                                  activeCoursePickerCompId === item.competencyId
                                    ? null
                                    : item.competencyId
                                )
                              }
                              className="text-[11px] font-bold text-[#153f5e] hover:text-[#0f2e46] bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-md border border-sky-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                              <span>
                                {activeCoursePickerCompId === item.competencyId
                                  ? 'Close Catalog'
                                  : 'Select from Course Catalog'}
                              </span>
                            </button>

                            {activeCoursePickerCompId === item.competencyId && (
                              <div className="mt-1.5 p-2 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 space-y-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 py-0.5">
                                  Recommended Courses:
                                </div>
                                {recommendedCourses.map((crs, cIdx) => (
                                  <button
                                    key={cIdx}
                                    type="button"
                                    onClick={() => {
                                      updateLnaTrainingPlan(item.competencyId, crs);
                                      setActiveCoursePickerCompId(null);
                                    }}
                                    className="w-full text-left p-1.5 rounded-lg text-[11px] bg-slate-800 hover:bg-[#153f5e] border border-slate-700/60 text-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                                  >
                                    <span className="truncate pr-2">{crs}</span>
                                    <Plus className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="font-semibold text-slate-800 leading-relaxed">
                        {item.learningTrainingPlan || (
                          <span className="text-slate-400 italic font-normal">Pending LNA Team</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* 5. Phase (Months) */}
                  <td className="py-3 px-2 text-center border-r border-slate-200/80 align-top">
                    {isManagerPlanning ? (
                      <select
                        value={item.phaseMonths || '6 Months'}
                        onChange={(e) =>
                          updateRoadmapPhase(item.competencyId, e.target.value)
                        }
                        className="w-full text-xs font-semibold py-1.5 px-1 bg-white border border-slate-300 rounded-lg text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
                      >
                        {PHASE_OPTIONS.map((ph) => (
                          <option key={ph} value={ph}>
                            {ph}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.phaseMonths || '6 Months'}
                      </span>
                    )}
                  </td>

                  {/* 6. Status / Remarks */}
                  <td className="py-3 px-3.5 align-top">
                    {isManagerPlanning ? (
                      <input
                        type="text"
                        value={item.statusRemarks || ''}
                        onChange={(e) =>
                          updateRoadmapRemarks(item.competencyId, e.target.value)
                        }
                        placeholder="Planned / In Progress..."
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
                      />
                    ) : (
                      <span className="text-xs font-medium text-slate-700">
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

      {/* Stage Actions */}
      {isManagerPlanning && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {isManagerRoadmapComplete ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All 5 development activities and timelines defined.
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Enter development activities for all 5 competencies.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={submitManagerRoadmap}
            disabled={!isManagerRoadmapComplete}
            className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isManagerRoadmapComplete
                ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      )}

      {isLnaEditing && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {isLnaPlanComplete ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Training plans assigned for all 5 competencies.
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Assign learning interventions for each competency.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={submitLnaPlan}
            disabled={!isLnaPlanComplete}
            className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isLnaPlanComplete
                ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      )}

      {isEmployeeSigning && (
        <div className="p-3.5 bg-amber-50/90 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-amber-900 font-medium">
            Development plan is ready for your formal review and acknowledgement.
          </div>

          <button
            type="button"
            onClick={onOpenAcknowledgementModal}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Acknowledge PDP</span>
          </button>
        </div>
      )}
    </section>
  );
};
