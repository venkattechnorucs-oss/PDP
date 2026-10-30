import React, { useState } from 'react';
import { usePdp } from '../context/PdpContext';
import {
  AlertCircle,
  Calendar,
  Layers,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { calculatePhaseDates } from '../utils/phaseDateUtils';
import { DateRangeCalendarPicker } from './DateRangeCalendarPicker';
import { EditableActivityCombobox } from './EditableActivityCombobox';
import { EditableTrainingPathCombobox } from './EditableTrainingPathCombobox';
import { LnaCompetencyProcessView } from './LnaCompetencyProcessView';
import { PdpCommentHistory } from './PdpCommentHistory';
import { PdpCommentModal } from './PdpCommentModal';
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
    returnToManager,
    returnToLnt,
    isManagerRoadmapComplete,
    isLnaPlanComplete,
  } = usePdp();

  const [commentModalData, setCommentModalData] = useState<{
    item: DevelopmentRoadmapItem;
    row: RoadmapSubRow;
  } | null>(null);

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
  // Learning / Training Path column is only needed in LNA Training Plan and subsequent pages (not in Manager Roadmap)
  const showTrainingColumn = status !== 'PDP_PLANNING_MANAGER';
  const isLnaEditing =
    (currentRole === 'LNA_TEAM' && status === 'PENDING_LNA_TEAM') ||
    status === 'PENDING_LNA_TEAM';
  const isTrainingEditable = isLnaEditing;
  const isEmployeeSigning =
    currentRole === 'EMPLOYEE' && status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';

  // Dedicated interactive stepper process view for Manager Roadmap
  if (isManagerPlanning) {
    return (
      <LnaCompetencyProcessView
        mode="MANAGER"
        roadmapItems={roadmapItems}
        updateRoadmapSubRow={updateRoadmapSubRow}
        submitRoadmap={submitManagerRoadmap}
        isComplete={isManagerRoadmapComplete}
      />
    );
  }

  // Dedicated interactive stepper process view for LNA Training Plan
  if (isLnaEditing) {
    return (
      <LnaCompetencyProcessView
        mode="LNA"
        roadmapItems={roadmapItems}
        updateRoadmapSubRow={updateRoadmapSubRow}
        submitRoadmap={submitLnaPlan}
        onReturnToManager={() => returnToManager('LNA Team returned PDP to Manager for adjustments')}
        isComplete={isLnaPlanComplete}
      />
    );
  }

  // Dedicated interactive stepper process view for Employee Sign-off
  if (isEmployeeSigning) {
    return (
      <LnaCompetencyProcessView
        mode="EMPLOYEE_SIGNOFF"
        roadmapItems={roadmapItems}
        updateRoadmapSubRow={updateRoadmapSubRow}
        onReturnToManager={() => returnToManager('Employee returned PDP for manager adjustments')}
        onReturnToLnt={() => returnToLnt('Employee returned PDP for LNT learning path adjustments')}
        onOpenAcknowledgementModal={onOpenAcknowledgementModal}
        isComplete={true}
      />
    );
  }

  // Dedicated interactive stepper process view for Active PDP
  if (status === 'ACTIVE') {
    return (
      <LnaCompetencyProcessView
        mode="ACTIVE_PDP"
        roadmapItems={roadmapItems}
        updateRoadmapSubRow={updateRoadmapSubRow}
        isComplete={true}
      />
    );
  }

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
            <tr className="bg-[#211E4E] text-white font-bold text-[11px] uppercase tracking-wider border-b border-slate-200">
              {/* Column 1: Competency */}
              <th className={`py-3 px-3.5 ${showTrainingColumn ? 'w-[14%]' : 'w-[18%]'} border-r border-slate-700/60 text-left`}>
                Competency
              </th>

              {/* Column 2: Objectives */}
              <th className={`py-3 px-3.5 ${showTrainingColumn ? 'w-[16%]' : 'w-[22%]'} border-r border-slate-700/60 text-left`}>
                Objectives
              </th>

              {/* Column 3: Development Activities / Projects */}
              <th className={`py-3 px-3.5 ${showTrainingColumn ? 'w-[29%]' : 'w-[38%]'} border-r border-slate-700/60 text-left`}>
                Development Activities / Projects
              </th>

              {/* Column 4: Learning / Training Path (Shown only when not on Manager Roadmap) */}
              {showTrainingColumn && (
                <th className="py-3 px-3.5 w-[22%] border-r border-slate-700/60 text-left">
                  Learning / Training Path
                </th>
              )}

              {/* Column 5: Phase */}
              <th className={`py-3 px-2 ${showTrainingColumn ? 'w-[10%]' : 'w-[12%]'} border-r border-slate-700/60 text-center`}>
                Phase
              </th>

              {/* Column 6: Status/Remarks */}
              <th className={`py-3 px-2 ${showTrainingColumn ? 'w-[8%]' : 'w-[10%]'} border-r border-slate-700/60 text-center`}>
                Status
              </th>

              {/* Column 7: Comments */}
              <th className={`py-3 px-2 ${showTrainingColumn ? 'w-[8%]' : 'w-[10%]'} text-center`}>
                Comments
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

                        {/* 3. Development Activities / Projects (Editable Combobox with Suggestions & Custom Input) */}
                        <td className="py-1 px-2.5 border-r border-slate-200/90 align-top">
                          {isManagerPlanning ? (
                            <EditableActivityCombobox
                              value={row.activity || ''}
                              onChange={(newActivity) =>
                                updateRoadmapSubRow(
                                  item.competencyId,
                                  row.rowNumber,
                                  'activity',
                                  newActivity
                                )
                              }
                              competencyId={item.competencyId}
                              rowNumber={row.rowNumber}
                            />
                          ) : (
                            <div className="space-y-0.5">
                              <div className="text-[10.5px] font-semibold text-slate-700 leading-tight flex items-center">
                                Activity {row.rowNumber}
                                {row.rowNumber <= 4 && (
                                  <span className="text-red-500 font-bold ml-0.5">*</span>
                                )}
                                <span className="ml-0.5">:</span>
                              </div>
                              <div className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50/70 text-slate-900 leading-snug break-words shadow-2xs min-h-[36px]">
                                {row.activity ? (
                                  row.activity
                                ) : (
                                  <span className="text-slate-400 italic">
                                    {row.rowNumber === 5 ? 'Not specified' : '—'}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 4. Learning / Training Path (Editable Combobox with Suggestions & Custom Input, Box View in non-edit) */}
                        {showTrainingColumn && (
                          <td className="py-1 px-2.5 border-r border-slate-200/90 align-top">
                            {isTrainingEditable ? (
                              <EditableTrainingPathCombobox
                                value={
                                  row.trainingPath && row.trainingPath !== 'Pending LNA Team'
                                    ? row.trainingPath
                                    : ''
                                }
                                onChange={(newTraining) =>
                                  updateRoadmapSubRow(
                                    item.competencyId,
                                    row.rowNumber,
                                    'trainingPath',
                                    newTraining
                                  )
                                }
                                competencyId={item.competencyId}
                                rowNumber={row.rowNumber}
                              />
                            ) : (
                              <div className="space-y-0.5">
                                <div className="text-[10.5px] font-semibold text-slate-700 leading-tight flex items-center">
                                  Training Path {row.rowNumber}
                                  {row.rowNumber <= 4 && (
                                    <span className="text-red-500 font-bold ml-0.5">*</span>
                                  )}
                                  <span className="ml-0.5">:</span>
                                </div>
                                <div className="w-full text-xs p-1.5 rounded border border-slate-200 bg-slate-50/70 text-slate-900 leading-snug break-words shadow-2xs min-h-[36px]">
                                  {row.trainingPath && row.trainingPath !== 'Pending LNA Team' ? (
                                    row.trainingPath
                                  ) : (
                                    <span className="text-slate-400 italic">
                                      {row.rowNumber === 5 ? 'Self-paced / on-the-job' : 'Pending LNA Team'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </td>
                        )}

                        {/* 5. Phase (Single sleek interactive calendar picker or clean date display) */}
                        <td className="py-1 px-2 border-r border-slate-200/90 align-middle text-center">
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
                            <div className="w-full py-1 px-1.5 rounded-md bg-slate-50/80 border border-slate-200/80 text-left shadow-2xs">
                              <div className="flex items-center justify-between gap-1 mb-0.5 pb-0.5 border-b border-slate-200/60">
                                <span className="text-[10px] font-bold text-[#211E4E] tracking-tight">
                                  {row.phase || dateInfo.duration}
                                </span>
                                <span className="w-3.5 h-3.5 rounded bg-[#211E4E]/5 text-[#211E4E] flex items-center justify-center shrink-0">
                                  <Calendar className="w-2.5 h-2.5 text-[#C8A977]" />
                                </span>
                              </div>
                              <div className="space-y-0.5 font-mono text-[9.5px]">
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-[8.5px] font-sans font-semibold text-slate-400 uppercase">From</span>
                                  <span className="font-semibold text-slate-800">{row.startDate || dateInfo.startDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                  <span className="text-[8.5px] font-sans font-semibold text-slate-400 uppercase">To</span>
                                  <span className="font-semibold text-slate-800">{row.endDate || dateInfo.endDate}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 6. Status/Remarks (ACTIVE green dropdown on Active PDP, spacious text box in edit mode, clean pill in view mode) */}
                        <td className="py-1 px-2 align-middle text-center">
                          {status === 'ACTIVE' ? (
                            <div className="py-0.5 flex justify-center">
                              <div className="relative inline-block w-full max-w-[115px]">
                                <select
                                  value={row.statusRemarks || 'ACTIVE'}
                                  onChange={(e) =>
                                    updateRoadmapSubRow(
                                      item.competencyId,
                                      row.rowNumber,
                                      'statusRemarks',
                                      e.target.value
                                    )
                                  }
                                  className={`w-full text-[10px] font-bold py-1 pl-2 pr-5 rounded-md border shadow-2xs cursor-pointer appearance-none transition-colors text-center ${
                                    (row.statusRemarks || 'ACTIVE') === 'Completed'
                                      ? 'bg-emerald-600 text-white border-emerald-700'
                                      : (row.statusRemarks || 'ACTIVE') === 'In Progress'
                                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  }`}
                                >
                                  <option value="ACTIVE" className="bg-white text-emerald-700 font-bold">
                                    ACTIVE
                                  </option>
                                  <option value="In Progress" className="bg-white text-blue-700 font-bold">
                                    In Progress
                                  </option>
                                  <option value="Completed" className="bg-white text-emerald-700 font-bold">
                                    Completed
                                  </option>
                                </select>
                                <ChevronDown
                                  className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                    (row.statusRemarks || 'ACTIVE') === 'Completed'
                                      ? 'text-white'
                                      : 'text-slate-500'
                                  }`}
                                />
                              </div>
                            </div>
                          ) : isManagerPlanning ? (
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
                                className="w-full text-xs py-1 px-1.5 rounded border border-slate-200 bg-white text-center focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all"
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

                        {/* 7. Comments Link/Icon Popup */}
                        <td className="py-1 px-2 align-middle text-center">
                          {status === 'ACTIVE' ? (
                            <button
                              type="button"
                              onClick={() => setCommentModalData({ item, row })}
                              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[#211E4E] hover:text-[#C8A977] bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#211E4E]/30 transition-all cursor-pointer shadow-2xs group mx-auto"
                              title="View Comment History"
                              aria-label="View Comment History"
                            >
                              <MessageSquare className="w-4 h-4 text-[#211E4E] group-hover:text-[#C8A977] transition-colors" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setCommentModalData({ item, row })}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#211E4E] hover:text-[#C8A977] bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#211E4E]/30 transition-all cursor-pointer shadow-2xs group"
                              title="View Comment History"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#211E4E] group-hover:text-[#C8A977] transition-colors" />
                              <span className="underline decoration-slate-300 group-hover:decoration-[#C8A977]">
                                Comments
                              </span>
                            </button>
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
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Complete Development Activities for Activities 1–4 (*) across all 5 competencies.
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

          {/* Employee Action: Return to Manager, Return to LNT, and Submit */}
          {isEmployeeSigning && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => returnToManager('Employee returned PDP for manager adjustments')}
                className="px-4 py-2 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 font-bold text-xs rounded-lg border border-orange-300 shadow-2xs transition-all cursor-pointer"
              >
                Return to Manager
              </button>
              <button
                type="button"
                onClick={() => returnToLnt('Employee returned PDP for LNT learning path adjustments')}
                className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-800 hover:text-amber-900 font-bold text-xs rounded-lg border border-amber-300 shadow-2xs transition-all cursor-pointer"
              >
                Return to LNT
              </button>
              <button
                type="button"
                onClick={onOpenAcknowledgementModal}
                className="px-7 py-2 bg-[#211E4E] hover:bg-[#161435] text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Modal Popup for Comment History on row link click */}
      <PdpCommentModal
        isOpen={!!commentModalData}
        onClose={() => setCommentModalData(null)}
      />
    </section>
  );
};
