import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  X,
  Send,
  Building2,
  AlertTriangle,
  Network,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';

export type CompetencyCategory = 'Behavioral' | 'Functional';

export interface CompetencyItem {
  id: string;
  functional: string;
  entity: 'GANS' | 'YHA' | 'Eshara';
  category: CompetencyCategory;
  name: string;
  description?: string;
}

const INITIAL_COMPETENCIES: CompetencyItem[] = [
  // 1. AIS Functionals
  {
    id: 'CMP-001',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Accountability',
    description: 'Takes complete ownership of outcomes, adhering strictly to safety regulations and timelines.',
  },
  {
    id: 'CMP-002',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Adaptability',
    description: 'Adjusts readily to shifting operational demands, emergencies, and new digital workflows.',
  },
  {
    id: 'CMP-003',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Customer Centricity',
    description: 'Ensures pilots, airlines, and stakeholders receive timely, flawless aeronautical information.',
  },
  {
    id: 'CMP-004',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Effective Communication',
    description: 'Conveys mission-critical aeronautical and briefing updates with clarity and precision.',
  },
  {
    id: 'CMP-005',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Learning Agility',
    description: 'Rapidly absorbs updated ICAO and GCAA aeronautical protocols and software capabilities.',
  },
  {
    id: 'CMP-006',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Result Orientation',
    description: 'Meets and surpasses operational SLAs with meticulous attention to accuracy and deadlines.',
  },
  {
    id: 'CMP-007',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Teamwork & Collaboration',
    description: 'Fosters cross-shift unity and seamless handovers between ATC, briefing, and flight planning.',
  },
  {
    id: 'CMP-008',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Aeronautical Charting',
    description: 'Design and maintenance of visual and instrument flight procedure charts in compliance with standards.',
  },
  {
    id: 'CMP-009',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Aeronautical Data Quality and Integrity Management',
    description: 'Validation, verification, and audit of aeronautical coordinates, obstacles, and navigational aids.',
  },
  {
    id: 'CMP-010',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'AIP and Aeronautical Publication Management',
    description: 'Authoring, amendment, and publishing of the UAE Aeronautical Information Publication (AIP).',
  },
  {
    id: 'CMP-011',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'AIS Manuals, Procedures and Document Control',
    description: 'Maintenance of standard operating procedures, manuals, and document control systems.',
  },
  {
    id: 'CMP-012',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Flight Planning and Briefing Services',
    description: 'Processing international flight plans, pre-flight briefing bulletins, and route verifications.',
  },
  {
    id: 'CMP-013',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'GCAA Regulatory Compliance',
    description: 'Ensuring all operations conform with General Civil Aviation Authority safety mandates.',
  },
  {
    id: 'CMP-014',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'NOTAM Management and Validation',
    description: 'Review, drafting, and distribution of Notices to Airmen across international telecommunication networks.',
  },
  {
    id: 'CMP-015',
    functional: 'AIS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Static and Dynamic Aeronautical Data Systems',
    description: 'Operation and schema administration of European AIXM and national aeronautical databases.',
  },

  // 2. ANS Functionals
  {
    id: 'CMP-016',
    functional: 'ANS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Situational Awareness & Stress Resilience',
    description: 'Maintains acute spatial awareness and composure under peak airspace traffic loads.',
  },
  {
    id: 'CMP-017',
    functional: 'ANS',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Safety First Mindset',
    description: 'Zero-tolerance safety governance across tower, approach, and en-route operations.',
  },
  {
    id: 'CMP-018',
    functional: 'ANS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Air Traffic Control Separation Standards',
    description: 'Precision radar and procedural separation of aircraft across controlled airspace sectors.',
  },
  {
    id: 'CMP-019',
    functional: 'ANS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Airspace Management & Radar Vectoring',
    description: 'Real-time sequencing, sequencing optimization, and conflict resolution during adverse weather.',
  },
  {
    id: 'CMP-020',
    functional: 'ANS',
    entity: 'GANS',
    category: 'Functional',
    name: 'Emergency & Contingency Response Protocol',
    description: 'Instantaneous execution of emergency handovers and diversion plans.',
  },

  // 3. Finance Functionals
  {
    id: 'CMP-021',
    functional: 'Finance',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Integrity & Professional Ethics',
    description: 'Adheres to highest standards of financial governance, transparency, and accountability.',
  },
  {
    id: 'CMP-022',
    functional: 'Finance',
    entity: 'GANS',
    category: 'Functional',
    name: 'Financial Governance & Audit Compliance',
    description: 'Rigorous fiscal oversight, IFRS standards alignment, and external audit readiness.',
  },
  {
    id: 'CMP-023',
    functional: 'Finance',
    entity: 'YHA',
    category: 'Functional',
    name: 'Management Accounting & Capital Allocation',
    description: 'Budget forecasting, OPEX/CAPEX variance tracking, and aviation asset depreciation models.',
  },

  // 4. IT Functionals
  {
    id: 'CMP-024',
    functional: 'IT',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Problem Solving & Innovation',
    description: 'Proactively identifies technical root causes and automates repetitive workflows.',
  },
  {
    id: 'CMP-025',
    functional: 'IT',
    entity: 'GANS',
    category: 'Functional',
    name: 'Enterprise Cyber Security & Threat Mitigation',
    description: 'Zero-trust network architecture, penetration defense, and critical aviation data protection.',
  },
  {
    id: 'CMP-026',
    functional: 'IT',
    entity: 'GANS',
    category: 'Functional',
    name: 'Cloud Infrastructure & High-Availability Operations',
    description: '99.999% uptime maintenance for flight dispatch and mission-critical server clusters.',
  },

  // 5. HR Functionals
  {
    id: 'CMP-027',
    functional: 'HR',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Empathy & Strategic Influence',
    description: 'Cultivates employee trust while advocating for strategic talent development and leadership succession.',
  },
  {
    id: 'CMP-028',
    functional: 'HR',
    entity: 'GANS',
    category: 'Functional',
    name: 'Learning Needs Analysis & PDP Governance',
    description: 'End-to-end management of organizational competency frameworks, roadmaps, and sign-off compliance.',
  },

  // 6. Commercial Functionals
  {
    id: 'CMP-029',
    functional: 'Commercial',
    entity: 'GANS',
    category: 'Behavioral',
    name: 'Commercial Acumen & Negotiation',
    description: 'Identifies high-value partnership opportunities and negotiates win-win aviation contracts.',
  },
  {
    id: 'CMP-030',
    functional: 'Commercial',
    entity: 'GANS',
    category: 'Functional',
    name: 'Aviation Contract Lifecycle Management',
    description: 'Drafting, SLAs enforcement, and renewal negotiations for ground handling and airspace services.',
  },
];

