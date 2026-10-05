import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  ProficiencyLevel,
  PdpStatus,
  CompetencyItem,
  DevelopmentRoadmapItem,
  RoadmapSubRow,
  EmployeeProfile,
  CycleConfig,
  AuditLog,
  ToastMessage,
} from '../types/pdp';
import {
  INITIAL_EMPLOYEE,
  INITIAL_COMPETENCIES,
  INITIAL_CYCLE_CONFIG,
  COMPETENCY_4_ROW_PRESETS,
} from '../data/mockData';

interface PdpContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  status: PdpStatus;
  employee: EmployeeProfile;
  cycleConfig: CycleConfig;
  competencies: CompetencyItem[];
  roadmapItems: DevelopmentRoadmapItem[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Actions
  updateEmployeeEvaluation: (competencyId: string, level: ProficiencyLevel) => void;
  submitEmployeeEvaluation: () => { success: boolean; error?: string };
  
  updateManagerEvaluation: (competencyId: string, level: ProficiencyLevel) => void;
  toggleCompetencySelection: (competencyId: string) => void;
  updateManagerObjective: (competencyId: string, objective: string) => void;
  submitManagerEvaluation: () => { success: boolean; error?: string };
  
  initiatePdpByHr: (remarks?: string) => { success: boolean; error?: string };
  
  updateRoadmapSubRow: (
    competencyId: string,
    rowNumber: number,
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks',
    value: string
  ) => void;
  updateRoadmapActivity: (competencyId: string, activities: string) => void;
  updateRoadmapObjective: (competencyId: string, objective: string) => void;
  updateRoadmapPhase: (competencyId: string, phase: string) => void;
  updateRoadmapRemarks: (competencyId: string, remarks: string) => void;
  submitManagerRoadmap: () => { success: boolean; error?: string };
  
  updateLnaTrainingPlan: (competencyId: string, trainingPlan: string) => void;
  submitLnaPlan: () => { success: boolean; error?: string };
  
  acknowledgePdpByEmployee: (comments?: string) => { success: boolean; error?: string };
  
  releasePdpCycle: (config: Partial<CycleConfig>) => void;
  sendReminder: (targetRole: Role, recipientName: string) => void;
  resetAllData: () => void;
  loadStagePreset: (targetStatus: PdpStatus) => void;
  
  // Helper queries
  selectedCompetenciesCount: number;
  isEmployeeEvalComplete: boolean;
  isManagerEvalComplete: boolean;
  isManagerRoadmapComplete: boolean;
  isLnaPlanComplete: boolean;
}

const PdpContext = createContext<PdpContextType | undefined>(undefined);

const STORAGE_KEY = 'enterprise_pdp_state_v3';

