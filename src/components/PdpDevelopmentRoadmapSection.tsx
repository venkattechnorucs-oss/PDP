import React from 'react';
import { usePdp } from '../context/PdpContext';
import {
  AlertCircle,
  Layers,
} from 'lucide-react';
import { calculatePhaseDates } from '../utils/phaseDateUtils';
import { DateRangeCalendarPicker } from './DateRangeCalendarPicker';
import { DevelopmentRoadmapItem, RoadmapSubRow } from '../types/pdp';

interface PdpDevelopmentRoadmapSectionProps {
  onOpenAcknowledgementModal: () => void;
}

const getFiveSubRows = (item: DevelopmentRoadmapItem): RoadmapSubRow[] => {
  const defaultTemplates = [
    { rowNumber: 1, phase: '6 Months', startDate: '01/Jul/2026', endDate: '31/Dec/2026', assignedDates: 'From: 01/Jul/2026 To: 31/Dec/2026', statusRemarks: item.statusRemarks || 'Scheduled' },
    { rowNumber: 2, phase: '6 Months', startDate: '01/Jan/2027', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027', statusRemarks: 'Planned' },
    { rowNumber: 3, phase: '1 Year', startDate: '01/Jul/2026', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027', statusRemarks: 'Planned' },
    { rowNumber: 4, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Planned' },
    { rowNumber: 5, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Planned' },
  ];

  const existing = item.rows || [];
  const result: RoadmapSubRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const found = existing.find((r) => r.rowNumber === i);
    const tmpl = defaultTemplates[i - 1];
    if (found) {
      result.push({
        ...tmpl,
        ...found,
        rowNumber: i,
        statusRemarks: found.statusRemarks || tmpl.statusRemarks,
      });
    } else {
      result.push({
        rowNumber: i,
        activity: i === 1 ? (item.developmentActivities || '') : '',
        trainingPath: i === 1 ? (item.learningTrainingPlan || 'Pending LNA Team') : 'Pending LNA Team',
        phase: tmpl.phase,
        startDate: tmpl.startDate,
        endDate: tmpl.endDate,
        assignedDates: tmpl.assignedDates,
        statusRemarks: tmpl.statusRemarks,
      });
    }
  }
  return result;
};

export const PdpDevelopmentRoadmapSection: React.FC<PdpDevelopmentRoadmapSectionProps> = ({
  onOpenAcknowledgementModal,
}) => {
  const {
    roadmapItems,
    currentRole,
    status,
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
    (currentRole === 'LNA_TEAM' && status === 'PENDING_LNA_TEAM') ||
    status === 'PENDING_LNA_TEAM';
  const isTrainingEditable = isLnaEditing || isManagerPlanning;
  const isEmployeeSigning =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';

  return (
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs w-full">
      {/* Table Section Header - Matches Employee Details */}
      <div className="bg-[#211E4E] text-white py-3 px-5 font-bold text-xs uppercase tracking-wider flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-[#C8A977]" />
          <span>Development Roadmap</span>
        </div>
      </div>

      {/* Table Container - Spacious, un-congested layout with clean alignment */}
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed text-left text-xs border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-[#1C1844] text-white font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              {/* Column 1: Competency (14%) - Sleek corporate presentation */}
              <th className="py-3 px-3.5 w-[14%] border-r border-slate-700/60 text-left">
                Competency
              </th>

              {/* Column 2: Objectives (16%) */}
              <th className="py-3 px-3.5 w-[16%] border-r border-slate-700/60 text-left">
                Objectives
              </th>

              {/* Column 3: Development Activities / Projects (29%) */}
              <th className="py-3 px-3.5 w-[29%] border-r border-slate-700/60 text-left">
                Development Activities / Projects
              </th>

              {/* Column 4: Learning / Training Path (22%) */}
              <th className="py-3 px-3.5 w-[22%] border-r border-slate-700/60 text-left">
                Learning / Training Path
              </th>

              {/* Column 5: Phase (11%) */}
              <th className="py-3 px-2 w-[11%] border-r border-slate-700/60 text-center">
                Phase
              </th>

              {/* Column 6: Status/Remarks (8%) */}
              <th className="py-3 px-2 w-[8%] text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {roadmapItems.map((item, compIdx) => {
              const rows = getFiveSubRows(item);

              return (
                <React.Fragment key={item.competencyId}>
                  {rows.map((row, rowIdx) => {
                    const isFirstRow = rowIdx === 0;
                    const isLastRow = rowIdx === rows.length - 1;
                    const rowBorderClass = isLastRow
                      ? 'border-b-2 border-slate-300'
                      : 'border-b border-slate-100';

                    const rowBgClass =
                      compIdx % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/40';

                    // Calculate phase and assigned dates info
                    const dateInfo = calculatePhaseDates(
                      row.phase,
                      row.rowNumber,
                      row.startDate
                    );

                    return (
                      <tr
                        key={`${item.competencyId}-row-${row.rowNumber}`}
                        className={`${rowBgClass} ${rowBorderClass} hover:bg-slate-50/70 transition-colors`}
                      >
                        {/* 1. Competency (Spans 5 Rows - Refined Executive Presentation) */}
                        {isFirstRow && (
                          <td
                            rowSpan={rows.length}
                            className="py-3 px-3.5 border-r border-slate-200/90 align-top bg-inherit"
                          >
                            <div className="space-y-1.5 sticky top-12 border-l-2 border-[#C8A977] pl-2.5 py-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-1.5 py-0.5 rounded bg-[#211E4E] text-[#C8A977] font-bold text-[10px] tracking-wide shadow-2xs whitespace-nowrap">
                                  Priority {item.priorityRank || compIdx + 1}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                  {item.category}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug break-words">
                                {item.competencyName}
                              </div>
                            </div>
                          </td>
                        )}

                        {/* 2. Objectives (Spans 5 Rows - Clean and readable) */}
                        {isFirstRow && (
                          <td
                            rowSpan={rows.length}
                            className="py-3 px-3.5 border-r border-slate-200/90 align-top bg-inherit"
                          >
                            <div className="text-xs text-slate-700 leading-relaxed font-normal break-words sticky top-12">
                              {item.objective ? (
                                <p className="text-slate-800">{item.objective}</p>
                              ) : (
                                <span className="text-slate-400 italic">No specific objective defined</span>
                              )}
                            </div>
                          </td>
                        )}

                        {/* 3. Development Activities / Projects (Tight, neat milestone rows) */}
                        <td className="py-2 px-3 border-r border-slate-200/90 align-top">
                          {isManagerPlanning ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                                Milestone {row.rowNumber}
                                {row.rowNumber <= 4 && (
                                  <span className="text-red-500 font-bold ml-0.5">*</span>
                                )}
                              </div>
                              <textarea
                                rows={2}
                                value={row.activity || ''}
                                onChange={(e) =>
                                  updateRoadmapSubRow(
                                    item.competencyId,
                                    row.rowNumber,
                                    'activity',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  row.rowNumber <= 4
                                    ? "Specify development activity, milestone or work project..."
                                    : "Additional development project or stretch goal..."
                                }
                                className="w-full text-xs p-2 rounded-md border border-slate-200 bg-white hover:border-slate-300 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-normal break-words resize-y min-h-[44px]"
                              />
                            </div>
                          ) : (
                            <div className="py-0.5">
                              <span className="font-semibold text-slate-700 text-[11px] mr-1.5 inline-block">
                                Milestone {row.rowNumber}{row.rowNumber <= 4 && <span className="text-red-500 font-bold ml-0.5">*</span>}:
                              </span>
                              <span className="text-xs text-slate-900 leading-normal break-words">
                                {row.activity ? (
                                  row.activity
                                ) : (
                                  <span className="text-slate-400 italic">
                                    {row.rowNumber === 5 ? 'Not specified' : '—'}
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 4. Learning / Training Path (Tight, neat training path rows) */}
                        <td className="py-2 px-3 border-r border-slate-200/90 align-top">
                          {isTrainingEditable ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                                Training Path {row.rowNumber}
                                {row.rowNumber <= 4 && (
                                  <span className="text-red-500 font-bold ml-0.5">*</span>
                                )}
                              </div>
                              <textarea
                                rows={2}
                                value={
                                  row.trainingPath && row.trainingPath !== 'Pending LNA Team'
                                    ? row.trainingPath
                                    : ''
                                }
                                onChange={(e) =>
                                  updateRoadmapSubRow(
                                    item.competencyId,
                                    row.rowNumber,
                                    'trainingPath',
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  row.rowNumber <= 4
                                    ? "Enter course, certification, workshop, or learning path..."
                                    : "Additional course, certification, or self-paced study..."
                                }
                                className="w-full text-xs p-2 rounded-md border border-slate-200 bg-white hover:border-slate-300 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-normal break-words resize-y min-h-[44px]"
                              />
                            </div>
                          ) : (
                            <div className="py-0.5">
                              <span className="font-semibold text-slate-700 text-[11px] mr-1.5 inline-block">
                                Training Path {row.rowNumber}{row.rowNumber <= 4 && <span className="text-red-500 font-bold ml-0.5">*</span>}:
                              </span>
                              <span className="text-xs text-slate-900 leading-normal break-words">
                                {row.trainingPath && row.trainingPath !== 'Pending LNA Team' ? (
                                  row.trainingPath
                                ) : (
                                  <span className="text-slate-400 italic">
                                    {row.rowNumber === 5 ? 'Self-paced / on-the-job' : 'Pending LNA Team'}
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 5. Phase (Single sleek interactive calendar picker or clean date display) */}
                        <td className="py-2 px-2 border-r border-slate-200/90 align-middle text-center">
                          {isManagerPlanning ? (
                            <div className="w-full">
                              <DateRangeCalendarPicker
                                startDate={row.startDate || dateInfo.startDate}
                                endDate={row.endDate || dateInfo.endDate}
                                rowNumber={row.rowNumber}
                                onSelectRange={(newStart, newEnd, durationLabel) => {
                                  updateRoadmapSubRow(item.competencyId, row.rowNumber, 'startDate', newStart);
                                  updateRoadmapSubRow(item.competencyId, row.rowNumber, 'endDate', newEnd);
                                  if (durationLabel) {
                                    updateRoadmapSubRow(item.competencyId, row.rowNumber, 'phase', durationLabel);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-center py-0.5">
                              <span className="font-bold text-xs text-[#211E4E] whitespace-nowrap leading-tight">
                                {row.phase || dateInfo.duration}
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-mono mt-0.5 whitespace-nowrap">
                                {row.startDate || dateInfo.startDate} – {row.endDate || dateInfo.endDate}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 6. Status/Remarks (Spacious text box in edit mode, clean pill in view mode) */}
                        <td className="py-2 px-2 align-middle text-center">
                          {isManagerPlanning ? (
                            <div>
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
                                className="w-full text-xs py-1.5 px-1.5 rounded-md border border-slate-200 bg-white text-center focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
                              />
                            </div>
                          ) : (
                            <div className="py-0.5 flex justify-center">
                              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">
                                {row.statusRemarks || 'Scheduled'}
                              </span>
                            </div>
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
      <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex items-center justify-end gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Manager Action: Submit with validation hint */}
          {isManagerPlanning && (
            <div className="flex items-center gap-2">
              {!isManagerRoadmapComplete && (
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Complete Development Activities for Milestones 1–4 (*) across all 5 competencies.
                </span>
              )}
              <button
                type="button"
                onClick={submitManagerRoadmap}
                disabled={!isManagerRoadmapComplete}
                className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
                  isManagerRoadmapComplete
                    ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white shadow-xs'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
                }`}
              >
                Submit
              </button>
            </div>
          )}

          {/* LNA Team Action: Submit with validation hint */}
          {isLnaEditing && (
            <div className="flex items-center gap-2">
              {!isLnaPlanComplete && (
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Assign Learning & Training programs for Training Paths 1–4 (*) across all 5 competencies.
                </span>
              )}
              <button
                type="button"
                onClick={submitLnaPlan}
                disabled={!isLnaPlanComplete}
                className={`px-7 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
                  isLnaPlanComplete
                    ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white shadow-xs'
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
              className="px-7 py-2.5 bg-[#211E4E] hover:bg-[#161435] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
