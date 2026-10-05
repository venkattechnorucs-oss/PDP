import React from 'react';
import { usePdp } from '../context/PdpContext';
import { User } from 'lucide-react';

export const PdpEmployeeInfoSection: React.FC = () => {
  const { employee, status } = usePdp();

  // From Manager roadmap onwards, show the additional row with Program Duration and Status
  const showRoadmapRow = [
    'PDP_PLANNING_MANAGER',
    'PENDING_LNA_TEAM',
    'PENDING_EMPLOYEE_ACKNOWLEDGEMENT',
    'ACTIVE',
    'COMPLETED',
  ].includes(status);

  const getStatusDisplay = (s: string) => {
    switch (s) {
      case 'PDP_PLANNING_MANAGER':
        return { label: 'Roadmap Planning', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'PENDING_LNA_TEAM':
        return { label: 'LNA Formulation', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT':
        return { label: 'Pending Sign-Off', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'ACTIVE':
        return { label: 'Active PDP', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'COMPLETED':
        return { label: 'Completed', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: s.replace(/_/g, ' '), color: 'bg-sky-50 text-sky-800 border-sky-200' };
    }
  };

  return (
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Table Section Header */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
        <User className="w-3.5 h-3.5 text-sky-300" />
        <span>Employee Details</span>
      </div>

      {/* 2-Column Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <tbody>
            {/* Row 1: Employee Name | Division */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="w-1/6 bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Employee Name
              </td>
              <td className="w-2/6 py-2.5 px-3.5 font-bold text-slate-900 border-r border-slate-200/70">
                {employee.name}
              </td>
              <td className="w-1/6 bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Division
              </td>
              <td className="w-2/6 py-2.5 px-3.5 font-semibold text-slate-800">
                {employee.division}
              </td>
            </tr>

            {/* Row 2: Employee ID | Department/Project */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Employee ID
              </td>
              <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800 border-r border-slate-200/70">
                {employee.staffId}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Department/Project
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                {employee.department}
              </td>
            </tr>

            {/* Row 3: Position / Designation | Function */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Position / Designation
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-200/70">
                {employee.position}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Function
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                {employee.functionDept || 'Operations'}
              </td>
            </tr>

            {/* Row 4: Grade | Manager */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Grade
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-200/70">
                {employee.grade}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Manager
              </td>
              <td className="py-2.5 px-3.5 font-bold text-[#153f5e]">
                {employee.lineManager}
              </td>
            </tr>

            {/* Row 5: Date of Joining | Year */}
            <tr className={`${showRoadmapRow ? 'border-b border-slate-200/70' : ''} hover:bg-slate-50/50 transition-colors`}>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Date of Joining
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-800 border-r border-slate-200/70">
                {employee.dateOfJoining}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Year
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-900 font-mono">
                {employee.year || '2026'}
              </td>
            </tr>

            {/* Row 6: Program Duration | Status (From Manager Roadmap onwards) */}
            {showRoadmapRow && (
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                  Program Duration
                </td>
                <td className="py-2.5 px-3.5 font-semibold text-slate-800 border-r border-slate-200/70">
                  {employee.programDuration || '12 Months (2026)'}
                </td>
                <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                  Status
                </td>
                <td className="py-2.5 px-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      getStatusDisplay(status).color
                    }`}
                  >
                    {getStatusDisplay(status).label}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
