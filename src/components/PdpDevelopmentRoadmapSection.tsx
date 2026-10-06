import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  AlertCircle,
  Layers,
} from 'lucide-react';
import { LNA_RECOMMENDED_COURSES } from '../data/mockData';
import { calculatePhaseDates } from '../utils/phaseDateUtils';

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
    <section className="border-2 border-[#153f5e] rounded-xl overflow-hidden bg-white shadow-xs w-full">
      {/* Centered Blue Header Bar */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-sm tracking-wider uppercase text-center border-b border-[#0f2e46] flex items-center justify-center gap-2">
        <Layers className="w-4 h-4 text-sky-300" />
        <span>DEVELOPMENT ROADMAP</span>
      </div>

      {/* Table Container - Fixed width table, completely fits screen without congestion or scroll */}
      <div className="w-full">
        <table className="w-full table-fixed text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#1e4e73] text-white font-bold text-[11px] tracking-wide border-b border-[#0f2e46]">
              {/* Column 1: Competency (14%) */}
              <th className="py-2.5 px-2.5 w-[14%] border-r border-[#2d648f] text-center">
                Competency
              </th>

              {/* Column 2: Objectives (16%) */}
              <th className="py-2.5 px-2.5 w-[16%] border-r border-[#2d648f] text-center">
                Objectives
              </th>

              {/* Column 3: Development Activities / Projects (24%) */}
              <th className="py-2.5 px-2.5 w-[24%] border-r border-[#2d648f] text-center">
                Development Activities / Projects
              </th>

              {/* Column 4: Learning / Training Path (20%) */}
              <th className="py-2.5 px-2.5 w-[20%] border-r border-[#2d648f] text-center">
                Learning / Training Path
              </th>

              {/* Column 5: Phase (18%) - Spacious, un-congested */}
              <th className="py-2.5 px-2.5 w-[18%] border-r border-[#2d648f] text-center">
                Phase
              </th>

              {/* Column 6: Status/Remarks (8%) */}
              <th className="py-2.5 px-1.5 w-[8%] text-center">
                Status/Remarks
              </th>
            </tr>
          </thead>

          <tbody>
            {roadmapItems.map((item, compIdx) => {
              // Ensure 4 sub-rows per competency with valid phase dates
              const rows =
                item.rows && item.rows.length === 4
                  ? item.rows
                  : [
                      {
                        rowNumber: 1,
                        activity: item.developmentActivities || '',
                        trainingPath: item.learningTrainingPlan || 'Pending LNA Team',
                        phase: '6 Months',
                        startDate: '01/Jul/2026',
                        endDate: '31/Dec/2026',
                        assignedDates: 'From: 01/Jul/2026 To: 31/Dec/2026',
                        statusRemarks: item.statusRemarks || 'Scheduled',
                      },
                      {
                        rowNumber: 2,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: '6 Months',
                        startDate: '01/Jan/2027',
                        endDate: '30/Jun/2027',
                        assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027',
                        statusRemarks: 'Planned',
                      },
                      {
                        rowNumber: 3,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: '1 Year',
                        startDate: '01/Jul/2026',
                        endDate: '30/Jun/2027',
                        assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027',
                        statusRemarks: 'Planned',
                      },
                      {
                        rowNumber: 4,
                        activity: '',
                        trainingPath: 'Pending LNA Team',
                        phase: '2 Years',
                        startDate: '01/Jul/2026',
                        endDate: '30/Jun/2028',
                        assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028',
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
                      : 'border-b border-slate-200';

                    const rowBgClass =
                      compIdx % 2 === 0
                        ? rowIdx % 2 === 0
                          ? 'bg-white'
                          : 'bg-[#fafcfe]'
                        : rowIdx % 2 === 0
                        ? 'bg-slate-50/70'
                        : 'bg-[#f4f7f9]';

                    // Calculate phase and assigned dates info
                    const dateInfo = calculatePhaseDates(
                      row.phase,
                      row.rowNumber,
                      row.startDate
                    );

                    return (
                      <tr
                        key={`${item.competencyId}-row-${row.rowNumber}`}
                        className={`${rowBgClass} ${rowBorderClass} hover:bg-sky-50/30 transition-colors`}
                      >
                        {/* 1. Competency (Spans 4 Rows - simple display without box) */}
                        {isFirstRow && (
                          <td
                            rowSpan={4}
                            className="py-2.5 px-2.5 border-r border-slate-300 align-top bg-inherit"
                          >
                            <div className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded bg-[#153f5e] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                {compIdx + 1}
                              </span>
                              <div className="space-y-1 min-w-0">
                                <div className="font-bold text-slate-900 text-xs leading-snug break-words">
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

                        {/* 2. Objectives (Spans 4 Rows - Simple text, NO Box, like Competency) */}
                        {isFirstRow && (
                          <td
                            rowSpan={4}
                            className="py-2.5 px-3 border-r border-slate-300 align-top bg-inherit"
                          >
                            <div className="text-xs text-slate-900 leading-relaxed font-normal break-words py-0.5">
                              {item.objective || (
                                <span className="text-slate-400 italic">No objective recorded</span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* 3. Development Activities / Projects (4 lines without gap, NO Box) */}
                        <td className="py-1.5 px-2.5 border-r border-slate-300 align-middle">
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
                              placeholder="Specify task, project, or milestone..."
                              className="w-full text-xs py-1 px-1 bg-transparent hover:bg-sky-50/50 focus:bg-white border-b border-transparent focus:border-[#153f5e] focus:outline-none text-slate-900 leading-normal"
                            />
                          ) : (
                            <div className="text-xs text-slate-800 leading-snug py-0.5 break-words font-normal">
                              {row.activity || (
                                <span className="text-slate-400 italic">—</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 4. Learning / Training Path (4 lines without gap, NO Box) */}
                        <td className="py-1.5 px-2.5 border-r border-slate-300 align-middle">
                          {isLnaEditing ? (
                            <div className="space-y-1">
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
                                placeholder="Course, certification, or workshop..."
                                className="w-full text-xs py-1 px-1.5 bg-white border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-600 text-slate-900 leading-normal"
                              />
                              {coursesCatalog.length > 0 && (
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
                                  className="text-[10px] py-0.5 px-1 bg-purple-50 border border-purple-200 text-purple-900 rounded cursor-pointer w-full truncate"
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
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-800 leading-snug py-0.5 break-words font-normal">
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
                        </td>

                        {/* 5. Phase (18% width, spacious and un-congested) */}
                        <td className="py-1.5 px-2 border-r border-slate-300 align-middle text-center">
                          {isManagerPlanning ? (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <select
                                value={dateInfo.duration}
                                onChange={(e) =>
                                  updateRoadmapSubRow(
                                    item.competencyId,
                                    row.rowNumber,
                                    'phase',
                                    e.target.value
                                  )
                                }
                                className="w-full text-xs py-1 px-2 bg-white border border-slate-300 rounded font-semibold text-[#153f5e] cursor-pointer text-center"
                              >
                                <option value="6 Months">6 Months</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                              </select>
                              <span className="text-[11px] font-semibold text-slate-700 font-mono">
                                {dateInfo.startDate} – {dateInfo.endDate}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 py-0.5 text-center flex-wrap">
                              <span className="inline-block font-bold text-xs text-[#153f5e] bg-sky-50 border border-sky-200 px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
                                {row.phase || dateInfo.duration}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-700 font-mono whitespace-nowrap">
                                {dateInfo.startDate} – {dateInfo.endDate}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 6. Status/Remarks (8% width, completely visible without scroll) */}
                        <td className="py-1 px-1.5 align-middle text-center">
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
                              placeholder="Status"
                              className="w-full text-[11px] py-1 px-1 bg-transparent hover:bg-sky-50/50 focus:bg-white border-b border-transparent focus:border-[#153f5e] focus:outline-none text-slate-800 text-center"
                            />
                          ) : (
                            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
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
      <div className="bg-slate-50 border-t border-slate-300 p-3.5 flex items-center justify-end gap-3">
        {/* Manager Action: Submit with no icon */}
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
              className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
                isManagerRoadmapComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              Submit
            </button>
          </div>
        )}

        {/* LNA Team Action: Submit with no icon */}
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
              className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
                isLnaPlanComplete
                  ? 'bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.99] text-white shadow-xs'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              Submit
            </button>
          </div>
        )}

        {/* Employee Action: Submit with no icon */}
        {isEmployeeSigning && (
          <button
            type="button"
            onClick={onOpenAcknowledgementModal}
            className="px-7 py-2.5 bg-[#153f5e] hover:bg-[#0f2e46] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
          >
            Submit
          </button>
        )}
      </div>
    </section>
  );
};
