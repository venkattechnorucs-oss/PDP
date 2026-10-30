import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Send,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertTriangle,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

export interface DelegationItem {
  id: string;
  fromName: string;
  fromRole?: string;
  fromInitials: string;
  fromBg: string;
  toName: string;
  toRole?: string;
  toInitials: string;
  toBg: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}

const INITIAL_DELEGATIONS: DelegationItem[] = [
  {
    id: 'DEL-001',
    fromName: 'Madhesh Maasi',
    fromRole: 'Air Navigation Operations Director',
    fromInitials: 'MM',
    fromBg: 'bg-[#211E4E]',
    toName: 'Mohan Raj',
    toRole: 'Senior ATC Specialist',
    toInitials: 'MR',
    toBg: 'bg-[#C8A977]',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    remarks: 'Annual Leave Line Manager Coverage',
  },
  {
    id: 'DEL-002',
    fromName: 'Madhesh Maasi',
    fromRole: 'Air Navigation Operations Director',
    fromInitials: 'MM',
    fromBg: 'bg-[#211E4E]',
    toName: 'Suresh Nair',
    toRole: 'Operations Duty Manager',
    toInitials: 'SN',
    toBg: 'bg-[#C8A977]',
    startDate: '2026-09-05',
    endDate: '2026-10-15',
    remarks: 'Overseas Mission Delegation',
  },
  {
    id: 'DEL-003',
    fromName: 'Ram',
    fromRole: 'Finance & Governance Lead',
    fromInitials: 'RA',
    fromBg: 'bg-[#211E4E]',
    toName: 'Suresh Nair',
    toRole: 'Operations Duty Manager',
    toInitials: 'SN',
    toBg: 'bg-[#C8A977]',
    startDate: '2026-08-15',
    endDate: '2026-11-30',
    remarks: 'Interim Approvals Authority',
  },
  {
    id: 'DEL-004',
    fromName: 'Mansoor Al Hammadi',
    fromRole: 'HR Strategy Executive',
    fromInitials: 'MH',
    fromBg: 'bg-[#211E4E]',
    toName: 'Anita Rao',
    toRole: 'Talent & Development Specialist',
    toInitials: 'AR',
    toBg: 'bg-slate-700',
    startDate: '2026-09-10',
    endDate: '2026-10-10',
    remarks: 'PDP Cycle Review Delegation',
  },
];

const AVAILABLE_USERS = [
  { name: 'Ravi Kumar', role: 'Store Manager • Operations', initials: 'RK' },
  { name: 'Priya Sharma', role: 'Sales Manager • Sales', initials: 'PS' },
  { name: 'Madhesh Maasi', role: 'Air Navigation Operations Director', initials: 'MM' },
  { name: 'Mohan Raj', role: 'Senior ATC Specialist', initials: 'MR' },
  { name: 'Suresh Nair', role: 'Operations Duty Manager', initials: 'SN' },
  { name: 'Ram', role: 'Finance & Governance Lead', initials: 'RA' },
  { name: 'Mansoor Al Hammadi', role: 'HR Strategy Executive', initials: 'MH' },
  { name: 'Anita Rao', role: 'Talent & Development Specialist', initials: 'AR' },
  { name: 'Ahmed Saleh Al Mansoori', role: 'Duty Operations Manager', initials: 'AS' },
  { name: 'Eisa Al Shamsi', role: 'Airside Safety Supervisor', initials: 'ES' },
];

