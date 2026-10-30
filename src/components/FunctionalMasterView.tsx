import React, { useState, useMemo } from 'react';
import {
  Network,
  Plus,
  Search,
  RotateCcw,
  Building2,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

export interface FunctionalRecord {
  id: string;
  name: string;
  entity: 'GANS' | 'YHA' | 'Eshara';
}

const INITIAL_FUNCTIONALS: FunctionalRecord[] = [
  { id: 'FNC-001', name: 'Eshara', entity: 'Eshara' },
  { id: 'FNC-002', name: 'Marketing & Communications', entity: 'YHA' },
  { id: 'FNC-003', name: 'PMO', entity: 'YHA' },
  { id: 'FNC-004', name: 'Finance', entity: 'YHA' },
  { id: 'FNC-005', name: 'Finance', entity: 'GANS' },
  { id: 'FNC-006', name: 'Commercial', entity: 'GANS' },
  { id: 'FNC-007', name: 'Procurement', entity: 'GANS' },
  { id: 'FNC-008', name: 'ANS', entity: 'GANS' },
  { id: 'FNC-009', name: 'IT', entity: 'GANS' },
  { id: 'FNC-010', name: 'HR', entity: 'GANS' },
  { id: 'FNC-011', name: 'AIS', entity: 'GANS' },
];

export const FunctionalMasterView: React.FC = () => {
  const { addToast } = usePdp();
  const [functionals, setFunctionals] = useState<FunctionalRecord[]>(INITIAL_FUNCTIONALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('All Entities');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FunctionalRecord | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalEntity, setModalEntity] = useState<'GANS' | 'YHA' | 'Eshara'>('GANS');

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredFunctionals = useMemo(() => {
    return functionals.filter((f) => {
      if (selectedEntity !== 'All Entities' && f.entity !== selectedEntity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!f.name.toLowerCase().includes(q) && !f.entity.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [functionals, selectedEntity, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalName('');
    setModalEntity('GANS');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FunctionalRecord) => {
    setEditingItem(item);
    setModalName(item.name);
    setModalEntity(item.entity);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) {
      addToast('error', 'Required Field', 'Please enter a functional name.');
      return;
    }

    if (editingItem) {
      setFunctionals((prev) =>
        prev.map((f) =>
          f.id === editingItem.id ? { ...f, name: modalName.trim(), entity: modalEntity } : f
        )
      );
      addToast('success', 'Functional Updated', `Updated "${modalName.trim()}" successfully.`);
    } else {
      const newItem: FunctionalRecord = {
        id: `FNC-${String(functionals.length + 1).padStart(3, '0')}`,
        name: modalName.trim(),
        entity: modalEntity,
      };
      setFunctionals((prev) => [...prev, newItem]);
      addToast('success', 'Functional Added', `Added "${modalName.trim()}" successfully.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const target = functionals.find((f) => f.id === id);
    setFunctionals((prev) => prev.filter((f) => f.id !== id));
    setDeletingId(null);
    addToast('info', 'Functional Removed', `Removed "${target?.name || 'Functional'}".`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEntity('All Entities');
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* 1. Header Banner matching image_a694fae3.png */}
      <div className="bg-[#211E4E] rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <Network className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Functional Master
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E7490] hover:bg-[#086178] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span>Add</span>
        </button>
      </div>

      {/* 2. Filter Bar matching image_a694fae3.png */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search functional..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200/90 focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E] shadow-2xs"
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

        {/* Entity Selector */}
        <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs">
          <span className="text-slate-500 mr-2 font-medium">Entity:</span>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="bg-transparent text-slate-800 font-bold text-xs focus:outline-hidden cursor-pointer appearance-none pr-5"
          >
            <option value="All Entities">All Entities</option>
            <option value="GANS">GANS</option>
            <option value="YHA">YHA</option>
            <option value="Eshara">Eshara</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* Refresh / Reset button */}
        <button
          type="button"
          onClick={handleResetFilters}
          title="Reset Filters"
          className="p-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/90 text-slate-500 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Table matching image_a694fae3.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">FUNCTIONAL NAME</th>
                <th className="py-3.5 px-6">ENTITY</th>
                <th className="py-3.5 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredFunctionals.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    <Network className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No functional areas found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredFunctionals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* FUNCTIONAL NAME */}
                    <td className="py-4 px-6 font-semibold text-slate-800 text-[13px]">
                      {item.name}
                    </td>

                    {/* ENTITY */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 shadow-2xs">
                        <Building2 className="w-3 h-3 text-sky-500" />
                        <span>{item.entity}</span>
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Functional"
                          className="w-7 h-7 rounded-lg bg-[#211E4E] hover:bg-[#18153A] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          title="Delete Functional"
                          className="w-7 h-7 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
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
      </div>

      {/* 4. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#211E4E] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Network className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {editingItem ? 'Edit Functional' : 'Add Functional'}
                  </h3>
                  <p className="text-xs text-[#C8A977]">Manage organizational functional domain</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Functional Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="e.g. Flight Operations, AIS, Commercial..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Entity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={modalEntity}
                  onChange={(e) => setModalEntity(e.target.value as 'GANS' | 'YHA' | 'Eshara')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                >
                  <option value="GANS">GANS</option>
                  <option value="YHA">YHA</option>
                  <option value="Eshara">Eshara</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#211E4E] hover:bg-[#18153A] text-white text-xs font-bold shadow-xs cursor-pointer"
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
                <h4 className="text-sm font-bold text-slate-900">Delete Functional Area?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  This functional area will be removed from masters.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
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
