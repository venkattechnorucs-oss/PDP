import React from 'react';
import { usePdp } from '../context/PdpContext';
import { User } from 'lucide-react';

export const PdpEmployeeInfoSection: React.FC = () => {
  const { employee } = usePdp();

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
            <tr className="hover:bg-slate-50/50 transition-colors">
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
          </tbody>
        </table>
      </div>
    </section>
  );
};
