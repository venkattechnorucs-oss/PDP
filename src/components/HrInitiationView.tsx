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
} from 'lucide-react';
import { TEAM_SUBMISSIONS, TeamMemberSubmission } from '../data/teamSubmissionsData';

interface HrInitiationViewProps {
  onReviewEmployee: (employee: TeamMemberSubmission) => void;
  title?: string;
  subtitle?: string;
}

export const HrInitiationView: React.FC<HrInitiationViewProps> = ({
  onReviewEmployee,
  title,
  subtitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedFunction, setSelectedFunction] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

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

  const filteredEmployees = useMemo(() => {
    return TEAM_SUBMISSIONS.filter((sub) => {
      if (selectedDivision !== 'ALL' && sub.division !== selectedDivision) return false;
      if (selectedDepartment !== 'ALL' && sub.department !== selectedDepartment) return false;
      if (selectedFunction !== 'ALL' && sub.functionDept !== selectedFunction) return false;
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'PENDING_APPROVAL' && sub.status !== 'PENDING APPROVAL') return false;
        if (selectedStatus === 'APPROVED' && sub.status !== 'APPROVED') return false;
        if (selectedStatus === 'RETURNED' && sub.status !== 'RETURNED') return false;
      }

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
  }, [selectedDivision, selectedDepartment, selectedFunction, selectedStatus, searchQuery]);

  const handleResetFilters = () => {
    setSelectedDivision('ALL');
    setSelectedDepartment('ALL');
    setSelectedFunction('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  const isFiltered =
    selectedDivision !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedFunction !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(33,30,78,0.05)] border border-white/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{title || 'Personal Development Plan (PDP) – HR Initiation'}</span>
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-white/80 font-normal">
              {subtitle ||
                'Filter employee submissions by functional area, department, and division. Review development objectives and initiate organizational PDP cycles.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#C8A977] text-[#211E4E] shadow-2xs">
              {filteredEmployees.length} of {TEAM_SUBMISSIONS.length} Employees
            </span>
          </div>
        </div>
      </section>

      {/* 2. HR Filter Controls: Functional, Department, Division, Status & Search */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-[#C8A977]" />
            <span>Employee Filters</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-hidden transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING_APPROVAL">Pending Approval / Review</option>
              <option value="APPROVED">Approved / Ready to Initiate</option>
              <option value="RETURNED">Returned for Revisions</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Employee List Table */}
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
                <th className="py-3 px-4 text-center">STATUS</th>
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
                  const isApproved = emp.status === 'APPROVED';
                  const isPending = emp.status === 'PENDING APPROVAL';
                  const isReturned = emp.status === 'RETURNED';

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

                      {/* Employee Name (No Emp ID underneath) */}
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

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs whitespace-nowrap">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>APPROVED</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>PENDING APPROVAL</span>
                          </span>
                        )}
                        {isReturned && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-300 shadow-2xs whitespace-nowrap">
                            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                            <span>RETURNED</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button: Review PDP */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onReviewEmployee(emp)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#211E4E] hover:bg-[#161435] hover:text-[#C8A977] transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C8A977]" />
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
