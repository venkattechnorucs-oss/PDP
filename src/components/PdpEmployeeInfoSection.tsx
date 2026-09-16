import React from 'react';
import { usePdp } from '../context/PdpContext';
import { User } from 'lucide-react';

export const PdpEmployeeInfoSection: React.FC = () => {
  const { employee } = usePdp();

  return (
    <section className="border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Table Section Header */}
      <div className="bg-[#153f5e] text-white py-2.5 px-4 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-sky-300" />
          <span>Employee Information</span>
        </div>
        <span className="text-[10px] text-sky-200 font-mono tracking-normal lowercase">
          {employee.staffId}
        </span>
      </div>

      {/* 2-Column Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <tbody>
            {/* Row 1: Name | Division */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="w-1/6 bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Name
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

            {/* Row 2: Emp ID | Department */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Emp ID
              </td>
              <td className="py-2.5 px-3.5 font-mono font-bold text-slate-800 border-r border-slate-200/70">
                {employee.staffId}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Department
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                {employee.department}
              </td>
            </tr>

            {/* Row 3: Grade | Manager */}
            <tr className="border-b border-slate-200/70 hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Grade
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-200/70">
                {employee.grade.replace(/[^0-9]/g, '') || employee.grade}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Manager
              </td>
              <td className="py-2.5 px-3.5 font-bold text-[#153f5e]">
                {employee.lineManager}
              </td>
            </tr>

            {/* Row 4: Position | Date of Joining */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Position
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-900 border-r border-slate-200/70">
                {employee.position}
              </td>
              <td className="bg-[#f4f8fb] font-bold py-2.5 px-3.5 border-r border-slate-200/70 text-[#153f5e]">
                Date of Joining
              </td>
              <td className="py-2.5 px-3.5 font-semibold text-slate-800">
                {employee.dateOfJoining}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
