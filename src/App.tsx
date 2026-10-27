import React, { useState } from 'react';
import { PdpProvider, usePdp } from './context/PdpContext';
import { GansTopBar } from './components/GansTopBar';
import { EmployeeDashboardView } from './components/EmployeeDashboardView';
import { PdpEmployeeInfoSection } from './components/PdpEmployeeInfoSection';
import { PdpCompetencyEvaluationTable } from './components/PdpCompetencyEvaluationTable';
import { PdpDevelopmentRoadmapSection } from './components/PdpDevelopmentRoadmapSection';
import { PdpEmployeeAcknowledgmentModal } from './components/PdpEmployeeAcknowledgmentModal';
import { PdpSideNav, NavTabType } from './components/PdpSideNav';
import { ManagerApprovalsView } from './components/ManagerApprovalsView';
import { HrInitiationView } from './components/HrInitiationView';
import { ToastContainer } from './components/ToastContainer';
import { ArrowLeft } from 'lucide-react';
import { PdpStatus } from './types/pdp';
import { TEAM_SUBMISSIONS, MANAGER_SELF_PROFILE, TeamMemberSubmission } from './data/teamSubmissionsData';

const MainAppContent: React.FC = () => {
  const { status, loadStagePreset, selectEmployeeForReview } = usePdp();

  // Derive role directly from the active workflow stage
  const currentRole: 'employee' | 'manager' | 'hr' | 'lna' =
    status === 'PENDING_HR_INITIATION' || status === 'HR_VIEW'
      ? 'hr'
      : status === 'PENDING_LNA_TEAM'
      ? 'lna'
      : status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER'
      ? 'manager'
      : 'employee';

  const [activeTab, setActiveTab] = useState<NavTabType>(() => {
    if (status === 'PENDING_HR_INITIATION' || status === 'HR_VIEW') return 'hr_initiation';
    if (status === 'PENDING_LNA_TEAM') return 'lna_plan';
    if (status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER') return 'my_approvals';
    return 'my_pdp';
  });

  const [isReviewingEmployee, setIsReviewingEmployee] = useState<boolean>(false);
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);

  // Synchronize view and reset review sub-view when workflow stage preset is changed via the Dropdown stages
  const prevStatusRef = React.useRef(status);
  React.useEffect(() => {
    if (prevStatusRef.current !== status) {
      prevStatusRef.current = status;
      setIsReviewingEmployee(false);

      if (status === 'PENDING_HR_INITIATION' || status === 'HR_VIEW') {
        setActiveTab('hr_initiation');
      } else if (status === 'PENDING_LNA_TEAM') {
        setActiveTab('lna_plan');
        setIsReviewingEmployee(false);
      } else if (status === 'PENDING_MANAGER_REVIEW') {
        setActiveTab('my_approvals');
      } else if (status === 'PDP_PLANNING_MANAGER') {
        setActiveTab('my_approvals');
        setIsReviewingEmployee(false);
      } else {
        setActiveTab('my_pdp');
      }
    }
  }, [status]);

  const handleSelectSideNavTab = (tab: NavTabType) => {
    setIsReviewingEmployee(false);
    if (tab === 'my_pdp' || tab === 'dashboard') {
      setActiveTab('my_pdp');
      if (currentRole === 'manager') {
        selectEmployeeForReview(
          {
            ...TEAM_SUBMISSIONS[0],
            id: MANAGER_SELF_PROFILE.id,
            name: MANAGER_SELF_PROFILE.name,
            position: MANAGER_SELF_PROFILE.position,
            department: MANAGER_SELF_PROFILE.department,
            division: MANAGER_SELF_PROFILE.division,
            functionDept: MANAGER_SELF_PROFILE.functionDept,
            grade: '10',
            date: '15 Jan 2026',
            status: 'PENDING APPROVAL',
            pdpStage: 'PENDING_EMPLOYEE_EVALUATION',
            avatarInitials: MANAGER_SELF_PROFILE.avatarInitials,
            lineManager: MANAGER_SELF_PROFILE.lineManager,
            lineManagerTitle: MANAGER_SELF_PROFILE.lineManagerTitle,
            dateOfJoining: MANAGER_SELF_PROFILE.dateOfJoining,
            serviceLength: MANAGER_SELF_PROFILE.serviceLength,
            programDuration: MANAGER_SELF_PROFILE.programDuration,
            year: MANAGER_SELF_PROFILE.year,
            email: MANAGER_SELF_PROFILE.email,
          },
          'PENDING_EMPLOYEE_EVALUATION'
        );
      } else {
        loadStagePreset('PENDING_EMPLOYEE_EVALUATION');
      }
    } else if (tab === 'my_approvals') {
      setActiveTab('my_approvals');
    } else if (tab === 'hr_initiation' || tab === 'pdp') {
      setActiveTab('hr_initiation');
    } else if (tab === 'lna_plan') {
      setActiveTab('lna_plan');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewFromManagerApprovals = (sub: TeamMemberSubmission) => {
    // If currently in Manager Roadmap stage, open the employee's PDP Development Roadmap page
    const targetStatus: PdpStatus =
      status === 'PDP_PLANNING_MANAGER' ? 'PDP_PLANNING_MANAGER' : 'PENDING_MANAGER_REVIEW';
    selectEmployeeForReview(sub, targetStatus);
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewFromHrInitiation = (sub: TeamMemberSubmission) => {
    selectEmployeeForReview(sub, 'PENDING_HR_INITIATION');
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewFromLna = (sub: TeamMemberSubmission) => {
    selectEmployeeForReview(sub, 'PENDING_LNA_TEAM');
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex flex-col font-sans">
      {/* Top SharePoint & Talent Management Header Bar */}
      <GansTopBar />

      {/* Main Layout Area with Side Navigation */}
      <div className="flex-1 flex w-full">
        {/* Side Navigation Bar with My PDP & My Approvals (for Manager) / PDP Initiation (for HR) */}
        <PdpSideNav
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={handleSelectSideNavTab}
          pendingApprovalsCount={4}
        />

        {/* Main Document Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full min-w-0">
          {/* 1. EMPLOYEE ROLE VIEW */}
          {currentRole === 'employee' && (
            <>
              {!isReviewingEmployee ? (
                /* Employee Dashboard - Cycles Table (Welcome, Ravi Kumar) */
                <EmployeeDashboardView
                  onNavigateToPdp={() => {
                    setIsReviewingEmployee(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                /* Employee PDP Evaluation Form */
                <div className="space-y-6 w-full max-w-[1720px] mx-auto">
                  <div className="flex items-center justify-between pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReviewingEmployee(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Employee Dashboard</span>
                    </button>
                  </div>

                  <PdpEmployeeInfoSection />
                  <PdpCompetencyEvaluationTable />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              )}
            </>
          )}

          {/* 2. MANAGER ROLE VIEW */}
          {currentRole === 'manager' && (
            <>
              {/* Tab A: My PDP (Manager is also an employee having their own PDP) */}
              {activeTab === 'my_pdp' && (
                <>
                  {!isReviewingEmployee ? (
                    <EmployeeDashboardView
                      onNavigateToPdp={() => {
                        setIsReviewingEmployee(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ) : (
                    <div className="space-y-6 w-full max-w-[1720px] mx-auto">
                      <div className="flex items-center justify-between pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsReviewingEmployee(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to My PDP Dashboard</span>
                        </button>
                      </div>

                      <PdpEmployeeInfoSection />
                      <PdpCompetencyEvaluationTable />
                      <PdpDevelopmentRoadmapSection
                        onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Tab B: My Approvals (Pending Approval: 4, Returned: 1, Approved: 11) */}
              {activeTab === 'my_approvals' && (
                <>
                  {!isReviewingEmployee ? (
                    <ManagerApprovalsView
                      onReviewEmployee={handleReviewFromManagerApprovals}
                    />
                  ) : (
                    <div className="space-y-6 w-full max-w-[1720px] mx-auto">
                      <div className="flex items-center justify-between pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsReviewingEmployee(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to My Approvals</span>
                        </button>
                      </div>

                      <PdpEmployeeInfoSection />
                      <PdpCompetencyEvaluationTable />
                      <PdpDevelopmentRoadmapSection
                        onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* 3. HR ADMIN ROLE VIEW (Shows Employee List with Functional, Department & Division Filters) */}
          {currentRole === 'hr' && (
            <>
              {!isReviewingEmployee ? (
                <HrInitiationView
                  onReviewEmployee={handleReviewFromHrInitiation}
                />
              ) : (
                <div className="space-y-6 w-full max-w-[1720px] mx-auto">
                  <div className="flex items-center justify-between pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReviewingEmployee(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Employee List</span>
                    </button>
                  </div>

                  <PdpEmployeeInfoSection />
                  <PdpCompetencyEvaluationTable />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              )}
            </>
          )}

          {/* 4. LNA TRAINING PLAN ROLE VIEW (Shows Employee Filters & Organizational Submissions like HR Initiation page) */}
          {currentRole === 'lna' && (
            <>
              {!isReviewingEmployee ? (
                <HrInitiationView
                  onReviewEmployee={handleReviewFromLna}
                  title="Personal Development Plan (PDP) – LNA Training Plan"
                  subtitle="Filter organizational employee submissions and assign tailored learning courses, certifications, and development milestones."
                />
              ) : (
                <div className="space-y-6 w-full max-w-[1720px] mx-auto">
                  <div className="flex items-center justify-between pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReviewingEmployee(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Employee Submissions</span>
                    </button>
                  </div>

                  <PdpEmployeeInfoSection />
                  <PdpCompetencyEvaluationTable />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Employee Acknowledgement Modal */}
      <PdpEmployeeAcknowledgmentModal
        isOpen={isAckModalOpen}
        onClose={() => setIsAckModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PdpProvider>
      <MainAppContent />
    </PdpProvider>
  );
}
