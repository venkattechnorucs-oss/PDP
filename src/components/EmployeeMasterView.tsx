import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Users,
  Upload,
  Plus,
  ChevronDown,
  Search,
  Filter,
  Check,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  FileSpreadsheet,
  CheckSquare,
  CheckCheck,
  Send,
  X,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

export interface StageDeadlineConfig {
  id: string;
  step: number;
  title: string;
  role: string;
  startDate: string;
  deadline: string;
}

export const DEFAULT_STAGE_DEADLINES: StageDeadlineConfig[] = [
  {
    id: 'employee_submission',
    step: 1,
    title: 'Employee Submission',
    role: 'Employee',
    startDate: '2026-08-01',
    deadline: '2026-08-15',
  },
  {
    id: 'manager_action',
    step: 2,
    title: 'Manager Action',
    role: 'Line Manager',
    startDate: '2026-08-16',
    deadline: '2026-08-31',
  },
  {
    id: 'pdp_initiation',
    step: 3,
    title: 'PDP Initiation',
    role: 'HR & LNA',
    startDate: '2026-09-01',
    deadline: '2026-09-15',
  },
  {
    id: 'manager_review',
    step: 4,
    title: 'Manager Review',
    role: 'Line Manager',
    startDate: '2026-09-16',
    deadline: '2026-09-30',
  },
  {
    id: 'lna_team_review',
    step: 5,
    title: 'LNA Team Review',
    role: 'LNA Specialist',
    startDate: '2026-10-01',
    deadline: '2026-10-15',
  },
  {
    id: 'employee_signoff',
    step: 6,
    title: 'Employee Sign off',
    role: 'Employee',
    startDate: '2026-10-16',
    deadline: '2026-10-31',
  },
];

export interface EmployeeMasterRecord {
  sNo: number;
  id: string;
  name: string;
  avatarInitials: string;
  position: string;
  entity: 'GANS' | 'Eshara' | 'YHA';
  department: string;
  functionDept: string;
  doj: string;
  reportingManager: string;
  location: string;
  grade: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  email: string;
}

