import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Users,
  Search,
  RotateCcw,
  Eye,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Layers,
  UserCheck,
  PlayCircle,
  Target,
  Activity,
  Flame,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { TEAM_SUBMISSIONS, TeamMemberSubmission } from '../data/teamSubmissionsData';

interface HrPdpDashboardViewProps {
  onReviewEmployee: (employee: TeamMemberSubmission) => void;
}

type FilterStageType =
  | 'ALL'
  | 'NOT_STARTED'
  | 'PENDING_APPROVAL'
  | 'PENDING_HR'
  | 'PENDING_MANAGER'
  | 'PENDING_LNA'
  | 'PENDING_EMPLOYEE'
  | 'ACKNOWLEDGED';

export const HrPdpDashboardView: React.FC<HrPdpDashboardViewProps> = ({
  onReviewEmployee,
}) => {
  const [selectedFilterStage, setSelectedFilterStage] = useState<FilterStageType>('ALL');
  const [activeExecutionFilter, setActiveExecutionFilter] = useState<'ALL' | 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchBy, setSearchBy] = useState<'Employee' | 'Manager'>('Employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSlice, setHoveredSlice] = useState<{
    chartId: string;
    label: string;
    count: number;
    percentage: number;
    color: string;
  } | null>(null);

  // Derive dynamic counts for the 8 requested metrics
  const metrics = useMemo(() => {
    let notStarted = 0;
    let pendingApproval = 0;
    let pendingHr = 0;
    let pendingManager = 0;
    let pendingLna = 0;
    let pendingEmployee = 0;
    let acknowledged = 0;

    TEAM_SUBMISSIONS.forEach((sub, idx) => {
      // Deterministically categorize mock submissions across the 7 stages
      if (idx % 8 === 0) {
        notStarted++;
      } else if (sub.pdpStage === 'PENDING_HR_INITIATION' || idx % 7 === 1) {
        pendingHr++;
        pendingApproval++;
      } else if (sub.pdpStage === 'PENDING_MANAGER_REVIEW' || sub.pdpStage === 'PDP_PLANNING_MANAGER' || idx % 7 === 2) {
        pendingManager++;
        pendingApproval++;
      } else if (sub.pdpStage === 'PENDING_LNA_TEAM' || idx % 7 === 3) {
        pendingLna++;
        pendingApproval++;
      } else if (sub.pdpStage === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' || sub.pdpStage === 'PENDING_EMPLOYEE_EVALUATION' || idx % 7 === 4) {
        pendingEmployee++;
        pendingApproval++;
      } else if (sub.pdpStage === 'ACTIVE' || sub.status === 'APPROVED' || idx % 7 === 5 || idx % 7 === 6) {
        acknowledged++;
      } else {
        pendingApproval++;
      }
    });

    const totalRequests = TEAM_SUBMISSIONS.length;

    return {
      totalRequests,
      notStarted,
      pendingApproval,
      pendingHr,
      pendingManager,
      pendingLna,
      pendingEmployee,
      acknowledged,
    };
  }, []);

  // Filter options
  const divisions = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.division))).sort();
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.department))).sort();
  }, []);

  const positions = useMemo(() => {
    return Array.from(new Set(TEAM_SUBMISSIONS.map((s) => s.position))).sort();
  }, []);

  const handleResetFilters = () => {
    setSelectedEntity('ALL');
    setSelectedDivision('ALL');
    setSelectedDepartment('ALL');
    setSelectedPosition('ALL');
    setSelectedStatus('ALL');
    setSearchBy('Employee');
    setSearchQuery('');
    setSelectedFilterStage('ALL');
    setActiveExecutionFilter('ALL');
  };

  // Map employee to one of the 7 stages for filtering
  const getEmployeeStage = (sub: TeamMemberSubmission, idx: number): FilterStageType => {
    if (idx % 8 === 0) return 'NOT_STARTED';
    if (sub.pdpStage === 'PENDING_HR_INITIATION' || idx % 7 === 1) return 'PENDING_HR';
    if (sub.pdpStage === 'PENDING_MANAGER_REVIEW' || sub.pdpStage === 'PDP_PLANNING_MANAGER' || idx % 7 === 2) return 'PENDING_MANAGER';
    if (sub.pdpStage === 'PENDING_LNA_TEAM' || idx % 7 === 3) return 'PENDING_LNA';
    if (sub.pdpStage === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' || sub.pdpStage === 'PENDING_EMPLOYEE_EVALUATION' || idx % 7 === 4) return 'PENDING_EMPLOYEE';
    if (sub.pdpStage === 'ACTIVE' || sub.status === 'APPROVED' || idx % 7 === 5 || idx % 7 === 6) return 'ACKNOWLEDGED';
    return 'PENDING_APPROVAL';
  };

  const getStageLabel = (stage: FilterStageType): { label: string; colorClass: string } => {
    switch (stage) {
      case 'NOT_STARTED':
        return { label: 'Not Started', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };
      case 'PENDING_HR':
        return { label: 'Pending with HR', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'PENDING_MANAGER':
        return { label: 'Pending with Manager', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'PENDING_LNA':
        return { label: 'Pending with LNA Team', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'PENDING_EMPLOYEE':
        return { label: 'Pending with Employee', colorClass: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'ACKNOWLEDGED':
        return { label: 'Acknowledged', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Pending', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return TEAM_SUBMISSIONS.map((sub, idx) => ({ ...sub, computedStage: getEmployeeStage(sub, idx) }))
      .filter((sub) => {
        // Entity Filter
        if (selectedEntity !== 'ALL') {
          const empEntity = ((sub as unknown) as Record<string, string>).entity || 'GANS';
          if (empEntity !== selectedEntity && selectedEntity !== 'GANS') return false;
        }

        // Division Filter
        if (selectedDivision !== 'ALL' && sub.division !== selectedDivision) return false;

        // Department Filter
        if (selectedDepartment !== 'ALL' && sub.department !== selectedDepartment) return false;

        // Position Filter
        if (selectedPosition !== 'ALL' && sub.position !== selectedPosition) return false;

        // Status Filter
        if (selectedStatus !== 'ALL') {
          if (selectedStatus === 'Not Started' && sub.computedStage !== 'NOT_STARTED') return false;
          if ((selectedStatus === 'Pending' || selectedStatus === 'Pending Approval') && sub.status !== 'PENDING APPROVAL') return false;
          if ((selectedStatus === 'Submitted' || selectedStatus === 'Approved') && sub.status !== 'APPROVED') return false;
          if (selectedStatus === 'Returned' && sub.status !== 'RETURNED') return false;
          if (selectedStatus === 'Completed' && sub.pdpStage !== 'ACTIVE' && sub.status !== 'APPROVED') return false;
        }

        // Key Metric Stage Card Filter
        if (selectedFilterStage !== 'ALL') {
          if (selectedFilterStage === 'PENDING_APPROVAL') {
            if (sub.computedStage === 'NOT_STARTED' || sub.computedStage === 'ACKNOWLEDGED') return false;
          } else if (sub.computedStage !== selectedFilterStage) {
            return false;
          }
        }

        // Active Execution Filter
        if (activeExecutionFilter !== 'ALL') {
          if (sub.computedStage !== 'ACKNOWLEDGED') return false;
        }

        // Search By: Employee vs Manager
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          if (searchBy === 'Employee') {
            const matchesName = sub.name.toLowerCase().includes(q);
            const matchesPos = sub.position.toLowerCase().includes(q);
            const matchesId = sub.id.toLowerCase().includes(q);
            if (!matchesName && !matchesPos && !matchesId) return false;
          } else {
            const matchesManager = sub.lineManager.toLowerCase().includes(q);
            const matchesTitle = sub.lineManagerTitle.toLowerCase().includes(q);
            if (!matchesManager && !matchesTitle) return false;
          }
        }
        return true;
      });
  }, [selectedEntity, selectedDivision, selectedDepartment, selectedPosition, selectedStatus, selectedFilterStage, activeExecutionFilter, searchBy, searchQuery]);

  const cards = [
    {
      id: 'TOTAL',
      label: 'Total Requests',
      count: metrics.totalRequests,
      stage: 'ALL' as FilterStageType,
      icon: Users,
      topBorderColor: 'border-t-[#211E4E]',
      iconContainerClass: 'bg-slate-100 text-[#211E4E]',
    },
    {
      id: 'NOT_STARTED',
      label: 'Not Started',
      count: metrics.notStarted,
      stage: 'NOT_STARTED' as FilterStageType,
      icon: AlertCircle,
      topBorderColor: 'border-t-slate-400',
      iconContainerClass: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'PENDING_APPROVAL',
      label: 'Pending',
      count: metrics.pendingApproval,
      stage: 'PENDING_APPROVAL' as FilterStageType,
      icon: Clock,
      topBorderColor: 'border-t-amber-500',
      iconContainerClass: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'PENDING_HR',
      label: 'Pending with HR',
      count: metrics.pendingHr,
      stage: 'PENDING_HR' as FilterStageType,
      icon: Users,
      topBorderColor: 'border-t-indigo-600',
      iconContainerClass: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'PENDING_MANAGER',
      label: 'Pending with Manager',
      count: metrics.pendingManager,
      stage: 'PENDING_MANAGER' as FilterStageType,
      icon: Briefcase,
      topBorderColor: 'border-t-orange-500',
      iconContainerClass: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'PENDING_LNA',
      label: 'Pending with LNA Team',
      count: metrics.pendingLna,
      stage: 'PENDING_LNA' as FilterStageType,
      icon: GraduationCap,
      topBorderColor: 'border-t-purple-600',
      iconContainerClass: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'PENDING_EMPLOYEE',
      label: 'Pending with Employee',
      count: metrics.pendingEmployee,
      stage: 'PENDING_EMPLOYEE' as FilterStageType,
      icon: UserCheck,
      topBorderColor: 'border-t-sky-500',
      iconContainerClass: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'ACKNOWLEDGED',
      label: 'Acknowledged',
      count: metrics.acknowledged,
      stage: 'ACKNOWLEDGED' as FilterStageType,
      icon: CheckCircle2,
      topBorderColor: 'border-t-emerald-600',
      iconContainerClass: 'bg-emerald-50 text-emerald-700',
    },
  ];

  // Donut chart metrics aligned dynamically with TEAM_SUBMISSIONS
  const statusDistributionSlices = useMemo(() => {
    const total = TEAM_SUBMISSIONS.length;
    const approved = TEAM_SUBMISSIONS.filter((s) => s.status === 'APPROVED').length;
    const pending = TEAM_SUBMISSIONS.filter((s) => s.status === 'PENDING APPROVAL').length;
    const returned = TEAM_SUBMISSIONS.filter((s) => s.status === 'RETURNED').length;

    const approvedPct = Math.round((approved / total) * 100);
    const pendingPct = Math.round((pending / total) * 100);
    const returnedPct = 100 - approvedPct - pendingPct;

    return {
      total,
      approved,
      pending,
      returned,
      approvedPct,
      pendingPct,
      returnedPct,
      slices: [
        { label: 'SUBMITTED', count: approved, percentage: approvedPct, color: '#059669' },
        { label: 'PENDING', count: pending, percentage: pendingPct, color: '#211E4E' },
        { label: 'RETURNED', count: returned, percentage: returnedPct, color: '#D97706' },
      ],
    };
  }, []);

  const competencySplitSlices = useMemo(() => {
    // Aligns with overall competency log split: 11 Behavioral (41%), 16 Functional (59%), total 27
    const behavioral = 11;
    const functional = 16;
    const total = behavioral + functional;
    const behavioralPct = Math.round((behavioral / total) * 100);
    const functionalPct = 100 - behavioralPct;

    return {
      total,
      behavioral,
      functional,
      behavioralPct,
      functionalPct,
      slices: [
        { label: 'Behavioral Competencies', count: behavioral, percentage: behavioralPct, color: '#C8A977' },
        { label: 'Functional Competencies', count: functional, percentage: functionalPct, color: '#211E4E' },
      ],
    };
  }, []);

  // Active PDP Execution Metrics (Active, In Progress, Completed development milestones)
  const activeExecutionMetrics = useMemo(() => {
    // 48 Total Milestones across active/approved employee development roadmaps
    const active = 22;
    const inProgress = 17;
    const completed = 9;
    const total = active + inProgress + completed; // 48
    const activePct = Math.round((active / total) * 100); // 46%
    const inProgressPct = Math.round((inProgress / total) * 100); // 35%
    const completedPct = 100 - activePct - inProgressPct; // 19%

    return {
      total,
      active,
      inProgress,
      completed,
      activePct,
      inProgressPct,
      completedPct,
      slices: [
        { label: 'Active', count: active, percentage: activePct, color: '#059669' },
        { label: 'In Progress', count: inProgress, percentage: inProgressPct, color: '#D97706' },
        { label: 'Completed', count: completed, percentage: completedPct, color: '#2563EB' },
      ],
    };
  }, []);

  const executionBoxes = [
    {
      id: 'EXEC_ACTIVE',
      statusKey: 'ACTIVE' as const,
      label: 'Active',
      count: activeExecutionMetrics.active,
      pct: activeExecutionMetrics.activePct,
      color: 'border-t-emerald-600',
      iconContainer: 'bg-emerald-50 text-emerald-700',
      icon: PlayCircle,
    },
    {
      id: 'EXEC_IN_PROGRESS',
      statusKey: 'IN_PROGRESS' as const,
      label: 'In Progress',
      count: activeExecutionMetrics.inProgress,
      pct: activeExecutionMetrics.inProgressPct,
      color: 'border-t-amber-500',
      iconContainer: 'bg-amber-50 text-amber-700',
      icon: Clock,
    },
    {
      id: 'EXEC_COMPLETED',
      statusKey: 'COMPLETED' as const,
      label: 'Completed',
      count: activeExecutionMetrics.completed,
      pct: activeExecutionMetrics.completedPct,
      color: 'border-t-blue-600',
      iconContainer: 'bg-blue-50 text-blue-700',
      icon: CheckCircle2,
    },
  ];

  // Helper to render SVG Donut segments with clean gaps and interactive hover
  const renderDonutSlices = (
    chartId: string,
    slices: { label: string; count: number; percentage: number; color: string }[],
    radius = 68,
    strokeWidth = 28
  ) => {
    const circumference = 2 * Math.PI * radius;
    let accumulatedAngle = 0;
    const gap = 4.5;

    return slices.map((slice, idx) => {
      const isHovered = hoveredSlice?.chartId === chartId && hoveredSlice?.label === slice.label;
      const isAnyHoveredInChart = hoveredSlice?.chartId === chartId;
      const sliceLen = Math.max(0, (slice.percentage / 100) * circumference - gap);
      const strokeDasharray = `${sliceLen} ${circumference - sliceLen}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += (slice.percentage / 100) * circumference;

      return (
        <circle
          key={idx}
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke={slice.color}
          strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          className="transition-all duration-200 cursor-pointer"
          style={{
            transformOrigin: '100px 100px',
            transform: 'rotate(-90deg)',
            opacity: isAnyHoveredInChart && !isHovered ? 0.65 : 1,
            filter: isHovered ? 'drop-shadow(0px 2px 6px rgba(0,0,0,0.35))' : 'none',
          }}
          onMouseEnter={() => setHoveredSlice({ chartId, ...slice })}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <title>{`${slice.label}: ${slice.count} (${slice.percentage}%)`}</title>
        </circle>
      );
    });
  };

  return (
    <div className="space-y-4 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner */}
      <section className="bg-[#211E4E] rounded-xl p-4 sm:p-5 shadow-xs border border-white/80 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C8A977]" />
              <span>Professional Development Plan (PDP) – Executive Dashboard</span>
            </h1>
            <p className="mt-0.5 text-xs text-slate-200 font-normal">
              Real-time monitoring of submissions, bottlenecks, and stage distribution across the organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C8A977] text-[#211E4E] shadow-2xs">
              Cycle Year: 2026 – 2027
            </span>
          </div>
        </div>
      </section>

      {/* ORGANIZATIONAL MONITORING & FILTERS (Matching image_6377b364.png) */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3">
        {/* Header: Funnel icon + Title + Reset Button */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <Filter className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-black text-[#211E4E] tracking-wider uppercase">
              ORGANIZATIONAL MONITORING & FILTERS
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset All Filters"
            className="p-1.5 rounded-lg border border-slate-200/90 hover:bg-slate-50 text-slate-500 hover:text-[#211E4E] transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Filter Controls in Responsive Grid matching image_6377b364.png */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 items-end">
          {/* 1. Entity */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              Entity
            </label>
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="ALL">All Entities</option>
                <option value="GANS">GANS</option>
                <option value="Eshara">Eshara</option>
                <option value="YHA">YHA</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Division */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              Division
            </label>
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="ALL">All Divisions</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Department */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              Department
            </label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Designation / Position */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              Designation / Position
            </label>
            <div className="relative">
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="ALL">All Positions</option>
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. LNA Status */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              LNA Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Returned">Returned</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Search By */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              Search By
            </label>
            <div className="relative">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as 'Employee' | 'Manager')}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E] appearance-none pr-6 cursor-pointer"
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Search Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">
              {searchBy === 'Employee' ? 'Search Employee' : 'Search Manager'}
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={searchBy === 'Employee' ? 'Search employee' : 'Search manager'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-2 bg-white rounded-lg border border-[#C8A977]/60 hover:border-[#C8A977] text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-hidden focus:ring-1 focus:ring-[#211E4E]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Cards (2 Rows of 4 Cards - Compact Sleek Sizing) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedFilterStage === card.stage;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedFilterStage(isSelected && card.stage !== 'ALL' ? 'ALL' : card.stage)}
              className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 border-t-[3px] ${card.topBorderColor} text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between group ${
                isSelected ? 'ring-2 ring-[#211E4E] shadow-xs bg-slate-50/50' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  {card.label}
                </span>
                <div
                  className={`w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${card.iconContainerClass}`}
                >
                  <Icon className="w-3 h-3" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                  {card.count}
                </span>
                {isSelected && (
                  <span className="text-[9px] font-bold text-[#211E4E] bg-slate-100 px-1.5 py-0.2 rounded-full">
                    Active Filter
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </section>

      {/* 3. Donut Charts (3-Column Layout: LNA Status, Competency Split, Active PDP Execution matching reference) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Chart 1: LNA Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  LNA Status Distribution
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {statusDistributionSlices.total} Total Submissions
              </span>
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('LNA_STATUS', statusDistributionSlices.slices, 68, 28)}
                </svg>
                {/* Center text: dynamic on hover, or clean standard without inner pill badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'LNA_STATUS' ? (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.label}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {hoveredSlice.count}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {hoveredSlice.percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        COMPLETION
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {statusDistributionSlices.approvedPct}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details Table / Legend with Hover Support */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1">
              {statusDistributionSlices.slices.map((slice) => {
                const isHovered = hoveredSlice?.chartId === 'LNA_STATUS' && hoveredSlice?.label === slice.label;
                return (
                  <div
                    key={slice.label}
                    onMouseEnter={() => setHoveredSlice({ chartId: 'LNA_STATUS', ...slice })}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-slate-100/90 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.color }}
                      ></span>
                      <span className="font-semibold text-slate-700 text-xs truncate">
                        {slice.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <span className="font-extrabold text-slate-900 text-xs">{slice.count}</span>
                      <span className="font-semibold text-slate-400 text-xs w-8 text-right">
                        {slice.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Competency Selections Split */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#211E4E]"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Competency Selections Split
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {competencySplitSlices.total} Total Competencies
              </span>
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('COMPETENCY_SPLIT', competencySplitSlices.slices, 68, 28)}
                </svg>
                {/* Center text: dynamic on hover, or clean standard without inner pill badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'COMPETENCY_SPLIT' ? (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.label}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {hoveredSlice.count}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {hoveredSlice.percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        SELECTIONS
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {competencySplitSlices.total}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details Table / Legend with Hover Support */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1">
              {competencySplitSlices.slices.map((slice) => {
                const isHovered = hoveredSlice?.chartId === 'COMPETENCY_SPLIT' && hoveredSlice?.label === slice.label;
                return (
                  <div
                    key={slice.label}
                    onMouseEnter={() => setHoveredSlice({ chartId: 'COMPETENCY_SPLIT', ...slice })}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-slate-100/90 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.color }}
                      ></span>
                      <span className="font-semibold text-slate-700 text-xs truncate">
                        {slice.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <span className="font-extrabold text-slate-900 text-xs">{slice.count}</span>
                      <span className="font-semibold text-slate-400 text-xs w-8 text-right">
                        {slice.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Active PDP Execution Distribution (Moved up into same row) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Active PDP Execution Distribution
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {activeExecutionMetrics.total} Total Milestones
              </span>
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('ACTIVE_EXECUTION', activeExecutionMetrics.slices, 68, 28)}
                </svg>
                {/* Center text: dynamic on hover, or clean standard without inner pill badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'ACTIVE_EXECUTION' ? (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.label}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {hoveredSlice.count}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {hoveredSlice.percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        COMPLETION
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {activeExecutionMetrics.completedPct}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details Table / Legend with Hover Support */}
            <div className="pt-2.5 border-t border-slate-100 space-y-1">
              {activeExecutionMetrics.slices.map((slice) => {
                const isHovered = hoveredSlice?.chartId === 'ACTIVE_EXECUTION' && hoveredSlice?.label === slice.label;
                return (
                  <div
                    key={slice.label}
                    onMouseEnter={() => setHoveredSlice({ chartId: 'ACTIVE_EXECUTION', ...slice })}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between text-xs py-0.5 px-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-slate-100/90 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: slice.color }}
                      ></span>
                      <span className="font-semibold text-slate-700 text-xs truncate">
                        {slice.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <span className="font-extrabold text-slate-900 text-xs">{slice.count}</span>
                      <span className="font-semibold text-slate-400 text-xs w-8 text-right">
                        {slice.percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active PDP Execution & Milestone Monitoring (Only Active, In Progress, and Completed clean boxes) */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 space-y-3">
        {/* Clean Header without redundant subtext or badge */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <h2 className="text-xs sm:text-sm font-black text-[#211E4E] tracking-tight uppercase">
            Active PDP Execution & Milestone Monitoring
          </h2>
        </div>

        {/* 3 Clean Stat Boxes matching the top cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {executionBoxes.map((box) => {
            const Icon = box.icon;
            const isSelected = activeExecutionFilter === box.statusKey;
            return (
              <button
                key={box.id}
                type="button"
                onClick={() =>
                  setActiveExecutionFilter(isSelected ? 'ALL' : box.statusKey)
                }
                className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 border-t-[3px] ${box.color} text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between group ${
                  isSelected ? 'ring-2 ring-[#211E4E] bg-slate-50/70 shadow-xs' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    {box.label}
                  </span>
                  <div
                    className={`w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${box.iconContainer}`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                    {box.count}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {box.pct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Submissions Table & Filter Controls */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee, position, manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Division Filter */}
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Divisions</option>
              {divisions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Reset Filters */}
            {(selectedFilterStage !== 'ALL' || activeExecutionFilter !== 'ALL' || selectedDivision !== 'ALL' || selectedDepartment !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFilterStage('ALL');
                  setActiveExecutionFilter('ALL');
                  setSelectedDivision('ALL');
                  setSelectedDepartment('ALL');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1C1844] text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Division</th>
                <th className="py-3 px-4">Line Manager</th>
                <th className="py-3 px-4 text-center">Stage</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const stageInfo = getStageLabel(emp.computedStage);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#211E4E] text-[#C8A977] font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.avatarInitials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{emp.name}</div>
                          <div className="text-[11px] text-slate-500">{emp.position}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Division */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium text-xs">{emp.department}</div>
                      <div className="text-[11px] text-slate-400">{emp.division}</div>
                    </td>

                    {/* Manager */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium text-xs">{emp.lineManager}</div>
                      <div className="text-[11px] text-slate-400">{emp.lineManagerTitle}</div>
                    </td>

                    {/* Stage */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${stageInfo.colorClass}`}>
                        {stageInfo.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onReviewEmployee(emp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#211E4E] hover:bg-[#161435] text-white shadow-2xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review PDP</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
