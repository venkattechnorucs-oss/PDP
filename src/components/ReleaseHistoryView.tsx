import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  History,
  Calendar,
  Check,
  Search,
  RotateCw,
  ChevronDown,
  ArrowLeft,
  Clock,
  RotateCcw,
  UserMinus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCheck,
  CheckSquare,
  Send,
  X,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

export interface ReleaseRecord {
  id: string;
  releaseDate: string;
  successCount: number;
  failedCount: number;
  status: 'Completed' | 'In Progress' | 'Failed';
}

export interface EmployeeDistribution {
  id: number;
  sNo: number;
  employeeName: string;
  employeeAvatar?: string;
  managerName: string;
  managerAvatar?: string;
  status: 'Not Started' | 'Pending Approval' | 'Returned' | 'Completed';
  skipped?: boolean;
}

const INITIAL_RELEASES: ReleaseRecord[] = [
  {
    id: 'REL-2026-001',
    releaseDate: '22-10-2026',
    successCount: 729,
    failedCount: 0,
    status: 'Completed',
  },
];

const INITIAL_DISTRIBUTION: EmployeeDistribution[] = [
  {
    id: 1,
    sNo: 1,
    employeeName: 'Sana Krishnan',
    managerName: 'Ashmigandhi Viv...',
    status: 'Not Started',
  },
  {
    id: 2,
    sNo: 2,
    employeeName: 'Jarsh Al Suwaidi',
    managerName: 'Ahmed Saleh Al ...',
    managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    status: 'Not Started',
  },
  {
    id: 3,
    sNo: 3,
    employeeName: 'Layla Al Hayyas',
    employeeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    managerName: 'Eisa Al Shamsi',
    managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    status: 'Not Started',
  },
  {
    id: 4,
    sNo: 4,
    employeeName: 'Ahmed Bakir',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    managerName: 'Ahmed Moham...',
    managerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    status: 'Not Started',
  },
  {
    id: 5,
    sNo: 5,
    employeeName: 'Layla Al Mazrouei',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    managerName: 'Ahmed Moham...',
    managerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    status: 'Not Started',
  },
  {
    id: 6,
    sNo: 6,
    employeeName: 'Mohammed Miz...',
    managerName: 'Mikel Torres',
    status: 'Pending Approval',
  },
  {
    id: 7,
    sNo: 7,
    employeeName: 'Ahmed Moham...',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
    managerName: 'Eisa Al Shamsi',
    managerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    status: 'Not Started',
  },
  {
    id: 8,
    sNo: 8,
    employeeName: 'Gaetan Erwann B...',
    managerName: 'Mikel Torres',
    status: 'Not Started',
  },
  {
    id: 9,
    sNo: 9,
    employeeName: 'Mariam Ali Ghani...',
    managerName: 'Mikel Torres',
    status: 'Pending Approval',
  },
  {
    id: 10,
    sNo: 10,
    employeeName: 'Tariq Al Hashemi',
    managerName: 'David O\'Connor',
    status: 'Completed',
  },
  {
    id: 11,
    sNo: 11,
    employeeName: 'Ravi Kumar',
    managerName: 'Suresh Nair',
    status: 'Completed',
  },
  {
    id: 12,
    sNo: 12,
    employeeName: 'Fatima Al Mansoori',
    managerName: 'Suresh Nair',
    status: 'Returned',
  },
  {
    id: 13,
    sNo: 13,
    employeeName: 'Zayed Al Zaabi',
    managerName: 'Mansoor Al Hammadi',
    status: 'Not Started',
  },
  {
    id: 14,
    sNo: 14,
    employeeName: 'Hessa Al Nuaimi',
    managerName: 'Anita Rao',
    status: 'Pending Approval',
  },
  {
    id: 15,
    sNo: 15,
    employeeName: 'Rashid Al Dhaheri',
    managerName: 'Suresh Nair',
    status: 'Returned',
  },
];

