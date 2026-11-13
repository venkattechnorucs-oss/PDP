import React, { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  AlertCircle,
  RotateCcw,
  FileCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  TEAM_SUBMISSIONS,
  TeamMemberSubmission,
  ManagerActionStage,
  getSubmissionCategory,
} from '../data/teamSubmissionsData';
import { PdpStatus } from '../types/pdp';

interface ManagerApprovalsViewProps {
  initialSubView?: 'PENDING_ACTIONS' | 'REVIEW_ASSIGN';
  onReviewEmployee: (
    employee: TeamMemberSubmission,
    targetStage?: PdpStatus
  ) => void;
}

type FilterTab =
  | 'ALL'
  | 'NOT_STARTED'
  | 'MANAGER_ACTIONS'
  | 'PENDING_MANAGER_ACTIONS'
  | 'RETURNED_MANAGER_ACTIONS'
  | 'PDP_INITIATION'
  | 'PENDING_PDP_INITIATION'
  | 'MANAGER_REVIEW'
  | 'PENDING_MANAGER_REVIEW'
  | 'RETURNED_MANAGER_REVIEW'
  | 'LNA_TEAM'
  | 'PENDING_LNA_TEAM'
  | 'EMPLOYEE_ACK'
  | 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
  | 'ACTIVE'
  | 'DELEGATION';

