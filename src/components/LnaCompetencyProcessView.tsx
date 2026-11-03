import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  MessageSquare,
  Clock,
  RotateCcw,
  Send,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';
import { DevelopmentRoadmapItem, RoadmapSubRow, CommentMessage } from '../types/pdp';
import { calculatePhaseDates } from '../utils/phaseDateUtils';
import { EditableActivityCombobox } from './EditableActivityCombobox';
import { EditableTrainingPathCombobox } from './EditableTrainingPathCombobox';
import { DevelopmentActivityDropdown } from './DevelopmentActivityDropdown';
import { DEFAULT_ROW_ACTIVITIES } from '../data/developmentActivitiesData';
import { PdpCommentHistory } from './PdpCommentHistory';

interface LnaCompetencyProcessViewProps {
  mode?: 'MANAGER' | 'LNA' | 'EMPLOYEE_SIGNOFF' | 'ACTIVE_PDP';
  roadmapItems: DevelopmentRoadmapItem[];
  updateRoadmapSubRow: (
    competencyId: string,
    rowNumber: number,
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks' | 'startDate' | 'endDate' | 'activityCategory',
    value: string
  ) => void;
  submitRoadmap?: () => void;
  isComplete?: boolean;
  onReturnToManager?: () => void;
  onReturnToLnt?: () => void;
  onOpenAcknowledgementModal?: () => void;
}

