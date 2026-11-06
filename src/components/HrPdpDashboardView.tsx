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
  | 'EVAL_TOTAL'
  | 'EVAL_NOT_STARTED'
  | 'EVAL_PENDING_MANAGER'
  | 'EVAL_RETURNED_MANAGER'
  | 'EVAL_PENDING_LNA'
  | 'PDP_PENDING_MANAGER'
  | 'PDP_PENDING_LNA'
  | 'PDP_RETURNED_LNA'
  | 'PDP_PENDING_SIGNOFF'
  | 'PDP_ACKNOWLEDGED';

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

  // Map employee to one of the stages for filtering
  const getEmployeeStage = (sub: TeamMemberSubmission, idx: number): FilterStageType => {
    if (idx === 0 || idx === 7) return 'EVAL_NOT_STARTED';
    if (idx === 3) return 'EVAL_PENDING_MANAGER';
    if (idx === 5) return 'EVAL_RETURNED_MANAGER';
    if (idx === 8 || idx === 13) return 'EVAL_PENDING_LNA';
    if (idx === 9 || idx === 14) return 'PDP_PENDING_MANAGER';
    if (idx === 10) return 'PDP_PENDING_LNA';
    if (idx === 15) return 'PDP_RETURNED_LNA';
    if (idx === 4 || idx === 11) return 'PDP_PENDING_SIGNOFF';
    return 'PDP_ACKNOWLEDGED';
  };

  const getStageLabel = (stage: FilterStageType): { label: string; colorClass: string } => {
    switch (stage) {
      case 'EVAL_NOT_STARTED':
        return { label: 'Not Started', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };
      case 'EVAL_PENDING_MANAGER':
        return { label: 'Pending with Manager Actions', colorClass: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'EVAL_RETURNED_MANAGER':
        return { label: 'Returned to Manager Actions', colorClass: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'EVAL_PENDING_LNA':
        return { label: 'Pending with PDP Initiation', colorClass: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'PDP_PENDING_MANAGER':
        return { label: 'Pending with Manager Review', colorClass: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'PDP_PENDING_LNA':
        return { label: 'Pending with PDP Review', colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'PDP_RETURNED_LNA':
        return { label: 'Returned to LNA Team', colorClass: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'PDP_PENDING_SIGNOFF':
        return { label: 'Pending Sign-Off', colorClass: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'PDP_ACKNOWLEDGED':
        return { label: 'Acknowledged', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'In Progress', colorClass: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  // Derive dynamic counts for Competency Evaluation and PDP Initiation
  const metrics = useMemo(() => {
    let evalNotStarted = 0;
    let evalPendingManager = 0;
    let evalReturnedManager = 0;
    let evalPendingLna = 0;
    let pdpPendingManager = 0;
    let pdpPendingLna = 0;
    let pdpReturnedLna = 0;
    let pdpPendingSignOff = 0;
    let pdpAcknowledged = 0;

    TEAM_SUBMISSIONS.forEach((sub, idx) => {
      const stage = getEmployeeStage(sub, idx);
      if (stage === 'EVAL_NOT_STARTED') evalNotStarted++;
      else if (stage === 'EVAL_PENDING_MANAGER') evalPendingManager++;
      else if (stage === 'EVAL_RETURNED_MANAGER') evalReturnedManager++;
      else if (stage === 'EVAL_PENDING_LNA') evalPendingLna++;
      else if (stage === 'PDP_PENDING_MANAGER') pdpPendingManager++;
      else if (stage === 'PDP_PENDING_LNA') pdpPendingLna++;
      else if (stage === 'PDP_RETURNED_LNA') pdpReturnedLna++;
      else if (stage === 'PDP_PENDING_SIGNOFF') pdpPendingSignOff++;
      else if (stage === 'PDP_ACKNOWLEDGED') pdpAcknowledged++;
    });

    const totalRequests = TEAM_SUBMISSIONS.length;

    return {
      totalRequests,
      evalNotStarted,
      evalPendingManager,
      evalReturnedManager,
      evalPendingLna,
      pdpPendingManager,
      pdpPendingLna,
      pdpReturnedLna,
      pdpPendingSignOff,
      pdpAcknowledged,
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
          if (selectedStatus === 'Not Started' && sub.computedStage !== 'EVAL_NOT_STARTED') return false;
          if ((selectedStatus === 'Pending' || selectedStatus === 'Pending Approval') && sub.status !== 'PENDING APPROVAL') return false;
          if ((selectedStatus === 'Submitted' || selectedStatus === 'Approved') && sub.status !== 'APPROVED') return false;
          if (selectedStatus === 'Returned' && sub.status !== 'RETURNED') return false;
          if (selectedStatus === 'Completed' && sub.pdpStage !== 'ACTIVE' && sub.status !== 'APPROVED') return false;
        }

        // Key Metric Stage Card Filter
        if (selectedFilterStage !== 'ALL' && selectedFilterStage !== 'EVAL_TOTAL') {
          if (sub.computedStage !== selectedFilterStage) {
            return false;
          }
        }

        // Active Execution Filter
        if (activeExecutionFilter !== 'ALL') {
          if (sub.computedStage !== 'PDP_ACKNOWLEDGED') return false;
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

  const evalCards = [
    {
      id: 'EVAL_TOTAL',
      label: 'Total Requests',
      count: metrics.totalRequests,
      stage: 'EVAL_TOTAL' as FilterStageType,
      icon: Users,
      topBorderColor: 'border-t-[#211E4E]',
      iconContainerClass: 'bg-slate-100 text-[#211E4E]',
    },
    {
      id: 'EVAL_NOT_STARTED',
      label: 'Not Started',
      count: metrics.evalNotStarted,
      stage: 'EVAL_NOT_STARTED' as FilterStageType,
      icon: AlertCircle,
      topBorderColor: 'border-t-slate-400',
      iconContainerClass: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'EVAL_PENDING_MANAGER',
      label: 'PENDING WITH MANAGER ACTIONS',
      count: metrics.evalPendingManager,
      stage: 'EVAL_PENDING_MANAGER' as FilterStageType,
      icon: Briefcase,
      topBorderColor: 'border-t-orange-500',
      iconContainerClass: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'EVAL_RETURNED_MANAGER',
      label: 'RETURNED TO MANAGER ACTIONS',
      count: metrics.evalReturnedManager,
      stage: 'EVAL_RETURNED_MANAGER' as FilterStageType,
      icon: RotateCcw,
      topBorderColor: 'border-t-rose-500',
      iconContainerClass: 'bg-rose-50 text-rose-700',
    },
    {
      id: 'EVAL_PENDING_LNA',
      label: 'PENDING WITH PDP INITIATION',
      count: metrics.evalPendingLna,
      stage: 'EVAL_PENDING_LNA' as FilterStageType,
      icon: GraduationCap,
      topBorderColor: 'border-t-purple-600',
      iconContainerClass: 'bg-purple-50 text-purple-700',
    },
  ];

  const pdpCards = [
    {
      id: 'PDP_PENDING_MANAGER',
      label: 'PENDING WITH MANAGER REVIEW',
      count: metrics.pdpPendingManager,
      stage: 'PDP_PENDING_MANAGER' as FilterStageType,
      icon: Briefcase,
      topBorderColor: 'border-t-amber-500',
      iconContainerClass: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'PDP_PENDING_LNA',
      label: 'PENDING WITH PDP REVIEW',
      count: metrics.pdpPendingLna,
      stage: 'PDP_PENDING_LNA' as FilterStageType,
      icon: GraduationCap,
      topBorderColor: 'border-t-indigo-600',
      iconContainerClass: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'PDP_RETURNED_LNA',
      label: 'RETURNED TO LNA TEAM',
      count: metrics.pdpReturnedLna,
      stage: 'PDP_RETURNED_LNA' as FilterStageType,
      icon: RotateCcw,
      topBorderColor: 'border-t-orange-500',
      iconContainerClass: 'bg-orange-50 text-orange-700',
    },
    {
      id: 'PDP_PENDING_SIGNOFF',
      label: 'PENDING SIGN-OFF',
      count: metrics.pdpPendingSignOff,
      stage: 'PDP_PENDING_SIGNOFF' as FilterStageType,
      icon: UserCheck,
      topBorderColor: 'border-t-sky-500',
      iconContainerClass: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'PDP_ACKNOWLEDGED',
      label: 'ACKNOWLEDGED',
      count: metrics.pdpAcknowledged,
      stage: 'PDP_ACKNOWLEDGED' as FilterStageType,
      icon: CheckCircle2,
      topBorderColor: 'border-t-emerald-600',
      iconContainerClass: 'bg-emerald-50 text-emerald-700',
    },
  ];

  // Donut chart metrics aligned dynamically with TEAM_SUBMISSIONS
  // Donut chart metrics covering all 9 lifecycle stages (Overall PDP Status Distribution)
  const statusDistributionSlices = useMemo(() => {
    const total = metrics.totalRequests;
    const items = [
      {
        stageKey: 'EVAL_NOT_STARTED',
        label: 'Not Started',
        count: metrics.evalNotStarted,
        color: '#94A3B8', // slate-400
      },
      {
        stageKey: 'EVAL_PENDING_MANAGER',
        label: 'Pending with Manager Actions',
        count: metrics.evalPendingManager,
        color: '#F97316', // orange-500
      },
      {
        stageKey: 'EVAL_RETURNED_MANAGER',
        label: 'Returned to Manager Actions',
        count: metrics.evalReturnedManager,
        color: '#F43F5E', // rose-500
      },
      {
        stageKey: 'EVAL_PENDING_LNA',
        label: 'Pending with PDP Initiation',
        count: metrics.evalPendingLna,
        color: '#9333EA', // purple-600
      },
      {
        stageKey: 'PDP_PENDING_MANAGER',
        label: 'Pending with Manager Review',
        count: metrics.pdpPendingManager,
        color: '#F59E0B', // amber-500
      },
      {
        stageKey: 'PDP_PENDING_LNA',
        label: 'Pending with PDP Review',
        count: metrics.pdpPendingLna,
        color: '#4F46E5', // indigo-600
      },
      {
        stageKey: 'PDP_RETURNED_LNA',
        label: 'Returned to LNA Team',
        count: metrics.pdpReturnedLna,
        color: '#EA580C', // orange-600
      },
      {
        stageKey: 'PDP_PENDING_SIGNOFF',
        label: 'Pending Sign-Off',
        count: metrics.pdpPendingSignOff,
        color: '#0EA5E9', // sky-500
      },
      {
        stageKey: 'PDP_ACKNOWLEDGED',
        label: 'Acknowledged',
        count: metrics.pdpAcknowledged,
        color: '#059669', // emerald-600
      },
    ];

    const slices = items.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));

    return {
      total,
      slices,
    };
  }, [metrics]);

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
    const activeSlices = slices.filter((s) => s.count > 0);
    const totalCount = activeSlices.reduce((sum, s) => sum + s.count, 0);
    const gap = activeSlices.length > 1 ? (activeSlices.length > 5 ? 2.5 : 4) : 0;

    return activeSlices.map((slice, idx) => {
      const isHovered = hoveredSlice?.chartId === chartId && hoveredSlice?.label === slice.label;
      const isAnyHoveredInChart = hoveredSlice?.chartId === chartId;
      const ratio = totalCount > 0 ? slice.count / totalCount : 0;
      const sliceLen = Math.max(0, ratio * circumference - gap);
      const strokeDasharray = `${sliceLen} ${circumference - sliceLen}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += ratio * circumference;

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
          <title>{`${slice.label}: ${slice.count} (${Math.round(ratio * 100)}%)`}</title>
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
              <span>Professional Development Plan (PDP) – Dashboard</span>
            </h1>
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

      {/* 2. Key Metrics Cards with Two Distinct Headings */}
      <div className="space-y-4">
        {/* Heading 1: Assessment Status */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#211E4E]"></span>
            <h2 className="text-xs sm:text-sm font-black text-[#211E4E] tracking-wider uppercase">
              Assessment Status
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {evalCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedFilterStage === card.stage;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() =>
                    setSelectedFilterStage(
                      isSelected && card.stage !== 'ALL' ? 'ALL' : card.stage
                    )
                  }
                  className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 border-t-[3px] ${card.topBorderColor} text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between group ${
                    isSelected ? 'ring-2 ring-[#211E4E] shadow-xs bg-slate-50/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 mb-1 min-h-[28px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
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
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Heading 2: PDP Initiation Status */}
        <section className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A977]"></span>
            <h2 className="text-xs sm:text-sm font-black text-[#211E4E] tracking-wider uppercase">
              PDP Initiation Status
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {pdpCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedFilterStage === card.stage;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() =>
                    setSelectedFilterStage(
                      isSelected && card.stage !== 'ALL' ? 'ALL' : card.stage
                    )
                  }
                  className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-white border border-slate-200/90 border-t-[3px] ${card.topBorderColor} text-left transition-all cursor-pointer shadow-2xs hover:shadow-sm flex flex-col justify-between group ${
                    isSelected ? 'ring-2 ring-[#211E4E] shadow-xs bg-slate-50/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 mb-1 min-h-[28px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
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
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Donut Charts (3-Column Layout: LNA Status, Competency Split, Active PDP Execution) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Chart 1: Overall PDP Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#211E4E]"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Overall PDP Status Distribution
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                All Stages
              </span>
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('OVERALL_PDP_STATUS', statusDistributionSlices.slices, 68, 28)}
                </svg>
                {/* Center text: Total Requests or Hovered Stage Details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'OVERALL_PDP_STATUS' ? (
                    <>
                      <span
                        className="text-[9px] font-extrabold uppercase tracking-wider truncate max-w-[110px]"
                        style={{ color: hoveredSlice.color }}
                      >
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
                        TOTAL REQUESTS
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {statusDistributionSlices.total}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details Table / Legend */}
            <div className="pt-2 border-t border-slate-100">
              {/* Total Requests Row */}
              <div
                onClick={() => setSelectedFilterStage('ALL')}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-100/90 font-bold text-[#211E4E] border border-slate-200/80 mb-1 cursor-pointer hover:bg-slate-200/70 transition-colors"
                title="Click to view all requests"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#211E4E]"></span>
                  <span className="text-[11px] font-bold">Total Requests</span>
                </div>
                <span className="font-black text-xs text-[#211E4E]">{statusDistributionSlices.total}</span>
              </div>

              {/* 9 Lifecycle Stages */}
              <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1">
                {statusDistributionSlices.slices.map((slice) => {
                  const isHovered =
                    hoveredSlice?.chartId === 'OVERALL_PDP_STATUS' &&
                    hoveredSlice?.label === slice.label;
                  const isSelected = selectedFilterStage === slice.stageKey;
                  return (
                    <div
                      key={slice.label}
                      onMouseEnter={() =>
                        setHoveredSlice({ chartId: 'OVERALL_PDP_STATUS', ...slice })
                      }
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() =>
                        setSelectedFilterStage(
                          isSelected ? 'ALL' : (slice.stageKey as FilterStageType)
                        )
                      }
                      className={`flex items-center justify-between text-xs py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
                        isHovered
                          ? 'bg-slate-100/90 font-bold'
                          : isSelected
                          ? 'bg-slate-100 font-bold border border-slate-300'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: slice.color }}
                        ></span>
                        <span className="font-medium text-slate-700 text-[11px] truncate">
                          {slice.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {slice.percentage}%
                        </span>
                        <span className="font-extrabold text-slate-900 text-[11.5px] min-w-[18px] text-right">
                          {slice.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('COMPETENCY_SPLIT', competencySplitSlices.slices, 68, 28)}
                </svg>
                {/* Center text: count without percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'COMPETENCY_SPLIT' ? (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.label}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {hoveredSlice.count}
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

            {/* Details Table / Legend */}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Active PDP Execution Distribution */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Active PDP Execution Distribution
                </h3>
              </div>
            </div>

            {/* Centered Donut Chart with Interactive Hover Details */}
            <div className="flex justify-center items-center py-2 sm:py-2.5">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xs">
                  {renderDonutSlices('ACTIVE_EXECUTION', activeExecutionMetrics.slices, 68, 28)}
                </svg>
                {/* Center text: count without percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2 transition-all">
                  {hoveredSlice?.chartId === 'ACTIVE_EXECUTION' ? (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider truncate max-w-[100px]" style={{ color: hoveredSlice.color }}>
                        {hoveredSlice.label}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        {hoveredSlice.count}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        MILESTONES
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {activeExecutionMetrics.total}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details Table / Legend */}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active PDP Status */}
      <section className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-4.5 space-y-3">
        {/* Clean Header without redundant subtext or badge */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <h2 className="text-xs sm:text-sm font-black text-[#211E4E] tracking-tight uppercase">
            Active PDP Status
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
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Submissions Table & Filter Controls */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

          <div className="flex items-center gap-2">
            {/* Reset Filters */}
            {(selectedFilterStage !== 'ALL' || activeExecutionFilter !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFilterStage('ALL');
                  setActiveExecutionFilter('ALL');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl cursor-pointer"
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
                        <span>View PDP</span>
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
