import React, { useState, useMemo } from 'react';
import { TEAM_MEMBERS_OVERVIEW, INITIAL_EMPLOYEE } from '../../../data/mockData';
import {
  Users,
  Search,
  Download,
  Filter,
  Building2,
  Briefcase,
  Calendar,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  Shield,
  X,
  ExternalLink,
} from 'lucide-react';

interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  grade: string;
  department: string;
  manager: string;
  pdpCycle: string;
  status: string;
  completionRate: number;
  email?: string;
  dateOfJoining?: string;
  serviceLength?: string;
  functionDept?: string;
}

export const HrEmployeeMasterTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [showExportToast, setShowExportToast] = useState(false);

  // Augment mock team members with master record details
  const employees: EmployeeRecord[] = useMemo(() => {
    return TEAM_MEMBERS_OVERVIEW.map((item, index) => {
      const isMain = item.id === INITIAL_EMPLOYEE.staffId;
      return {
        ...item,
        email: isMain
          ? INITIAL_EMPLOYEE.email
          : `${item.name.toLowerCase().replace(/[^a-z]/g, '.')}@enterprise.com`,
        dateOfJoining: isMain
          ? INITIAL_EMPLOYEE.dateOfJoining
          : `1${index + 1}/Mar/202${(index % 4) + 0}`,
        serviceLength: isMain
          ? INITIAL_EMPLOYEE.serviceLength
          : `${(index % 6) + 2} Years`,
        functionDept: isMain ? INITIAL_EMPLOYEE.functionDept : item.department,
      };
    });
  }, []);

  const departments = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.department)));
  }, [employees]);

  const grades = useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.grade))).sort();
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (departmentFilter !== 'ALL' && emp.department !== departmentFilter) {
        return false;
      }
      if (gradeFilter !== 'ALL' && emp.grade !== gradeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(q);
        const matchId = emp.id.toLowerCase().includes(q);
        const matchRole = emp.role.toLowerCase().includes(q);
        const matchDept = emp.department.toLowerCase().includes(q);
        const matchMgr = emp.manager.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchRole && !matchDept && !matchMgr) {
          return false;
        }
      }
      return true;
    });
  }, [employees, departmentFilter, gradeFilter, searchQuery]);

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#153f5e] text-white p-4 rounded-xl shadow-xs border border-[#0f2e46] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
            <Users className="w-5 h-5 text-sky-200" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide uppercase">
              Employee Master Directory
            </h2>
            <p className="text-[11px] text-sky-200/80">
              Enterprise workforce master data, reporting lines & PDP eligibility
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/15 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster</span>
          </button>
          <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
            {employees.length} Employees
          </span>
        </div>
      </div>

      {showExportToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Employee Master roster exported successfully (CSV/Excel).
          </span>
          <button
            type="button"
            onClick={() => setShowExportToast(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Stat Widgets - Exactly 3 as requested: Total Employees, Departments, Divisions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#153f5e]" />
            <span>Total Employees</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {employees.length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Departments</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {departments.length}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>Divisions</span>
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            3
          </div>
        </div>
      </div>

      {/* Master Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Staff ID, role, department..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters:</span>
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="py-1.5 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-[#153f5e] cursor-pointer"
            >
              <option value="ALL">All Grades</option>
              {grades.map((gr) => (
                <option key={gr} value={gr}>
                  Grade {gr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Reporting Manager</th>
                <th className="py-3 px-4">Date Joined</th>
                <th className="py-3 px-4 text-center">Cycle</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp, idx) => (
                <tr
                  key={emp.id}
                  className={`hover:bg-sky-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#153f5e]">
                    {emp.id}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#153f5e]/10 text-[#153f5e] font-bold text-xs flex items-center justify-center shrink-0 border border-[#153f5e]/20">
                        {emp.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-500">{emp.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-800">
                    {emp.role}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {emp.department}
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px]">
                      {emp.grade.includes('Grade') ? emp.grade : `Grade ${emp.grade}`}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {emp.manager}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <div>{emp.dateOfJoining}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{emp.serviceLength}</div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      2026 Enrolled
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedEmployee(emp)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#153f5e] hover:bg-sky-50 border border-slate-300 rounded-lg transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No employee records match the selected search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#153f5e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 text-white font-bold text-sm flex items-center justify-center border border-white/20">
                  {selectedEmployee.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedEmployee.name}</h3>
                  <p className="text-xs text-sky-200">{selectedEmployee.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Staff ID / ERP</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedEmployee.id}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Job Grade</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedEmployee.grade.includes('Grade') ? selectedEmployee.grade : `Grade ${selectedEmployee.grade}`}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Department</span>
                  <span className="font-bold text-slate-900">{selectedEmployee.department}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Reporting Manager</span>
                  <span className="font-bold text-slate-900">{selectedEmployee.manager}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Date of Joining</span>
                  <span className="font-bold text-slate-900">{selectedEmployee.dateOfJoining}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Service Length</span>
                  <span className="font-bold text-slate-900">{selectedEmployee.serviceLength}</span>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 text-sky-900 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>Current PDP Workflow State:</span>
                  <span className="font-mono text-xs">{selectedEmployee.status.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-[11px] text-sky-800">
                  PDP Cycle: {selectedEmployee.pdpCycle} • Competencies Target: 5 Assigned
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEmployee(null)}
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
