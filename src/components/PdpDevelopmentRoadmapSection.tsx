import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  Send,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { LNA_RECOMMENDED_COURSES } from '../data/mockData';

const PHASE_OPTIONS = [
  'Phase 1 (1 - 3 Months)',
  'Phase 2 (3 - 6 Months)',
  'Phase 3 (6 - 9 Months)',
  'Phase 4 (9 - 12 Months)',
  '1 Month',
  '2 Months',
  '3 Months',
  '4 Months',
  '6 Months',
  '9 Months',
  '12 Months',
  'Continuous / Ongoing',
];

const DEFAULT_PHASES = [
  'Phase 1 (1 - 3 Months)',
  'Phase 2 (3 - 6 Months)',
  'Phase 3 (6 - 9 Months)',
  'Phase 4 (9 - 12 Months)',
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
    updateRoadmapSubRow,
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
      {/* Centered Blue Header Bar - Official Template */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-sm tracking-wider uppercase text-center border-b border-[#0f2e46] flex items-center justify-center gap-2">
        <Layers className="w-4 h-4 text-sky-300" />
        <span>DEVELOPMENT ROADMAP</span>
      </div>

      {/* Development Roadmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1e4e73] text-white font-bold text-[11px] tracking-wide border-b border-[#0f2e46]">
              {/* Column 1: Competency */}
              <th className="py-2.5 px-3.5 w-48 min-w-[180px] border-r border-[#2d648f] text-center">
                Competency
              </th>

              {/* Column 2: Objectives */}
              <th className="py-2.5 px-3.5 min-w-[220px] border-r border-[#2d648f] text-center">
                Objectives
              </th>

              {/* Column 3: Development Activities / Projects */}
              <th className="py-2.5 px-3.5 min-w-[280px] border-r border-[#2d648f] text-center">
                Development Activities / Projects
              </th>

              {/* Column 4: Learning / Training Path */}
              <th className="py-2.5 px-3.5 min-w-[260px] border-r border-[#2d648f] text-center">
                Learning / Training Path
              </th>

              {/* Column 5: Phase (Months) - Fully visible with ample width */}
              <th className="py-2.5 px-3.5 w-52 min-w-[200px] border-r border-[#2d648f] text-center whitespace-nowrap">
                Phase (Months)
              </th>

              {/* Column 6: Status/Remarks */}
              <th className="py-2.5 px-3.5 w-40 min-w-[130px] text-center">
                Status/Remarks
              </th>
            </tr>
          </thead>

          <tbody>
            {roadmapItems.map((item, compIdx) => {
              // Ensure 4 sub-rows per competency
              const rows =
                item.rows && item.rows.length === 4
                  ? item.rows
                  : [
                      {
                        rowNumber: 1,
                        activity: item.developmentActivities || '',
                        trainingPath: item.learningTrainingPlan || 'Pending LNA Team',
                        phase: DEFAULT_PHASES[0],
                        statusRemarks: item.statusRemarks || 'Scheduled',
                      },
                      {
                        rowNumber: 2,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: DEFAULT_PHASES[1],
                        statusRemarks: 'Planned',
                      },
                      {
                        rowNumber: 3,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: DEFAULT_PHASES[2],
                        statusRemarks: 'Planned',
                      },
                      {
                        rowNumber: 4,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: DEFAULT_PHASES[3],
                        statusRemarks: 'Planned',
                      },
                    ];

              const coursesCatalog = LNA_RECOMMENDED_COURSES[item.competencyId] || [];

              return (
                <React.Fragment key={item.competencyId}>
                  {rows.map((row, rowIdx) => {
                    const isFirstRow = rowIdx === 0;
                    const isLastRow = rowIdx === rows.length - 1;
                    const rowBorderClass = isLastRow
                      ? 'border-b-2 border-[#153f5e]/40'
                      : 'border-b border-slate-200/80';

                    const rowBgClass =
                      compIdx % 2 === 0
                        ? rowIdx % 2 === 0
                          ? 'bg-white'
                          : 'bg-[#fafcfe]'
                        : rowIdx % 2 === 0
                        ? 'bg-slate-50/70'
                        : 'bg-[#f4f7f9]';

                    return (
                      <tr
                        key={`${item.competencyId}-row-${row.rowNumber}`}
                        className={`${rowBgClass} ${rowBorderClass} hover:bg-sky-50/40 transition-colors`}
                      >
                        {/* 1. Competency (Spans 4 Rows - NO code displayed) */}
                        {isFirstRow && (
                          <td
                            rowSpan={4}
                            className="py-3 px-3.5 border-r border-slate-300 align-top bg-inherit"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded bg-[#153f5e] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                {compIdx + 1}
                              </span>
                              <div className="space-y-1">
                                <div className="font-bold text-slate-900 text-xs leading-snug">
                                  {item.competencyName}
                                </div>
                                <span
                                  className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                    item.category === 'Behavioural'
                                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                                  }`}
                                >
                                  {item.category}
                                </span>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* 2. Objectives (Spans 4 Rows) */}
                        {isFirstRow && (
                          <td
                            rowSpan={4}
                            className="py-3 px-3 border-r border-slate-300 align-top bg-inherit"
                          >
                            {isManagerPlanning ? (
                              <textarea
                                rows={6}
                                value={item.objective || ''}
                                onChange={(e) =>
                                  updateRoadmapObjective(item.competencyId, e.target.value)
                                }
                                placeholder="Enter developmental objective for this competency..."
                                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-[#153f5e] transition-all leading-relaxed shadow-2xs"
                              />
                            ) : (
                              <div className="text-xs text-slate-800 leading-relaxed font-normal p-1">
                                {item.objective || (
                                  <span className="text-slate-400 italic">No objective recorded</span>
                                )}
                              </div>
                            )}
                          </td>
                        )}

                        {/* 3. Development Activities / Projects (Clean Excel row, NO number badges) */}
                        <td className="py-2 px-3 border-r border-slate-300 align-middle">
                          {isManagerPlanning ? (
                            <input
                              type="text"
                              value={row.activity || ''}
                              onChange={(e) =>
                                updateRoadmapSubRow(
                                  item.competencyId,
                                  row.rowNumber,
                                  'activity',
                                  e.target.value
                                )
                              }
                              placeholder="Specify on-the-job task, project assignment, or milestone..."
                              className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#153f5e] focus:border-[#153f5e] transition-all leading-normal"
                            />
                          ) : (
                            <div className="text-xs text-slate-800 leading-normal py-1 font-normal">
                              {row.activity ? (
                                <span>{row.activity}</span>
                              ) : (
                                <span className="text-slate-400 italic">
                                  Pending manager entry
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 4. Learning / Training Path (Clean Excel row, NO number badges) */}
                        <td className="py-2 px-3 border-r border-slate-300 align-middle">
                          <div className="space-y-1">
                            {isLnaEditing ? (
                              <>
                                <input
                                  type="text"
                                  value={
                                    row.trainingPath === 'Pending LNA Team'
                                      ? ''
                                      : row.trainingPath || ''
                                  }
                                  onChange={(e) =>
                                    updateRoadmapSubRow(
                                      item.competencyId,
                                      row.rowNumber,
                                      'trainingPath',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Assign formal course, certification, or workshop..."
                                  className="w-full text-xs py-1.5 px-2 bg-white border border-purple-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 transition-all leading-normal shadow-2xs"
                                />

                                {/* Suggestion Course Picker */}
                                {coursesCatalog.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      Suggest:
                                    </span>
                                    <select
                                      defaultValue=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          updateRoadmapSubRow(
                                            item.competencyId,
                                            row.rowNumber,
                                            'trainingPath',
                                            e.target.value
                                          );
                                        }
                                      }}
                                      className="text-[10px] py-0.5 px-1.5 bg-purple-50 border border-purple-200 text-purple-900 rounded cursor-pointer max-w-[240px] truncate"
                                    >
                                      <option value="" disabled>
                                        Pick Course from Catalog...
                                      </option>
                                      {coursesCatalog.map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-xs text-slate-800 leading-normal py-1 font-normal">
                                {row.trainingPath &&
                                row.trainingPath !== 'Pending LNA Team' ? (
                                  <span className="font-medium text-purple-950">
                                    {row.trainingPath}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">
                                    Pending LNA Team
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 5. Phase (Months) - Fully displayed, ample width */}
                        <td className="py-2 px-3 border-r border-slate-300 align-middle text-center whitespace-nowrap">
                          {isManagerPlanning ? (
                            <select
                              value={row.phase || DEFAULT_PHASES[rowIdx]}
                              onChange={(e) =>
                                updateRoadmapSubRow(
                                  item.competencyId,
                                  row.rowNumber,
                                  'phase',
                                  e.target.value
                                )
                              }
                              className="w-full text-xs py-1.5 px-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#153f5e] focus:border-[#153f5e] cursor-pointer shadow-2xs"
                            >
                              {PHASE_OPTIONS.map((ph) => (
                                <option key={ph} value={ph}>
                                  {ph}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="inline-block font-semibold text-xs text-[#153f5e] bg-sky-50 border border-sky-200 px-3 py-1 rounded whitespace-nowrap shadow-2xs">
                              {row.phase || DEFAULT_PHASES[rowIdx]}
                            </span>
                          )}
                        </td>

                        {/* 6. Status/Remarks */}
                        <td className="py-2 px-2.5 align-middle text-center">
                          {isManagerPlanning ? (
                            <input
                              type="text"
                              value={row.statusRemarks || ''}
                              onChange={(e) =>
                                updateRoadmapSubRow(
                                  item.competencyId,
                                  row.rowNumber,
                                  'statusRemarks',
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Scheduled"
                              className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#153f5e] text-center shadow-2xs"
                            />
                          ) : (
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                              {row.statusRemarks || 'Scheduled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
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
            {roadmapItems.length} Core priorities assigned • 4 development activity & training path rows per competency.
          </span>
        </div>

        {/* Manager Action: Submit Roadmap to LNA */}
        {isManagerPlanning && (
          <div className="flex items-center gap-2">
            {!isManagerRoadmapComplete && (
              <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Please specify development activities across the rows.
              </span>
            )}
            <button
              type="button"
              onClick={submitManagerRoadmap}
              disabled={!isManagerRoadmapComplete}
              className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isManagerRoadmapComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Roadmap to LNA</span>
            </button>
          </div>
        )}

        {/* LNA Team Action: Submit Training Curriculum */}
        {isLnaEditing && (
          <div className="flex items-center gap-2">
            {!isLnaPlanComplete && (
              <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Assign Learning & Training programs across competencies.
              </span>
            )}
            <button
              type="button"
              onClick={submitLnaPlan}
              disabled={!isLnaPlanComplete}
              className={`px-6 py-2 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                isLnaPlanComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Finalize & Submit Training Plan</span>
            </button>
          </div>
        )}

        {/* Employee Action: Acknowledge & Sign */}
        {isEmployeeSigning && (
          <button
            type="button"
            onClick={onOpenAcknowledgementModal}
            className="px-6 py-2.5 bg-[#153f5e] hover:bg-[#0f2e46] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>Acknowledge & Sign PDP</span>
          </button>
        )}

        {/* Active Stage Indicator */}
        {status === 'ACTIVE' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active & Operational PDP Cycle 2026</span>
          </div>
        )}
      </div>
    </section>
  );
};