export const DelegationView: React.FC = () => {
  const { addToast } = usePdp();
  const [delegations, setDelegations] = useState<DelegationItem[]>(INITIAL_DELEGATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DelegationItem | null>(null);

  // Form Fields
  const [fromUser, setFromUser] = useState(AVAILABLE_USERS[0].name);
  const [toUser, setToUser] = useState(AVAILABLE_USERS[1].name);
  const [startDate, setStartDate] = useState('2026-10-28');
  const [endDate, setEndDate] = useState('2026-11-27');
  const [remarks, setRemarks] = useState('');

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDelegations = useMemo(() => {
    if (!searchQuery.trim()) return delegations;
    const q = searchQuery.toLowerCase();
    return delegations.filter(
      (d) =>
        d.fromName.toLowerCase().includes(q) ||
        d.toName.toLowerCase().includes(q) ||
        d.startDate.includes(q) ||
        d.endDate.includes(q) ||
        (d.remarks && d.remarks.toLowerCase().includes(q))
    );
  }, [delegations, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredDelegations.length / itemsPerPage));
  const currentDelegations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDelegations.slice(start, start + itemsPerPage);
  }, [filteredDelegations, currentPage, itemsPerPage]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFromUser('Ravi Kumar');
    setToUser('Priya Sharma');
    setStartDate('2026-10-28');
    setEndDate('2026-11-27');
    setRemarks('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DelegationItem) => {
    setEditingItem(item);
    setFromUser(item.fromName);
    setToUser(item.toName);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setRemarks(item.remarks || '');
    setIsModalOpen(true);
  };

  const handleSaveDelegation = (e: React.FormEvent) => {
    e.preventDefault();

    if (fromUser === toUser) {
      addToast('error', 'Invalid Delegation', 'Delegator and delegatee cannot be the same user.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      addToast('error', 'Invalid Date Range', 'End date must be after start date.');
      return;
    }

    const fromObj = AVAILABLE_USERS.find((u) => u.name === fromUser) || {
      name: fromUser,
      role: 'Manager',
      initials: fromUser.slice(0, 2).toUpperCase(),
    };
    const toObj = AVAILABLE_USERS.find((u) => u.name === toUser) || {
      name: toUser,
      role: 'Reviewer',
      initials: toUser.slice(0, 2).toUpperCase(),
    };

    if (editingItem) {
      // Update existing
      setDelegations((prev) =>
        prev.map((d) =>
          d.id === editingItem.id
            ? {
                ...d,
                fromName: fromObj.name,
                fromRole: fromObj.role,
                fromInitials: fromObj.initials,
                toName: toObj.name,
                toRole: toObj.role,
                toInitials: toObj.initials,
                startDate,
                endDate,
                remarks,
              }
            : d
        )
      );
      addToast('success', 'Delegation Updated', `Authority updated for ${fromObj.name} to ${toObj.name}.`);
    } else {
      // Create new
      const newItem: DelegationItem = {
        id: `DEL-${String(delegations.length + 1).padStart(3, '0')}`,
        fromName: fromObj.name,
        fromRole: fromObj.role,
        fromInitials: fromObj.initials,
        fromBg: 'bg-[#211E4E]',
        toName: toObj.name,
        toRole: toObj.role,
        toInitials: toObj.initials,
        toBg: 'bg-[#C8A977]',
        startDate,
        endDate,
        remarks,
      };
      setDelegations((prev) => [newItem, ...prev]);
      addToast('success', 'Delegation Created', `Authority delegated from ${fromObj.name} to ${toObj.name}.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const item = delegations.find((d) => d.id === id);
    setDelegations((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
    addToast('info', 'Delegation Removed', `Delegation for ${item?.fromName || 'user'} has been deleted.`);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto space-y-5">
      {/* 1. Header Banner matching image_c1b6028d.png */}
      <div className="bg-[#211E4E] rounded-2xl px-6 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Delegation</h1>
        </div>

        {/* Right: Search Box + Add Delegation Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search delegation..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:outline-hidden focus:border-[#C8A977] focus:ring-1 focus:ring-[#C8A977] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C8A977] hover:bg-[#b89561] text-[#211E4E] text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#211E4E]" strokeWidth={2.5} />
            <span>Add Delegation</span>
          </button>
        </div>
      </div>

      {/* 2. Delegation Table matching image_c1b6028d.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">FROM</th>
                <th className="py-3.5 px-6">TO</th>
                <th className="py-3.5 px-6">START DATE</th>
                <th className="py-3.5 px-6">END DATE</th>
                <th className="py-3.5 px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentDelegations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No delegation records found.
                  </td>
                </tr>
              ) : (
                currentDelegations.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* FROM Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${item.fromBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {item.fromInitials}
                        </div>
                        <span className="font-bold text-slate-800 text-[13px]">{item.fromName}</span>
                      </div>
                    </td>

                    {/* TO Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${item.toBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                        >
                          {item.toInitials}
                        </div>
                        <span className="font-bold text-slate-800 text-[13px]">{item.toName}</span>
                      </div>
                    </td>

                    {/* START DATE Column */}
                    <td className="py-4 px-6 font-medium text-slate-700 font-mono text-xs">
                      {item.startDate}
                    </td>

                    {/* END DATE Column */}
                    <td className="py-4 px-6 font-medium text-slate-700 font-mono text-xs">
                      {item.endDate}
                    </td>

                    {/* ACTION Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Delegation"
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-600 hover:text-[#211E4E] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          title="Delete Delegation"
                          className="w-8 h-8 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">1</span> to{' '}
            <span className="font-semibold text-slate-700">{filteredDelegations.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{filteredDelegations.length}</span> delegations
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
            </button>

            <span className="w-7 h-7 rounded-lg bg-[#211E4E] text-white font-bold text-xs flex items-center justify-center">
              {currentPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronsRight className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. New / Edit Delegation Modal matching image_510dac36.png */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#211E4E] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {editingItem ? 'Edit Delegation' : 'New Delegation'}
                  </h3>
                  <p className="text-xs text-[#C8A977]">
                    Configure manager review authority and assignment dates
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveDelegation} className="p-6 space-y-4">
              {/* Field 1: From */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>From</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={fromUser}
                  onChange={(e) => setFromUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] transition-all"
                  required
                >
                  {AVAILABLE_USERS.map((u) => (
                    <option key={u.name} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2: To */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>To</span>
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={toUser}
                  onChange={(e) => setToUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] transition-all"
                  required
                >
                  {AVAILABLE_USERS.map((u) => (
                    <option key={u.name} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Start Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start Date</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] transition-all"
                  required
                />
              </div>

              {/* Field 4: End Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>End Date</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] transition-all"
                  required
                />
              </div>

              {/* Field 5: Remarks / Purpose (Optional) */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                  <span>Remarks / Purpose</span>
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Leave Coverage, Interim Line Manager..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] transition-all"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#211E4E] hover:bg-[#19163d] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Delegation Authority?</h4>
                <p className="text-xs text-slate-500">
                  This action will remove the assigned manager review delegation.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
