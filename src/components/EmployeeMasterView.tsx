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
  Sparkles,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

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

export const EmployeeMasterView: React.FC = () => {
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

      {/* Release Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#211E4E] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C8A977] text-[#211E4E] flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Confirm PDP Cycle Release
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Cycle Year: 2026 – 2027
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Release Scope:</span>
                  <span className="font-extrabold text-[#211E4E] uppercase tracking-wide">
                    {confirmModal.mode === 'all' ? 'All Employees' : 'Selected Employees'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Target Count:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {confirmModal.count} Employees
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Release Reference ID:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    REL-2026-002
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                Initiating this release will distribute the Professional Development Plan to the specified employee(s) and notify their Line Managers.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRelease}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Release</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
