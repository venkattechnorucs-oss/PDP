import React, { useState, useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  Search,
  Eye,
  AlertCircle,
  RotateCcw,
  FileText,
  GraduationCap,
} from 'lucide-react';
import {
  TEAM_SUBMISSIONS,
  TeamMemberSubmission,
  getSubmissionCategory,
} from '../data/teamSubmissionsData';
import { PdpStatus } from '../types/pdp';

interface LnaTeamViewProps {
  onReviewEmployee: (
    employee: TeamMemberSubmission,
    targetStage?: PdpStatus
  ) => void;
}

type LnaFilterTab =
  | 'ALL'
  | 'PDP_INITIATION'
  | 'PENDING_LNA_REVIEW'
  | 'RETURNED_MANAGER_ACTIONS'
  | 'RETURNED_MANAGER_REVIEW'
  | 'PENDING_EMP_SIGNOFF';

export const LnaTeamView: React.FC<LnaTeamViewProps> = ({ onReviewEmployee }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<LnaFilterTab>('ALL');

  const metrics = useMemo(() => {
    let pdpInitiation = 0;
    let pendingLnaReview = 0;
    let returnedManagerActions = 0;
    let returnedManagerReview = 0;
    let pendingEmpSignOff = 0;

    TEAM_SUBMISSIONS.forEach((sub) => {
      const cat = getSubmissionCategory(sub);
      if (cat === 'PENDING_PDP_INITIATION') pdpInitiation++;
      else if (cat === 'PENDING_LNA_TEAM') pendingLnaReview++;
      else if (cat === 'RETURNED_MANAGER_ACTIONS') returnedManagerActions++;
      else if (cat === 'RETURNED_MANAGER_REVIEW') returnedManagerReview++;
      else if (cat === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') pendingEmpSignOff++;
    });

    return {
      pdpInitiation,
      pendingLnaReview,
      returnedManagerActions,
      returnedManagerReview,
      pendingEmpSignOff,
      total: TEAM_SUBMISSIONS.length,
    };
  }, []);

  const filteredSubmissions = useMemo(() => {
    const priorityOrder = (sub: TeamMemberSubmission): number => {
      const cat = getSubmissionCategory(sub);
      if (cat === 'PENDING_LNA_TEAM') return 1;
      if (cat === 'PENDING_PDP_INITIATION') return 2;
      if (cat === 'RETURNED_MANAGER_ACTIONS') return 3;
      if (cat === 'RETURNED_MANAGER_REVIEW') return 4;
      if (cat === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') return 5;
      if (cat === 'ACTIVE') return 6;
      if (cat === 'PENDING_MANAGER_REVIEW' || cat === 'PENDING_MANAGER_ACTIONS') return 7;
      return 8;
    };

    return TEAM_SUBMISSIONS.filter((sub) => {
      const cat = getSubmissionCategory(sub);
      if (activeFilter === 'PDP_INITIATION' && cat !== 'PENDING_PDP_INITIATION') {
        return false;
      }
      if (activeFilter === 'PENDING_LNA_REVIEW' && cat !== 'PENDING_LNA_TEAM') {
        return false;
      }
      if (
        activeFilter === 'RETURNED_MANAGER_ACTIONS' &&
        cat !== 'RETURNED_MANAGER_ACTIONS'
      ) {
        return false;
      }
      if (
        activeFilter === 'RETURNED_MANAGER_REVIEW' &&
        cat !== 'RETURNED_MANAGER_REVIEW'
      ) {
        return false;
      }
      if (
        activeFilter === 'PENDING_EMP_SIGNOFF' &&
        cat !== 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(q);
        const matchesPos = sub.position.toLowerCase().includes(q);
        const matchesDept = sub.department.toLowerCase().includes(q);
        const matchesId = sub.id.toLowerCase().includes(q);
        if (!matchesName && !matchesPos && !matchesDept && !matchesId) return false;
      }

      return true;
    }).sort((a, b) => priorityOrder(a) - priorityOrder(b));
  }, [activeFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveFilter('ALL');
    setSearchQuery('');
  };

  const isFiltered = activeFilter !== 'ALL' || searchQuery.trim().length > 0;

  const handleActionClick = (sub: TeamMemberSubmission) => {
    const cat = getSubmissionCategory(sub);
    if (cat === 'PENDING_PDP_INITIATION') {
      onReviewEmployee(sub, 'PENDING_HR_INITIATION');
    } else if (cat === 'PENDING_LNA_TEAM') {
      onReviewEmployee(sub, 'PENDING_LNA_TEAM');
    } else if (cat === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') {
      onReviewEmployee(sub, 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT');
    } else if (cat === 'ACTIVE') {
      onReviewEmployee(sub, 'ACTIVE');
    } else if (cat === 'PENDING_MANAGER_REVIEW' || cat === 'RETURNED_MANAGER_REVIEW') {
      onReviewEmployee(sub, 'PDP_PLANNING_MANAGER');
    } else if (cat === 'PENDING_MANAGER_ACTIONS' || cat === 'RETURNED_MANAGER_ACTIONS') {
      onReviewEmployee(sub, 'PENDING_MANAGER_REVIEW');
    } else {
      onReviewEmployee(sub, 'PENDING_EMPLOYEE_EVALUATION');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Professional Development Plan (PDP) – LNA Team
        </h1>
      </section>

      {/* 2. Top Status Cards - Exact Sequence & Labels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {/* Card 1: PENDING WITH PDP INITIATION */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'PDP_INITIATION' ? 'ALL' : 'PDP_INITIATION'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'PDP_INITIATION'
              ? 'bg-[#dbeafe] border-[#2563eb] ring-1 ring-blue-400/40 shadow-xs'
              : 'bg-[#eff6ff] border-blue-200/90 hover:border-blue-300 hover:bg-[#e0effe]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#1d4ed8] uppercase leading-tight">
              PENDING WITH PDP INITIATION
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#2563eb] leading-tight mt-0.5">
              {metrics.pdpInitiation}
            </div>
          </div>
        </div>

        {/* Card 2: RETURNED TO MANAGER ACTION */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'RETURNED_MANAGER_ACTIONS'
                ? 'ALL'
                : 'RETURNED_MANAGER_ACTIONS'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'RETURNED_MANAGER_ACTIONS'
              ? 'bg-[#ffe4e6] border-[#e11d48] ring-1 ring-rose-400/40 shadow-xs'
              : 'bg-[#fff1f2] border-rose-200/90 hover:border-rose-300 hover:bg-[#ffe4e6]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#be123c] uppercase leading-tight">
              RETURNED TO MANAGER ACTION
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#e11d48] leading-tight mt-0.5">
              {metrics.returnedManagerActions}
            </div>
          </div>
        </div>

        {/* Card 3: PENDING WITH LNA REVIEW */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'PENDING_LNA_REVIEW' ? 'ALL' : 'PENDING_LNA_REVIEW'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'PENDING_LNA_REVIEW'
              ? 'bg-[#e0f2fe] border-[#0284c7] ring-1 ring-sky-400/40 shadow-xs'
              : 'bg-[#f0f9ff] border-sky-200/90 hover:border-sky-300 hover:bg-[#e0f2fe]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#0284c7] uppercase leading-tight">
              PENDING WITH LNA REVIEW
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#0284c7] leading-tight mt-0.5">
              {metrics.pendingLnaReview}
            </div>
          </div>
        </div>

        {/* Card 4: RETURN TO MANAGER REVIEW */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'RETURNED_MANAGER_REVIEW'
                ? 'ALL'
                : 'RETURNED_MANAGER_REVIEW'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'RETURNED_MANAGER_REVIEW'
              ? 'bg-[#feeede] border-[#ea580c] ring-1 ring-amber-400/40 shadow-xs'
              : 'bg-[#fff7ed] border-amber-200/90 hover:border-amber-300 hover:bg-[#ffeedd]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#9a3412] uppercase leading-tight">
              RETURN TO MANAGER REVIEW
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#c2410c] leading-tight mt-0.5">
              {metrics.returnedManagerReview}
            </div>
          </div>
        </div>

        {/* Card 5: PENDING WITH EMPLOYEE SIGN-OFF */}
        <div
          onClick={() =>
            setActiveFilter(
              activeFilter === 'PENDING_EMP_SIGNOFF' ? 'ALL' : 'PENDING_EMP_SIGNOFF'
            )
          }
          className={`rounded-xl py-2 px-3 transition-all cursor-pointer flex flex-col justify-between select-none border ${
            activeFilter === 'PENDING_EMP_SIGNOFF'
              ? 'bg-[#dcfce7] border-[#059669] ring-1 ring-emerald-400/40 shadow-xs'
              : 'bg-[#f0fdf4] border-emerald-200/90 hover:border-emerald-300 hover:bg-[#dcfce7]'
          }`}
        >
          <div>
            <div className="text-[10px] sm:text-[10.5px] font-semibold tracking-normal text-[#047857] uppercase leading-tight">
              PENDING WITH EMPLOYEE SIGN-OFF
            </div>
            <div className="text-[19px] sm:text-[20px] font-bold text-[#059669] leading-tight mt-0.5">
              {metrics.pendingEmpSignOff}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Action Bar */}
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

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'ALL'
                ? 'bg-[#211E4E] text-white border-[#211E4E] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>All Submissions</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                activeFilter === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/80 text-slate-700'
              }`}
            >
              {metrics.total}
            </span>
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#211E4E] hover:text-[#C8A977] bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Submissions Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Header Banner */}
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

        {/* Table */}
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
                  const category = getSubmissionCategory(sub);

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
                          <span className="text-xs font-bold text-slate-900 block">
                            {sub.name}
                          </span>
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

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {category === 'PENDING_PDP_INITIATION' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs whitespace-nowrap">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>PENDING WITH PDP INITIATION</span>
                          </span>
                        )}
                        {category === 'PENDING_LNA_TEAM' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-300 shadow-2xs whitespace-nowrap">
                            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                            <span>PENDING WITH LNA REVIEW</span>
                          </span>
                        )}
                        {category === 'RETURNED_MANAGER_ACTIONS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-2xs whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                            <span>RETURNED TO MANAGER ACTION</span>
                          </span>
                        )}
                        {category === 'RETURNED_MANAGER_REVIEW' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-300 shadow-2xs whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                            <span>RETURN TO MANAGER REVIEW</span>
                          </span>
                        )}
                        {category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>PENDING WITH EMPLOYEE SIGN-OFF</span>
                          </span>
                        )}
                        {category === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                        {(category === 'PENDING_MANAGER_ACTIONS' ||
                          category === 'PENDING_MANAGER_REVIEW') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>WITH MANAGER</span>
                          </span>
                        )}
                        {category === 'NOT_STARTED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs whitespace-nowrap">
                            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>NOT STARTED</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-center">
                        {category === 'PENDING_PDP_INITIATION' ? (
                          <button
                            type="button"
                            title="Review objectives and initiate PDP"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#211E4E] hover:bg-[#161435] hover:text-[#C8A977] transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#C8A977]" />
                            <span>Review PDP</span>
                          </button>
                        ) : category === 'PENDING_LNA_TEAM' ? (
                          <button
                            type="button"
                            title="Assign Learning & Training Plans across 5 competencies"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-sky-200" />
                            <span>Review PDP</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="View employee PDP details"
                            onClick={() => handleActionClick(sub)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View PDP</span>
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
