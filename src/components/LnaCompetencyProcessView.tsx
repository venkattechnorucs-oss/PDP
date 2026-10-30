import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { DevelopmentRoadmapItem, RoadmapSubRow } from '../types/pdp';
import { DateRangeCalendarPicker } from './DateRangeCalendarPicker';
import { EditableActivityCombobox } from './EditableActivityCombobox';
import { EditableTrainingPathCombobox } from './EditableTrainingPathCombobox';
import { PdpCommentHistory } from './PdpCommentHistory';
import { PdpCommentModal } from './PdpCommentModal';

interface LnaCompetencyProcessViewProps {
  mode?: 'MANAGER' | 'LNA' | 'EMPLOYEE_SIGNOFF' | 'ACTIVE_PDP';
  roadmapItems: DevelopmentRoadmapItem[];
  updateRoadmapSubRow: (
    competencyId: string,
    rowNumber: number,
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks' | 'startDate' | 'endDate',
    value: string
  ) => void;
  submitRoadmap?: () => void;
  isComplete?: boolean;
  onReturnToManager?: () => void;
  onReturnToLnt?: () => void;
  onOpenAcknowledgementModal?: () => void;
}

const getFiveSubRows = (item: DevelopmentRoadmapItem): RoadmapSubRow[] => {
  const defaultTemplates = [
    { rowNumber: 1, phase: '6 Months', startDate: '01/Jul/2026', endDate: '31/Dec/2026', assignedDates: 'From: 01/Jul/2026 To: 31/Dec/2026', statusRemarks: 'ACTIVE' },
    { rowNumber: 2, phase: '6 Months', startDate: '01/Jan/2027', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027', statusRemarks: 'ACTIVE' },
    { rowNumber: 3, phase: '1 Year', startDate: '01/Jul/2026', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027', statusRemarks: 'ACTIVE' },
    { rowNumber: 4, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'ACTIVE' },
    { rowNumber: 5, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'ACTIVE' },
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

// Normalize active PDP status to ensure it defaults strictly to ACTIVE
const normalizeActiveStatus = (val?: string): 'ACTIVE' | 'In Progress' | 'Completed' => {
  if (val === 'In Progress') return 'In Progress';
  if (val === 'Completed') return 'Completed';
  return 'ACTIVE';
};

export const LnaCompetencyProcessView: React.FC<LnaCompetencyProcessViewProps> = ({
  mode = 'LNA',
  roadmapItems,
  updateRoadmapSubRow,
  submitRoadmap,
  isComplete = false,
  onReturnToManager,
  onReturnToLnt,
  onOpenAcknowledgementModal,
}) => {
  const [activeCompIndex, setActiveCompIndex] = useState(0);
  const [activeStatusRow, setActiveStatusRow] = useState<number | null>(null);
  const [commentModalRow, setCommentModalRow] = useState<RoadmapSubRow | null>(null);

  // Fallback safety if roadmap items are fewer than 5
  const validIndex = Math.min(Math.max(activeCompIndex, 0), Math.max(roadmapItems.length - 1, 0));
  const activeItem = roadmapItems[validIndex];

  if (!activeItem) return null;

  const currentRows = getFiveSubRows(activeItem);

  // Milestone column is only shown in Manager and LNA modes. In Employee Sign-off and Active PDP, it is NOT needed.
  const showMilestoneColumn = mode === 'MANAGER' || mode === 'LNA';

  // Milestone 5 rule:
  // In Manager mode, always show so manager can optionally configure it.
  // In LNA mode, Employee Sign-off, and Active PDP: if there is no milestone 5 activity from manager, don't show it!
  const displayRows = currentRows.filter((row) => {
    if (row.rowNumber <= 4) return true;
    if (mode === 'MANAGER') return true;
    return row.activity && row.activity.trim().length > 0;
  });

  return (
    <div className="w-full space-y-4">
      {/* 1. TOP BANNER: STEPPER NUMBERS (Clean white background, selected skill is blue) */}
      <section className="rounded-xl overflow-hidden shadow-xs bg-white text-slate-800 border border-slate-200/90 p-4 sm:p-5">
        {/* Stepper Flow: White section background, selected skill is Blue, unselected is White */}
        <div className="pt-2 pb-1">
          <div className="relative flex items-start justify-between max-w-5xl mx-auto px-1 sm:px-2">
            {roadmapItems.map((comp, idx) => {
              const isSelected = idx === validIndex;
              const isLast = idx === roadmapItems.length - 1;

              return (
                <div key={comp.competencyId} className="relative flex-1 flex flex-col items-center group">
                  {/* Horizontal connecting line to next step */}
                  {!isLast && (
                    <div
                      className="absolute top-5 left-1/2 w-full h-[2px] z-0 bg-slate-200"
                    />
                  )}

                  {/* Circle Node with Number (Selected is Blue, Unselected is White) */}
                  <button
                    type="button"
                    onClick={() => setActiveCompIndex(idx)}
                    className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#211E4E] text-white font-black ring-4 ring-[#211E4E]/20 shadow-md scale-105 border-2 border-[#211E4E]'
                        : 'bg-white hover:bg-slate-50 text-slate-700 font-bold border-2 border-slate-200 hover:border-[#211E4E]/50 hover:scale-105 shadow-2xs'
                    }`}
                    title={`Competency ${idx + 1}: ${comp.competencyName}`}
                  >
                    <span>{idx + 1}</span>
                  </button>

                  {/* Competency Name */}
                  <div
                    onClick={() => setActiveCompIndex(idx)}
                    className="mt-2 text-center cursor-pointer max-w-[130px] sm:max-w-[150px] px-0.5"
                  >
                    <p
                      className={`text-[11px] sm:text-[12px] uppercase leading-tight tracking-tight transition-colors line-clamp-2 ${
                        isSelected ? 'text-[#211E4E] font-black' : 'text-slate-600 font-bold group-hover:text-slate-900'
                      }`}
                    >
                      {comp.competencyName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. UNIFIED DEVELOPMENT ROADMAP SECTION */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* 1. Development Roadmap Title Bar (Single Blue Bar) */}
        <div className="bg-[#211E4E] text-white py-2.5 px-4 sm:px-5 font-bold text-xs uppercase tracking-wider flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C8A977]" />
            <span>Development Roadmap</span>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider ${
              activeItem.category === 'Behavioural'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-400/30'
                : 'bg-blue-900/60 text-blue-200 border border-blue-400/30'
            }`}
          >
            {activeItem.category} Competency
          </span>
        </div>

        {/* 2. In-between Area: White background with Competency Name and Objective */}
        <div className="bg-white p-4 sm:p-5 border-b border-slate-200/90 space-y-1.5">
          <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {activeItem.competencyName}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-[#211E4E]">Objective: </span>
            <span className="text-slate-700">
              {activeItem.objective || 'Focus on closing operational and technical performance gaps in line with departmental requirements.'}
            </span>
          </p>
        </div>

        {/* 3. Column Header Row (Milestone, Development Activities / Projects *, Phase): Blue line */}
        <div className="bg-[#211E4E] text-white text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 border-b border-slate-300 hidden md:grid grid-cols-12 gap-3.5 items-center">
          {/* Milestone Column Header (Only in Manager and LNA modes) */}
          {showMilestoneColumn && (
            <div className="col-span-2 text-left">Milestone</div>
          )}

          {/* Development Activities / Projects Header */}
          <div
            className={
              mode === 'MANAGER'
                ? 'col-span-7'
                : mode === 'LNA'
                ? 'col-span-4'
                : mode === 'EMPLOYEE_SIGNOFF'
                ? 'col-span-4'
                : 'col-span-4'
            }
          >
            Development Activities / Projects {mode === 'MANAGER' && <span className="text-red-400 font-bold">*</span>}
          </div>

          {/* Learning / Training Path Header */}
          {mode !== 'MANAGER' && (
            <div
              className={
                mode === 'LNA'
                  ? 'col-span-4'
                  : mode === 'EMPLOYEE_SIGNOFF'
                  ? 'col-span-3'
                  : 'col-span-3'
              }
            >
              Learning / Training Path {mode === 'LNA' && <span className="text-red-400 font-bold">*</span>}
            </div>
          )}

          {/* Phase Header */}
          <div
            className={
              mode === 'MANAGER'
                ? 'col-span-3'
                : mode === 'LNA'
                ? 'col-span-2'
                : mode === 'EMPLOYEE_SIGNOFF'
                ? 'col-span-2'
                : 'col-span-2'
            }
          >
            Phase
          </div>

          {/* Status Header (In EMPLOYEE_SIGNOFF and ACTIVE_PDP modes) */}
          {mode === 'EMPLOYEE_SIGNOFF' && (
            <div className="col-span-1 text-center">Status</div>
          )}
          {mode === 'ACTIVE_PDP' && (
            <div className="col-span-2 text-center">Status</div>
          )}

          {/* Comments Header (In EMPLOYEE_SIGNOFF and ACTIVE_PDP modes) */}
          {mode === 'EMPLOYEE_SIGNOFF' && (
            <div className="col-span-2 text-center">Comments</div>
          )}
          {mode === 'ACTIVE_PDP' && (
            <div className="col-span-1 text-center">Comments</div>
          )}
        </div>

        {/* Milestone Rows */}
        <div className="divide-y divide-slate-100">
          {displayRows.map((row) => {
            const isMandatory = row.rowNumber <= 4;
            const currentStatus = normalizeActiveStatus(row.statusRemarks);

            return (
              <div
                key={`milestone-${activeItem.competencyId}-${row.rowNumber}`}
                className="p-3.5 sm:p-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
                  {/* Milestone Label (Only in Manager & LNA modes, NO milestone column in Employee Sign-off or Active PDP) */}
                  {showMilestoneColumn && (
                    <div className="md:col-span-2 flex items-center">
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                        Milestone {row.rowNumber} {isMandatory ? <span className="text-red-500 font-bold">*</span> : ''}
                      </span>
                    </div>
                  )}

                  {/* Column: Development Activities / Projects */}
                  <div
                    className={
                      mode === 'MANAGER'
                        ? 'md:col-span-7'
                        : mode === 'LNA'
                        ? 'md:col-span-4'
                        : mode === 'EMPLOYEE_SIGNOFF'
                        ? 'md:col-span-4'
                        : 'md:col-span-4'
                    }
                  >
                    <span className="md:hidden block text-[11px] font-bold text-slate-700 mb-1">
                      Development Activities / Projects {isMandatory && mode === 'MANAGER' && '*'}
                    </span>
                    {mode === 'MANAGER' ? (
                      <EditableActivityCombobox
                        value={row.activity || ''}
                        onChange={(newAct) =>
                          updateRoadmapSubRow(
                            activeItem.competencyId,
                            row.rowNumber,
                            'activity',
                            newAct
                          )
                        }
                        competencyId={activeItem.competencyId}
                        rowNumber={row.rowNumber}
                        placeholder="Select an activity option from dropdown or type your own..."
                      />
                    ) : (
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-800 leading-relaxed min-h-[44px] flex items-center shadow-2xs">
                        {row.activity && row.activity.trim().length > 0 ? (
                          <span>{row.activity}</span>
                        ) : (
                          <span className="text-slate-400 italic">
                            (No development activity specified by manager)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Column: Learning / Training Path */}
                  {mode !== 'MANAGER' && (
                    <div
                      className={
                        mode === 'LNA'
                          ? 'md:col-span-4'
                          : mode === 'EMPLOYEE_SIGNOFF'
                          ? 'md:col-span-3'
                          : 'md:col-span-3'
                      }
                    >
                      <span className="md:hidden block text-[11px] font-bold text-slate-700 mb-1">
                        Learning / Training Path {isMandatory && mode === 'LNA' && '*'}
                      </span>
                      {mode === 'LNA' ? (
                        <EditableTrainingPathCombobox
                          value={row.trainingPath || ''}
                          onChange={(newPath) =>
                            updateRoadmapSubRow(
                              activeItem.competencyId,
                              row.rowNumber,
                              'trainingPath',
                              newPath
                            )
                          }
                          competencyId={activeItem.competencyId}
                          rowNumber={row.rowNumber}
                          placeholder="Select course/certification from dropdown or type your own..."
                        />
                      ) : (
                        <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-800 leading-relaxed min-h-[44px] flex items-center shadow-2xs">
                          {row.trainingPath && row.trainingPath !== 'Pending LNA Team' ? (
                            <span>{row.trainingPath}</span>
                          ) : (
                            <span className="text-slate-400 italic">
                              {row.trainingPath || 'Pending LNA Team'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Column: Phase */}
                  <div
                    className={
                      mode === 'MANAGER'
                        ? 'md:col-span-3'
                        : mode === 'LNA'
                        ? 'md:col-span-2'
                        : mode === 'EMPLOYEE_SIGNOFF'
                        ? 'md:col-span-2'
                        : 'md:col-span-2'
                    }
                  >
                    <span className="md:hidden block text-[11px] font-bold text-slate-700 mb-1">
                      Phase
                    </span>
                    {mode === 'MANAGER' ? (
                      <div className="pt-0.5">
                        <DateRangeCalendarPicker
                          startDate={row.startDate}
                          endDate={row.endDate}
                          rowNumber={row.rowNumber}
                          onSelectRange={(s, e, dur) => {
                            updateRoadmapSubRow(activeItem.competencyId, row.rowNumber, 'startDate', s);
                            updateRoadmapSubRow(activeItem.competencyId, row.rowNumber, 'endDate', e);
                            if (dur) {
                              updateRoadmapSubRow(activeItem.competencyId, row.rowNumber, 'phase', dur);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-800 min-h-[44px] flex flex-col justify-center shadow-2xs text-left">
                        <span className="font-bold text-slate-800 text-[11.5px]">{row.phase}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {row.startDate} – {row.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Column: Status in EMPLOYEE_SIGNOFF */}
                  {mode === 'EMPLOYEE_SIGNOFF' && (
                    <div className="md:col-span-1 flex justify-center items-center text-center">
                      <span className="md:hidden block text-[11px] font-bold text-slate-700 mr-2">Status:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                        <span>{row.statusRemarks || 'Scheduled'}</span>
                      </span>
                    </div>
                  )}

                  {/* Column: Status (Only in ACTIVE_PDP mode) */}
                  {mode === 'ACTIVE_PDP' && (
                    <div className="md:col-span-2 flex justify-center relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveStatusRow(activeStatusRow === row.rowNumber ? null : row.rowNumber)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border shadow-2xs transition-colors cursor-pointer ${
                          currentStatus === 'Completed'
                            ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                            : currentStatus === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            currentStatus === 'Completed'
                              ? 'bg-blue-600'
                              : currentStatus === 'In Progress'
                              ? 'bg-amber-500'
                              : 'bg-emerald-600 animate-pulse'
                          }`}
                        />
                        <span>{currentStatus}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>

                      {/* Dropdown for Status: strictly ACTIVE, In Progress, Completed */}
                      {activeStatusRow === row.rowNumber && (
                        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-1 min-w-[130px] animate-in fade-in zoom-in-95 duration-100">
                          {(['ACTIVE', 'In Progress', 'Completed'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                updateRoadmapSubRow(
                                  activeItem.competencyId,
                                  row.rowNumber,
                                  'statusRemarks',
                                  st
                                );
                                setActiveStatusRow(null);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded cursor-pointer ${
                                currentStatus === st
                                  ? 'bg-slate-100 text-[#211E4E] font-bold'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Column: Comments Link/Icon (In EMPLOYEE_SIGNOFF and ACTIVE_PDP modes) */}
                  {(mode === 'EMPLOYEE_SIGNOFF' || mode === 'ACTIVE_PDP') && (
                    <div
                      className={`${
                        mode === 'EMPLOYEE_SIGNOFF' ? 'md:col-span-2' : 'md:col-span-1'
                      } flex justify-center items-center text-center`}
                    >
                      {mode === 'ACTIVE_PDP' ? (
                        <button
                          type="button"
                          onClick={() => setCommentModalRow(row)}
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-[#211E4E] hover:text-[#C8A977] bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#211E4E]/30 transition-all cursor-pointer shadow-2xs group"
                          title="View Comment History"
                          aria-label="View Comment History"
                        >
                          <MessageSquare className="w-4 h-4 text-[#211E4E] group-hover:text-[#C8A977] transition-colors" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCommentModalRow(row)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#211E4E] hover:text-[#C8A977] bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#211E4E]/30 transition-all cursor-pointer shadow-2xs group"
                          title="View Comment History"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#211E4E] group-hover:text-[#C8A977] transition-colors" />
                          <span className="underline decoration-slate-300 group-hover:decoration-[#C8A977]">
                            Comments
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FOOTER ACTIONS BASED ON STAGE */}
      {/* Manager Submit */}
      {mode === 'MANAGER' && (
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex justify-end">
          <button
            type="button"
            onClick={submitRoadmap}
            disabled={!isComplete}
            className={`px-8 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
              isComplete
                ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
            }`}
          >
            Submit
          </button>
        </section>
      )}

      {/* LNA Actions: Return to Manager button + Submit */}
      {mode === 'LNA' && (
        <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onReturnToManager}
            className="px-4 py-2 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 font-bold text-xs rounded-lg border border-orange-300 shadow-2xs transition-all cursor-pointer"
          >
            Return
          </button>
          <button
            type="button"
            onClick={submitRoadmap}
            disabled={!isComplete}
            className={`px-8 py-2 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-xs ${
              isComplete
                ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
            }`}
          >
            Submit
          </button>
        </section>
      )}

      {/* Employee Sign-off Comment History & Actions */}
      {mode === 'EMPLOYEE_SIGNOFF' && (
        <div className="space-y-4">
          <PdpCommentHistory />
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onReturnToManager}
              className="px-4 py-2 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 font-bold text-xs rounded-lg border border-orange-300 shadow-2xs transition-all cursor-pointer"
            >
              Return to Manager
            </button>
            <button
              type="button"
              onClick={onReturnToLnt}
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
          </section>
        </div>
      )}

      {/* Modal Popup for Comment History on row link click */}
      <PdpCommentModal
        isOpen={!!commentModalRow}
        onClose={() => setCommentModalRow(null)}
      />
    </div>
  );
};