export const PdpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('EMPLOYEE');
  const [status, setStatus] = useState<PdpStatus>('PENDING_EMPLOYEE_EVALUATION');
  const [employee, setEmployee] = useState<EmployeeProfile>(INITIAL_EMPLOYEE);
  const [cycleConfig, setCycleConfig] = useState<CycleConfig>(INITIAL_CYCLE_CONFIG);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(INITIAL_COMPETENCIES);
  const [roadmapItems, setRoadmapItems] = useState<DevelopmentRoadmapItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-08-01 09:00',
      role: 'HR_ADMIN',
      actor: 'L&D Talent Operations',
      action: 'Cycle Released',
      details: '2026 Annual PDP Cycle released to Retail Operations Division.',
    },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status) setStatus(parsed.status);
        if (parsed.employee) setEmployee(parsed.employee);
        if (parsed.cycleConfig) setCycleConfig(parsed.cycleConfig);
        if (parsed.competencies) setCompetencies(parsed.competencies);
        if (parsed.roadmapItems) setRoadmapItems(parsed.roadmapItems);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage', e);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status,
          employee,
          cycleConfig,
          competencies,
          roadmapItems,
          auditLogs,
        })
      );
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }, [status, employee, cycleConfig, competencies, roadmapItems, auditLogs]);

  // Toast Helpers
  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message, timestamp: Date.now() }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAction = (role: Role, actor: string, action: string, details: string) => {
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      role,
      actor,
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Employee Evaluation Updates
  const updateEmployeeEvaluation = (competencyId: string, level: ProficiencyLevel) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, employeeEvaluation: level } : c))
    );
  };

  const isEmployeeEvalComplete = competencies.every((c) => c.employeeEvaluation !== undefined);

  const submitEmployeeEvaluation = () => {
    const incomplete = competencies.filter((c) => !c.employeeEvaluation);
    if (incomplete.length > 0) {
      addToast(
        'error',
        'Incomplete Evaluation',
        `Please provide a self-evaluation for all 14 competencies (${incomplete.length} remaining).`
      );
      return { success: false, error: 'All 14 competencies must be evaluated.' };
    }

    setStatus('PENDING_MANAGER_REVIEW');
    setCurrentRole('MANAGER');
    logAction(
      'EMPLOYEE',
      employee.name,
      'Self-Evaluation Submitted',
      'Employee completed self-evaluation for all 14 competencies and submitted for Line Manager review.'
    );
    addToast(
      'success',
      'Evaluation Submitted Successfully',
      'Your PDP self-evaluation has been submitted. Moved to Manager Review stage.'
    );
    return { success: true };
  };

  // 2. Manager First Review Updates
  const updateManagerEvaluation = (competencyId: string, level: ProficiencyLevel) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, managerEvaluation: level } : c))
    );
  };

  const toggleCompetencySelection = (competencyId: string) => {
    setCompetencies((prev) => {
      const target = prev.find((c) => c.id === competencyId);
      if (!target) return prev;
      const currentlySelected = prev.filter((c) => c.isSelectedForPdp).length;
      if (!target.isSelectedForPdp && currentlySelected >= 5) {
        addToast(
          'warning',
          'Selection Limit Reached',
          'You can select exactly 5 competencies for the PDP development roadmap.'
        );
        return prev;
      }
      return prev.map((c) =>
        c.id === competencyId ? { ...c, isSelectedForPdp: !c.isSelectedForPdp } : c
      );
    });
  };

  const updateManagerObjective = (competencyId: string, objective: string) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, managerObjective: objective } : c))
    );
  };

  const selectedCompetencies = competencies.filter((c) => c.isSelectedForPdp);
  const selectedCompetenciesCount = selectedCompetencies.length;
  const isManagerEvalComplete =
    selectedCompetenciesCount === 5 &&
    selectedCompetencies.every((c) => c.managerObjective && c.managerObjective.trim().length > 0);

  const submitManagerEvaluation = () => {
    if (selectedCompetenciesCount !== 5) {
      addToast(
        'error',
        'Select Exactly 5 Competencies',
        `Please select exactly 5 development competencies (Currently selected: ${selectedCompetenciesCount}).`
      );
      return { success: false, error: 'Exactly 5 competencies must be selected.' };
    }

    const missingObjectives = selectedCompetencies.filter(
      (c) => !c.managerObjective || c.managerObjective.trim().length === 0
    );
    if (missingObjectives.length > 0) {
      addToast(
        'error',
        'Missing Objectives',
        `Please provide a development objective for all 5 selected competencies.`
      );
      return { success: false, error: 'Objectives required for all 5 selected competencies.' };
    }

    // Auto-fill any missing manager evaluation ratings on the 14 table items so manager is never blocked
    setCompetencies((prev) =>
      prev.map((c) => ({
        ...c,
        managerEvaluation: c.managerEvaluation || c.employeeEvaluation || c.idealProficiency || 'Advanced',
      }))
    );

    // Populate initial roadmap items based on 5 selected competencies with 4 rows each
    const initialRoadmaps: DevelopmentRoadmapItem[] = selectedCompetencies.map((comp) => {
      const preset = COMPETENCY_4_ROW_PRESETS[comp.id] || {
        objective: comp.managerObjective || '',
        rows: [
          { rowNumber: 1, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 1 (1 - 3 Months)', statusRemarks: 'Planned' },
          { rowNumber: 2, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 2 (3 - 6 Months)', statusRemarks: 'Planned' },
          { rowNumber: 3, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 3 (6 - 9 Months)', statusRemarks: 'Planned' },
          { rowNumber: 4, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 4 (9 - 12 Months)', statusRemarks: 'Planned' },
        ],
      };

      const rows: RoadmapSubRow[] = preset.rows.map((r) => ({
        rowNumber: r.rowNumber,
        activity: r.activity || '',
        trainingPath: 'Pending LNA Team',
        phase: r.phase || `Phase ${r.rowNumber}`,
        statusRemarks: r.statusRemarks || 'Planned',
      }));

      return {
        competencyId: comp.id,
        code: comp.code,
        competencyName: comp.name,
        category: comp.category,
        objective: comp.managerObjective || preset.objective || '',
        rows,
        developmentActivities: rows[0]?.activity || '',
        learningTrainingPlan: 'Pending LNA Team',
        phaseMonths: '12 Months (4 Phases)',
        statusRemarks: 'Planned for 2026/27 Cycle',
      };
    });

    setRoadmapItems(initialRoadmaps);
    setStatus('PENDING_HR_INITIATION');
    setCurrentRole('HR_ADMIN');
    logAction(
      'MANAGER',
      employee.lineManager,
      'Manager Evaluation & Competency Selection Completed',
      `Manager evaluated competencies, selected 5 priority development areas (${selectedCompetencies
        .map((c) => c.code)
        .join(', ')}), and submitted for HR Initiation.`
    );
    addToast(
      'success',
      'Manager Review Submitted',
      'Evaluation and 5 selected development competencies forwarded to HR. Moved to HR Initiation stage.'
    );
    return { success: true };
  };

  // 3. HR Initiates PDP
  const initiatePdpByHr = (remarks?: string) => {
    setStatus('PDP_PLANNING_MANAGER');
    setCurrentRole('MANAGER');
    logAction(
      'HR_ADMIN',
      'HR L&D Lead / Talent Partner',
      'PDP Formally Initiated',
      `HR reviewed and initiated PDP for ${employee.name}. Transferred back to Line Manager for Development Roadmap detailing.${
        remarks ? ` HR Note: ${remarks}` : ''
      }`
    );
    addToast(
      'success',
      'PDP Initiated by HR',
      'PDP approved by HR. Moved to Manager Development Roadmap Planning stage.'
    );
    return { success: true };
  };

  // 4. Manager Development Roadmap Updates
  const updateRoadmapObjective = (competencyId: string, objective: string) => {
    setRoadmapItems((prev) =>
      prev.map((r) => (r.competencyId === competencyId ? { ...r, objective } : r))
    );
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, managerObjective: objective } : c))
    );
  };

  const updateRoadmapSubRow = (
    competencyId: string,
    rowNumber: number,
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks',
    value: string
  ) => {
    setRoadmapItems((prev) =>
      prev.map((r) => {
        if (r.competencyId !== competencyId) return r;
        const currentRows = r.rows && r.rows.length === 4
          ? r.rows
          : [
              { rowNumber: 1, activity: r.developmentActivities || '', trainingPath: r.learningTrainingPlan || 'Pending LNA Team', phase: 'Phase 1 (1 - 3 Months)', statusRemarks: r.statusRemarks || 'Planned' },
              { rowNumber: 2, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 2 (3 - 6 Months)', statusRemarks: 'Planned' },
              { rowNumber: 3, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 3 (6 - 9 Months)', statusRemarks: 'Planned' },
              { rowNumber: 4, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 4 (9 - 12 Months)', statusRemarks: 'Planned' },
            ];

        const updatedRows = currentRows.map((row) =>
          row.rowNumber === rowNumber ? { ...row, [field]: value } : row
        );

        return {
          ...r,
          rows: updatedRows,
          developmentActivities: field === 'activity' && rowNumber === 1 ? value : (r.developmentActivities || updatedRows[0]?.activity || ''),
          learningTrainingPlan: field === 'trainingPath' && rowNumber === 1 ? value : (r.learningTrainingPlan || updatedRows[0]?.trainingPath || ''),
          phaseMonths: field === 'phase' && rowNumber === 1 ? value : (r.phaseMonths || updatedRows[0]?.phase || ''),
          statusRemarks: field === 'statusRemarks' && rowNumber === 1 ? value : (r.statusRemarks || updatedRows[0]?.statusRemarks || ''),
        };
      })
    );
  };

  const updateRoadmapActivity = (competencyId: string, activities: string) => {
    updateRoadmapSubRow(competencyId, 1, 'activity', activities);
  };

  const updateRoadmapPhase = (competencyId: string, phase: string) => {
    updateRoadmapSubRow(competencyId, 1, 'phase', phase);
  };

  const updateRoadmapRemarks = (competencyId: string, remarks: string) => {
    updateRoadmapSubRow(competencyId, 1, 'statusRemarks', remarks);
  };

  const isManagerRoadmapComplete =
    roadmapItems.length === 5 &&
    roadmapItems.every(
      (r) =>
        r.rows &&
        r.rows.length === 4 &&
        r.rows.some((row) => row.activity && row.activity.trim().length >= 8)
    );

  const submitManagerRoadmap = () => {
    const incomplete = roadmapItems.filter(
      (r) =>
        !r.rows ||
        r.rows.length !== 4 ||
        !r.rows.some((row) => row.activity && row.activity.trim().length >= 8)
    );
    if (incomplete.length > 0) {
      addToast(
        'error',
        'Incomplete Development Roadmap',
        `Please specify detailed Development Activities / Projects across the 4 rows for all 5 competencies (${incomplete.length} incomplete).`
      );
      return { success: false, error: 'All 5 competencies require development activities.' };
    }

    setStatus('PENDING_LNA_TEAM');
    setCurrentRole('LNA_TEAM');
    logAction(
      'MANAGER',
      employee.lineManager,
      'Development Roadmap Submitted to LNA',
      'Manager defined practical development activities across 4 rows and phase timelines for all 5 competencies.'
    );
    addToast(
      'success',
      'Development Plan Submitted',
      'Development Roadmap submitted successfully. Moved to LNA Team to configure Learning & Training Plans.'
    );
    return { success: true };
  };

  // 5. LNA Team Learning / Training Plan Updates
  const updateLnaTrainingPlan = (competencyId: string, trainingPlan: string) => {
    updateRoadmapSubRow(competencyId, 1, 'trainingPath', trainingPlan);
  };

  const isLnaPlanComplete =
    roadmapItems.length === 5 &&
    roadmapItems.every(
      (r) =>
        r.rows &&
        r.rows.length === 4 &&
        r.rows.some(
          (row) =>
            row.trainingPath &&
            row.trainingPath.trim().length >= 5 &&
            row.trainingPath !== 'Pending LNA Team'
        )
    );

  const submitLnaPlan = () => {
    const incomplete = roadmapItems.filter(
      (r) =>
        !r.rows ||
        r.rows.length !== 4 ||
        !r.rows.some(
          (row) =>
            row.trainingPath &&
            row.trainingPath.trim().length >= 5 &&
            row.trainingPath !== 'Pending LNA Team'
        )
    );
    if (incomplete.length > 0) {
      addToast(
        'error',
        'Incomplete Training Plan',
        `Please assign formal Learning & Training interventions across the 4 rows for all 5 competencies (${incomplete.length} pending).`
      );
      return { success: false, error: 'All 5 competencies require learning and training programs.' };
    }

    setStatus('PENDING_EMPLOYEE_ACKNOWLEDGEMENT');
    setCurrentRole('EMPLOYEE');
    logAction(
      'LNA_TEAM',
      'LNA & Training Solutions Lead',
      'Learning & Training Programs Assigned',
      'LNA Team finalized certified training courses, workshops, and coaching interventions for all 5 development competencies.'
    );
    addToast(
      'success',
      'Learning & Training Plan Submitted',
      'PDP finalized by LNA Team and dispatched to Employee for formal review and acknowledgement.'
    );
    return { success: true };
  };

  // 6. Employee Final Acknowledgement -> Active
  const acknowledgePdpByEmployee = (comments?: string) => {
    setStatus('ACTIVE');
    setCurrentRole('EMPLOYEE');
    logAction(
      'EMPLOYEE',
      employee.name,
      'PDP Formally Acknowledged',
      `Employee reviewed and accepted the 2026-2027 Professional Development Plan roadmap.${
        comments ? ` Employee Note: ${comments}` : ''
      }`
    );
    addToast(
      'success',
      'PDP Formally Active!',
      'Congratulations! Your Professional Development Plan (PDP) 2026/27 is now ACTIVE and operational.'
    );
    return { success: true };
  };

  // 7. HR Cycle Release
  const releasePdpCycle = (newConfig: Partial<CycleConfig>) => {
    setCycleConfig((prev) => ({
      ...prev,
      ...newConfig,
      isReleased: true,
      status: 'Released',
      releaseDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));
    logAction(
      'HR_ADMIN',
      'HR Strategy & Operations',
      'PDP Cycle Released',
      `PDP Cycle "${newConfig.assessmentName || cycleConfig.assessmentName}" released to target employees.`
    );
    addToast('success', 'PDP Cycle Released', 'The PDP cycle is now open for employee evaluations.');
  };

  const sendReminder = (targetRole: Role, recipientName: string) => {
    const roleLabels: Record<Role, string> = {
      EMPLOYEE: 'Employee',
      MANAGER: 'Line Manager',
      HR_ADMIN: 'HR / Admin',
      LNA_TEAM: 'LNA Team',
    };
    logAction('HR_ADMIN', 'HR System Automated', 'Reminder Notification Sent', `Formal PDP deadline reminder sent to ${recipientName} (${roleLabels[targetRole]}).`);
    addToast('info', 'Reminder Dispatched', `Official reminder notification sent to ${recipientName}.`);
  };

  // Reset to initial state
  const resetAllData = () => {
    setStatus('PENDING_EMPLOYEE_EVALUATION');
    setCurrentRole('EMPLOYEE');
    setEmployee(INITIAL_EMPLOYEE);
    setCycleConfig(INITIAL_CYCLE_CONFIG);
    setCompetencies(INITIAL_COMPETENCIES);
    setRoadmapItems([]);
    setAuditLogs([
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16),
        role: 'HR_ADMIN',
        actor: 'System Reset',
        action: 'Prototype Reset',
        details: 'Reset application data back to initial stage (Pending Employee Evaluation).',
      },
    ]);
    localStorage.removeItem(STORAGE_KEY);
    addToast('info', 'Prototype Reset', 'All PDP data has been reset to default initial state.');
  };

  // Quick Preset Loader to test any stage seamlessly
  const loadStagePreset = (targetStatus: PdpStatus) => {
    // 5 Selected default competencies (Behavioural first: comp-b-1, comp-b-3, then functional: comp-f-1, comp-f-2, comp-f-4)
    const selectedIds = ['comp-b-1', 'comp-b-3', 'comp-f-1', 'comp-f-2', 'comp-f-4'];

    // Stage-specific presets:
    const isStage1 = targetStatus === 'PENDING_EMPLOYEE_EVALUATION';
    const isStage2 = targetStatus === 'PENDING_MANAGER_REVIEW'; // Clean for manager to select and write objectives

    // Prepare competencies:
    const mockCompetencies: CompetencyItem[] = INITIAL_COMPETENCIES.map((c) => {
      // In Stage 1, employee has not evaluated yet
      const empEval = isStage1
        ? undefined
        : c.idealProficiency === 'Expert'
        ? 'Advanced'
        : 'Intermediate';

      // In Stage 1 & Stage 2, manager has NOT evaluated or selected yet
      const mgrEval = isStage1 || isStage2
        ? undefined
        : c.idealProficiency === 'Expert'
        ? 'Advanced'
        : 'Advanced';

      const isSelected = (!isStage1 && !isStage2) && selectedIds.includes(c.id);
      const preset = COMPETENCY_4_ROW_PRESETS[c.id];
      const obj = isSelected ? (preset?.objective || '') : '';

      return {
        ...c,
        employeeEvaluation: empEval,
        managerEvaluation: mgrEval,
        isSelectedForPdp: isSelected,
        managerObjective: obj,
      };
    });

    const mockRoadmaps: DevelopmentRoadmapItem[] = (isStage1 || isStage2)
      ? []
      : selectedIds.map((id) => {
          const comp = mockCompetencies.find((c) => c.id === id)!;
          const preset = COMPETENCY_4_ROW_PRESETS[id] || {
            objective: '',
            rows: [
              { rowNumber: 1, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 1 (1 - 3 Months)', statusRemarks: 'Planned' },
              { rowNumber: 2, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 2 (3 - 6 Months)', statusRemarks: 'Planned' },
              { rowNumber: 3, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 3 (6 - 9 Months)', statusRemarks: 'Planned' },
              { rowNumber: 4, activity: '', trainingPath: 'Pending LNA Team', phase: 'Phase 4 (9 - 12 Months)', statusRemarks: 'Planned' },
            ],
          };

          const rows: RoadmapSubRow[] = preset.rows.map((r) => {
            const hasActivities = ['PDP_PLANNING_MANAGER', 'PENDING_LNA_TEAM', 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT', 'ACTIVE'].includes(targetStatus);
            const hasTraining = ['PENDING_EMPLOYEE_ACKNOWLEDGEMENT', 'ACTIVE'].includes(targetStatus);

            return {
              rowNumber: r.rowNumber,
              activity: hasActivities ? r.activity : '',
              trainingPath: hasTraining ? r.trainingPath : 'Pending LNA Team',
              phase: r.phase,
              statusRemarks: targetStatus === 'ACTIVE' ? 'Active In-Progress' : (r.statusRemarks || 'Scheduled for 2026/27 Cycle'),
            };
          });

          return {
            competencyId: comp.id,
            code: comp.code,
            competencyName: comp.name,
            category: comp.category,
            objective: comp.managerObjective || preset.objective || '',
            rows,
            developmentActivities: rows[0]?.activity || '',
            learningTrainingPlan: rows[0]?.trainingPath || 'Pending LNA Team',
            phaseMonths: '12 Months (4 Phases)',
            statusRemarks: targetStatus === 'ACTIVE' ? 'Active In-Progress' : 'Scheduled for 2026/27 Cycle',
          };
        });

    setCompetencies(mockCompetencies);
    setRoadmapItems(mockRoadmaps);
    setStatus(targetStatus);

    // Set appropriate role view for convenience
    if (targetStatus === 'PENDING_EMPLOYEE_EVALUATION') setCurrentRole('EMPLOYEE');
    else if (targetStatus === 'PENDING_MANAGER_REVIEW') setCurrentRole('MANAGER');
    else if (targetStatus === 'PENDING_HR_INITIATION') setCurrentRole('HR_ADMIN');
    else if (targetStatus === 'PDP_PLANNING_MANAGER') setCurrentRole('MANAGER');
    else if (targetStatus === 'PENDING_LNA_TEAM') setCurrentRole('LNA_TEAM');
    else if (targetStatus === 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT') setCurrentRole('EMPLOYEE');
    else if (targetStatus === 'ACTIVE') setCurrentRole('EMPLOYEE');
    else if (targetStatus === 'COMPLETED') setCurrentRole('EMPLOYEE');
    else if (targetStatus === 'HR_VIEW') setCurrentRole('HR_ADMIN');

    addToast('info', 'Preset Loaded', `Switched state to "${targetStatus.replace(/_/g, ' ')}".`);
  };

  return (
    <PdpContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        status,
        employee,
        cycleConfig,
        competencies,
        roadmapItems,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        updateEmployeeEvaluation,
        submitEmployeeEvaluation,
        updateManagerEvaluation,
        toggleCompetencySelection,
        updateManagerObjective,
        submitManagerEvaluation,
        initiatePdpByHr,
        updateRoadmapSubRow,
        updateRoadmapObjective,
        updateRoadmapActivity,
        updateRoadmapPhase,
        updateRoadmapRemarks,
        submitManagerRoadmap,
        updateLnaTrainingPlan,
        submitLnaPlan,
        acknowledgePdpByEmployee,
        releasePdpCycle,
        sendReminder,
        resetAllData,
        loadStagePreset,
        selectedCompetenciesCount,
        isEmployeeEvalComplete,
        isManagerEvalComplete,
        isManagerRoadmapComplete,
        isLnaPlanComplete,
      }}
    >
      {children}
    </PdpContext.Provider>
  );
};

export const usePdp = () => {
  const context = useContext(PdpContext);
  if (!context) throw new Error('usePdp must be used within a PdpProvider');
  return context;
};
