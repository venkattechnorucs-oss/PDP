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
  UserCheck,
  History,
  ShieldCheck,
  Menu,
  Filter,
} from 'lucide-react';
import { PdpStatus } from '../../types/pdp';
import { HrPdpPieChart } from './hr/HrPdpPieChart';
import { HrEmployeeMasterTab } from './hr/HrEmployeeMasterTab';
import { HrReleaseHistoryTab } from './hr/HrReleaseHistoryTab';

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

type HrNavTab = 'PDP_DASHBOARD' | 'EMPLOYEE_MASTER' | 'RELEASE_HISTORY';

export const HrExecutivePdpView: React.FC<HrExecutivePdpViewProps> = ({ onInspectEmployeePdp }) => {
  const {
    employee,
    status: currentPdpStatus,
    loadStagePreset,
  } = usePdp();

  // Side navigation active tab
  const [activeNavTab, setActiveNavTab] = useState<HrNavTab>('PDP_DASHBOARD');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Table filtering & search matching Image 2
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedPosition, setSelectedPosition] = useState('ALL');
  const [selectedLnaStatus, setSelectedLnaStatus] = useState('ALL');
  const [searchBy, setSearchBy] = useState<'EMPLOYEE' | 'STAFF_ID' | 'MANAGER' | 'DEPARTMENT'>('EMPLOYEE');
  const [searchQuery, setSearchQuery] = useState('');

  // Build reactive employee list
  const employeeList = useMemo(() => {
    return TEAM_MEMBERS_OVERVIEW.map((member) => {
      // Determine division based on department
      let division = 'Operations';
      if (['Corporate HR', 'Finance & Accounting', 'Legal'].includes(member.department)) {
        division = 'Corporate';
      } else if (['Engineering & Projects', 'Technical Services', 'Asset Integrity'].includes(member.department)) {
        division = 'Engineering';
      } else if (['HSE', 'Operational Safety'].includes(member.department)) {
        division = 'HSE';
      }

      if (member.id === employee.staffId) {
        let cat: FilterCategory = 'EMPLOYEE_PENDING';
        if (currentPdpStatus === 'PENDING_EMPLOYEE_EVALUATION') cat = 'EMPLOYEE_PENDING';
        else if (currentPdpStatus === 'PENDING_MANAGER_REVIEW') cat = 'EMPLOYEE_SUBMITTED';
        else if (currentPdpStatus === 'PENDING_HR_INITIATION' || currentPdpStatus === 'PDP_PLANNING_MANAGER') cat = 'MANAGER_PENDING';
        else if (currentPdpStatus === 'PENDING_TALENT_MANAGEMENT' || currentPdpStatus === 'PENDING_LNA_TEAM') cat = 'LNA_PENDING';
        else if (currentPdpStatus === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' || currentPdpStatus === 'ACTIVE') cat = 'ACTIVE_PDP';
        else if (currentPdpStatus === 'COMPLETED') cat = 'PDP_COMPLETED';

        return {
          ...member,
          division,
          status: currentPdpStatus,
          category: cat,
          grade: employee.grade.replace(/[^0-9]/g, '') || employee.grade,
        };
      }
      return {
        ...member,
        division,
      };
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
      (m) =>
        m.category === 'LNA_PENDING' ||
        m.status === 'PENDING_TALENT_MANAGEMENT' ||
        m.status === 'PENDING_LNA_TEAM'
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
      total,
      employeePending,
      employeeSubmitted,
      managerPending,
      lnaPending,
      activePdp,
      pdpCompleted,
    };
  }, [employeeList]);

  // Workflow Pipeline Chart Data (4 categories)
  const workflowChartData = useMemo(() => {
    return [
      {
        name: 'Pending with Employees',
        value: metrics.employeePending,
        color: '#f59e0b',
        filterKey: 'EMPLOYEE_PENDING',
      },
      {
        name: 'Employee Submitted',
        value: metrics.employeeSubmitted,
        color: '#0284c7',
        filterKey: 'EMPLOYEE_SUBMITTED',
      },
      {
        name: 'Pending with Manager',
        value: metrics.managerPending,
        color: '#153f5e',
        filterKey: 'MANAGER_PENDING',
      },
      {
        name: 'Pending with Talent Management',
        value: metrics.lnaPending,
        color: '#8b5cf6',
        filterKey: 'LNA_PENDING',
      },
    ];
  }, [metrics]);

  // Execution Chart Data (2 categories: Active PDP & PDP Completed)
  const executionChartData = useMemo(() => {
    return [
      {
        name: 'Active PDP',
        value: metrics.activePdp,
        color: '#10b981',
        filterKey: 'ACTIVE_PDP',
      },
      {
        name: 'PDP Completed',
        value: metrics.pdpCompleted,
        color: '#0f766e',
        filterKey: 'PDP_COMPLETED',
      },
    ];
  }, [metrics]);

  // Filter options
  const divisions = useMemo(() => {
    const set = new Set(employeeList.map((m) => m.division));
    return Array.from(set);
  }, [employeeList]);

  const departments = useMemo(() => {
    const set = new Set(employeeList.map((m) => m.department));
    return Array.from(set);
  }, [employeeList]);

  const positions = useMemo(() => {
    const set = new Set(employeeList.map((m) => m.role));
    return Array.from(set);
  }, [employeeList]);

  // Filtered employees based on category, filters, and search
  const filteredEmployees = useMemo(() => {
    return employeeList.filter((m) => {
      // Category filter (from boxes or chart clicks)
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

      // Division filter
      if (selectedDivision !== 'ALL' && m.division !== selectedDivision) {
        return false;
      }

      // Department filter
      if (selectedDepartment !== 'ALL' && m.department !== selectedDepartment) {
        return false;
      }

      // Position filter
      if (selectedPosition !== 'ALL' && m.role !== selectedPosition) {
        return false;
      }

      // LNA Status filter
      if (selectedLnaStatus !== 'ALL') {
        if (selectedLnaStatus === 'PENDING' && m.category !== 'LNA_PENDING') return false;
        if (selectedLnaStatus === 'ASSIGNED' && m.category !== 'ACTIVE_PDP' && m.category !== 'PDP_COMPLETED') return false;
      }

      // Search field
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (searchBy === 'STAFF_ID') {
          if (!m.id.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'MANAGER') {
          if (!m.manager.toLowerCase().includes(q)) return false;
        } else if (searchBy === 'DEPARTMENT') {
          if (!m.department.toLowerCase().includes(q)) return false;
        } else {
          // Default: search by Employee Name
          if (!m.name.toLowerCase().includes(q) && !m.id.toLowerCase().includes(q)) return false;
        }
      }

      return true;
    });
  }, [
    employeeList,
    activeFilter,
    selectedDivision,
    selectedDepartment,
    selectedPosition,
    selectedLnaStatus,
    searchBy,
    searchQuery,
  ]);

  const handleInspect = (memberStatus: string) => {
    let targetPreset: PdpStatus = 'ACTIVE';
    if (memberStatus === 'PENDING_EMPLOYEE_EVALUATION') targetPreset = 'PENDING_EMPLOYEE_EVALUATION';
    else if (memberStatus === 'PENDING_MANAGER_REVIEW') targetPreset = 'PENDING_MANAGER_REVIEW';
    else if (memberStatus === 'PENDING_HR_INITIATION') targetPreset = 'PENDING_HR_INITIATION';
    else if (memberStatus === 'PDP_PLANNING_MANAGER') targetPreset = 'PDP_PLANNING_MANAGER';
    else if (memberStatus === 'PENDING_TALENT_MANAGEMENT' || memberStatus === 'PENDING_LNA_TEAM') targetPreset = 'PENDING_TALENT_MANAGEMENT';
    else if (memberStatus === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') targetPreset = 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';
    else if (memberStatus === 'ACTIVE') targetPreset = 'ACTIVE';

    loadStagePreset(targetPreset);
    if (onInspectEmployeePdp) onInspectEmployeePdp(targetPreset);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* SIDE NAVIGATION: HR Dashboard */}
      <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden md:sticky md:top-20">
        {/* Nav Header */}
        <div className="p-4 bg-[#153f5e] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
              <ShieldCheck className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h2 className="font-bold text-xs uppercase tracking-wider">
                HR Dashboard
              </h2>
              <p className="text-[10px] text-sky-200/80">Talent & Operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-1 rounded-md text-white hover:bg-white/10"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          className={`p-3 space-y-1.5 ${
            isMobileNavOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* 1. PDP Dashboard */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('PDP_DASHBOARD');
              setIsMobileNavOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNavTab === 'PDP_DASHBOARD'
                ? 'bg-[#153f5e] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeNavTab === 'PDP_DASHBOARD'
                    ? 'text-sky-300'
                    : 'text-slate-500'
                }`}
              />
              <span>PDP Dashboard</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeNavTab === 'PDP_DASHBOARD'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {metrics.total}
            </span>
          </button>

          {/* 2. Employee Master */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('EMPLOYEE_MASTER');
              setIsMobileNavOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNavTab === 'EMPLOYEE_MASTER'
                ? 'bg-[#153f5e] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users
                className={`w-4 h-4 ${
                  activeNavTab === 'EMPLOYEE_MASTER'
                    ? 'text-sky-300'
                    : 'text-slate-500'
                }`}
              />
              <span>Employee Master</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeNavTab === 'EMPLOYEE_MASTER'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Master
            </span>
          </button>

          {/* 3. Release History */}
          <button
            type="button"
            onClick={() => {
              setActiveNavTab('RELEASE_HISTORY');
              setIsMobileNavOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeNavTab === 'RELEASE_HISTORY'
                ? 'bg-[#153f5e] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History
                className={`w-4 h-4 ${
                  activeNavTab === 'RELEASE_HISTORY'
                    ? 'text-sky-300'
                    : 'text-slate-500'
                }`}
              />
              <span>Release History</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeNavTab === 'RELEASE_HISTORY'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              Logs
            </span>
          </button>
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/60 hidden md:block">
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Cycle:</span>
            <span className="font-bold text-slate-800">FY 2026</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
            <span>Completion:</span>
            <span className="font-bold text-emerald-700">
              {Math.round(((metrics.activePdp + metrics.pdpCompleted) / metrics.total) * 100)}%
            </span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full space-y-5 min-w-0">
        {activeNavTab === 'PDP_DASHBOARD' && (
          <div className="space-y-5">
            {/* Header Banner - Only PDP Dashboard title as requested */}
            <div className="bg-[#153f5e] text-white p-4 rounded-xl shadow-xs border border-[#0f2e46] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                  <LayoutDashboard className="w-4 h-4 text-sky-200" />
                </div>
                <h2 className="text-base font-bold tracking-wide uppercase">
                  PDP Dashboard
                </h2>
              </div>
            </div>

            {/* ROW 1: 5 Specific Metric Boxes */}
            {/* Total Employees | Pending with Employees | Employee Submitted | Pending with Manager | Pending with LNA Team */}
            {/* Exactly only the number in each box, no sentences under that */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* 1. Total Employees */}
              <div
                onClick={() => setActiveFilter('ALL')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'ALL'
                    ? 'bg-[#153f5e] text-white border-[#0f2e46] shadow-md ring-2 ring-sky-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'ALL' ? 'text-sky-100' : 'text-[#153f5e]'
                    }`}
                  >
                    Total Employees
                  </span>
                  <Users
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'ALL' ? 'text-white' : 'text-[#153f5e]'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">{metrics.total}</div>
              </div>

              {/* 2. Pending with Employees */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'EMPLOYEE_PENDING' ? 'ALL' : 'EMPLOYEE_PENDING'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'EMPLOYEE_PENDING'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50/50 border-amber-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'EMPLOYEE_PENDING'
                        ? 'text-amber-100'
                        : 'text-amber-800'
                    }`}
                  >
                    Pending with Employees
                  </span>
                  <Clock
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'EMPLOYEE_PENDING'
                        ? 'text-white'
                        : 'text-amber-600'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">
                  {metrics.employeePending}
                </div>
              </div>

              {/* 3. Employee Submitted */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'EMPLOYEE_SUBMITTED' ? 'ALL' : 'EMPLOYEE_SUBMITTED'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'EMPLOYEE_SUBMITTED'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-400'
                    : 'bg-white hover:bg-sky-50/50 border-sky-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'EMPLOYEE_SUBMITTED'
                        ? 'text-sky-100'
                        : 'text-sky-800'
                    }`}
                  >
                    Employee Submitted
                  </span>
                  <Send
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'EMPLOYEE_SUBMITTED'
                        ? 'text-white'
                        : 'text-sky-600'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">
                  {metrics.employeeSubmitted}
                </div>
              </div>

              {/* 4. Pending with Manager */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'MANAGER_PENDING' ? 'ALL' : 'MANAGER_PENDING'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'MANAGER_PENDING'
                    ? 'bg-indigo-700 text-white border-indigo-800 shadow-md ring-2 ring-indigo-300'
                    : 'bg-white hover:bg-indigo-50/50 border-indigo-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'MANAGER_PENDING'
                        ? 'text-indigo-100'
                        : 'text-indigo-800'
                    }`}
                  >
                    Pending with Manager
                  </span>
                  <UserCheck
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'MANAGER_PENDING'
                        ? 'text-white'
                        : 'text-indigo-600'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">
                  {metrics.managerPending}
                </div>
              </div>

              {/* 5. Pending with Talent Management */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'LNA_PENDING' ? 'ALL' : 'LNA_PENDING'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'LNA_PENDING'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-400'
                    : 'bg-white hover:bg-purple-50/50 border-purple-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'LNA_PENDING'
                        ? 'text-purple-100'
                        : 'text-purple-800'
                    }`}
                  >
                    Pending with Talent Management
                  </span>
                  <GraduationCap
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'LNA_PENDING'
                        ? 'text-white'
                        : 'text-purple-600'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">{metrics.lnaPending}</div>
              </div>
            </div>

            {/* ROW 2: Active PDP and PDP Completed in a separate row */}
            {/* Exactly only the number in each box, no sentences under that */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Active PDP */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'ACTIVE_PDP' ? 'ALL' : 'ACTIVE_PDP'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'ACTIVE_PDP'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-emerald-50/50 border-emerald-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'ACTIVE_PDP'
                        ? 'text-emerald-100'
                        : 'text-emerald-800'
                    }`}
                  >
                    Active PDP
                  </span>
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'ACTIVE_PDP'
                        ? 'text-white'
                        : 'text-emerald-600'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">{metrics.activePdp}</div>
              </div>

              {/* PDP Completed */}
              <div
                onClick={() =>
                  setActiveFilter(
                    activeFilter === 'PDP_COMPLETED' ? 'ALL' : 'PDP_COMPLETED'
                  )
                }
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  activeFilter === 'PDP_COMPLETED'
                    ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400'
                    : 'bg-white hover:bg-teal-50/50 border-teal-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      activeFilter === 'PDP_COMPLETED'
                        ? 'text-teal-100'
                        : 'text-teal-800'
                    }`}
                  >
                    PDP Completed
                  </span>
                  <FileCheck
                    className={`w-3.5 h-3.5 ${
                      activeFilter === 'PDP_COMPLETED'
                        ? 'text-white'
                        : 'text-teal-700'
                    }`}
                  />
                </div>
                <div className="mt-2 text-2xl font-black">{metrics.pdpCompleted}</div>
              </div>
            </div>

            {/* TWO PIE CHARTS: Split Active PDP / PDP Completed in one chart and others in one chart */}
            <HrPdpPieChart
              workflowData={workflowChartData}
              executionData={executionChartData}
              activeFilter={activeFilter}
              onSelectFilter={(f) => setActiveFilter(f as FilterCategory)}
              workflowTotal={
                metrics.employeePending +
                metrics.employeeSubmitted +
                metrics.managerPending +
                metrics.lnaPending
              }
              executionTotal={metrics.activePdp + metrics.pdpCompleted}
            />

            {/* ORGANIZATIONAL MONITORING & ANALYTICAL FILTERS - Matching Image 2 Screenshot Exactly */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#153f5e] shrink-0">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#153f5e]">
                  ORGANIZATIONAL MONITORING & ANALYTICAL FILTERS
                </h3>
              </div>

              {/* Filter controls row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* 1. Division */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Division
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
                  >
                    <option value="ALL">All Divisions</option>
                    {divisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Department */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
                  >
                    <option value="ALL">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Designation / Position */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Designation / Position
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
                  >
                    <option value="ALL">All Positions</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Talent Management Status */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Talent Management Status
                  </label>
                  <select
                    value={selectedLnaStatus}
                    onChange={(e) => setSelectedLnaStatus(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending Talent Management</option>
                    <option value="ASSIGNED">Assigned / Active</option>
                  </select>
                </div>

                {/* 5. Search By */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Search By
                  </label>
                  <select
                    value={searchBy}
                    onChange={(e) =>
                      setSearchBy(e.target.value as 'EMPLOYEE' | 'STAFF_ID' | 'MANAGER' | 'DEPARTMENT')
                    }
                    className="w-full py-1.5 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="STAFF_ID">Staff ID</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DEPARTMENT">Department</option>
                  </select>
                </div>

                {/* 6. Search Employee Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Search Employee
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Employee..."
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Tracker Table - Clean & Professional */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#153f5e] text-white font-bold text-[11px] uppercase tracking-wider border-b border-[#0f2e46]">
                      <th className="py-3 px-3.5">Employee</th>
                      <th className="py-3 px-3.5">Role / Title</th>
                      <th className="py-3 px-2 text-center">Grade</th>
                      <th className="py-3 px-3.5">Department</th>
                      <th className="py-3 px-3.5">Line Manager</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center w-24">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 font-normal">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                          No employee records found matching current criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((member) => {
                        const isMainUser = member.id === employee.staffId;
                        return (
                          <tr
                            key={member.id}
                            className={`transition-colors hover:bg-sky-50/50 ${
                              isMainUser ? 'bg-sky-50/20 font-semibold' : ''
                            }`}
                          >
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#153f5e] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{member.name}</span>
                                    {isMainUser && (
                                      <span className="text-[9px] px-1.5 py-0.2 bg-[#153f5e] text-white rounded font-normal">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-500">
                                    {member.id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3.5 text-slate-700 font-medium">
                              {member.role}
                            </td>

                            <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">
                              {member.grade}
                            </td>

                            <td className="py-3 px-3.5 text-slate-700">
                              {member.department}
                            </td>

                            <td className="py-3 px-3.5 text-slate-700 font-medium">
                              {member.manager}
                            </td>

                            <td className="py-3 px-3 text-center">
                              {member.category === 'EMPLOYEE_PENDING' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  <Clock className="w-3 h-3" /> Employee Pending
                                </span>
                              )}
                              {member.category === 'EMPLOYEE_SUBMITTED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                  <Send className="w-3 h-3" /> Submitted
                                </span>
                              )}
                              {member.category === 'MANAGER_PENDING' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  <UserCheck className="w-3 h-3" /> Manager Review
                                </span>
                              )}
                              {member.category === 'LNA_PENDING' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  <GraduationCap className="w-3 h-3" /> Talent Management
                                </span>
                              )}
                              {member.category === 'ACTIVE_PDP' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Active PDP
                                </span>
                              )}
                              {member.category === 'PDP_COMPLETED' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                  <FileCheck className="w-3 h-3" /> Completed
                                </span>
                              )}
                            </td>

                            {/* Action column: "View" button as requested */}
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleInspect(member.status)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 hover:bg-sky-100 text-[#153f5e] font-semibold text-xs rounded-md border border-sky-200 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-700" />
                                <span>View</span>
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
        )}

        {activeNavTab === 'EMPLOYEE_MASTER' && <HrEmployeeMasterTab />}

        {activeNavTab === 'RELEASE_HISTORY' && <HrReleaseHistoryTab />}
      </div>
    </div>
  );
};
