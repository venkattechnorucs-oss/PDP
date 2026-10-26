import React from 'react';
import { GraduationCap, LayoutGrid, CheckSquare, Users } from 'lucide-react';

export type NavTabType =
  | 'dashboard'
  | 'my_pdp'
  | 'my_approvals'
  | 'pdp-assessment'
  | 'hr_initiation'
  | 'pdp';

interface PdpSideNavProps {
  currentRole?: 'employee' | 'manager' | 'hr';
  activeTab?: NavTabType;
  onSelectTab?: (tab: NavTabType) => void;
  pendingApprovalsCount?: number;
}

export const PdpSideNav: React.FC<PdpSideNavProps> = ({
  currentRole = 'employee',
  activeTab = 'dashboard',
  onSelectTab,
  pendingApprovalsCount = 4,
}) => {
  const isMyPdpActive =
    activeTab === 'dashboard' || activeTab === 'my_pdp';
  const isMyApprovalsActive = activeTab === 'my_approvals';
  const isHrInitiationActive = activeTab === 'hr_initiation' || activeTab === 'pdp';

  return (
    <aside className="w-48 lg:w-52 shrink-0 bg-white border-r border-slate-200 py-4 px-3 min-h-[calc(100vh-50px)] select-none hidden md:block">
      <div className="space-y-1.5">
        {/* Top Category: PDP with GraduationCap */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold text-slate-700 tracking-wide">
          <GraduationCap className="w-4 h-4 text-[#C8A977]" />
          <span>PDP</span>
        </div>

        {/* Item 1: My PDP (Available for Employee & Manager) */}
        {(currentRole === 'employee' || currentRole === 'manager') && (
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('my_pdp')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
              isMyPdpActive
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'text-[#211E4E] hover:text-[#C8A977] hover:bg-[#211E4E]/5'
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 ${isMyPdpActive ? 'text-white' : 'text-[#211E4E]'} shrink-0`}
              strokeWidth={2}
            />
            <span>My PDP</span>
          </button>
        )}

        {/* Item 2: My Approvals (Shown in Manager Review matching Image 1 & 3) */}
        {currentRole === 'manager' && (
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('my_approvals')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
              isMyApprovalsActive
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'text-[#211E4E] hover:text-[#C8A977] hover:bg-[#211E4E]/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare
                className={`w-4 h-4 ${isMyApprovalsActive ? 'text-white' : 'text-[#211E4E]'} shrink-0`}
                strokeWidth={2}
              />
              <span>My Approvals</span>
            </div>
            {pendingApprovalsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E5484D] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
        )}

        {/* Item 3: HR Initiation / Employee PDP List (Shown in HR Admin role) */}
        {currentRole === 'hr' && (
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('hr_initiation')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
              isHrInitiationActive
                ? 'bg-[#211E4E] text-white shadow-xs'
                : 'text-[#211E4E] hover:text-[#C8A977] hover:bg-[#211E4E]/5'
            }`}
          >
            <Users
              className={`w-4 h-4 ${isHrInitiationActive ? 'text-white' : 'text-[#211E4E]'} shrink-0`}
              strokeWidth={2}
            />
            <span>PDP Initiation</span>
          </button>
        )}
      </div>
    </aside>
  );
};