const FUNCTIONAL_OPTIONS = [
  'AIS',
  'ANS',
  'Finance',
  'IT',
  'HR',
  'Commercial',
  'Procurement',
  'PMO',
  'Marketing & Communications',
  'Eshara',
];

export const CompetencyMasterView: React.FC = () => {
  const { addToast } = usePdp();
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(INITIAL_COMPETENCIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('All Entities');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedFunctional, setSelectedFunctional] = useState<string>('All Functionals');

  // Track expanded functional accordions (default AIS and ANS open)
  const [expandedFunctionals, setExpandedFunctionals] = useState<Record<string, boolean>>({
    AIS: true,
    ANS: true,
    Finance: true,
    IT: true,
    HR: true,
    Commercial: true,
  });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CompetencyItem | null>(null);
  const [viewingItem, setViewingItem] = useState<CompetencyItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form Fields
  const [formFunctional, setFormFunctional] = useState('AIS');
  const [formEntity, setFormEntity] = useState<'GANS' | 'YHA' | 'Eshara'>('GANS');
  const [formCategory, setFormCategory] = useState<CompetencyCategory>('Functional');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const toggleFunctional = (f: string) => {
    setExpandedFunctionals((prev) => ({
      ...prev,
      [f]: !prev[f],
    }));
  };

  const handleOpenAdd = (defaultFunctional?: string) => {
    setEditingItem(null);
    setFormFunctional(defaultFunctional || 'AIS');
    setFormEntity('GANS');
    setFormCategory('Functional');
    setFormName('');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CompetencyItem) => {
    setEditingItem(item);
    setFormFunctional(item.functional);
    setFormEntity(item.entity);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      addToast('error', 'Required Field', 'Please provide a competency name.');
      return;
    }
    if (!formDescription.trim()) {
      addToast('error', 'Required Field', 'Please provide a competency description.');
      return;
    }

    if (editingItem) {
      setCompetencies((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? {
                ...c,
                functional: formFunctional,
                entity: formEntity,
                category: formCategory,
                name: formName.trim(),
                description: formDescription.trim(),
              }
            : c
        )
      );
      addToast('success', 'Competency Updated', `Updated "${formName.trim()}" successfully.`);
    } else {
      const newItem: CompetencyItem = {
        id: `CMP-${String(competencies.length + 1).padStart(3, '0')}`,
        functional: formFunctional,
        entity: formEntity,
        category: formCategory,
        name: formName.trim(),
        description: formDescription.trim(),
      };
      setCompetencies((prev) => [...prev, newItem]);
      // Ensure the accordion for this functional is expanded
      setExpandedFunctionals((prev) => ({ ...prev, [formFunctional]: true }));
      addToast(
        'success',
        'Competency Added',
        `Added ${formCategory} competency under "${formFunctional}".`
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const item = competencies.find((c) => c.id === id);
    setCompetencies((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
    addToast('info', 'Competency Removed', `Deleted "${item?.name || 'Competency'}".`);
  };

  // Filter competencies
  const filteredCompetencies = useMemo(() => {
    return competencies.filter((c) => {
      if (selectedEntity !== 'All Entities' && c.entity !== selectedEntity) return false;
      if (selectedCategory !== 'All Categories' && c.category !== selectedCategory) return false;
      if (selectedFunctional !== 'All Functionals' && c.functional !== selectedFunctional) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !c.name.toLowerCase().includes(q) &&
          !c.functional.toLowerCase().includes(q) &&
          !c.category.toLowerCase().includes(q) &&
          !c.entity.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [competencies, selectedEntity, selectedCategory, selectedFunctional, searchQuery]);

  // Group competencies by functional area
  const groupedByFunctional = useMemo(() => {
    const groups: Record<string, CompetencyItem[]> = {};

    // Get list of unique functional areas present or from options
    filteredCompetencies.forEach((item) => {
      if (!groups[item.functional]) {
        groups[item.functional] = [];
      }
      groups[item.functional].push(item);
    });

    return groups;
  }, [filteredCompetencies]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEntity('All Entities');
    setSelectedCategory('All Categories');
    setSelectedFunctional('All Functionals');
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* 1. Header Banner */}
      <div className="bg-[#211E4E] rounded-2xl px-6 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Competency Master
          </h1>
        </div>

        <button
          type="button"
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E7490] hover:bg-[#086178] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span>Add Competency</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search competency..."
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

        {/* Functional Filter */}
        <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs">
          <span className="text-slate-500 mr-2 font-medium">Functional:</span>
          <select
            value={selectedFunctional}
            onChange={(e) => setSelectedFunctional(e.target.value)}
            className="bg-transparent text-slate-800 font-bold text-xs focus:outline-hidden cursor-pointer appearance-none pr-5"
          >
            <option value="All Functionals">All Functionals</option>
            {FUNCTIONAL_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs">
          <span className="text-slate-500 mr-2 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-slate-800 font-bold text-xs focus:outline-hidden cursor-pointer appearance-none pr-5"
          >
            <option value="All Categories">All Categories</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Functional">Functional</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
        </div>

        {/* Entity Filter */}
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

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          title="Reset Filters"
          className="p-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/90 text-slate-500 hover:text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Grouped Table matching image_d0ba219c.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6 w-16">S.NO</th>
                <th className="py-3 px-6 w-32">ENTITY</th>
                <th className="py-3 px-6 w-36">CATEGORY</th>
                <th className="py-3 px-6">COMPETENCY</th>
                <th className="py-3 px-6 text-right w-44">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {Object.keys(groupedByFunctional).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No competencies found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                (Object.entries(groupedByFunctional) as [string, CompetencyItem[]][]).map(([functionalName, items]) => {
                  const isExpanded = expandedFunctionals[functionalName] ?? true;

                  return (
                    <React.Fragment key={functionalName}>
                      {/* Functional Accordion Header matching image_d0ba219c.png */}
                      <tr className="bg-sky-50/60 hover:bg-sky-50/90 transition-colors border-y border-sky-100/90">
                        <td colSpan={5} className="py-3 px-6">
                          <div
                            onClick={() => toggleFunctional(functionalName)}
                            className="flex items-center gap-3 cursor-pointer select-none group"
                          >
                            <button
                              type="button"
                              className="text-slate-500 group-hover:text-slate-800 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-sky-800 stroke-[2.5]" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-sky-800 stroke-[2.5]" />
                              )}
                            </button>

                            {/* FUNCTIONAL Badge */}
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#211E4E] text-white shadow-2xs">
                              FUNCTIONAL
                            </span>

                            {/* Functional Name with icon */}
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[13px]">
                              <Network className="w-4 h-4 text-sky-600" />
                              <span>{functionalName}</span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Rows matching image_d0ba219c.png */}
                      {isExpanded &&
                        items.map((item, index) => {
                          const isBehavioral = item.category === 'Behavioral';

                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-slate-50/70 transition-colors border-b border-slate-100"
                            >
                              {/* S.NO */}
                              <td className="py-3.5 px-6 font-medium text-slate-600">
                                {index + 1}
                              </td>

                              {/* ENTITY */}
                              <td className="py-3.5 px-6 font-semibold text-slate-700">
                                {item.entity}
                              </td>

                              {/* CATEGORY (Behavioral or Functional pill) */}
                              <td className="py-3.5 px-6">
                                {isBehavioral ? (
                                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                    Behavioral
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                                    Functional
                                  </span>
                                )}
                              </td>

                              {/* COMPETENCY NAME */}
                              <td className="py-3.5 px-6 font-bold text-slate-800 text-[13px]">
                                {item.name}
                              </td>

                              {/* ACTION: View, Edit, Delete */}
                              <td className="py-3.5 px-6 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {/* View Eye Button */}
                                  <button
                                    type="button"
                                    onClick={() => setViewingItem(item)}
                                    title="View Competency Details"
                                    className="w-7 h-7 rounded-lg bg-[#211E4E] hover:bg-[#18153A] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit Pencil Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(item)}
                                    title="Edit Competency"
                                    className="w-7 h-7 rounded-lg bg-[#211E4E] hover:bg-[#18153A] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Trash Button */}
                                  <button
                                    type="button"
                                    onClick={() => setDeletingId(item.id)}
                                    title="Delete Competency"
                                    className="w-7 h-7 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add / Edit Competency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#211E4E] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {editingItem ? 'Edit Competency' : 'Add New Competency'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Entity (First) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Entity <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formEntity}
                    onChange={(e) => setFormEntity(e.target.value as 'GANS' | 'YHA' | 'Eshara')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                  >
                    <option value="GANS">GANS</option>
                    <option value="YHA">YHA</option>
                    <option value="Eshara">Eshara</option>
                  </select>
                </div>

                {/* 2. Functional (Second) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Functional <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formFunctional}
                    onChange={(e) => setFormFunctional(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                  >
                    {FUNCTIONAL_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Category Toggle (Matching Behavioral_and_Functional_Toggle_States_ddfd2656.png) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="w-full flex rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setFormCategory('Behavioral')}
                    className={`flex-1 py-3 text-center text-sm font-bold transition-all cursor-pointer ${
                      formCategory === 'Behavioral'
                        ? 'bg-[#211E4E] text-white'
                        : 'bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    Behavioral
                  </button>
                  <div className="w-[1px] bg-slate-300" />
                  <button
                    type="button"
                    onClick={() => setFormCategory('Functional')}
                    className={`flex-1 py-3 text-center text-sm font-bold transition-all cursor-pointer ${
                      formCategory === 'Functional'
                        ? 'bg-[#211E4E] text-white'
                        : 'bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    Functional
                  </button>
                </div>
              </div>

              {/* 4. Competency Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Competency Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aeronautical Data Quality, Risk Management..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                  required
                />
              </div>

              {/* 5. Description (Mandatory with star mark) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Define the behavioral expectations or technical capabilities required..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:border-[#211E4E] focus:ring-1 focus:ring-[#211E4E]"
                />
              </div>

              {/* Actions */}
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

      {/* 5. View Details Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    viewingItem.category === 'Behavioral'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}
                >
                  {viewingItem.category}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {viewingItem.functional} • {viewingItem.entity}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {viewingItem.name}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {viewingItem.description || 'No detailed indicator description provided.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-[#211E4E] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delete Competency?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  This competency will be removed from the master registry.
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
