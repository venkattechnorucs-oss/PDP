import React, { useState, useMemo } from 'react';
import {
  History,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  X,
  Users,
  Building2,
  MailCheck,
  ArrowUpDown,
} from 'lucide-react';

interface ReleaseRun {
  id: string;
  releaseId: string;
  releaseDate: string;
  deadline: string;
  releaseCount: number;
  status: 'In Progress' | 'Completed';
  cohortScope: string;
  dispatchedBy: string;
  deliveryRate: string;
  remarks: string;
}

const RELEASE_RUNS_DATA: ReleaseRun[] = [
  {
    id: '1',
    releaseId: 'REL-2026-005',
    releaseDate: '01/Aug/2026',
    deadline: '31/Aug/2026',
    releaseCount: 14,
    status: 'In Progress',
    cohortScope: 'Enterprise Workforce (All Divisions)',
    dispatchedBy: 'Fatima Al-Riyami (HR Talent Operations Lead)',
    deliveryRate: '100% Dispatched (14/14)',
    remarks: 'Annual enterprise-wide PDP rollout across operations and corporate departments.',
  },
  {
    id: '2',
    releaseId: 'REL-2026-004',
    releaseDate: '15/Jul/2026',
    deadline: '15/Aug/2026',
    releaseCount: 6,
    status: 'Completed',
    cohortScope: 'Plant Integrity & Maintenance Division',
    dispatchedBy: 'Salim Al-Harthy (LNA Technical Lead)',
    deliveryRate: '100% Delivered (6/6)',
    remarks: 'Targeted technical competencies and asset reliability certification cohort.',
  },
  {
    id: '3',
    releaseId: 'REL-2026-003',
    releaseDate: '01/Jul/2026',
    deadline: '31/Jul/2026',
    releaseCount: 5,
    status: 'Completed',
    cohortScope: 'HSE & Operational Safety Division',
    dispatchedBy: 'HR Executive Operations',
    deliveryRate: '100% Delivered (5/5)',
    remarks: 'Process safety management and risk assessment developmental sprint.',
  },
  {
    id: '4',
    releaseId: 'REL-2026-002',
    releaseDate: '15/Jun/2026',
    deadline: '15/Jul/2026',
    releaseCount: 5,
    status: 'Completed',
    cohortScope: 'Electrical & Instrumentation Engineering',
    dispatchedBy: 'HR Talent Operations',
    deliveryRate: '100% Delivered (5/5)',
    remarks: 'Control systems & DCS diagnostic advancement training cycle.',
  },
  {
    id: '5',
    releaseId: 'REL-2026-001',
    releaseDate: '01/Jun/2026',
    deadline: '30/Jun/2026',
    releaseCount: 4,
    status: 'Completed',
    cohortScope: 'Rotary & Static Equipment Specialists',
    dispatchedBy: 'HR Talent Operations',
    deliveryRate: '100% Delivered (4/4)',
    remarks: 'Vibration analysis and predictive maintenance specialized cohort.',
  },
];

export const HrReleaseHistoryTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [selectedRun, setSelectedRun] = useState<ReleaseRun | null>(null);

  const filteredRuns = useMemo(() => {
    let list = RELEASE_RUNS_DATA.filter((run) => {
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'IN_PROGRESS' && run.status !== 'In Progress') return false;
        if (statusFilter === 'COMPLETED' && run.status !== 'Completed') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = run.releaseId.toLowerCase().includes(q);
        const matchScope = run.cohortScope.toLowerCase().includes(q);
        const matchRemarks = run.remarks.toLowerCase().includes(q);
        if (!matchId && !matchScope && !matchRemarks) return false;
      }
      return true;
    });

    if (sortOrder === 'OLDEST') {
      return [...list].reverse();
    }
    return list;
  }, [searchQuery, statusFilter, sortOrder]);

  return (
    <div className="space-y-4">
      {/* Top Header Banner - Exact Match to Screenshot */}
      <div className="bg-[#153f5e] text-white p-5 rounded-xl shadow-xs border border-[#0f2e46]">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-white shrink-0" />
          <h2 className="text-xl font-bold tracking-tight">Release History</h2>
        </div>
        <p className="text-xs text-sky-200/90 mt-1">
          Historical log of release runs and deadlines. Click any run to inspect its detailed delivery manifest.
        </p>
      </div>

      {/* Filter and Search Bar - Exact Match to Screenshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Release ID, Cohort Scope, or remarks..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
          />
        </div>

        {/* All Runs Dropdown */}
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
          >
            <option value="ALL">All Runs</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-56">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'NEWEST' | 'OLDEST')}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
          >
            <option value="NEWEST">Sort: Release ID (Newest)</option>
            <option value="OLDEST">Sort: Release ID (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Release History Table - Exact Match to Screenshot */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#153f5e] text-white font-bold text-xs uppercase tracking-wider border-b border-[#0f2e46]">
                <th className="py-3 px-5 w-44">Release ID</th>
                <th className="py-3 px-5">Release Date</th>
                <th className="py-3 px-5">Deadline</th>
                <th className="py-3 px-5">Release Count</th>
                <th className="py-3 px-5 text-right sm:text-center w-36">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 italic">
                    No release runs matching your search.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => (
                  <tr
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    {/* Release ID (Vivid Cyan/Blue Link) */}
                    <td className="py-3.5 px-5 font-bold text-[#0284c7] hover:underline font-mono text-xs">
                      {run.releaseId}
                    </td>

                    {/* Release Date with Calendar Icon */}
                    <td className="py-3.5 px-5 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-slate-800">{run.releaseDate}</span>
                      </div>
                    </td>

                    {/* Deadline with Calendar Icon */}
                    <td className="py-3.5 px-5 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-slate-800">{run.deadline}</span>
                      </div>
                    </td>

                    {/* Release Count */}
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      {run.releaseCount} Employees
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-5 text-right sm:text-center">
                      {run.status === 'In Progress' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50/80 text-amber-700 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>In Progress</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Release Manifest Modal (Opens on row click) */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#153f5e] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Delivery Manifest: {selectedRun.releaseId}</h3>
                <p className="text-xs text-sky-200">{selectedRun.cohortScope}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Release ID:</span>
                  <span className="font-mono font-bold text-[#0284c7]">{selectedRun.releaseId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Dispatched By:</span>
                  <span className="font-bold text-slate-900">{selectedRun.dispatchedBy}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Release Date:</span>
                  <span className="font-bold text-slate-900">{selectedRun.releaseDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Submission Due Date:</span>
                  <span className="font-bold text-amber-700">{selectedRun.deadline}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Target Workforce Count:</span>
                  <span className="font-bold text-slate-900">{selectedRun.releaseCount} Staff Enrolled</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Notification Delivery:</span>
                  <span className="font-bold text-emerald-700">{selectedRun.deliveryRate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Batch Status:</span>
                  <span className="font-bold text-slate-900">{selectedRun.status}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <span className="font-bold block text-slate-900 mb-1">Scope & Remarks:</span>
                {selectedRun.remarks}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRun(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