export const ManagerApprovalsView: React.FC<ManagerApprovalsViewProps> = ({
  onReviewEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  // Compute metrics for all unified stages in Pending Actions
  const metrics = useMemo(() => {
    let notStarted = 0;
    let pendingManagerActions = 0;
    let returnedManagerActions = 0;
    let pendingPdpInitiation = 0;
    let pendingManagerReview = 0;
    let returnedManagerReview = 0;
    let pendingLnaTeam = 0;
    let pendingEmployeeAcknowledgement = 0;
    let active = 0;
    let delegationCount = 0;

    TEAM_SUBMISSIONS.forEach((sub) => {
      if (sub.hasDelegation) delegationCount++;
      const cat = getSubmissionCategory(sub);
      if (cat === 'NOT_STARTED') notStarted++;
      else if (cat === 'PENDING_MANAGER_ACTIONS') pendingManagerActions++;
      else if (cat === 'RETURNED_MANAGER_ACTIONS') returnedManagerActions++;
      else if (cat === 'PENDING_PDP_INITIATION') pendingPdpInitiation++;
      else if (cat === 'PENDING_MANAGER_REVIEW') pendingManagerReview++;
      else if (cat === 'RETURNED_MANAGER_REVIEW') returnedManagerReview++;
      else if (cat === 'PENDING_LNA_TEAM') pendingLnaTeam++;
      else if (cat === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') pendingEmployeeAcknowledgement++;
      else if (cat === 'ACTIVE') active++;
    });

    return {
      notStarted,
      pendingManagerActions,
      returnedManagerActions,
      managerActionsTotal: pendingManagerActions + returnedManagerActions,
      pendingPdpInitiation,
      pendingManagerReview,
      returnedManagerReview,
      managerReviewTotal: pendingManagerReview + returnedManagerReview,
      pendingLnaTeam,
      pendingEmployeeAcknowledgement,
      active,
      delegationCount,
      total: TEAM_SUBMISSIONS.length,
      requiringManagerAttention:
        pendingManagerActions +
        returnedManagerActions +
        pendingManagerReview +
        returnedManagerReview,
    };
  }, []);

  const filteredSubmissions = useMemo(() => {
    return TEAM_SUBMISSIONS.filter((sub) => {
      const category = getSubmissionCategory(sub);

      // Filter by category pill / card
      if (activeFilter === 'NOT_STARTED' && category !== 'NOT_STARTED') return false;
      if (
        activeFilter === 'MANAGER_ACTIONS' &&
        category !== 'PENDING_MANAGER_ACTIONS' &&
        category !== 'RETURNED_MANAGER_ACTIONS'
      ) {
        return false;
      }
      if (
        activeFilter === 'PENDING_MANAGER_ACTIONS' &&
        category !== 'PENDING_MANAGER_ACTIONS'
      ) {
        return false;
      }
      if (
        activeFilter === 'RETURNED_MANAGER_ACTIONS' &&
        category !== 'RETURNED_MANAGER_ACTIONS'
      ) {
        return false;
      }
      if (
        (activeFilter === 'PDP_INITIATION' || activeFilter === 'PENDING_PDP_INITIATION') &&
        category !== 'PENDING_PDP_INITIATION'
      ) {
        return false;
      }
      if (
        activeFilter === 'MANAGER_REVIEW' &&
        category !== 'PENDING_MANAGER_REVIEW' &&
        category !== 'RETURNED_MANAGER_REVIEW'
      ) {
        return false;
      }
      if (
        activeFilter === 'PENDING_MANAGER_REVIEW' &&
        category !== 'PENDING_MANAGER_REVIEW'
      ) {
        return false;
      }
      if (
        activeFilter === 'RETURNED_MANAGER_REVIEW' &&
        category !== 'RETURNED_MANAGER_REVIEW'
      ) {
        return false;
      }
      if (
        (activeFilter === 'LNA_TEAM' || activeFilter === 'PENDING_LNA_TEAM') &&
        category !== 'PENDING_LNA_TEAM'
      ) {
        return false;
      }
      if (
        (activeFilter === 'EMPLOYEE_ACK' ||
          activeFilter === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') &&
        category !== 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
      ) {
        return false;
      }
      if (activeFilter === 'ACTIVE' && category !== 'ACTIVE') return false;
      if (activeFilter === 'DELEGATION' && !sub.hasDelegation) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(q);
        const matchesPos = sub.position.toLowerCase().includes(q);
        const matchesDept = sub.department.toLowerCase().includes(q);
        const matchesId = sub.id.toLowerCase().includes(q);
        if (!matchesName && !matchesPos && !matchesDept && !matchesId) return false;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  /**
   * Action click handler:
   * 1. Pending with Manager Actions / Returned to Manager Actions:
   *    Opens the page where Manager rates all competencies, selects 5 top priorities, and sets objectives ('PENDING_MANAGER_REVIEW').
   * 2. Pending with Manager Review / Returned to Manager Review:
   *    Opens the page where Manager specifies development activities across the 5 competencies ('PDP_PLANNING_MANAGER').
   * 3. Pending with PDP Initiation:
   *    Opens the HR Initiation summary view ('PENDING_HR_INITIATION').
   * 4. Pending with LNA Team:
   *    Opens the roadmap development review view ('PENDING_LNA_TEAM').
   * 5. Pending with Employee Acknowledgement / Active:
   *    Opens the finalized roadmap view ('PENDING_EMPLOYEE_ACKNOWLEDGEMENT' / 'ACTIVE').
   * 6. Not Started:
   *    Opens the initial evaluation form ('PENDING_EMPLOYEE_EVALUATION').
   */
  const handleActionClick = (sub: TeamMemberSubmission) => {
    const category = getSubmissionCategory(sub);

    if (
      category === 'PENDING_MANAGER_ACTIONS' ||
      category === 'RETURNED_MANAGER_ACTIONS'
    ) {
      onReviewEmployee(sub, 'PENDING_MANAGER_REVIEW');
    } else if (
      category === 'PENDING_MANAGER_REVIEW' ||
      category === 'RETURNED_MANAGER_REVIEW'
    ) {
      onReviewEmployee(sub, 'PDP_PLANNING_MANAGER');
    } else if (category === 'PENDING_PDP_INITIATION') {
      onReviewEmployee(sub, 'PENDING_HR_INITIATION');
    } else if (category === 'PENDING_LNA_TEAM') {
      onReviewEmployee(sub, 'PENDING_LNA_TEAM');
    } else if (category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') {
      onReviewEmployee(sub, 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT');
    } else if (category === 'ACTIVE') {
      onReviewEmployee(sub, 'ACTIVE');
    } else {
      // NOT_STARTED
      onReviewEmployee(sub, 'PENDING_EMPLOYEE_EVALUATION');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Professional Development Plan (PDP) – Pending Actions
        </h1>
      </section>

      {/* 2. Top Status Cards - Compact Pastel Badges Matching LNA Team Sizing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {/* Card 1: NOT STARTED */}
        <div
          onClick={() =>
            setActiveFilter(activeFilter === 'NOT_STARTED' ? 'ALL' : 'NOT_STARTED')
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'NOT_STARTED'
              ? 'bg-[#e2e8f0] border-slate-500 ring-1 ring-slate-400/40 shadow-xs'
              : 'bg-[#f1f5f9] border-slate-200/90 hover:border-slate-300 hover:bg-[#e9edf3]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#475569] uppercase leading-tight">
              NOT STARTED
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#0f172a] leading-tight mt-0.5">
              {metrics.notStarted}
            </div>
          </div>
        </div>

        {/* Card 2: MANAGER ACTIONS */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'MANAGER_ACTIONS' ? 'ALL' : 'MANAGER_ACTIONS'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'MANAGER_ACTIONS' ||
            activeFilter === 'PENDING_MANAGER_ACTIONS' ||
            activeFilter === 'RETURNED_MANAGER_ACTIONS'
              ? 'bg-[#feeede] border-[#ea580c] ring-1 ring-amber-400/40 shadow-xs'
              : 'bg-[#fff7ed] border-amber-200/90 hover:border-amber-300 hover:bg-[#ffeedd]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#9a3412] uppercase leading-tight">
              MANAGER ACTIONS
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#c2410c] leading-tight mt-0.5">
              {metrics.managerActionsTotal}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#9a3412] mt-0.5">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === 'PENDING_MANAGER_ACTIONS'
                    ? 'ALL'
                    : 'PENDING_MANAGER_ACTIONS'
                );
              }}
              className={`hover:underline cursor-pointer ${
                activeFilter === 'PENDING_MANAGER_ACTIONS'
                  ? 'font-bold underline text-[#7c2d12]'
                  : ''
              }`}
            >
              {metrics.pendingManagerActions} Pending
            </span>
            <span>·</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === 'RETURNED_MANAGER_ACTIONS'
                    ? 'ALL'
                    : 'RETURNED_MANAGER_ACTIONS'
                );
              }}
              className={`hover:underline cursor-pointer ${
                activeFilter === 'RETURNED_MANAGER_ACTIONS'
                  ? 'font-bold underline text-[#7c2d12]'
                  : ''
              }`}
            >
              {metrics.returnedManagerActions} Returned
            </span>
          </div>
        </div>

        {/* Card 3: PDP INITIATION */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'PDP_INITIATION' ||
                activeFilter === 'PENDING_PDP_INITIATION'
                ? 'ALL'
                : 'PDP_INITIATION'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'PDP_INITIATION' ||
            activeFilter === 'PENDING_PDP_INITIATION'
              ? 'bg-[#dbeafe] border-[#2563eb] ring-1 ring-blue-400/40 shadow-xs'
              : 'bg-[#eff6ff] border-blue-200/90 hover:border-blue-300 hover:bg-[#e0effe]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#1d4ed8] uppercase leading-tight">
              PDP INITIATION
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#2563eb] leading-tight mt-0.5">
              {metrics.pendingPdpInitiation}
            </div>
          </div>
        </div>

        {/* Card 4: MANAGER REVIEW */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'MANAGER_REVIEW' ? 'ALL' : 'MANAGER_REVIEW'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'MANAGER_REVIEW' ||
            activeFilter === 'PENDING_MANAGER_REVIEW' ||
            activeFilter === 'RETURNED_MANAGER_REVIEW'
              ? 'bg-[#f3e8ff] border-[#9333ea] ring-1 ring-purple-400/40 shadow-xs'
              : 'bg-[#faf5ff] border-purple-200/90 hover:border-purple-300 hover:bg-[#f5e8ff]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#7e22ce] uppercase leading-tight">
              MANAGER REVIEW
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#9333ea] leading-tight mt-0.5">
              {metrics.managerReviewTotal}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#7e22ce] mt-0.5">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === 'PENDING_MANAGER_REVIEW'
                    ? 'ALL'
                    : 'PENDING_MANAGER_REVIEW'
                );
              }}
              className={`hover:underline cursor-pointer ${
                activeFilter === 'PENDING_MANAGER_REVIEW'
                  ? 'font-bold underline text-[#581c87]'
                  : ''
              }`}
            >
              {metrics.pendingManagerReview} Pending
            </span>
            <span>·</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === 'RETURNED_MANAGER_REVIEW'
                    ? 'ALL'
                    : 'RETURNED_MANAGER_REVIEW'
                );
              }}
              className={`hover:underline cursor-pointer ${
                activeFilter === 'RETURNED_MANAGER_REVIEW'
                  ? 'font-bold underline text-[#581c87]'
                  : ''
              }`}
            >
              {metrics.returnedManagerReview} Returned
            </span>
          </div>
        </div>

        {/* Card 5: PENDING WITH LNA REVIEW */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'LNA_TEAM' || activeFilter === 'PENDING_LNA_TEAM'
                ? 'ALL'
                : 'LNA_TEAM'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'LNA_TEAM' || activeFilter === 'PENDING_LNA_TEAM'
              ? 'bg-[#e0f2fe] border-[#0284c7] ring-1 ring-sky-400/40 shadow-xs'
              : 'bg-[#f0f9ff] border-sky-200/90 hover:border-sky-300 hover:bg-[#e0f2fe]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#0284c7] uppercase leading-tight">
              PENDING WITH LNA REVIEW
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#0284c7] leading-tight mt-0.5">
              {metrics.pendingLnaTeam}
            </div>
          </div>
        </div>

        {/* Card 6: EMPLOYEE ACK. */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'EMPLOYEE_ACK' ||
                activeFilter === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
                ? 'ALL'
                : 'EMPLOYEE_ACK'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'EMPLOYEE_ACK' ||
            activeFilter === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
              ? 'bg-[#dcfce7] border-[#059669] ring-1 ring-emerald-400/40 shadow-xs'
              : 'bg-[#f0fdf4] border-emerald-200/90 hover:border-emerald-300 hover:bg-[#dcfce7]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#047857] uppercase leading-tight">
              EMPLOYEE ACK.
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#059669] leading-tight mt-0.5">
              {metrics.pendingEmployeeAcknowledgement}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search and Action Bar (Search, All Submissions, Delegation, Reset) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name, position, department..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl pl-10 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls: All Submissions + Delegation + Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* All Submissions Toggle */}
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#211E4E] text-white border-[#211E4E] shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>All Submissions</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {TEAM_SUBMISSIONS.length}
            </span>
          </button>

          {/* Delegation Filter */}
          <button
            type="button"
            onClick={() =>
              setActiveFilter(activeFilter === 'DELEGATION' ? 'ALL' : 'DELEGATION')
            }
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              activeFilter === 'DELEGATION'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs ring-2 ring-indigo-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>Delegation</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeFilter === 'DELEGATION'
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {metrics.delegationCount}
            </span>
          </button>

          {/* Reset Button (visible when filter or search active) */}
          {(activeFilter !== 'ALL' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setActiveFilter('ALL');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Table Card Container */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Banner Header */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="w-4 h-4 text-[#C8A977]" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              PDP Submissions
            </h2>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">EMPLOYEE NAME</th>
                <th className="py-3 px-4">POSITION</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-3.5">DATE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center w-40">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400 italic text-xs"
                  >
                    No submissions found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, index) => {
                  const category: ManagerActionStage = getSubmissionCategory(sub);

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Row # */}
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600 font-bold">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[11px]">
                          {index + 1}
                        </span>
                      </td>

                      {/* Employee Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#211E4E]/10 text-[#211E4E] font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {sub.avatarInitials}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 block">
                              {sub.name}
                            </span>
                            {sub.hasDelegation && (
                              <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[9px] border border-indigo-200">
                                Delegated
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {sub.position}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {sub.department}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3.5 text-slate-600 font-medium whitespace-nowrap">
                        {sub.date}
                      </td>

                      {/* Status Badge - Explicitly 1 of the 8 Stages */}
                      <td className="py-3.5 px-4 text-center">
                        {category === 'NOT_STARTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs whitespace-nowrap">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>NOT STARTED</span>
                          </span>
                        )}
                        {category === 'PENDING_MANAGER_ACTIONS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>PENDING WITH MANAGER ACTIONS</span>
                          </span>
                        )}
                        {category === 'RETURNED_MANAGER_ACTIONS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                            <span>RETURNED TO MANAGER ACTIONS</span>
                          </span>
                        )}
                        {category === 'PENDING_PDP_INITIATION' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs whitespace-nowrap">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>PENDING WITH PDP INITIATION</span>
                          </span>
                        )}
                        {category === 'PENDING_MANAGER_REVIEW' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-300 shadow-2xs whitespace-nowrap">
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>PENDING WITH MANAGER REVIEW</span>
                          </span>
                        )}
                        {category === 'RETURNED_MANAGER_REVIEW' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-300 shadow-2xs whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                            <span>RETURNED TO MANAGER REVIEW</span>
                          </span>
                        )}
                        {category === 'PENDING_LNA_TEAM' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            <span>PENDING WITH LNA REVIEW</span>
                          </span>
                        )}
                        {category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>PENDING WITH EMPLOYEE ACKNOWLEDGEMENT</span>
                          </span>
                        )}
                        {category === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-center">
                        {category === 'PENDING_MANAGER_ACTIONS' ? (
                          <button
                            type="button"
                            title="Rate competencies, select 5 top priorities, and set objectives"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#211E4E] hover:bg-[#161435] hover:text-[#C8A977] transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C8A977]" />
                            <span>Review PDP</span>
                          </button>
                        ) : category === 'RETURNED_MANAGER_ACTIONS' ? (
                          <button
                            type="button"
                            title="Update competency ratings, priorities, or objectives"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-300 hover:bg-rose-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                            <span>Review PDP</span>
                          </button>
                        ) : category === 'PENDING_MANAGER_REVIEW' ? (
                          <button
                            type="button"
                            title="Specify development activities across the 5 competencies"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-indigo-200" />
                            <span>Review PDP</span>
                          </button>
                        ) : category === 'RETURNED_MANAGER_REVIEW' ? (
                          <button
                            type="button"
                            title="Adjust development activities per LNA review feedback"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-300 hover:bg-orange-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                            <span>Review PDP</span>
                          </button>
                        ) : category === 'PENDING_PDP_INITIATION' ? (
                          <button
                            type="button"
                            title="View PDP initiation status"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50/70 border border-blue-300 hover:bg-blue-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Details</span>
                          </button>
                        ) : category === 'PENDING_LNA_TEAM' ? (
                          <button
                            type="button"
                            title="View LNA team status"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50/80 border border-sky-300 hover:bg-sky-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>View Details</span>
                          </button>
                        ) : category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' ? (
                          <button
                            type="button"
                            title="View employee acknowledgement status"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>View Details</span>
                          </button>
                        ) : category === 'ACTIVE' ? (
                          <button
                            type="button"
                            title="View active PDP roadmap"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50/80 border border-teal-300 hover:bg-teal-100 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-600" />
                            <span>View Details</span>
                          </button>
                        ) : (
                          /* NOT_STARTED */
                          <button
                            type="button"
                            title="View member evaluation status"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Details</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