export const EMPLOYEE_MASTER_DATA: EmployeeMasterRecord[] = [
  {
    sNo: 1,
    id: 'EMP00123',
    name: 'Ravi Kumar',
    avatarInitials: 'RK',
    position: 'Store Manager',
    entity: 'GANS',
    department: 'Operations',
    functionDept: 'Retail Operations & Outlets',
    doj: '12/May/2021',
    reportingManager: 'Suresh Nair',
    location: 'Abu Dhabi HQ / Operations',
    grade: '8',
    status: 'Active',
    email: 'ravi.kumar@enterprise.com',
  },
  {
    sNo: 2,
    id: 'EMP00124',
    name: 'Priya Sharma',
    avatarInitials: 'PS',
    position: 'Sales Manager',
    entity: 'GANS',
    department: 'Sales',
    functionDept: 'Corporate Sales & Channels',
    doj: '10/Jan/2022',
    reportingManager: 'Anita Rao',
    location: 'Dubai Branch Office',
    grade: '7',
    status: 'Active',
    email: 'priya.sharma@enterprise.com',
  },
  {
    sNo: 3,
    id: 'EMP00125',
    name: 'Arun Kumar',
    avatarInitials: 'AK',
    position: 'Accountant',
    entity: 'GANS',
    department: 'Accounts',
    functionDept: 'Financial Accounting & Treasury',
    doj: '05/Mar/2023',
    reportingManager: 'Suresh Nair',
    location: 'Abu Dhabi HQ',
    grade: '6',
    status: 'Active',
    email: 'arun.kumar@enterprise.com',
  },
  {
    sNo: 4,
    id: 'EMP00126',
    name: 'Vivekanandan',
    avatarInitials: 'V',
    position: 'Specialist - Performance Management',
    entity: 'Eshara',
    department: 'HR & Administration',
    functionDept: 'HR & Administration',
    doj: '14/Apr/2026',
    reportingManager: 'Mansoor Al Hammadi',
    location: 'GANS Head Office',
    grade: '9',
    status: 'Active',
    email: 'vivekanandan@eshara.ae',
  },
  {
    sNo: 5,
    id: 'EMP00127',
    name: 'Tariq Al Hashemi',
    avatarInitials: 'TA',
    position: 'Senior Air Traffic Controller',
    entity: 'YHA',
    department: 'ATM Operations',
    functionDept: 'Area Control Center',
    doj: '01/Feb/2018',
    reportingManager: "David O'Connor",
    location: 'Sheikh Zayed Centre',
    grade: '10',
    status: 'Active',
    email: 'tariq.hashemi@yha.ae',
  },
  {
    sNo: 6,
    id: 'EMP00128',
    name: 'Fatima Al Mansoori',
    avatarInitials: 'FM',
    position: 'Lead Avionics Systems Engineer',
    entity: 'GANS',
    department: 'Engineering',
    functionDept: 'ATM Systems Engineering',
    doj: '15/Jun/2019',
    reportingManager: 'Ahmed Al Zaabi',
    location: 'Abu Dhabi Int. Airport',
    grade: '9',
    status: 'Active',
    email: 'fatima.m@gans.aero',
  },
  {
    sNo: 7,
    id: 'EMP00129',
    name: 'Hamad Al Dhaheri',
    avatarInitials: 'HD',
    position: 'Aviation Safety Inspector',
    entity: 'YHA',
    department: 'Quality & Safety',
    functionDept: 'Safety & Quality Assurance',
    doj: '22/Nov/2020',
    reportingManager: 'Mariam Al Qubaisi',
    location: 'Sheikh Zayed Centre',
    grade: '8',
    status: 'Active',
    email: 'hamad.d@yha.ae',
  },
  {
    sNo: 8,
    id: 'EMP00130',
    name: 'Sara Al Blooshi',
    avatarInitials: 'SB',
    position: 'Talent Development Specialist',
    entity: 'Eshara',
    department: 'HR & Administration',
    functionDept: 'Learning & Organizational Dev',
    doj: '08/Aug/2022',
    reportingManager: 'Mansoor Al Hammadi',
    location: 'GANS Head Office',
    grade: '7',
    status: 'Active',
    email: 'sara.b@eshara.ae',
  },
  {
    sNo: 9,
    id: 'EMP00131',
    name: 'Khalid Al Nuaimi',
    avatarInitials: 'KN',
    position: 'Procurement Specialist',
    entity: 'GANS',
    department: 'Supply Chain',
    functionDept: 'Strategic Sourcing',
    doj: '19/Jan/2021',
    reportingManager: 'Anita Rao',
    location: 'Abu Dhabi HQ',
    grade: '7',
    status: 'Active',
    email: 'khalid.n@gans.aero',
  },
  {
    sNo: 10,
    id: 'EMP00132',
    name: 'Zayed Al Marzooqi',
    avatarInitials: 'ZM',
    position: 'Cyber Security Analyst',
    entity: 'GANS',
    department: 'Information Technology',
    functionDept: 'Infrastructure & Security',
    doj: '03/Oct/2023',
    reportingManager: 'Suresh Nair',
    location: 'Abu Dhabi HQ',
    grade: '8',
    status: 'Active',
    email: 'zayed.m@gans.aero',
  },
  {
    sNo: 11,
    id: 'EMP00133',
    name: 'Noora Al Kaabi',
    avatarInitials: 'NK',
    position: 'Financial Planning Analyst',
    entity: 'GANS',
    department: 'Finance',
    functionDept: 'FP&A and Budgeting',
    doj: '14/Feb/2022',
    reportingManager: 'Suresh Nair',
    location: 'Abu Dhabi HQ',
    grade: '8',
    status: 'Active',
    email: 'noora.k@gans.aero',
  },
  {
    sNo: 12,
    id: 'EMP00134',
    name: 'Sultan Al Shamsi',
    avatarInitials: 'SS',
    position: 'CNS Support Engineer',
    entity: 'YHA',
    department: 'Engineering',
    functionDept: 'Communications & Nav',
    doj: '11/May/2019',
    reportingManager: 'Ahmed Al Zaabi',
    location: 'Al Ain Station',
    grade: '8',
    status: 'Active',
    email: 'sultan.s@yha.ae',
  },
  {
    sNo: 13,
    id: 'EMP00135',
    name: 'Reem Al Mazrouei',
    avatarInitials: 'RM',
    position: 'Corporate Legal Counsel',
    entity: 'Eshara',
    department: 'Legal & Compliance',
    functionDept: 'Corporate Affairs & Governance',
    doj: '30/Jun/2020',
    reportingManager: 'Mariam Al Qubaisi',
    location: 'GANS Head Office',
    grade: '10',
    status: 'Active',
    email: 'reem.m@eshara.ae',
  },
  {
    sNo: 14,
    id: 'EMP00136',
    name: 'Omar Al Suwaidi',
    avatarInitials: 'OS',
    position: 'Senior Operations Planner',
    entity: 'GANS',
    department: 'Operations',
    functionDept: 'Capacity & Traffic Management',
    doj: '17/Mar/2017',
    reportingManager: "David O'Connor",
    location: 'Sheikh Zayed Centre',
    grade: '9',
    status: 'Active',
    email: 'omar.s@gans.aero',
  },
  {
    sNo: 15,
    id: 'EMP00137',
    name: 'Mona Al Rumaithi',
    avatarInitials: 'MR',
    position: 'Internal Auditor',
    entity: 'GANS',
    department: 'Audit & Risk',
    functionDept: 'Internal Audit & Assurance',
    doj: '05/Sep/2022',
    reportingManager: 'Mansoor Al Hammadi',
    location: 'Abu Dhabi HQ',
    grade: '8',
    status: 'Active',
    email: 'mona.r@gans.aero',
  },
  {
    sNo: 16,
    id: 'EMP00138',
    name: 'Rashid Al Ketbi',
    avatarInitials: 'RK',
    position: 'Aeronautical Information Officer',
    entity: 'YHA',
    department: 'ATM Operations',
    functionDept: 'AIS & Cartography',
    doj: '12/Dec/2021',
    reportingManager: "David O'Connor",
    location: 'Sheikh Zayed Centre',
    grade: '7',
    status: 'Active',
    email: 'rashid.k@yha.ae',
  },
];

