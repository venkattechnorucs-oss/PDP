import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Send,
} from 'lucide-react';
import { TEAM_SUBMISSIONS, TeamMemberSubmission } from '../data/teamSubmissionsData';

interface HrInitiationViewProps {
  onReviewEmployee: (employee: TeamMemberSubmission) => void;
  title?: string;
  subtitle?: string;
}

type HrFilterTab = 'ALL' | 'PENDING' | 'INITIATED';

export const HrInitiationView: React.FC<HrInitiationViewProps> = ({
  onReviewEmployee,
  title,
  subtitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedFunction, setSelectedFunction] = useState('ALL');
  const [activeHrFilter, setActiveHrFilter] = useState<HrFilterTab>('ALL');

  // Derive unique filter options
  const divisions = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.division))).sort();
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.department))).sort();
  }, []);

  const functions = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.functionDept))).sort();
  }, []);

  // Helper: Determine if a submission has been initiated
  const isSubmissionInitiated = (sub: TeamMemberSubmission) => {
    return (
      sub.pdpStage === 'ACTIVE' ||
      sub.pdpStage === 'PDP_PLANNING_MANAGER' ||
      sub.pdpStage === 'PENDING_LNA_TEAM' ||
      sub.pdpStage === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
    );
  };

  // Top Summary Metrics: Pending & Initiated
  const metrics = useMemo(() => {
    const initiatedCount = TEAM_SUBMISSIONS.filter(isSubmissionInitiated).length;
    const pendingCount = TEAM_SUBMISSIONS.length - initiatedCount;
    return {
      pending: pendingCount,
      initiated: initiatedCount,
      total: TEAM_SUBMISSIONS.length,
    };
  }, []);

  const filteredEmployees = useMemo(() => {
    return TEAM_SUBMISSIONS.filter((sub) => {
      const isInitiated = isSubmissionInitiated(sub);

      // KPI Tab filter: ALL / PENDING / INITIATED
      if (activeHrFilter === 'PENDING' && isInitiated) return false;
      if (activeHrFilter === 'INITIATED' && !isInitiated) return false;

      // Dropdown filters
      if (selectedDivision !== 'ALL' && sub.division !== selectedDivision) return false;
      if (selectedDepartment !== 'ALL' && sub.department !== selectedDepartment) return false;
      if (selectedFunction !== 'ALL' && sub.functionDept !== selectedFunction) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(q);
        const matchesPos = sub.position.toLowerCase().includes(q);
        const matchesDept = sub.department.toLowerCase().includes(q);
        const matchesId = sub.id.toLowerCase().includes(q);
        const matchesFunc = sub.functionDept.toLowerCase().includes(q);
        if (!matchesName && !matchesPos && !matchesDept && !matchesId && !matchesFunc) return false;
      }

      return true;
    });
  }, [activeHrFilter, selectedDivision, selectedDepartment, selectedFunction, searchQuery]);

  const handleResetFilters = () => {
    setActiveHrFilter('ALL');
    setSelectedDivision('ALL');
    setSelectedDepartment('ALL');
    setSelectedFunction('ALL');
    setSearchQuery('');
  };

  const isFiltered =
    activeHrFilter !== 'ALL' ||
    selectedDivision !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedFunction !== 'ALL' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <span>{title || 'Professional Development Plan (PDP) – HR Initiation'}</span>
        </h1>
      </section>

      {/* 2. Top Summary KPI Cards (Pending & Initiated) matching Manager Page layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Card 1: Pending */}
        <div
          onClick={() => setActiveHrFilter(activeHrFilter === 'PENDING' ? 'ALL' : 'PENDING')}
          className={`bg-white rounded-2xl p-5 border shadow-xs transition-all cursor-pointer ${
            activeHrFilter === 'PENDING'
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

        {/* Card 2: Initiated */}
        <div
          onClick={() => setActiveHrFilter(activeHrFilter === 'INITIATED' ? 'ALL' : 'INITIATED')}
          className={`bg-white rounded-2xl p-5 border shadow-xs transition-all cursor-pointer ${
            activeHrFilter === 'INITIATED'
              ? 'border-[#211E4E] ring-2 ring-[#211E4E]/20 shadow-md'
              : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              INITIATED
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-600 tracking-tight">
            {metrics.initiated}
          </div>
        </div>
      </div>

      {/* 4. HR Filter Controls: Search & Dropdowns */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#C8A977]" />
            <span>Additional Filters</span>
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#211E4E] hover:text-[#C8A977] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, position, ERP..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-hidden transition-all"
            />
          </div>

          {/* Division Filter */}
          <div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden transition-all cursor-pointer"
            >
              <option value="ALL">All Divisions</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  Division: {div}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden transition-all cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  Dept: {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Functional Filter */}
          <div>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden transition-all cursor-pointer"
            >
              <option value="ALL">All Functions</option>
              {functions.map((fn) => (
                <option key={fn} value={fn}>
                  Function: {fn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 5. Employee List Table */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Banner Header */}
        <div className="bg-[#211E4E] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Users className="w-4 h-4 text-[#C8A977]" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
              Organizational Employee Submissions
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#C8A977]">
            Showing {filteredEmployees.length} Records
          </span>
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
                <th className="py-3 px-4">FUNCTION</th>
                <th className="py-3 px-3.5">DATE</th>
                <th className="py-3 px-4 text-center">INITIATION STATUS</th>
                <th className="py-3 px-4 text-center w-36">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic text-xs">
                    No employees found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const initiated = isSubmissionInitiated(emp);

                  return (
                    <tr
                      key={emp.id}
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
                        <span className="text-xs font-bold text-slate-900">{emp.name}</span>
                      </td>

                      {/* Position */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {emp.position}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {emp.department}
                      </td>

                      {/* Functional Area */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {emp.functionDept}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3.5 text-slate-600 font-medium whitespace-nowrap">
                        {emp.date}
                      </td>

                      {/* Initiation Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {initiated ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>INITIATED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button: Review PDP */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onReviewEmployee(emp)}
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