const getFiveSubRows = (item: DevelopmentRoadmapItem): RoadmapSubRow[] => {
  const selectedPhase = item.phase || '6 Months';
  const r1Dates = calculatePhaseDates(selectedPhase, 1, '01/Jul/2026');

  const defaultTemplates = [
    { rowNumber: 1, activityCategory: DEFAULT_ROW_ACTIVITIES[1], phase: selectedPhase, startDate: r1Dates.startDate, endDate: r1Dates.endDate, assignedDates: r1Dates.assignedDates, statusRemarks: 'Not Started' },
    { rowNumber: 2, activityCategory: DEFAULT_ROW_ACTIVITIES[2], phase: '6 Months', startDate: '01/Jan/2027', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027', statusRemarks: 'Not Started' },
    { rowNumber: 3, activityCategory: DEFAULT_ROW_ACTIVITIES[3], phase: '1 Year', startDate: '01/Jul/2026', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027', statusRemarks: 'Not Started' },
    { rowNumber: 4, activityCategory: DEFAULT_ROW_ACTIVITIES[4], phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Not Started' },
    { rowNumber: 5, activityCategory: DEFAULT_ROW_ACTIVITIES[5], phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Not Started' },
  ];

  const existing = item.rows || [];
  const result: RoadmapSubRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const found = existing.find((r) => r.rowNumber === i);
    const tmpl = defaultTemplates[i - 1];
    if (found) {
      const effectivePhase = (i === 1 && item.phase) ? item.phase : (found.phase || tmpl.phase);
      const dateInfo = calculatePhaseDates(effectivePhase, i, found.startDate || tmpl.startDate);
      result.push({
        ...tmpl,
        ...found,
        rowNumber: i,
        activityCategory: found.activityCategory || tmpl.activityCategory,
        phase: effectivePhase,
        startDate: dateInfo.startDate,
        endDate: dateInfo.endDate,
        assignedDates: dateInfo.assignedDates,
        statusRemarks: found.statusRemarks || tmpl.statusRemarks,
      });
    } else {
      result.push({
        rowNumber: i,
        activityCategory: tmpl.activityCategory,
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

// Normalize active PDP status to ensure it defaults strictly to 'Not Started'
const normalizeActiveStatus = (val?: string): 'Not Started' | 'In Progress' | 'Completed' => {
  if (val === 'In Progress') return 'In Progress';
  if (val === 'Completed') return 'Completed';
  return 'Not Started';
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
  const { employee, currentRole, addCommentMessage } = usePdp();
  const [activeCompIndex, setActiveCompIndex] = useState(0);
  const [activeStatusRow, setActiveStatusRow] = useState<number | null>(null);

  // Active PDP expandable comments state (+ / - toggle per row)
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [rowInputText, setRowInputText] = useState<Record<string, string>>({});
  const [rowCommentsMap, setRowCommentsMap] = useState<Record<string, CommentMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('pdp_active_row_comments');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const toggleComments = (rowNumber: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [rowNumber]: !prev[rowNumber],
    }));
  };

  const getRowComments = (compKey: string): CommentMessage[] => {
    if (rowCommentsMap[compKey] && rowCommentsMap[compKey].length > 0) {
      return rowCommentsMap[compKey];
    }
    return [
      {
        id: `seed-${compKey}`,
        sender: 'employee',
        senderName: employee.name || 'Vivekanandan',
        text: 'Initiated active milestone tracking and progressing on planned developmental activities.',
        timestamp: '19/Aug/2026',
      },
    ];
  };

  const handleSendRowComment = (competencyId: string, rowNumber: number) => {
    const compKey = `${competencyId}-${rowNumber}`;
    const text = (rowInputText[compKey] || '').trim();
    if (!text) return;

    const isEmp = currentRole === 'EMPLOYEE';
    const nowStr = new Date()
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '/');
    const newMsg: CommentMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: isEmp ? 'employee' : 'manager',
      senderName: isEmp
        ? employee.name || 'Vivekanandan'
        : employee.lineManager || 'Suresh Nair',
      text,
      timestamp: nowStr,
    };

    setRowCommentsMap((prev) => {
      const current = prev[compKey] || getRowComments(compKey);
      const updated = {
        ...prev,
        [compKey]: [...current, newMsg],
      };
      try {
        localStorage.setItem('pdp_active_row_comments', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    addCommentMessage({
      sender: isEmp ? 'employee' : 'manager',
      senderName: newMsg.senderName,
      text: `[Check-In S.No ${rowNumber}] ${text}`,
    });

    setRowInputText((prev) => ({ ...prev, [compKey]: '' }));
  };

  // Fallback safety if roadmap items are fewer than 5
  const validIndex = Math.min(Math.max(activeCompIndex, 0), Math.max(roadmapItems.length - 1, 0));
  const activeItem = roadmapItems[validIndex];

  if (!activeItem) return null;

  const currentRows = getFiveSubRows(activeItem);

  // Category column is shown across all modes for clean full-width 12-column alignment
  const showMilestoneColumn = true;

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

        {/* 3. Structured HTML Table: Clean borders, perfect column alignment, and horizontal row separators */}
        <div className="overflow-x-auto bg-white border-t border-slate-200/90">
          <table className="w-full table-fixed text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#211E4E] text-white font-bold uppercase text-[11px] tracking-wider select-none border-b border-slate-300">
                {/* S.No Column */}
                <th className="py-3 px-2 text-center border-r border-white/20 w-14 whitespace-nowrap">
                  S.No
                </th>

                {/* Development Activity Column */}
                <th className="py-3 px-3 border-r border-white/20 w-72 sm:w-80 whitespace-nowrap">
                  Development Activity {mode === 'MANAGER' && <span className="text-red-400 font-bold">*</span>}
                </th>

                {/* Description Column */}
                <th className="py-3 px-3.5 border-r border-white/20">
                  Description {mode === 'MANAGER' && <span className="text-red-400 font-bold">*</span>}
                </th>

                {/* Learning / Training Path */}
                {mode !== 'MANAGER' && (
                  <th className="py-3 px-3.5 border-r border-white/20 w-64">
                    Learning / Training Path
                  </th>
                )}

                {/* Phase */}
                <th className={`py-3 px-3 text-center w-36 whitespace-nowrap ${mode === 'ACTIVE_PDP' ? 'border-r border-white/20' : ''}`}>
                  Phase
                </th>

                {/* Status (Only in ACTIVE_PDP mode) */}
                {mode === 'ACTIVE_PDP' && (
                  <th className="py-3 px-3 text-center w-36 whitespace-nowrap">
                    Status
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/90 bg-white">
              {displayRows.map((row) => {
                const isMandatory = row.rowNumber <= 4;
                const currentStatus = normalizeActiveStatus(row.statusRemarks);
                const compKey = `${activeItem.competencyId}-${row.rowNumber}`;
                const rowComments = getRowComments(compKey);
                const isExpanded = !!expandedComments[row.rowNumber];

                return (
                  <React.Fragment key={`milestone-${activeItem.competencyId}-${row.rowNumber}`}>
                    <tr className="hover:bg-slate-50/70 transition-colors border-b border-slate-200/80">
                      {/* Column 1: S.No */}
                      <td className="py-3 px-2 text-center align-middle border-r border-slate-200/80 w-14">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#211E4E]/10 text-[#211E4E] font-bold text-xs">
                          {row.rowNumber}
                        </span>
                      </td>

                      {/* Column 2: Development Activity */}
                      <td className="py-3 px-2.5 align-middle border-r border-slate-200/80 w-72 sm:w-80 relative">
                        {mode === 'MANAGER' ? (
                          <DevelopmentActivityDropdown
                            value={row.activityCategory || DEFAULT_ROW_ACTIVITIES[row.rowNumber] || 'Mentoring/Coaching'}
                            onChange={(newCategory) =>
                              updateRoadmapSubRow(
                                activeItem.competencyId,
                                row.rowNumber,
                                'activityCategory',
                                newCategory
                              )
                            }
                            rowNumber={row.rowNumber}
                            placeholder="Select Activity..."
                          />
                        ) : (
                          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 leading-relaxed min-h-[42px] flex items-center shadow-2xs">
                            <span className="font-bold text-[#211E4E] leading-snug break-words block">
                              {row.activityCategory || DEFAULT_ROW_ACTIVITIES[row.rowNumber] || 'Mentoring/Coaching'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Column 3: Description */}
                      <td className="py-3 px-3.5 align-middle border-r border-slate-200/80">
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
                            activityCategory={row.activityCategory || DEFAULT_ROW_ACTIVITIES[row.rowNumber]}
                            placeholder="Select a description sample from dropdown or type custom..."
                          />
                        ) : (
                          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs text-slate-800 leading-relaxed min-h-[44px] flex items-center shadow-2xs">
                            {row.activity && row.activity.trim().length > 0 ? (
                              <span>{row.activity}</span>
                            ) : (
                              <span className="text-slate-400 italic">
                                (No description specified by manager)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Learning / Training Path */}
                      {mode !== 'MANAGER' && (
                        <td className="py-3 px-3.5 align-middle border-r border-slate-200/80">
                          {mode === 'LNA' ? (
                            <textarea
                              rows={2}
                              value={row.trainingPath || ''}
                              onChange={(e) =>
                                updateRoadmapSubRow(
                                  activeItem.competencyId,
                                  row.rowNumber,
                                  'trainingPath',
                                  e.target.value
                                )
                              }
                              placeholder={
                                row.rowNumber <= 4
                                  ? 'Enter learning / training course, certification, or program...'
                                  : 'Optional: enter course or learning program...'
                              }
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white hover:border-slate-400 focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] focus:outline-hidden text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all leading-snug break-words resize-y min-h-[44px]"
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
                        </td>
                      )}

                      {/* Column 4: Phase */}
                      <td className={`py-3 px-3 text-center align-middle w-36 ${mode === 'ACTIVE_PDP' ? 'border-r border-slate-200/80' : ''}`}>
                        {mode === 'MANAGER' ? (
                          <div className="relative max-w-[130px] mx-auto">
                            <select
                              value={row.phase || '6 Months'}
                              onChange={(e) =>
                                updateRoadmapSubRow(
                                  activeItem.competencyId,
                                  row.rowNumber,
                                  'phase',
                                  e.target.value
                                )
                              }
                              className="w-full text-xs font-bold py-2.5 pl-3 pr-7 rounded-lg border border-slate-300 bg-white text-slate-800 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#211E4E]/20 focus:border-[#211E4E] cursor-pointer shadow-2xs appearance-none transition-colors"
                            >
                              <option value="3 Months">3 Months</option>
                              <option value="6 Months">6 Months</option>
                              <option value="1 Year">1 Year</option>
                              <option value="2 Years">2 Years</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        ) : (
                          <div className="py-2 px-3 rounded-lg border border-[#211E4E]/20 bg-[#211E4E]/5 text-xs min-h-[42px] flex items-center justify-center shadow-2xs text-center mx-auto max-w-[130px]">
                            <span className="font-bold text-[#211E4E] text-xs">
                              {row.phase || '6 Months'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Column 5: Status (Strictly under Status column in ACTIVE_PDP mode) */}
                      {mode === 'ACTIVE_PDP' && (
                        <td className="py-3 px-3 text-center align-middle w-40">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveStatusRow(activeStatusRow === row.rowNumber ? null : row.rowNumber)
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-2xs transition-colors cursor-pointer ${
                                currentStatus === 'Completed'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200'
                                  : currentStatus === 'In Progress'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  currentStatus === 'Completed'
                                    ? 'bg-blue-600'
                                    : currentStatus === 'In Progress'
                                    ? 'bg-amber-500 animate-pulse'
                                    : 'bg-slate-400'
                                }`}
                              />
                              <span>{currentStatus}</span>
                              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                            </button>

                            {/* Dropdown for Status: strictly Not Started, In Progress, Completed */}
                            {activeStatusRow === row.rowNumber && (
                              <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg p-1 min-w-[130px] animate-in fade-in zoom-in-95 duration-100">
                                {(['Not Started', 'In Progress', 'Completed'] as const).map((st) => (
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
                        </td>
                      )}
                    </tr>

                    {/* Expandable Comments/Check-In Sub-row (Only in ACTIVE_PDP mode, under each row) */}
                    {mode === 'ACTIVE_PDP' && (
                      <tr className="bg-slate-50/40 border-b border-slate-200">
                        <td colSpan={6} className="p-3 sm:px-4 sm:py-3">
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleComments(row.rowNumber)}
                              className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200/90 transition-all cursor-pointer shadow-2xs group"
                            >
                              <span className="w-4 h-4 rounded-full bg-[#211E4E] text-white flex items-center justify-center font-mono font-bold text-xs group-hover:bg-[#C8A977] group-hover:text-[#211E4E] transition-colors leading-none">
                                {isExpanded ? '−' : '+'}
                              </span>
                              <span className="tracking-wide text-[11.5px]">Comments</span>
                            </button>

                            {/* Expanded Thread & WhatsApp-style Typing Row: Sized to see at least 3 messages at a time */}
                            {isExpanded && (
                              <div className="mt-2.5 rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-xs animate-in fade-in duration-150">
                                {/* Header banner */}
                                <div className="bg-[#211E4E] px-4 py-2.5 flex items-center justify-between text-white border-b border-[#C8A977]/30">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[#C8A977]" />
                                    <span className="text-xs font-bold tracking-wide">
                                      Comments
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-300 font-medium">
                                    {rowComments.length} {rowComments.length === 1 ? 'Update' : 'Updates'}
                                  </span>
                                </div>

                                {/* Thread: Spacious container (min-h-[290px] max-h-[420px]) so at least 3 messages are visible at a time */}
                                <div
                                  className="p-4 overflow-y-auto space-y-3.5 min-h-[290px] max-h-[420px]"
                                  style={{
                                    backgroundImage:
                                      'radial-gradient(circle at 50% 50%, rgba(200, 169, 119, 0.15) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                  }}
                                >
                                  {rowComments.length === 0 ? (
                                    <div className="py-12 text-center text-xs text-slate-400 italic">
                                      No comments or check-in updates yet for {row.activityCategory || `S.No ${row.rowNumber}`}. Type a message below.
                                    </div>
                                  ) : (
                                    rowComments.map((msg) => {
                                      const isEmp = msg.sender === 'employee';
                                      const initials = msg.senderName
                                        ? msg.senderName.slice(0, 2).toUpperCase()
                                        : isEmp
                                        ? 'VI'
                                        : 'SN';
                                      return (
                                        <div
                                          key={msg.id}
                                          className={`flex items-start gap-3 ${
                                            isEmp ? 'flex-row' : 'flex-row-reverse'
                                          }`}
                                        >
                                          {/* Circular Avatar with Role Badge */}
                                          <div className="relative shrink-0">
                                            <div
                                              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shadow-2xs ${
                                                isEmp
                                                  ? 'bg-[#0F845C] text-white'
                                                  : 'bg-[#211E4E] text-[#C8A977]'
                                              }`}
                                            >
                                              {initials}
                                            </div>
                                            <div
                                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs ${
                                                isEmp
                                                  ? 'bg-white text-[#0F845C] border border-slate-200'
                                                  : 'bg-white text-[#211E4E] border border-slate-200'
                                              }`}
                                            >
                                              {isEmp ? (
                                                <GraduationCap className="w-2.5 h-2.5" />
                                              ) : (
                                                <ShieldCheck className="w-2.5 h-2.5 text-[#211E4E]" />
                                              )}
                                            </div>
                                          </div>

                                          {/* Bubble */}
                                          <div
                                            className={`p-3 max-w-[85%] sm:max-w-[75%] shadow-2xs rounded-2xl ${
                                              isEmp
                                                ? 'bg-[#dff5e6]/85 border border-[#b2e7c3] rounded-tl-xs'
                                                : 'bg-white border border-slate-200 rounded-tr-xs'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between gap-3 pb-1 text-xs">
                                              <span
                                                className={`font-bold ${
                                                  isEmp ? 'text-[#0F845C]' : 'text-[#211E4E]'
                                                }`}
                                              >
                                                {msg.senderName}
                                              </span>
                                              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                                <Clock className="w-3 h-3 text-slate-400" />
                                                {msg.timestamp}
                                              </span>
                                            </div>
                                            <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                                              {msg.text}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>

                                {/* WhatsApp-Style Input Bar & Send Button */}
                                <div className="p-3 bg-slate-50 border-t border-slate-200/90 flex items-center gap-2.5">
                                  <input
                                    type="text"
                                    value={rowInputText[compKey] || ''}
                                    onChange={(e) => {
                                      setRowInputText((prev) => ({ ...prev, [compKey]: e.target.value }));
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendRowComment(activeItem.competencyId, row.rowNumber);
                                      }
                                    }}
                                    placeholder="Type a comment or check-in update..."
                                    className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] shadow-2xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSendRowComment(activeItem.competencyId, row.rowNumber)}
                                    disabled={!(rowInputText[compKey] || '').trim()}
                                    className="w-8 h-8 rounded-full bg-[#0F845C] hover:bg-[#0a6646] disabled:bg-slate-300 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs shrink-0 active:scale-95"
                                    title="Send comment"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. FOOTER ACTIONS BASED ON STAGE */}
      {/* Manager Submit + Comment History */}
      {mode === 'MANAGER' && (
        <div className="space-y-4">
          <PdpCommentHistory />
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex justify-end">
            <button
              type="button"
              onClick={submitRoadmap}
              disabled={!isComplete}
              className={`px-8 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs ${
                isComplete
                  ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              SUBMIT
            </button>
          </section>
        </div>
      )}

      {/* LNA Actions: Return to Manager button + Initiate + Comment box */}
      {mode === 'LNA' && (
        <div className="space-y-4">
          <PdpCommentHistory />
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onReturnToManager}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 font-bold text-xs uppercase tracking-wider rounded-lg border border-orange-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
              <span>RETURN</span>
            </button>
            <button
              type="button"
              onClick={submitRoadmap}
              disabled={!isComplete}
              className={`px-8 py-2.5 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs ${
                isComplete
                  ? 'bg-[#211E4E] hover:bg-[#161435] active:scale-[0.99] text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-75'
              }`}
            >
              SUBMIT
            </button>
          </section>
        </div>
      )}

      {/* Employee Sign-off Comment History & Actions: Request Changes + Sign-Off */}
      {mode === 'EMPLOYEE_SIGNOFF' && (
        <div className="space-y-4">
          <PdpCommentHistory />
          <section className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-end gap-3 flex-wrap">
            <button
              type="button"
              onClick={onReturnToManager}
              className="px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-700 hover:text-orange-800 font-bold text-xs uppercase tracking-wider rounded-lg border border-orange-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
              <span>REQUEST CHANGES</span>
            </button>
            <button
              type="button"
              onClick={onOpenAcknowledgementModal}
              className="px-7 py-2.5 bg-[#211E4E] hover:bg-[#161435] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer active:scale-98"
            >
              SIGN-OFF
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