export interface EmployeeMasterViewProps {
  onNavigateToReleaseHistory?: () => void;
}

export const EmployeeMasterView: React.FC<EmployeeMasterViewProps> = ({ onNavigateToReleaseHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('All Functions');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter options
  const functionOptions = useMemo(() => {
    return ['All Functions', ...Array.from(new Set(EMPLOYEE_MASTER_DATA.map((e) => e.functionDept))).sort()];
  }, []);

  const departmentOptions = useMemo(() => {
    return ['All Departments', ...Array.from(new Set(EMPLOYEE_MASTER_DATA.map((e) => e.department))).sort()];
  }, []);

  const gradeOptions = useMemo(() => {
    return ['All Grades', ...Array.from(new Set(EMPLOYEE_MASTER_DATA.map((e) => `Grade ${e.grade}`))).sort()];
  }, []);

  const statusOptions = ['All Status', 'Active', 'Inactive', 'On Leave'];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return EMPLOYEE_MASTER_DATA.filter((emp) => {
      if (selectedFunction !== 'All Functions' && emp.functionDept !== selectedFunction) return false;
      if (selectedDepartment !== 'All Departments' && emp.department !== selectedDepartment) return false;
      if (selectedGrade !== 'All Grades' && `Grade ${emp.grade}` !== selectedGrade) return false;
      if (selectedStatus !== 'All Status' && emp.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesId = emp.id.toLowerCase().includes(q);
        const matchesEmail = emp.email.toLowerCase().includes(q);
        const matchesPosition = emp.position.toLowerCase().includes(q);
        const matchesManager = emp.reportingManager.toLowerCase().includes(q);
        const matchesLocation = emp.location.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesEmail && !matchesPosition && !matchesManager && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedFunction, selectedDepartment, selectedGrade, selectedStatus]);

  // Pagination
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const { addToast } = usePdp();
  const [isReleaseMenuOpen, setIsReleaseMenuOpen] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(new Set());
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: 'all' | 'selected';
    count: number;
  } | null>(null);
  const releaseMenuRef = useRef<HTMLDivElement>(null);

  // 6 Workflow Stage Deadlines configuration
  const [stageDeadlines, setStageDeadlines] = useState<StageDeadlineConfig[]>(DEFAULT_STAGE_DEADLINES);

  const handleDeadlineChange = (id: string, field: 'startDate' | 'deadline', value: string) => {
    setStageDeadlines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Compute release stats according to PDP release status logic shown in notice popup
  const releaseStats = useMemo(() => {
    if (!confirmModal) {
      return { totalEmployees: 16, excluded: 4, alreadyReleased: 3, goingToRelease: 9 };
    }
    if (confirmModal.mode === 'all') {
      const total = EMPLOYEE_MASTER_DATA.length;
      const excluded = 4; // Excluded due to nationality
      const alreadyReleased = 3; // Already released in active cycle
      const goingToRelease = Math.max(0, total - excluded - alreadyReleased);
      return {
        totalEmployees: total,
        excluded,
        alreadyReleased,
        goingToRelease,
      };
    }
    const count = confirmModal.count;
    const excluded = count > 3 ? 1 : 0;
    const alreadyReleased = count > 2 ? 1 : 0;
    const goingToRelease = Math.max(0, count - excluded - alreadyReleased);
    return {
      totalEmployees: count,
      excluded,
      alreadyReleased,
      goingToRelease: goingToRelease > 0 ? goingToRelease : count,
    };
  }, [confirmModal]);

  // Close release menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (releaseMenuRef.current && !releaseMenuRef.current.contains(event.target as Node)) {
        setIsReleaseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSelectAllPage = () => {
    if (paginatedData.length === 0) return;
    const allSelected = paginatedData.every((emp) => selectedEmployeeIds.has(emp.id));
    const next = new Set(selectedEmployeeIds);
    if (allSelected) {
      paginatedData.forEach((emp) => next.delete(emp.id));
    } else {
      paginatedData.forEach((emp) => next.add(emp.id));
    }
    setSelectedEmployeeIds(next);
  };

  const handleToggleSelectEmployee = (id: string) => {
    const next = new Set(selectedEmployeeIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedEmployeeIds(next);
  };

  const handleReleaseClick = (mode: 'all' | 'selected') => {
    setIsReleaseMenuOpen(false);
    if (mode === 'selected' && selectedEmployeeIds.size === 0) {
      addToast(
        'info',
        'No Employees Selected',
        'Please select one or more employees using the table checkboxes, or choose "Release all".'
      );
      return;
    }
    setConfirmModal({
      isOpen: true,
      mode,
      count: mode === 'all' ? EMPLOYEE_MASTER_DATA.length : selectedEmployeeIds.size,
    });
  };

  const handleExecuteRelease = () => {
    if (!confirmModal) return;
    const { mode, count } = confirmModal;
    addToast(
      'success',
      'PDP Cycle Released',
      mode === 'all'
        ? `Successfully released PDP cycle for all ${count} employees (Release ID: REL-2026-002)`
        : `Successfully released PDP cycle for ${count} selected employee${count > 1 ? 's' : ''} (Release ID: REL-2026-002)`
    );
    if (mode === 'selected') {
      setSelectedEmployeeIds(new Set());
    }
    setConfirmModal(null);
  };

  const uniqueFunctionsCount = useMemo(() => {
    return new Set(EMPLOYEE_MASTER_DATA.map((e) => e.functionDept)).size;
  }, []);

  const uniqueDepartmentsCount = useMemo(() => {
    return new Set(EMPLOYEE_MASTER_DATA.map((e) => e.department)).size;
  }, []);

  const renderEntityBadge = (entity: 'GANS' | 'Eshara' | 'YHA') => {
    switch (entity) {
      case 'GANS':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-amber-300 bg-amber-50 text-amber-800">
            GANS
          </span>
        );
      case 'Eshara':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-sky-300 bg-sky-50 text-sky-800">
            Eshara
          </span>
        );
      case 'YHA':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold border border-teal-300 bg-teal-50 text-teal-800">
            YHA
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200 font-sans">
      {/* 1. Header Banner matching image_a491e30a.png */}
      <section className="bg-[#211E4E] rounded-xl px-5 py-4 shadow-xs border border-white/80 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Employee Master
          </h1>
        </div>

        {/* Action Buttons: Release with Dropdown (Release all, Release Selected), Import, Add */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative" ref={releaseMenuRef}>
            <button
              type="button"
              onClick={() => setIsReleaseMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>Release</span>
              {selectedEmployeeIds.size > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-[#059669] text-[9.5px] font-black flex items-center justify-center">
                  {selectedEmployeeIds.size}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isReleaseMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Release Dropdown Menu */}
            {isReleaseMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => handleReleaseClick('all')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-800 hover:text-[#211E4E] font-bold transition-colors cursor-pointer"
                >
                  Release All
                </button>

                <div className="h-[1px] bg-slate-100 my-0.5" />

                <button
                  type="button"
                  onClick={() => handleReleaseClick('selected')}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-800 hover:text-[#211E4E] font-bold transition-colors cursor-pointer"
                >
                  Release Selected
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-transparent hover:bg-white/10 border border-white/40 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C8A977] hover:bg-[#b89865] text-[#211E4E] text-xs font-black shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>
        </div>
      </section>

      {/* 2. Top 3 KPI Stat Cards matching image_a491e30a.png */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* TOTAL EMPLOYEES */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            TOTAL EMPLOYEES
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {EMPLOYEE_MASTER_DATA.length}
          </span>
        </div>

        {/* FUNCTIONS */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            FUNCTIONS
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#C8A977] mt-1">
            {uniqueFunctionsCount}
          </span>
        </div>

        {/* DEPARTMENTS */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            DEPARTMENTS
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {uniqueDepartmentsCount}
          </span>
        </div>
      </div>

      {/* 3. Search & Filter Bar matching image_a491e30a.png */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3 sm:p-3.5 flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Employee Name, ID, Email, Position, Mar..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#211E4E] focus:bg-white transition-all"
          />
        </div>

        {/* Function Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Function:
          </label>
          <div className="relative">
            <select
              value={selectedFunction}
              onChange={(e) => {
                setSelectedFunction(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pr-7 pl-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#211E4E] cursor-pointer"
            >
              {functionOptions.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Department:
          </label>
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pr-7 pl-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#211E4E] cursor-pointer"
            >
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Grade Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Grade:
          </label>
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pr-7 pl-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#211E4E] cursor-pointer"
            >
              {gradeOptions.map((gr) => (
                <option key={gr} value={gr}>
                  {gr}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Status:
          </label>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pr-7 pl-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#211E4E] cursor-pointer"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Employee Master Table matching image_a491e30a.png */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1C1844] text-white font-bold text-[11px] tracking-wide uppercase">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((emp) => selectedEmployeeIds.has(emp.id))
                    }
                    onChange={handleToggleSelectAllPage}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#211E4E] focus:ring-1 focus:ring-[#211E4E] cursor-pointer accent-[#211E4E]"
                    title="Select / Deselect all on current page"
                  />
                </th>
                <th className="py-3 px-3.5 w-14 text-center">S.No</th>
                <th className="py-3 px-4 min-w-[180px]">Employee Name</th>
                <th className="py-3 px-4 min-w-[160px]">Position</th>
                <th className="py-3 px-3 w-20 text-center">Entity</th>
                <th className="py-3 px-4 min-w-[140px]">Department</th>
                <th className="py-3 px-4 min-w-[180px]">Function</th>
                <th className="py-3 px-3.5 min-w-[100px]">DOJ</th>
                <th className="py-3 px-4 min-w-[150px]">Reporting Manager</th>
                <th className="py-3 px-4 min-w-[180px]">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No employees found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((emp) => {
                  const isSelected = selectedEmployeeIds.has(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectEmployee(emp.id)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#211E4E] focus:ring-1 focus:ring-[#211E4E] cursor-pointer accent-[#211E4E]"
                        />
                      </td>

                      {/* S.No */}
                      <td className="py-3 px-3.5 text-center text-slate-500 font-semibold">
                        {emp.sNo}
                      </td>

                      {/* Employee Name with Circle Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 text-[10.5px] font-black flex items-center justify-center shrink-0 border border-slate-300">
                            {emp.avatarInitials}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-[#211E4E]">
                            {emp.name}
                          </span>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {emp.position}
                      </td>

                      {/* Entity Badge */}
                      <td className="py-3 px-3 text-center">
                        {renderEntityBadge(emp.entity)}
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-700">
                        {emp.department}
                      </td>

                      {/* Function */}
                      <td className="py-3 px-4 text-slate-700">
                        {emp.functionDept}
                      </td>

                      {/* DOJ */}
                      <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                        {emp.doj}
                      </td>

                      {/* Reporting Manager */}
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {emp.reportingManager}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-600">
                        {emp.location}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-800">
              {totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * pageSize, totalEntries)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{totalEntries}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Previous
            </button>
            <span className="px-2.5 py-1 font-bold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PDP Release Status Notice Modal with 6 Workflow Milestone Deadlines */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-[0_25px_60px_-15px_rgba(33,30,78,0.35)] border border-slate-200/90 max-w-4xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#17143B] via-[#211E4E] to-[#2D2866] text-white px-5 py-3 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 flex items-center justify-center shadow-inner">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    PDP Release Status Notice
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Designed to fit seamlessly without scrolling on full screen */}
            <div className="px-5 py-3.5 space-y-3 overflow-y-auto max-h-[calc(92vh-100px)]">
              {/* Yellow / Amber Notice Banner */}
              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 border-l-4 border-l-amber-500 flex items-start gap-2.5 shadow-2xs">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-[#92400E] font-medium leading-relaxed">
                  Only UAE National employees are eligible for PDP release.{' '}
                  <strong>{releaseStats.excluded} employees excluded</strong> due to nationality. PDP has already been released for{' '}
                  <strong>{releaseStats.alreadyReleased} employees</strong> in the active cycle.
                </p>
              </div>

              {/* 3 Stat KPI Cards in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Employees */}
                <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-2.5 text-center shadow-xs">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#211E4E] to-[#433E65]" />
                  <div className="text-2xl font-black text-[#211E4E] tracking-tight">
                    {releaseStats.totalEmployees}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Total Employees
                  </div>
                </div>

                {/* Already Released */}
                <div className="relative overflow-hidden rounded-lg border border-sky-200/80 bg-gradient-to-b from-sky-50/40 to-white p-2.5 text-center shadow-xs">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-[#0284C7]" />
                  <div className="text-2xl font-black text-[#0284C7] tracking-tight">
                    {releaseStats.alreadyReleased}
                  </div>
                  <div className="text-[11px] font-semibold text-sky-800 mt-0.5">
                    Already Released
                  </div>
                </div>

                {/* Going to Release Now */}
                <div className="relative overflow-hidden rounded-lg border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white p-2.5 text-center shadow-xs">
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-[#16A34A]" />
                  <div className="text-2xl font-black text-[#16A34A] tracking-tight">
                    {releaseStats.goingToRelease}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                    Going to Release Now
                  </div>
                </div>
              </div>

              {/* 6 Milestone Deadlines Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/80">
                  <Calendar className="w-3.5 h-3.5 text-[#211E4E]" />
                  <h4 className="text-xs font-bold text-[#211E4E] uppercase tracking-wider">
                    Cycle Milestone Deadlines
                  </h4>
                </div>

                {/* Grid of 6 Unique Connected Deadlines Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {stageDeadlines.map((stage) => (
                    <div
                      key={stage.id}
                      className="rounded-lg border border-slate-200/90 bg-white hover:border-[#211E4E]/40 hover:shadow-2xs transition-all duration-150 p-2 flex flex-col justify-between group shadow-2xs"
                    >
                      {/* Card Title - Clean text heading without vertical icon */}
                      <div className="mb-1.5 pb-1 border-b border-slate-100">
                        <span className="text-xs font-bold text-[#211E4E] tracking-tight">
                          {stage.title}
                        </span>
                      </div>

                      {/* Integrated Date Range Bar */}
                      <div className="flex items-center gap-1.5 bg-slate-50/90 p-1 rounded-md border border-slate-200/80 group-hover:border-slate-300 transition-colors">
                        <div className="flex-1 min-w-0">
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={stage.startDate}
                            onChange={(e) => handleDeadlineChange(stage.id, 'startDate', e.target.value)}
                            className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#211E4E]/30 focus:border-[#211E4E] cursor-pointer shadow-2xs"
                          />
                        </div>

                        <span className="text-slate-300 font-light text-xs self-end pb-0.5 select-none shrink-0">
                          →
                        </span>

                        <div className="flex-1 min-w-0">
                          <label className="block text-[9px] uppercase font-bold tracking-wider text-slate-600 mb-0.5">
                            Deadline
                          </label>
                          <input
                            type="date"
                            value={stage.deadline}
                            onChange={(e) => handleDeadlineChange(stage.id, 'deadline', e.target.value)}
                            className="w-full text-xs font-bold text-[#211E4E] bg-white border border-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#211E4E]/40 focus:border-[#211E4E] cursor-pointer shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Release History Notice Banner */}
              <div className="rounded-lg border border-sky-100 bg-gradient-to-r from-sky-50/80 to-slate-50/50 p-2.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>
                    See full details in <strong className="font-bold text-[#211E4E]">PDP Release History</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal(null);
                    if (onNavigateToReleaseHistory) {
                      onNavigateToReleaseHistory();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition-colors cursor-pointer group"
                >
                  <span>Release History</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRelease}
                className="px-5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#211E4E] to-[#433E65] hover:from-[#17143B] hover:to-[#363255] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md"
              >
                <Send className="w-3.5 h-3.5 rotate-45" />
                <span>Release</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
