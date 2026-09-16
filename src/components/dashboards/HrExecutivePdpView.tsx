import React, { useState, useMemo } from 'react';
import { usePdp } from '../../context/PdpContext';
import { TEAM_MEMBERS_OVERVIEW } from '../../data/mockData';
import {
  Users,
  Clock,
  CheckCircle2,
  FileCheck,
  GraduationCap,
  Send,
  Eye,
  Search,
  LayoutDashboard,
} from 'lucide-react';
import { PdpStatus } from '../../types/pdp';

interface HrExecutivePdpViewProps {
  onInspectEmployeePdp?: (statusToLoad?: PdpStatus) => void;
}

type FilterCategory =
  | 'ALL'
  | 'EMPLOYEE_PENDING'
  | 'EMPLOYEE_SUBMITTED'
  | 'MANAGER_PENDING'
  | 'LNA_PENDING'
  | 'ACTIVE_PDP'
  | 'PDP_COMPLETED';

export const HrExecutivePdpView: React.FC<HrExecutivePdpViewProps> = ({ onInspectEmployeePdp }) => {
  const {
    employee,
    status: currentPdpStatus,
    loadStagePreset,
  } = usePdp();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');

  // Build reactive employee list
  const employeeList = useMemo(() => {
    return TEAM_MEMBERS_OVERVIEW.map((member) => {
      if (member.id === employee.staffId) {
        let cat: FilterCategory = 'EMPLOYEE_PENDING';
        if (currentPdpStatus === 'PENDING_EMPLOYEE_EVALUATION') cat = 'EMPLOYEE_PENDING';
        else if (currentPdpStatus === 'PENDING_MANAGER_REVIEW') cat = 'EMPLOYEE_SUBMITTED';
        else if (currentPdpStatus === 'PENDING_HR_INITIATION' || currentPdpStatus === 'PDP_PLANNING_MANAGER') cat = 'MANAGER_PENDING';
        else if (currentPdpStatus === 'PENDING_LNA_TEAM') cat = 'LNA_PENDING';
        else if (currentPdpStatus === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' || currentPdpStatus === 'ACTIVE') cat = 'ACTIVE_PDP';
        else if (currentPdpStatus === 'COMPLETED') cat = 'PDP_COMPLETED';

        return {
          ...member,
          status: currentPdpStatus,
          category: cat,
          grade: employee.grade.replace(/[^0-9]/g, '') || employee.grade,
        };
      }
      return member;
    });
  }, [employee, currentPdpStatus]);

  // Compute counts for all requested categories
  const metrics = useMemo(() => {
    const employeePending = employeeList.filter(
      (m) => m.category === 'EMPLOYEE_PENDING' || m.status === 'PENDING_EMPLOYEE_EVALUATION'
    ).length;

    const employeeSubmitted = employeeList.filter(
      (m) => m.category === 'EMPLOYEE_SUBMITTED' || m.status === 'PENDING_MANAGER_REVIEW'
    ).length;

    const managerPending = employeeList.filter(
      (m) =>
        m.category === 'MANAGER_PENDING' ||
        m.status === 'PENDING_MANAGER_REVIEW' ||
        m.status === 'PENDING_HR_INITIATION' ||
        m.status === 'PDP_PLANNING_MANAGER'
    ).length;

    const lnaPending = employeeList.filter(
      (m) => m.category === 'LNA_PENDING' || m.status === 'PENDING_LNA_TEAM'
    ).length;

    const activePdp = employeeList.filter(
      (m) =>
        m.category === 'ACTIVE_PDP' ||
        m.status === 'ACTIVE' ||
        m.status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
    ).length;

    const pdpCompleted = employeeList.filter(
      (m) => m.category === 'PDP_COMPLETED' || m.status === 'COMPLETED'
    ).length;

    const total = employeeList.length;

    return {
      employeePending,
      employeeSubmitted,
      managerPending,
      lnaPending,
      activePdp,
      pdpCompleted,
      total,
    };
  }, [employeeList]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employeeList.filter((m) => {
      // Filter by category
      if (activeFilter !== 'ALL') {
        if (activeFilter === 'EMPLOYEE_PENDING') {
          if (m.category !== 'EMPLOYEE_PENDING' && m.status !== 'PENDING_EMPLOYEE_EVALUATION') return false;
        } else if (activeFilter === 'EMPLOYEE_SUBMITTED') {
          if (m.category !== 'EMPLOYEE_SUBMITTED' && m.status !== 'PENDING_MANAGER_REVIEW') return false;
        } else if (activeFilter === 'MANAGER_PENDING') {
          if (
            m.category !== 'MANAGER_PENDING' &&
            m.status !== 'PENDING_MANAGER_REVIEW' &&
            m.status !== 'PENDING_HR_INITIATION' &&
            m.status !== 'PDP_PLANNING_MANAGER'
          )
            return false;
        } else if (activeFilter === 'LNA_PENDING') {
          if (m.category !== 'LNA_PENDING' && m.status !== 'PENDING_LNA_TEAM') return false;
        } else if (activeFilter === 'ACTIVE_PDP') {
          if (
            m.category !== 'ACTIVE_PDP' &&
            m.status !== 'ACTIVE' &&
            m.status !== 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
          )
            return false;
        } else if (activeFilter === 'PDP_COMPLETED') {
          if (m.category !== 'PDP_COMPLETED' && m.status !== 'COMPLETED') return false;
        }
      }

      // Filter by department
      if (selectedDepartment !== 'ALL' && m.department !== selectedDepartment) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        const matchDept = m.department.toLowerCase().includes(q);
        const matchRole = m.role.toLowerCase().includes(q);
        const matchMgr = m.manager.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchDept && !matchRole && !matchMgr) return false;
      }

      return true;
    });
  }, [employeeList, activeFilter, selectedDepartment, searchQuery]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set(employeeList.map((m) => m.department));
    return Array.from(set);
  }, [employeeList]);

  const handleInspect = (memberStatus: string) => {
    let targetPreset: PdpStatus = 'ACTIVE';
    if (memberStatus === 'PENDING_EMPLOYEE_EVALUATION') targetPreset = 'PENDING_EMPLOYEE_EVALUATION';
    else if (memberStatus === 'PENDING_MANAGER_REVIEW') targetPreset = 'PENDING_MANAGER_REVIEW';
    else if (memberStatus === 'PENDING_HR_INITIATION') targetPreset = 'PENDING_HR_INITIATION';
    else if (memberStatus === 'PDP_PLANNING_MANAGER') targetPreset = 'PDP_PLANNING_MANAGER';
    else if (memberStatus === 'PENDING_LNA_TEAM') targetPreset = 'PENDING_LNA_TEAM';
    else if (memberStatus === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') targetPreset = 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';
    else if (memberStatus === 'ACTIVE') targetPreset = 'ACTIVE';

    loadStagePreset(targetPreset);
    if (onInspectEmployeePdp) onInspectEmployeePdp(targetPreset);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#153f5e] text-white p-4 rounded-xl shadow-xs border border-[#0f2e46] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
            <LayoutDashboard className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide uppercase">
              PDP Dashboard
            </h2>
            <p className="text-[11px] text-sky-200/80">
              Enterprise Overview & Pipeline Monitoring
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/15">
            {employeeList.length} Total Records
          </span>
        </div>
      </div>

      {/* 6 Key Requested Status Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Employee Pending */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'EMPLOYEE_PENDING' ? 'ALL' : 'EMPLOYEE_PENDING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'EMPLOYEE_PENDING'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
              : 'bg-white hover:bg-amber-50/50 border-amber-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'EMPLOYEE_PENDING' ? 'text-amber-100' : 'text-amber-800'}`}>
              Employee Pending
            </span>
            <Clock className={`w-3.5 h-3.5 ${activeFilter === 'EMPLOYEE_PENDING' ? 'text-white' : 'text-amber-600'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.employeePending}</div>
        </div>

        {/* 2. Employee Submitted */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'EMPLOYEE_SUBMITTED' ? 'ALL' : 'EMPLOYEE_SUBMITTED')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'EMPLOYEE_SUBMITTED'
              ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-400'
              : 'bg-white hover:bg-sky-50/50 border-sky-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'EMPLOYEE_SUBMITTED' ? 'text-sky-100' : 'text-sky-800'}`}>
              Employee Submitted
            </span>
            <Send className={`w-3.5 h-3.5 ${activeFilter === 'EMPLOYEE_SUBMITTED' ? 'text-white' : 'text-sky-600'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.employeeSubmitted}</div>
        </div>

        {/* 3. Manager Pending Approval */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'MANAGER_PENDING' ? 'ALL' : 'MANAGER_PENDING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'MANAGER_PENDING'
              ? 'bg-[#153f5e] text-white border-[#0f2e46] shadow-md ring-2 ring-sky-300'
              : 'bg-white hover:bg-blue-50/50 border-blue-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'MANAGER_PENDING' ? 'text-sky-100' : 'text-[#153f5e]'}`}>
              Manager Pending
            </span>
            <Users className={`w-3.5 h-3.5 ${activeFilter === 'MANAGER_PENDING' ? 'text-white' : 'text-[#153f5e]'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.managerPending}</div>
        </div>

        {/* 4. LNA Team Pending */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'LNA_PENDING' ? 'ALL' : 'LNA_PENDING')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'LNA_PENDING'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400'
              : 'bg-white hover:bg-purple-50/50 border-purple-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'LNA_PENDING' ? 'text-purple-100' : 'text-purple-800'}`}>
              LNA Team Pending
            </span>
            <GraduationCap className={`w-3.5 h-3.5 ${activeFilter === 'LNA_PENDING' ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.lnaPending}</div>
        </div>

        {/* 5. No of Active PDP */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'ACTIVE_PDP' ? 'ALL' : 'ACTIVE_PDP')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'ACTIVE_PDP'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
              : 'bg-white hover:bg-emerald-50/50 border-emerald-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'ACTIVE_PDP' ? 'text-emerald-100' : 'text-emerald-800'}`}>
              Active PDP
            </span>
            <CheckCircle2 className={`w-3.5 h-3.5 ${activeFilter === 'ACTIVE_PDP' ? 'text-white' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.activePdp}</div>
        </div>

        {/* 6. No of PDP Completed */}
        <div
          onClick={() => setActiveFilter(activeFilter === 'PDP_COMPLETED' ? 'ALL' : 'PDP_COMPLETED')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeFilter === 'PDP_COMPLETED'
              ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400'
              : 'bg-white hover:bg-teal-50/50 border-teal-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeFilter === 'PDP_COMPLETED' ? 'text-teal-100' : 'text-teal-800'}`}>
              PDP Completed
            </span>
            <FileCheck className={`w-3.5 h-3.5 ${activeFilter === 'PDP_COMPLETED' ? 'text-white' : 'text-teal-600'}`} />
          </div>
          <div className="mt-2 text-2xl font-black">{metrics.pdpCompleted}</div>
        </div>
      </div>

      {/* Employee List Section with Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-xs text-[#153f5e] uppercase tracking-wider">
                Employee PDP Tracker
              </h3>
            </div>

            {/* Search & Department Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, role..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] w-56 transition-all"
                />
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer transition-all"
              >
                <option value="ALL">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-[#153f5e] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setActiveFilter('EMPLOYEE_PENDING')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'EMPLOYEE_PENDING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-amber-800 hover:bg-amber-50'
              }`}
            >
              Employee Pending ({metrics.employeePending})
            </button>
            <button
              onClick={() => setActiveFilter('EMPLOYEE_SUBMITTED')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'EMPLOYEE_SUBMITTED'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-sky-800 hover:bg-sky-50'
              }`}
            >
              Employee Submitted ({metrics.employeeSubmitted})
            </button>
            <button
              onClick={() => setActiveFilter('MANAGER_PENDING')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'MANAGER_PENDING'
                  ? 'bg-[#153f5e] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#153f5e] hover:bg-blue-50'
              }`}
            >
              Manager Pending ({metrics.managerPending})
            </button>
            <button
              onClick={() => setActiveFilter('LNA_PENDING')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'LNA_PENDING'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-purple-800 hover:bg-purple-50'
              }`}
            >
              LNA Team Pending ({metrics.lnaPending})
            </button>
            <button
              onClick={() => setActiveFilter('ACTIVE_PDP')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'ACTIVE_PDP'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              Active PDP ({metrics.activePdp})
            </button>
            <button
              onClick={() => setActiveFilter('PDP_COMPLETED')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeFilter === 'PDP_COMPLETED'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-teal-800 hover:bg-teal-50'
              }`}
            >
              Completed ({metrics.pdpCompleted})
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#153f5e] text-white font-bold uppercase text-[10px] tracking-wider border-b border-[#0f2e46]">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3.5">Employee Name</th>
                <th className="py-2.5 px-3.5">Position</th>
                <th className="py-2.5 px-2 text-center w-16">Grade</th>
                <th className="py-2.5 px-3.5">Department</th>
                <th className="py-2.5 px-3.5">Manager</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center w-28">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 text-slate-800 font-normal">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No employees matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((member, idx) => {
                  // Stage pill styling
                  let statusBadge = {
                    bg: 'bg-slate-100 text-slate-700 border-slate-300',
                    label: member.status.replace(/_/g, ' '),
                  };

                  if (member.status === 'PENDING_EMPLOYEE_EVALUATION') {
                    statusBadge = {
                      bg: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
                      label: 'Employee Pending',
                    };
                  } else if (member.status === 'PENDING_MANAGER_REVIEW') {
                    statusBadge = {
                      bg: 'bg-sky-50 text-sky-800 border-sky-300 font-bold',
                      label: 'Manager Review Pending',
                    };
                  } else if (member.status === 'PENDING_HR_INITIATION') {
                    statusBadge = {
                      bg: 'bg-blue-50 text-[#153f5e] border-blue-300 font-bold',
                      label: 'HR Initiation Pending',
                    };
                  } else if (member.status === 'PDP_PLANNING_MANAGER') {
                    statusBadge = {
                      bg: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold',
                      label: 'Manager Roadmap Pending',
                    };
                  } else if (member.status === 'PENDING_LNA_TEAM') {
                    statusBadge = {
                      bg: 'bg-purple-50 text-purple-800 border-purple-300 font-bold',
                      label: 'LNA Team Pending',
                    };
                  } else if (member.status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') {
                    statusBadge = {
                      bg: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
                      label: 'Sign-Off Pending',
                    };
                  } else if (member.status === 'ACTIVE') {
                    statusBadge = {
                      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
                      label: 'Active PDP',
                    };
                  } else if (member.status === 'COMPLETED') {
                    statusBadge = {
                      bg: 'bg-teal-50 text-teal-800 border-teal-300 font-bold',
                      label: 'Completed',
                    };
                  }

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#f9fbfd]'
                      } hover:bg-sky-50/60`}
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-500 text-center">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900">
                        {member.name}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700">{member.role}</td>
                      <td className="py-2.5 px-2 text-center font-bold text-slate-900 font-mono">
                        {member.grade.replace(/[^0-9]/g, '') || member.grade}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-700">{member.department}</td>
                      <td className="py-2.5 px-3.5 text-slate-800 font-medium">{member.manager}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] border ${statusBadge.bg}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleInspect(member.status)}
                          className="px-3 py-1 bg-[#153f5e] hover:bg-[#0f2e46] active:scale-[0.98] text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View PDP</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
