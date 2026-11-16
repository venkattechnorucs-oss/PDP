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
import { LnaTeamView } from './components/LnaTeamView';
import { LnaPdpInitiationReviewView } from './components/LnaPdpInitiationReviewView';
import { HrPdpDashboardView } from './components/HrPdpDashboardView';
import { EmployeeMasterView } from './components/EmployeeMasterView';
import { FunctionalMasterView } from './components/FunctionalMasterView';
import { CompetencyMasterView } from './components/CompetencyMasterView';
import { ReleaseHistoryView } from './components/ReleaseHistoryView';
import { DelegationView } from './components/DelegationView';
import { ReportsView } from './components/ReportsView';
import { ToastContainer } from './components/ToastContainer';
import { ArrowLeft, Clock, FileCheck, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { PdpStatus } from './types/pdp';
import {
  TEAM_SUBMISSIONS,
  MANAGER_SELF_PROFILE,
  TeamMemberSubmission,
  getSubmissionCategory,
} from './data/teamSubmissionsData';

const MainAppContent: React.FC = () => {
  const { status, loadStagePreset, selectEmployeeForReview, employee } = usePdp();

  // Explicit App Role decoupled from employee review stage so Manager NEVER flips to Employee
  const [appRole, setAppRole] = useState<'employee' | 'manager' | 'hr' | 'lna'>(() => {
    if (status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER') return 'manager';
    if (status === 'PENDING_LNA_TEAM') return 'lna';
    if (status === 'HR_VIEW' || status === 'PENDING_HR_INITIATION') return 'hr';
    return 'employee';
  });

  const [activeTab, setActiveTab] = useState<NavTabType>(() => {
    if (status === 'PENDING_MANAGER_REVIEW' || status === 'PDP_PLANNING_MANAGER') return 'pending_actions';
    if (status === 'PENDING_LNA_TEAM') return 'lna_plan';
    if (status === 'HR_VIEW' || status === 'PENDING_HR_INITIATION') return 'hr_dashboard';
    return 'my_pdp';
  });
  const [isReviewingEmployee, setIsReviewingEmployee] = useState<boolean>(false);
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);

  // Switching workflow stage from GansTopBar preset menu
  const handleSelectWorkflowStage = (newStage: PdpStatus) => {
    setIsReviewingEmployee(false);
    loadStagePreset(newStage);

    if (newStage === 'PENDING_EMPLOYEE_EVALUATION') {
      setAppRole('employee');
      setActiveTab('my_pdp');
    } else if (newStage === 'PENDING_MANAGER_REVIEW' || newStage === 'PDP_PLANNING_MANAGER') {
      setAppRole('manager');
      setActiveTab('pending_actions');
    } else if (newStage === 'PENDING_LNA_TEAM') {
      setAppRole('lna');
      setActiveTab('lna_plan');
    } else if (newStage === 'HR_VIEW' || newStage === 'PENDING_HR_INITIATION') {
      setAppRole('hr');
      setActiveTab('hr_dashboard');
    }
  };

  const handleSelectSideNavTab = (tab: NavTabType) => {
    setIsReviewingEmployee(false);

    if (tab === 'my_pdp' || tab === 'dashboard') {
      setActiveTab('my_pdp');
      if (appRole === 'manager') {
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

  /**
   * Manager reviewing an employee submission from Pending Actions:
   * 1. Pending with Manager Actions / Returned to Manager Actions:
   *    -> Loads 'PENDING_MANAGER_REVIEW' (rates competencies, selects 5 top priorities, gives objectives).
   * 2. Pending with Manager Review / Returned to Manager Review:
   *    -> Loads 'PDP_PLANNING_MANAGER' (manager assigns development activities across 5 competencies).
   * 3. Pending with Employee:
   *    -> Loads 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' (read-only view for manager, never switches to Employee Sign Off tab).
   * 4. Pending with PDP Initiation:
   *    -> Loads 'PENDING_HR_INITIATION'.
   * 5. Not Started:
   *    -> Loads 'PENDING_EMPLOYEE_EVALUATION'.
   */
  const handleReviewFromManagerApprovals = (
    sub: TeamMemberSubmission,
    targetStage?: PdpStatus
  ) => {
    const category = getSubmissionCategory(sub);
    let effectiveStage: PdpStatus = targetStage || 'PENDING_MANAGER_REVIEW';

    if (!targetStage) {
      if (
        category === 'PENDING_MANAGER_ACTIONS' ||
        category === 'RETURNED_MANAGER_ACTIONS'
      ) {
        effectiveStage = 'PENDING_MANAGER_REVIEW';
      } else if (
        category === 'PENDING_MANAGER_REVIEW' ||
        category === 'RETURNED_MANAGER_REVIEW'
      ) {
        effectiveStage = 'PDP_PLANNING_MANAGER';
      } else if (category === 'PENDING_PDP_INITIATION') {
        effectiveStage = 'PENDING_HR_INITIATION';
      } else if (category === 'PENDING_LNA_TEAM') {
        effectiveStage = 'PENDING_LNA_TEAM';
      } else if (
        category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' ||
        category === 'PENDING_EMPLOYEE'
      ) {
        effectiveStage = 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';
      } else if (category === 'ACTIVE') {
        effectiveStage = 'ACTIVE';
      } else {
        effectiveStage = 'PENDING_EMPLOYEE_EVALUATION';
      }
    }

    // Keep manager role active and keep tab on pending_actions
    selectEmployeeForReview(sub, effectiveStage, 'MANAGER');
    setAppRole('manager');
    setActiveTab('pending_actions');
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewFromHrInitiation = (sub: TeamMemberSubmission) => {
    selectEmployeeForReview(sub, 'HR_VIEW', 'HR_ADMIN');
    setAppRole('hr');
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewFromLnaTeam = (
    sub: TeamMemberSubmission,
    targetStage?: PdpStatus
  ) => {
    const category = getSubmissionCategory(sub);
    let effectiveStage: PdpStatus = targetStage || 'PENDING_LNA_TEAM';

    if (!targetStage) {
      if (category === 'PENDING_PDP_INITIATION') {
        effectiveStage = 'PENDING_HR_INITIATION';
      } else if (category === 'PENDING_LNA_TEAM') {
        effectiveStage = 'PENDING_LNA_TEAM';
      } else if (category === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') {
        effectiveStage = 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT';
      } else if (category === 'ACTIVE') {
        effectiveStage = 'ACTIVE';
      } else if (
        category === 'PENDING_MANAGER_REVIEW' ||
        category === 'RETURNED_MANAGER_REVIEW'
      ) {
        effectiveStage = 'PDP_PLANNING_MANAGER';
      } else if (
        category === 'PENDING_MANAGER_ACTIONS' ||
        category === 'RETURNED_MANAGER_ACTIONS'
      ) {
        effectiveStage = 'PENDING_MANAGER_REVIEW';
      } else {
        effectiveStage = 'PENDING_EMPLOYEE_EVALUATION';
      }
    }

    selectEmployeeForReview(sub, effectiveStage, 'LNA_TEAM');
    setAppRole('lna');
    setActiveTab('lna_plan');
    setIsReviewingEmployee(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex flex-col font-sans">
      {/* Top SharePoint & Talent Management Header Bar */}
      <GansTopBar
        activeStage={
          appRole === 'manager'
            ? 'PENDING_MANAGER_REVIEW'
            : appRole === 'lna'
            ? 'PENDING_LNA_TEAM'
            : appRole === 'hr'
            ? 'HR_VIEW'
            : 'PENDING_EMPLOYEE_EVALUATION'
        }
        onSelectStagePreset={handleSelectWorkflowStage}
      />

      {/* Main Layout Area with Side Navigation */}
      <div className="flex-1 flex w-full">
        {/* Side Navigation Bar with My PDP & Pending Actions (for Manager) / Pending Actions (for LNA) */}
        <PdpSideNav
          currentRole={appRole}
          activeTab={activeTab}
          onSelectTab={handleSelectSideNavTab}
          pendingApprovalsCount={appRole === 'lna' ? 5 : 6}
        />

        {/* Main Document Body */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full min-w-0">
          {/* ================= 1. EMPLOYEE ROLE VIEW ================= */}
          {appRole === 'employee' && (
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
                /* Employee Dashboard - Cycles Table */
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

          {/* ================= 2. MANAGER ROLE VIEW ================= */}
          {appRole === 'manager' && (
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

              {/* Tab A: My PDP (Manager's own personal PDP evaluation) */}
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

              {/* Tab B: Pending Actions (Unified View for Manager Approvals & Reviews) */}
              {(activeTab === 'my_approvals' ||
                activeTab === 'pending_actions' ||
                activeTab === 'review_and_assign') && (
                <>
                  {!isReviewingEmployee ? (
                    <ManagerApprovalsView
                      onReviewEmployee={(sub, targetStage) =>
                        handleReviewFromManagerApprovals(sub, targetStage)
                      }
                    />
                  ) : (
                    <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                      {/* Top Bar with Back to Pending Actions & Mode Pill */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsReviewingEmployee(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back to Pending Actions</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {status === 'PENDING_MANAGER_REVIEW' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Manager Action: Rate Competencies, Select Top 5 & Objectives</span>
                            </span>
                          )}
                          {status === 'PDP_PLANNING_MANAGER' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-300 shadow-2xs">
                              <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
                              <span>Manager Review: Assign Development Activities Roadmap</span>
                            </span>
                          )}
                          {status === 'PENDING_LNA_TEAM' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-900 border border-sky-300 shadow-2xs">
                              <Clock className="w-3.5 h-3.5 text-sky-700" />
                              <span>Status: Pending with LNA Review</span>
                            </span>
                          )}
                          {status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Status: Pending with Employee Acknowledgement</span>
                            </span>
                          )}
                          {status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                              <span>Status: Active PDP Roadmap</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Employee Info Header */}
                      <PdpEmployeeInfoSection />

                      {/* 1. When in PENDING_MANAGER_REVIEW:
                          Render Competency Evaluation Table where Manager rates 14 competencies (1-4), selects 5 top priorities, sets phases, and gives objectives */}
                      {status === 'PENDING_MANAGER_REVIEW' && (
                        <PdpCompetencyEvaluationTable />
                      )}

                      {/* 2. When in PDP_PLANNING_MANAGER:
                          Render Development Roadmap page where Manager assigns development activities across the 5 competencies */}
                      {status === 'PDP_PLANNING_MANAGER' && (
                        <PdpDevelopmentRoadmapSection
                          onOpenAcknowledgementModal={() => {}}
                        />
                      )}

                      {/* 3. When in PENDING_LNA_TEAM, PENDING_EMPLOYEE_ACKNOWLEDGEMENT or ACTIVE:
                          Render Roadmap in read-only review mode for manager (no sign-off button) */}
                      {(status === 'PENDING_LNA_TEAM' ||
                        status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' ||
                        status === 'ACTIVE') && (
                        <PdpDevelopmentRoadmapSection
                          onOpenAcknowledgementModal={() => {}}
                        />
                      )}

                      {/* 4. When in PENDING_HR_INITIATION:
                          Render Competency Evaluation summary */}
                      {status === 'PENDING_HR_INITIATION' && (
                        <PdpCompetencyEvaluationTable />
                      )}

                      {/* 5. When in PENDING_EMPLOYEE_EVALUATION (Not Started): */}
                      {status === 'PENDING_EMPLOYEE_EVALUATION' && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6 text-slate-500" />
                          </div>
                          <h3 className="text-base font-bold text-slate-800">
                            Self-Evaluation Not Yet Submitted
                          </h3>
                          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                            {employee.name} has not submitted their self-evaluation yet. Once submitted, manager actions will be enabled to rate competencies, select top 5 priorities, and define objectives.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ================= 3. HR ADMIN ROLE VIEW ================= */}
          {appRole === 'hr' && (
            <>
              {!isReviewingEmployee ? (
                activeTab === 'employee_master' ? (
                  <EmployeeMasterView
                    onNavigateToReleaseHistory={() => setActiveTab('release_history')}
                  />
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
                      <span>Back to HR View</span>
                    </button>
                  </div>

                  <PdpEmployeeInfoSection />
                  <PdpCompetencyEvaluationTable />
                </div>
              )}
            </>
          )}

          {/* ================= 4. LNA ROLE VIEW (Merged PDP Initiation & LNA Training Plan) ================= */}
          {appRole === 'lna' && (
            <>
              {!isReviewingEmployee ? (
                <LnaTeamView onReviewEmployee={handleReviewFromLnaTeam} />
              ) : status === 'PENDING_HR_INITIATION' ? (
                <LnaPdpInitiationReviewView
                  onBack={() => {
                    setIsReviewingEmployee(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <div className="space-y-6 w-full max-w-[1720px] mx-auto animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReviewingEmployee(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#211E4E] hover:text-[#C8A977] px-3.5 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to LNA Actions</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {status === 'PENDING_LNA_TEAM' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-900 border border-sky-300 shadow-2xs">
                          <GraduationCap className="w-3.5 h-3.5 text-sky-700" />
                          <span>LNA Training Plan: Assign Learning &amp; Training Paths</span>
                        </span>
                      )}
                      {status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Status: Pending with Employee Acknowledgement</span>
                        </span>
                      )}
                      {status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                          <span>Status: Active PDP Roadmap</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <PdpEmployeeInfoSection />

                  {(status === 'PENDING_LNA_TEAM' ||
                    status === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT' ||
                    status === 'ACTIVE') && (
                    <PdpDevelopmentRoadmapSection
                      onOpenAcknowledgementModal={() => {}}
                    />
                  )}

                  {(status === 'PENDING_MANAGER_REVIEW' ||
                    status === 'PDP_PLANNING_MANAGER' ||
                    status === 'PENDING_EMPLOYEE_EVALUATION') && (
                    <PdpCompetencyEvaluationTable />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals & Toast Notifications */}
      <PdpEmployeeAcknowledgmentModal
        isOpen={isAckModalOpen}
        onClose={() => setIsAckModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PdpProvider>
      <MainAppContent />
    </PdpProvider>
  );
};

export default App;
