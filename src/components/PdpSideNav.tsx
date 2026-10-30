import React from 'react';
import {
  GraduationCap,
  LayoutGrid,
  CheckSquare,
  Users,
  History,
  Layers,
  UserCheck,
  FileText,
  Shield,
  Clock,
  Network,
  ChevronDown,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

export type NavTabType =
  | 'dashboard'
  | 'my_pdp'
  | 'sign_off'
  | 'active_pdp'
  | 'my_approvals'
  | 'pending_actions'
  | 'review_and_assign'
  | 'pdp-assessment'
  | 'hr_dashboard'
  | 'hr_initiation'
  | 'employee_master'
  | 'functional_master'
  | 'competency_master'
  | 'release_history'
  | 'delegation'
  | 'reports'
  | 'lna_plan'
  | 'pdp';

interface PdpSideNavProps {
  currentRole?: 'employee' | 'manager' | 'hr' | 'lna';
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
  const isMyPdpActive = activeTab === 'dashboard' || activeTab === 'my_pdp';
  const isSignOffActive = activeTab === 'sign_off';
  const isActivePdpActive = activeTab === 'active_pdp';
  const isPdpGroupActive = isMyPdpActive || isSignOffActive || isActivePdpActive;

  const [isPdpExpanded, setIsPdpExpanded] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (isPdpGroupActive) {
      setIsPdpExpanded(true);
    }
  }, [isPdpGroupActive]);

  const isPendingActionsActive = activeTab === 'pending_actions' || activeTab === 'my_approvals';
  const isReviewAndAssignActive = activeTab === 'review_and_assign';
  const isMyApprovalsActive = isPendingActionsActive || isReviewAndAssignActive;

  const [isApprovalsExpanded, setIsApprovalsExpanded] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (isMyApprovalsActive) {
      setIsApprovalsExpanded(true);
    }
  }, [isMyApprovalsActive]);

  const isHrDashboardActive = activeTab === 'hr_dashboard';
  const isHrInitiationActive = activeTab === 'hr_initiation' || activeTab === 'pdp';
  const isFunctionalMasterActive = activeTab === 'functional_master';
  const isCompetencyMasterActive = activeTab === 'competency_master';
  const isEmployeeMasterActive = activeTab === 'employee_master';
  const isReleaseHistoryActive = activeTab === 'release_history';
  const isDelegationActive = activeTab === 'delegation';
  const isReportsActive = activeTab === 'reports';
  const isLnaPlanActive = activeTab === 'lna_plan';

  return (
    <aside className="w-52 lg:w-56 shrink-0 bg-white border-r border-slate-200 py-3.5 px-3 min-h-[calc(100vh-50px)] select-none hidden md:block overflow-y-auto">
      <div className="space-y-3">
        {/* ================= 1. EMPLOYEE & MANAGER SECTION: PDP ================= */}
        {(currentRole === 'employee' || currentRole === 'manager') && (
          <div className="space-y-1">
            {/* Parent Header Button: PDP with Chevron */}
            <button
              type="button"
              onClick={() => {
                setIsPdpExpanded((prev) => !prev);
                if (!isPdpGroupActive && onSelectTab) {
                  onSelectTab('my_pdp');
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isPdpGroupActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-[#211E4E] hover:text-[#C8A977] hover:bg-[#211E4E]/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap
                  className={`w-4 h-4 ${isPdpGroupActive ? 'text-[#C8A977]' : 'text-[#C8A977]'} shrink-0`}
                  strokeWidth={2}
                />
                <span>PDP</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isPdpExpanded ? 'rotate-180' : ''
                } ${isPdpGroupActive ? 'text-white/80' : 'text-slate-400'}`}
              />
            </button>

            {/* Sub-divisions under PDP: My PDP and Sign Off */}
            {isPdpExpanded && (
              <div className="pl-3.5 ml-2 border-l-2 border-slate-200 space-y-1 pt-0.5 animate-in fade-in duration-150">
                {/* Sub-division 1: My PDP */}
                <button
                  type="button"
                  onClick={() => onSelectTab && onSelectTab('my_pdp')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left font-bold ${
                    isMyPdpActive
                      ? 'bg-[#211E4E]/10 text-[#211E4E] font-extrabold border-l-2 border-[#211E4E]'
                      : 'text-slate-600 hover:text-[#211E4E] hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid
                    className={`w-3.5 h-3.5 ${
                      isMyPdpActive ? 'text-[#211E4E]' : 'text-slate-400'
                    } shrink-0`}
                  />
                  <span>My PDP</span>
                </button>

                {/* Sub-division 2: Sign Off */}
                <button
                  type="button"
                  onClick={() => onSelectTab && onSelectTab('sign_off')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left font-bold ${
                    isSignOffActive
                      ? 'bg-[#211E4E]/10 text-[#211E4E] font-extrabold border-l-2 border-[#211E4E]'
                      : 'text-slate-600 hover:text-[#211E4E] hover:bg-slate-100'
                  }`}
                >
                  <UserCheck
                    className={`w-3.5 h-3.5 ${
                      isSignOffActive ? 'text-[#211E4E]' : 'text-slate-400'
                    } shrink-0`}
                  />
                  <span>Sign Off</span>
                </button>

                {/* Sub-division 3: Active PDP */}
                <button
                  type="button"
                  onClick={() => onSelectTab && onSelectTab('active_pdp')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left font-bold ${
                    isActivePdpActive
                      ? 'bg-[#211E4E]/10 text-[#211E4E] font-extrabold border-l-2 border-[#211E4E]'
                      : 'text-slate-600 hover:text-[#211E4E] hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isActivePdpActive ? 'text-[#211E4E]' : 'text-slate-400'
                    } shrink-0`}
                  />
                  <span>Active PDP</span>
                </button>
              </div>
            )}

            {/* My Approvals (for Manager) with Sub Menu */}
            {currentRole === 'manager' && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsApprovalsExpanded((prev) => !prev);
                    if (!isMyApprovalsActive && onSelectTab) {
                      onSelectTab('pending_actions');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
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
                  <div className="flex items-center gap-1.5">
                    {pendingApprovalsCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#E5484D] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {pendingApprovalsCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isApprovalsExpanded ? 'rotate-180' : ''
                      } ${isMyApprovalsActive ? 'text-white/80' : 'text-slate-400'}`}
                    />
                  </div>
                </button>

                {/* Sub-divisions under My Approvals */}
                {isApprovalsExpanded && (
                  <div className="pl-3.5 ml-2 border-l-2 border-slate-200 space-y-1 pt-0.5 animate-in fade-in duration-150">
                    {/* Sub-division 1: Pending Actions */}
                    <button
                      type="button"
                      onClick={() => onSelectTab && onSelectTab('pending_actions')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left font-bold ${
                        isPendingActionsActive
                          ? 'bg-[#211E4E]/10 text-[#211E4E] font-extrabold border-l-2 border-[#211E4E]'
                          : 'text-slate-600 hover:text-[#211E4E] hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Clock
                          className={`w-3.5 h-3.5 ${
                            isPendingActionsActive ? 'text-[#211E4E]' : 'text-slate-400'
                          } shrink-0`}
                        />
                        <span className="truncate">Pending Actions</span>
                      </div>
                      {pendingApprovalsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#E5484D]/10 text-[#E5484D]">
                          {pendingApprovalsCount}
                        </span>
                      )}
                    </button>

                    {/* Sub-division 2: Review & Assign */}
                    <button
                      type="button"
                      onClick={() => onSelectTab && onSelectTab('review_and_assign')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer text-left font-bold ${
                        isReviewAndAssignActive
                          ? 'bg-[#211E4E]/10 text-[#211E4E] font-extrabold border-l-2 border-[#211E4E]'
                          : 'text-slate-600 hover:text-[#211E4E] hover:bg-slate-100'
                      }`}
                    >
                      <FileCheck
                        className={`w-3.5 h-3.5 ${
                          isReviewAndAssignActive ? 'text-[#211E4E]' : 'text-slate-400'
                        } shrink-0`}
                      />
                      <span className="truncate">Review & Assign</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= 2. HR ROLE VIEW (Matching image_5b0917dc.png & image_1260a655.png) ================= */}
        {currentRole === 'hr' && (
          <div className="space-y-1">
            {/* HR DASHBOARD Category */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#C8A977]" />
              <span>HR DASHBOARD</span>
            </div>

            {/* Item 1: PDP Dashboard */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('hr_dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isHrDashboardActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <LayoutGrid
                className={`w-4 h-4 ${isHrDashboardActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>PDP Dashboard</span>
            </button>

            {/* Item 2: Employee Master */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('employee_master')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isEmployeeMasterActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <Users
                className={`w-4 h-4 ${isEmployeeMasterActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Employee Master</span>
            </button>

            {/* Item 3: Release History */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('release_history')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isReleaseHistoryActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <History
                className={`w-4 h-4 ${isReleaseHistoryActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Release History</span>
            </button>

            {/* Item 4: Functional Master */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('functional_master')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isFunctionalMasterActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <Network
                className={`w-4 h-4 ${isFunctionalMasterActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Functional Master</span>
            </button>

            {/* Item 5: Competency Master */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('competency_master')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isCompetencyMasterActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <Layers
                className={`w-4 h-4 ${isCompetencyMasterActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Competency Master</span>
            </button>

            {/* Item 6: Delegation */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('delegation')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isDelegationActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <UserCheck
                className={`w-4 h-4 ${isDelegationActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Delegation</span>
            </button>

            {/* Item 7: Reports */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('reports')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isReportsActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
              }`}
            >
              <FileText
                className={`w-4 h-4 ${isReportsActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                strokeWidth={2}
              />
              <span>Reports</span>
            </button>

            {/* Category: PDP & LNA Initiation */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5 text-[#C8A977]" />
                <span>PDP / LNA</span>
              </div>

              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('hr_initiation')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                  isHrInitiationActive
                    ? 'bg-[#211E4E] text-white shadow-xs'
                    : 'text-slate-700 hover:text-[#211E4E] hover:bg-slate-100'
                }`}
              >
                <Users
                  className={`w-4 h-4 ${isHrInitiationActive ? 'text-white' : 'text-slate-600'} shrink-0`}
                  strokeWidth={2}
                />
                <span>PDP Initiation</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. LNA ROLE VIEW ================= */}
        {currentRole === 'lna' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-slate-700 tracking-wide">
              <GraduationCap className="w-4 h-4 text-[#C8A977]" />
              <span>LNA</span>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('lna_plan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left font-bold ${
                isLnaPlanActive
                  ? 'bg-[#211E4E] text-white shadow-xs'
                  : 'text-[#211E4E] hover:text-[#C8A977] hover:bg-[#211E4E]/5'
              }`}
            >
              <GraduationCap
                className={`w-4 h-4 ${isLnaPlanActive ? 'text-white' : 'text-[#211E4E]'} shrink-0`}
                strokeWidth={2}
              />
              <span>LNA Training Plan</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
