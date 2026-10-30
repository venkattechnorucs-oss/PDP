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
import { HrPdpDashboardView } from './components/HrPdpDashboardView';
import { EmployeeMasterView } from './components/EmployeeMasterView';
import { FunctionalMasterView } from './components/FunctionalMasterView';
import { CompetencyMasterView } from './components/CompetencyMasterView';
import { ReleaseHistoryView } from './components/ReleaseHistoryView';
import { DelegationView } from './components/DelegationView';
import { ReportsView } from './components/ReportsView';
import { ToastContainer } from './components/ToastContainer';
import { ReviewAndAssignView } from './components/ReviewAndAssignView';
import { ArrowLeft, FileCheck } from 'lucide-react';
import { PdpStatus } from './types/pdp';
import { TEAM_SUBMISSIONS, MANAGER_SELF_PROFILE, TeamMemberSubmission } from './data/teamSubmissionsData';

const MainAppContent: React.FC = () => {
  const { status, loadStagePreset, selectEmployeeForReview, employee } = usePdp();

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
    if (status === 'HR_VIEW') return 'hr_dashboard';
    if (status === 'PENDING_HR_INITIATION') return 'hr_initiation';
    if (status === 'PENDING_LNA_TEAM') return 'lna_plan';
    if (status === 'PENDING_MANAGER_REVIEW') return 'pending_actions';
    if (status === 'PDP_PLANNING_MANAGER') return 'review_and_assign';
    if (status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') return 'sign_off';
    if (status === 'ACTIVE') return 'active_pdp';
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

      if (status === 'HR_VIEW') {
        setActiveTab('hr_dashboard');
      } else if (status === 'PENDING_HR_INITIATION') {
        setActiveTab('hr_initiation');
      } else if (status === 'PENDING_LNA_TEAM') {
        setActiveTab('lna_plan');
        setIsReviewingEmployee(false);
      } else if (status === 'PENDING_MANAGER_REVIEW') {
        setActiveTab('pending_actions');
        setIsReviewingEmployee(false);
      } else if (status === 'PDP_PLANNING_MANAGER') {
        setActiveTab('review_and_assign');
        setIsReviewingEmployee(false);
      } else if (status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') {
        setActiveTab('sign_off');
        setIsReviewingEmployee(false);
      } else if (status === 'ACTIVE') {
        setActiveTab('active_pdp');
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
    } else if (tab === 'sign_off') {
      setActiveTab('sign_off');
      loadStagePreset('PENDING_EMPLOYEE_ACKNOWLEDGEMENT');
      setIsReviewingEmployee(false);
    } else if (tab === 'active_pdp') {
      setActiveTab('active_pdp');
      loadStagePreset('ACTIVE');
      setIsReviewingEmployee(false);
    } else if (tab === 'my_approvals' || tab === 'pending_actions') {
      setActiveTab('pending_actions');
      setIsReviewingEmployee(false);
    } else if (tab === 'review_and_assign') {
      setActiveTab('review_and_assign');
      loadStagePreset('PDP_PLANNING_MANAGER');
      setIsReviewingEmployee(false);
    } else if (tab === 'hr_dashboard') {
      setActiveTab('hr_dashboard');
    } else if (tab === 'employee_master') {
      setActiveTab('employee_master');
    } else if (tab === 'functional_master') {
      setActiveTab('functional_master');
    } else if (tab === 'competency_master') {
      setActiveTab('competency_master');
    } else if (tab === 'release_history') {
      setActiveTab('release_history');
    } else if (tab === 'delegation') {
      setActiveTab('delegation');
    } else if (tab === 'reports') {
      setActiveTab('reports');
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
              {activeTab === 'active_pdp' ? (
                /* Active PDP View */
                <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                  <PdpEmployeeInfoSection />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              ) : activeTab === 'sign_off' ? (
                /* Employee Sign-off Page */
                <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                  <PdpEmployeeInfoSection />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              ) : !isReviewingEmployee ? (
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
              {/* Tab A0: Active PDP (Manager's own personal Active PDP) */}
              {activeTab === 'active_pdp' && (
                <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                  <PdpEmployeeInfoSection />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              )}
              {/* Tab A1: Sign Off (Manager's own personal PDP Sign-off) */}
              {activeTab === 'sign_off' && (
                <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                  <PdpEmployeeInfoSection />
                  <PdpDevelopmentRoadmapSection
                    onOpenAcknowledgementModal={() => setIsAckModalOpen(true)}
                  />
                </div>
              )}
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

              {/* Tab B: Pending Actions (Under My Approvals) */}
              {(activeTab === 'my_approvals' || activeTab === 'pending_actions') && (
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
                          <span>Back to Pending Actions</span>
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

              {/* Tab C: Review & Assign (Under My Approvals) */}
              {activeTab === 'review_and_assign' && (
                <>
                  {!isReviewingEmployee ? (
                    <ReviewAndAssignView
                      onReviewEmployee={(sub) => {
                        selectEmployeeForReview(sub, 'PDP_PLANNING_MANAGER');
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
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer w-fit"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Review & Assign</span>
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

          {/* 3. HR ADMIN ROLE VIEW (Shows PDP Dashboard or PDP Initiation with Functional, Department & Division Filters) */}
          {currentRole === 'hr' && (
            <>
              {!isReviewingEmployee ? (
                activeTab === 'employee_master' ? (
                  <EmployeeMasterView />
                ) : activeTab === 'functional_master' ? (
                  <FunctionalMasterView />
                ) : activeTab === 'competency_master' ? (
                  <CompetencyMasterView />
                ) : activeTab === 'release_history' ? (
                  <ReleaseHistoryView />
                ) : activeTab === 'delegation' ? (
                  <DelegationView />
                ) : activeTab === 'reports' ? (
                  <ReportsView />
                ) : activeTab === 'hr_dashboard' ? (
                  <HrPdpDashboardView onReviewEmployee={handleReviewFromHrInitiation} />
                ) : (
                  <HrInitiationView onReviewEmployee={handleReviewFromHrInitiation} />
                )
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
                      <span>Back to {activeTab === 'hr_dashboard' ? 'Dashboard' : 'Employee List'}</span>
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