export const ReleaseHistoryView: React.FC = () => {
  const { addToast } = usePdp();
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);

  // Release History List State
  const [releasesList, setReleasesList] = useState<ReleaseRecord[]>(INITIAL_RELEASES);
  const [searchHistory, setSearchHistory] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Release Dropdown & Modal State
  const [isReleaseMenuOpen, setIsReleaseMenuOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: 'all' | 'selected';
    count: number;
  } | null>(null);
  const releaseMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (releaseMenuRef.current && !releaseMenuRef.current.contains(event.target as Node)) {
        setIsReleaseMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReleaseClick = (mode: 'all' | 'selected') => {
    setIsReleaseMenuOpen(false);
    setConfirmModal({
      isOpen: true,
      mode,
      count: mode === 'all' ? 729 : 284,
    });
  };

  const handleExecuteRelease = () => {
    if (!confirmModal) return;
    const nextNum = releasesList.length + 1;
    const newId = `REL-2026-00${nextNum}`;
    const newRecord: ReleaseRecord = {
      id: newId,
      releaseDate: '28-10-2026',
      successCount: confirmModal.count,
      failedCount: 0,
      status: 'Completed',
    };
    setReleasesList([newRecord, ...releasesList]);
    addToast(
      'success',
      'PDP Cycle Released',
      confirmModal.mode === 'all'
        ? `Successfully released PDP cycle for all ${confirmModal.count} roster employees (${newId})`
        : `Successfully released PDP cycle for ${confirmModal.count} selected employees (${newId})`
    );
    setConfirmModal(null);
  };

  // Distribution View State
  const [distributionFilter, setDistributionFilter] = useState<
    'All' | 'Not Started' | 'Pending Approval' | 'Returned' | 'Completed'
  >('All');
  const [searchDistribution, setSearchDistribution] = useState('');
  const [distributionData, setDistributionData] = useState<EmployeeDistribution[]>(INITIAL_DISTRIBUTION);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Release History records
  const filteredReleases = useMemo(() => {
    return releasesList.filter((r) => {
      const matchSearch = r.id.toLowerCase().includes(searchHistory.toLowerCase());
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [releasesList, searchHistory, statusFilter]);

  // Filtered Distribution items
  const filteredDistribution = useMemo(() => {
    return distributionData.filter((emp) => {
      const matchTab =
        distributionFilter === 'All'
          ? true
          : emp.status === distributionFilter;
      const matchSearch =
        searchDistribution === '' ||
        emp.employeeName.toLowerCase().includes(searchDistribution.toLowerCase()) ||
        emp.managerName.toLowerCase().includes(searchDistribution.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [distributionData, distributionFilter, searchDistribution]);

  // Paginated Distribution items
  const paginatedDistribution = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDistribution.slice(startIndex, startIndex + pageSize);
  }, [filteredDistribution, currentPage]);

  const totalPages = Math.ceil(filteredDistribution.length / pageSize) || 1;

  const handleSkip = (id: number, name: string) => {
    setDistributionData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, skipped: true } : emp))
    );
    addToast('success', 'Milestone Skipped', `Milestone skipped successfully for ${name}`);
  };

  const renderStatusBadge = (status: EmployeeDistribution['status']) => {
    switch (status) {
      case 'Not Started':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Not Started
          </span>
        );
      case 'Pending Approval':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Clock className="w-3 h-3 text-cyan-600 shrink-0" />
            Pending Approval
          </span>
        );
      case 'Returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            Returned
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
            Completed
          </span>
        );
    }
  };

  const renderAvatar = (avatarUrl?: string) => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
        />
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
    );
  };

  // ==========================================
  // 1. DETAIL VIEW: RELEASE DISTRIBUTION
  // (Matching image_1260a655.png)
  // ==========================================
  if (selectedReleaseId) {
    return (
      <div className="space-y-4 max-w-[1720px] mx-auto pb-12">
        {/* Top Dark Banner matching image_1260a655.png */}
        <div className="bg-[#211E4E] rounded-xl px-6 py-4 text-white flex items-center gap-4 shadow-sm">
          <button
            type="button"
            onClick={() => setSelectedReleaseId(null)}
            className="w-8 h-8 rounded-full bg-white text-[#211E4E] flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer shadow-xs shrink-0"
            title="Back to Release History"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              Release Distribution
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {selectedReleaseId}
            </p>
          </div>
        </div>

        {/* Filter Pills Bar & Search Bar matching image_1260a655.png */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { label: 'All', count: 729 },
                { label: 'Not Started', count: 402 },
                { label: 'Pending Approval', count: 116 },
                { label: 'Returned', count: 4 },
                { label: 'Completed', count: 207 },
              ] as const
            ).map((item) => {
              const isActive = distributionFilter === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setDistributionFilter(item.label);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#211E4E] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              );
            })}
          </div>

          {/* Right Toolbar: Search & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchDistribution}
                onChange={(e) => {
                  setSearchDistribution(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search employee or manager..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#211E4E] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchDistribution('');
                setDistributionFilter('All');
                addToast('info', 'Refreshed', 'Distribution list refreshed');
              }}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              title="Refresh distribution list"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Distribution Table matching image_1260a655.png */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-5 w-16">S.NO</th>
                  <th className="py-3.5 px-5">EMPLOYEE NAME</th>
                  <th className="py-3.5 px-5">MANAGER</th>
                  <th className="py-3.5 px-5">STATUS</th>
                  <th className="py-3.5 px-5 text-right w-28">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {paginatedDistribution.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400 font-medium"
                    >
                      No employee distribution records found matching criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedDistribution.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-5 text-slate-500 font-medium">
                        {emp.sNo}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          {renderAvatar(emp.employeeAvatar)}
                          <span className="font-semibold text-slate-800">
                            {emp.employeeName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          {renderAvatar(emp.managerAvatar)}
                          <span className="text-slate-700 font-medium">
                            {emp.managerName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        {renderStatusBadge(emp.status)}
                      </td>
                      <td className="py-3 px-5 text-right">
                        {emp.skipped ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 px-3 py-1 bg-slate-100 rounded-lg">
                            <Check className="w-3 h-3 text-slate-400" />
                            Skipped
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSkip(emp.id, emp.employeeName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50/60 border border-purple-200/90 hover:bg-purple-100/70 hover:border-purple-300 transition-all cursor-pointer shadow-2xs"
                          >
                            <UserMinus className="w-3.5 h-3.5 text-purple-600" />
                            Skip
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
            <div>
              Showing {filteredDistribution.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, 729)} of 729 employees
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <span className="px-3 py-1 rounded-md bg-[#211E4E] text-white font-bold text-xs">
                {currentPage}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. MAIN VIEW: RELEASE HISTORY LIST
  // (Matching image_5b0917dc.png)
  // ==========================================
  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-12">
      {/* Top Dark Banner matching image_5b0917dc.png */}
      <div className="bg-[#211E4E] rounded-xl px-6 py-4 text-white flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-white stroke-[2.5]" />
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
            Release History
          </h1>
        </div>

        {/* Release Button with Dropdown (Release all, Release Selected) */}
        <div className="relative" ref={releaseMenuRef}>
          <button
            type="button"
            onClick={() => setIsReleaseMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Release</span>
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
      </div>

      {/* Filter & Search Bar matching image_5b0917dc.png */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            placeholder="Search here..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#211E4E] transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:border-[#211E4E] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Failed">Failed</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className="appearance-none pl-3.5 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden focus:border-[#211E4E] cursor-pointer"
          >
            <option value="newest">Sort: Release Date (Newest)</option>
            <option value="oldest">Sort: Release Date (Oldest)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={() => {
            setSearchHistory('');
            setStatusFilter('All');
            addToast('info', 'Refreshed', 'Release history refreshed');
          }}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          title="Refresh"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Release History Table matching image_5b0917dc.png */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-6">RELEASE ID</th>
                <th className="py-3.5 px-6">RELEASE DATE</th>
                <th className="py-3.5 px-6">COUNT</th>
                <th className="py-3.5 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredReleases.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No releases found.
                  </td>
                </tr>
              ) : (
                filteredReleases.map((release) => (
                  <tr
                    key={release.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-6">
                      <button
                        type="button"
                        onClick={() => setSelectedReleaseId(release.id)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer tracking-tight"
                      >
                        {release.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{release.releaseDate}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {release.successCount} Success
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {release.failedCount} Failed
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {release.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching image_5b0917dc.png */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
          <div>
            Showing 1 to {filteredReleases.length} of {filteredReleases.length} releases
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled
              className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled
              className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="w-6 h-6 rounded bg-[#211E4E] text-white font-bold text-xs flex items-center justify-center"
            >
              1
            </button>
            <button
              type="button"
              disabled
              className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled
              className="p-1 rounded text-slate-400 cursor-not-allowed opacity-50"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
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
                  <span className="text-slate-500 font-medium">New Release Reference ID:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    REL-2026-00{releasesList.length + 1}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                Confirming will generate a new release record and distribute PDP roadmaps to the target employees and line managers.
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
