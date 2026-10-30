import React, { useState, useMemo } from 'react';
import { Search, Eye, Users, CheckCircle2, Clock } from 'lucide-react';
import { TEAM_SUBMISSIONS, TeamMemberSubmission } from '../data/teamSubmissionsData';

interface ReviewAndAssignViewProps {
  onReviewEmployee: (submission: TeamMemberSubmission) => void;
}

export const ReviewAndAssignView: React.FC<ReviewAndAssignViewProps> = ({
  onReviewEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'ASSIGNED'>('ALL');

  const metrics = useMemo(() => {
    let pending = 0;
    let assigned = 0;
    TEAM_SUBMISSIONS.forEach((sub) => {
      if (sub.status === 'APPROVED') {
        assigned++;
      } else {
        pending++;
      }
    });
    return { pending, assigned };
  }, []);

  const filteredMembers = useMemo(() => {
    return TEAM_SUBMISSIONS.filter((sub) => {
      if (activeFilter === 'PENDING' && sub.status === 'APPROVED') return false;
      if (activeFilter === 'ASSIGNED' && sub.status !== 'APPROVED') return false;

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
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80 text-white">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Review & Assign – Development Roadmap
        </h1>
      </section>

      {/* 2. Top Summary KPI Cards: Pending and Assigned */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Card 1: Pending */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'PENDING' ? 'ALL' : 'PENDING')}
          className={`bg-white rounded-2xl p-5 border shadow-xs transition-all cursor-pointer ${
            activeFilter === 'PENDING'
              ? 'border-[#211E4E] ring-2 ring-[#211E4E]/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              PENDING
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
            {metrics.pending}
          </div>
        </div>

        {/* Card 2: Assigned */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'ASSIGNED' ? 'ALL' : 'ASSIGNED')}
          className={`bg-white rounded-2xl p-5 border shadow-xs transition-all cursor-pointer ${
            activeFilter === 'ASSIGNED'
              ? 'border-[#211E4E] ring-2 ring-[#211E4E]/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ASSIGNED
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-[#059669] tracking-tight">
            {metrics.assigned}
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team members by name, position, department..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 transition-all outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Members ({TEAM_SUBMISSIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'PENDING'
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('ASSIGNED')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'ASSIGNED'
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Assigned
          </button>
        </div>
      </div>

      {/* 4. Team Roster Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="w-4 h-4 text-[#C8A977]" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Team Members for Roadmap Assignment
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#C8A977]">
            Showing {filteredMembers.length} Employees
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">EMPLOYEE NAME</th>
                <th className="py-3 px-4">POSITION</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">SUBMISSION DATE</th>
                <th className="py-3 px-4 text-center">STATUS</th>
                <th className="py-3 px-4 text-center w-36">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 italic text-xs">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((sub, index) => {
                  const isAssigned = sub.status === 'APPROVED';

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
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#211E4E] text-[#C8A977] font-bold text-[11px] flex items-center justify-center shrink-0">
                            {sub.avatarInitials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{sub.name}</div>
                            <div className="text-[10px] text-slate-400">{sub.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {sub.position}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <div>{sub.department}</div>
                        <div className="text-[10px] text-slate-400">{sub.division}</div>
                      </td>

                      {/* Submission Date */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {sub.date}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isAssigned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>ASSIGNED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onReviewEmployee(sub)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap text-[#211E4E] bg-white border border-slate-300 hover:bg-[#211E4E] hover:text-white group"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C8A977] group-hover:text-[#C8A977]" />
                          <span>Review PDP</span>
                        </button>
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
