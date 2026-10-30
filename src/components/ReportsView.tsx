import React, { useState } from 'react';
import {
  FileText,
  Download,
  Building2,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
} from 'lucide-react';
import { usePdp } from '../context/PdpContext';
import { TEAM_SUBMISSIONS } from '../data/teamSubmissionsData';

export const ReportsView: React.FC = () => {
  const { addToast } = usePdp();
  const [selectedEntity, setSelectedEntity] = useState('All Entities');
  const [selectedYear, setSelectedYear] = useState('2026 (Active)');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdpMasterReport = () => {
    setIsExporting(true);

    try {
      // Build CSV Data from master submissions
      const headers = [
        'Employee ID',
        'Full Name',
        'Position',
        'Department',
        'Division',
        'Grade',
        'Line Manager',
        'PDP Stage',
        'Status',
        'Date of Joining',
        'Program Duration',
        'Service Length',
        'Report Year',
        'Entity',
      ];

      const rows = TEAM_SUBMISSIONS.map((emp) => [
        `"${emp.id}"`,
        `"${emp.name}"`,
        `"${emp.position}"`,
        `"${emp.department}"`,
        `"${emp.division}"`,
        `"${emp.grade}"`,
        `"${emp.lineManager}"`,
        `"${emp.pdpStage}"`,
        `"${emp.status}"`,
        `"${emp.dateOfJoining || '15 Jan 2024'}"`,
        `"${emp.programDuration || '12 Months'}"`,
        `"${emp.serviceLength || '3 Years'}"`,
        `"${selectedYear}"`,
        `"${selectedEntity === 'All Entities' ? 'GANS Aviation' : selectedEntity}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      const fileName = `PDP_Master_Report_${selectedYear.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.csv`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsExporting(false);
        addToast(
          'success',
          'Report Exported',
          `PDP Master Report successfully generated and downloaded for ${selectedYear}.`
        );
      }, 500);
    } catch {
      setIsExporting(false);
      addToast('error', 'Export Failed', 'An error occurred while generating the master report.');
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto space-y-6">
      {/* 1. Top Banner matching image_214c7849.png */}
      <div className="bg-[#211E4E] rounded-2xl px-6 py-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Document Icon + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Reports</h1>
        </div>

        {/* Right: Entity Dropdown + Report Year Dropdown matching image_214c7849.png */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Entity Selector */}
          <div className="relative flex items-center bg-[#18153A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white">
            <Building2 className="w-4 h-4 text-slate-300 mr-2 shrink-0" />
            <span className="text-slate-300 mr-2">Entity:</span>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer appearance-none pr-5"
            >
              <option value="All Entities" className="bg-[#211E4E] text-white">
                All Entities
              </option>
              <option value="GANS" className="bg-[#211E4E] text-white">
                GANS
              </option>
              <option value="Eshara" className="bg-[#211E4E] text-white">
                Eshara
              </option>
              <option value="YHA Aviation" className="bg-[#211E4E] text-white">
                YHA Aviation
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>

          {/* Report Year Selector */}
          <div className="relative flex items-center bg-[#18153A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white">
            <Calendar className="w-4 h-4 text-slate-300 mr-2 shrink-0" />
            <span className="text-slate-300 mr-2">Report Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer appearance-none pr-5"
            >
              <option value="2026 (Active)" className="bg-[#211E4E] text-white">
                2026 (Active)
              </option>
              <option value="2025" className="bg-[#211E4E] text-white">
                2025
              </option>
              <option value="2024" className="bg-[#211E4E] text-white">
                2024
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. Main Report Card matching image_214c7849.png */}
      <div className="max-w-md">
        {/* Card: PDP Master Report */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5 hover:shadow-md transition-shadow">
          {/* Report Icon & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-[#211E4E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                PDP Master Report
              </h3>
            </div>
          </div>

          {/* Export Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportPdpMasterReport}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#211E4E] hover:bg-[#18153A] disabled:opacity-75 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Generating Report...' : 'Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
