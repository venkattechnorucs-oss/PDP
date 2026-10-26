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
  CommentMessage,
} from '../types/pdp';
import {
  INITIAL_EMPLOYEE,
  INITIAL_COMPETENCIES,
  INITIAL_CYCLE_CONFIG,
  COMPETENCY_4_ROW_PRESETS,
  DEFAULT_EMPLOYEE_DEVELOPMENT_THOUGHTS,
} from '../data/mockData';
import { calculatePhaseDates } from '../utils/phaseDateUtils';
import { TeamMemberSubmission, toEmployeeProfile } from '../data/teamSubmissionsData';

interface PdpContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  status: PdpStatus;
  employee: EmployeeProfile;
  cycleConfig: CycleConfig;
  competencies: CompetencyItem[];
  roadmapItems: DevelopmentRoadmapItem[];
  employeeDevelopmentThoughts: string;
  updateEmployeeDevelopmentThoughts: (thoughts: string) => void;
  managerRemarks: string;
  updateManagerRemarks: (remarks: string) => void;
  commentHistory: CommentMessage[];
  addCommentMessage: (message: Omit<CommentMessage, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Actions
  updateEmployeeEvaluation: (competencyId: string, level: ProficiencyLevel) => void;
  resetEmployeeEvaluationForm: () => void;
  submitEmployeeEvaluation: () => { success: boolean; error?: string };
  
  updateManagerEvaluation: (competencyId: string, level: ProficiencyLevel) => void;
  toggleCompetencySelection: (competencyId: string) => void;
  updateCompetencyPriority: (competencyId: string, priorityRank?: number) => void;
  updateManagerObjective: (competencyId: string, objective: string) => void;
  submitManagerEvaluation: () => { success: boolean; error?: string };
  returnToEmployee: (reason?: string) => void;
  returnToManager: (reason?: string) => void;
  
  initiatePdpByHr: (remarks?: string) => { success: boolean; error?: string };
  
  updateRoadmapSubRow: (
    competencyId: string,
    rowNumber: number,
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks' | 'startDate' | 'endDate',
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
  selectEmployeeForReview: (sub: TeamMemberSubmission, targetStatus?: PdpStatus) => void;
  
  // Helper queries
  selectedCompetenciesCount: number;
  isEmployeeEvalComplete: boolean;
  isManagerEvalComplete: boolean;
  isManagerRoadmapComplete: boolean;
  isLnaPlanComplete: boolean;
}

const PdpContext = createContext<PdpContextType | undefined>(undefined);

const STORAGE_KEY = 'enterprise_pdp_state_v3';

const ensureFiveSubRows = (existingRows: RoadmapSubRow[] = []): RoadmapSubRow[] => {
  const defaultTemplates = [
    { rowNumber: 1, phase: '6 Months', startDate: '01/Jul/2026', endDate: '31/Dec/2026', assignedDates: 'From: 01/Jul/2026 To: 31/Dec/2026', statusRemarks: 'Scheduled' },
    { rowNumber: 2, phase: '6 Months', startDate: '01/Jan/2027', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027', statusRemarks: 'Planned' },
    { rowNumber: 3, phase: '1 Year', startDate: '01/Jul/2026', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027', statusRemarks: 'Planned' },
    { rowNumber: 4, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Planned' },
    { rowNumber: 5, phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Optional' },
  ];

  const result: RoadmapSubRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const found = existingRows.find((r) => r.rowNumber === i);
    const tmpl = defaultTemplates[i - 1];
    if (found) {
      result.push({
        ...tmpl,
        ...found,
        rowNumber: i,
        statusRemarks: found.statusRemarks || tmpl.statusRemarks,
      });
    } else {
      result.push({
        rowNumber: i,
        activity: '',
        trainingPath: 'Pending LNA Team',
        phase: tmpl.phase,
        startDate: tmpl.startDate,
        endDate: tmpl.endDate,
        assignedDates: tmpl.assignedDates,
        statusRemarks: tmpl.statusRemarks,
      });
    }
  }
  return result;
};

export const PdpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('EMPLOYEE');
  const [status, setStatus] = useState<PdpStatus>('PENDING_EMPLOYEE_EVALUATION');
  const [employee, setEmployee] = useState<EmployeeProfile>(INITIAL_EMPLOYEE);
  const [cycleConfig, setCycleConfig] = useState<CycleConfig>(INITIAL_CYCLE_CONFIG);
  const [competencies, setCompetencies] = useState<CompetencyItem[]>(INITIAL_COMPETENCIES);
  const [roadmapItems, setRoadmapItems] = useState<DevelopmentRoadmapItem[]>([]);
  const [employeeDevelopmentThoughts, setEmployeeDevelopmentThoughts] = useState<string>(
    DEFAULT_EMPLOYEE_DEVELOPMENT_THOUGHTS
  );
  const [managerRemarks, setManagerRemarks] = useState<string>('');
  const [commentHistory, setCommentHistory] = useState<CommentMessage[]>([
    {
      id: 'msg-1',
      sender: 'employee',
      senderName: 'Vivekanandan',
      text: 'Focusing on driving enterprise performance KPIs and Kaizen operational excellence across corporate units.',
      timestamp: '19/Aug/2026',
    },
  ]);
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
        if (parsed.roadmapItems) {
          const normalized = (parsed.roadmapItems as DevelopmentRoadmapItem[]).map((item) => ({
            ...item,
            rows: ensureFiveSubRows(item.rows || []),
          }));
          setRoadmapItems(normalized);
        }
        if (parsed.employeeDevelopmentThoughts !== undefined) {
          setEmployeeDevelopmentThoughts(parsed.employeeDevelopmentThoughts);
        }
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
          employeeDevelopmentThoughts,
          auditLogs,
        })
      );
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }, [status, employee, cycleConfig, competencies, roadmapItems, employeeDevelopmentThoughts, auditLogs]);

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

  const updateEmployeeDevelopmentThoughts = (thoughts: string) => {
    setEmployeeDevelopmentThoughts(thoughts);
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

    if (employeeDevelopmentThoughts.trim().length > 0) {
      setCommentHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.text === employeeDevelopmentThoughts.trim() && last.sender === 'employee') return prev;
        return [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'employee',
            senderName: employee.name || 'Vivekanandan',
            text: employeeDevelopmentThoughts.trim(),
            timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/'),
          },
        ];
      });
    }

    setStatus('PENDING_MANAGER_REVIEW');
    setCurrentRole('MANAGER');
    logAction(
      'EMPLOYEE',
      employee.name,
      'Self-Evaluation & Thoughts Submitted',
      'Employee completed self-evaluation for all 14 competencies and submitted Development Thoughts for Line Manager review.'
    );
    addToast(
      'success',
      'Evaluation Submitted Successfully',
      'Your PDP self-evaluation and development thoughts have been submitted. Moved to Manager Review stage.'
    );
    return { success: true };
  };

  const resetEmployeeEvaluationForm = () => {
    setCompetencies((prev) =>
      prev.map((c) => ({
        ...c,
        employeeEvaluation: undefined,
      }))
    );
    setEmployeeDevelopmentThoughts('');
    addToast('info', 'Form Reset', 'Employee evaluation ratings and thoughts have been cleared.');
  };

  // 2. Manager First Review Updates
  const updateManagerEvaluation = (competencyId: string, level: ProficiencyLevel) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, managerEvaluation: level } : c))
    );
  };

  const updateCompetencyPriority = (competencyId: string, priorityRank?: number) => {
    setCompetencies((prev) =>
      prev.map((c) => {
        if (c.id === competencyId) {
          return {
            ...c,
            isSelectedForPdp: priorityRank !== undefined,
            priorityRank,
          };
        }
        // If another competency currently has this priorityRank, clear it to avoid duplicate priorities
        if (priorityRank !== undefined && c.priorityRank === priorityRank) {
          return {
            ...c,
            isSelectedForPdp: false,
            priorityRank: undefined,
          };
        }
        return c;
      })
    );
  };

  const toggleCompetencySelection = (competencyId: string) => {
    setCompetencies((prev) => {
      const target = prev.find((c) => c.id === competencyId);
      if (!target) return prev;
      if (target.isSelectedForPdp) {
        return prev.map((c) =>
          c.id === competencyId ? { ...c, isSelectedForPdp: false, priorityRank: undefined } : c
        );
      }
      const usedRanks = prev.map((c) => c.priorityRank).filter((r): r is number => r !== undefined);
      const nextRank = [1, 2, 3, 4, 5].find((r) => !usedRanks.includes(r));
      if (!nextRank) {
        addToast(
          'warning',
          'Selection Limit Reached',
          'You can select exactly 5 competencies for the PDP development roadmap (Priority 1 to 5).'
        );
        return prev;
      }
      return prev.map((c) =>
        c.id === competencyId ? { ...c, isSelectedForPdp: true, priorityRank: nextRank } : c
      );
    });
  };

  const updateManagerObjective = (competencyId: string, objective: string) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === competencyId ? { ...c, managerObjective: objective } : c))
    );
  };

  const selectedCompetencies = competencies
    .filter((c) => c.isSelectedForPdp)
    .sort((a, b) => (a.priorityRank || 99) - (b.priorityRank || 99));
  const selectedCompetenciesCount = selectedCompetencies.length;
  const isManagerEvalComplete =
    selectedCompetenciesCount === 5 &&
    selectedCompetencies.every((c) => c.managerObjective && c.managerObjective.trim().length > 0);

  const submitManagerEvaluation = () => {
    if (selectedCompetenciesCount !== 5) {
      addToast(
        'error',
        'Select Exactly 5 Competencies',
        `Please select all 5 priority competencies (Priority 1 to 5). Currently selected: ${selectedCompetenciesCount}.`
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

    // Populate initial roadmap items based on 5 selected competencies with 5 rows each (rows 1-4 mandatory, row 5 optional)
    const initialRoadmaps: DevelopmentRoadmapItem[] = selectedCompetencies.map((comp) => {
      const preset = COMPETENCY_4_ROW_PRESETS[comp.id] || {
        objective: comp.managerObjective || '',
        rows: [],
      };

      const baseRows: RoadmapSubRow[] = preset.rows.map((r) => {
        const dateInfo = calculatePhaseDates(r.phase, r.rowNumber, r.startDate);
        return {
          rowNumber: r.rowNumber,
          activity: r.activity || '',
          trainingPath: 'Pending LNA Team',
          phase: dateInfo.duration,
          startDate: dateInfo.startDate,
          endDate: dateInfo.endDate,
          assignedDates: dateInfo.assignedDates,
          statusRemarks: r.statusRemarks || 'Planned',
        };
      });

      const rows: RoadmapSubRow[] = ensureFiveSubRows(baseRows);

      return {
        competencyId: comp.id,
        code: comp.code,
        competencyName: comp.name,
        category: comp.category,
        priorityRank: comp.priorityRank,
        objective: comp.managerObjective || preset.objective || '',
        rows,
        developmentActivities: rows[0]?.activity || '',
        learningTrainingPlan: 'Pending LNA Team',
        phaseMonths: '24 Months (5 Milestones)',
        statusRemarks: 'Planned for 2026/27 Cycle',
      };
    });

    if (managerRemarks.trim().length > 0) {
      setCommentHistory((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'manager',
          senderName: employee.lineManager || 'Suresh Nair',
          text: managerRemarks.trim(),
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/'),
        },
      ]);
    }

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

  const returnToEmployee = (reason?: string) => {
    setStatus('PENDING_EMPLOYEE_EVALUATION');
    setCurrentRole('EMPLOYEE');
    logAction(
      currentRole,
      currentRole === 'MANAGER' ? employee.lineManager : 'HR Admin',
      'Returned to Employee',
      reason || 'PDP was returned to Employee for updates and revisions.'
    );
    addToast('warning', 'Returned to Employee', 'PDP has been returned to the employee for revision.');
  };

  const returnToManager = (reason?: string) => {
    setStatus('PENDING_MANAGER_REVIEW');
    setCurrentRole('MANAGER');
    logAction(
      'HR_ADMIN',
      'HR Talent Management',
      'Returned to Manager',
      reason || 'PDP was returned to Line Manager for revision.'
    );
    addToast('warning', 'Returned to Manager', 'PDP has been returned to Line Manager for revision.');
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
    field: 'activity' | 'trainingPath' | 'phase' | 'statusRemarks' | 'startDate' | 'endDate',
    value: string
  ) => {
    setRoadmapItems((prev) =>
      prev.map((r) => {
        if (r.competencyId !== competencyId) return r;
        const currentRows = ensureFiveSubRows(r.rows);

        const updatedRows = currentRows.map((row) => {
          if (row.rowNumber !== rowNumber) return row;
          if (field === 'phase') {
            const dateInfo = calculatePhaseDates(value, rowNumber, row.startDate);
            return {
              ...row,
              phase: dateInfo.duration,
              startDate: dateInfo.startDate,
              endDate: dateInfo.endDate,
              assignedDates: dateInfo.assignedDates,
            };
          }
          if (field === 'startDate') {
            const dateInfo = calculatePhaseDates(row.phase, rowNumber, value);
            const targetEndDate = row.endDate || dateInfo.endDate;
            return {
              ...row,
              startDate: value,
              endDate: targetEndDate,
              assignedDates: `From: ${value} To: ${targetEndDate}`,
            };
          }
          if (field === 'endDate') {
            const targetStartDate = row.startDate || '01/Jul/2026';
            return {
              ...row,
              endDate: value,
              assignedDates: `From: ${targetStartDate} To: ${value}`,
            };
          }
          return { ...row, [field]: value };
        });

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

  // 4 rows are mandatory (rows 1, 2, 3, 4), and the 5th row is optional
  const isManagerRoadmapComplete =
    roadmapItems.length === 5 &&
    roadmapItems.every((r) => {
      if (!r.rows || r.rows.length === 0) return false;
      const mandatoryRows = r.rows.filter((row) => row.rowNumber >= 1 && row.rowNumber <= 4);
      return (
        mandatoryRows.length === 4 &&
        mandatoryRows.every((row) => row.activity && row.activity.trim().length >= 5)
      );
    });

  const submitManagerRoadmap = () => {
    const incomplete = roadmapItems.filter((r) => {
      if (!r.rows || r.rows.length === 0) return true;
      const mandatoryRows = r.rows.filter((row) => row.rowNumber >= 1 && row.rowNumber <= 4);
      return (
        mandatoryRows.length !== 4 ||
        !mandatoryRows.every((row) => row.activity && row.activity.trim().length >= 5)
      );
    });
    if (incomplete.length > 0) {
      addToast(
        'error',
        'Incomplete Development Roadmap',
        `Please specify detailed Development Activities / Projects for Milestones 1–4 (*) across all 5 competencies (${incomplete.length} incomplete).`
      );
      return { success: false, error: 'All 5 competencies require development activities for Milestones 1–4 (*).' };
    }

    setStatus('PENDING_LNA_TEAM');
    setCurrentRole('LNA_TEAM');
    logAction(
      'MANAGER',
      employee.lineManager,
      'Development Roadmap Submitted to LNA',
      'Manager defined practical development activities across 5 milestones for all 5 competencies.'
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

  // 4 rows are mandatory (rows 1, 2, 3, 4), and the 5th row is optional
  const isLnaPlanComplete =
    roadmapItems.length === 5 &&
    roadmapItems.every((r) => {
      if (!r.rows || r.rows.length === 0) return false;
      const mandatoryRows = r.rows.filter((row) => row.rowNumber >= 1 && row.rowNumber <= 4);
      return (
        mandatoryRows.length === 4 &&
        mandatoryRows.every(
          (row) =>
            row.trainingPath &&
            row.trainingPath.trim().length >= 3 &&
            row.trainingPath !== 'Pending LNA Team'
        )
      );
    });

  const submitLnaPlan = () => {
    const incomplete = roadmapItems.filter((r) => {
      if (!r.rows || r.rows.length === 0) return true;
      const mandatoryRows = r.rows.filter((row) => row.rowNumber >= 1 && row.rowNumber <= 4);
      return (
        mandatoryRows.length !== 4 ||
        !mandatoryRows.every(
          (row) =>
            row.trainingPath &&
            row.trainingPath.trim().length >= 3 &&
            row.trainingPath !== 'Pending LNA Team'
        )
      );
    });
    if (incomplete.length > 0) {
      addToast(
        'error',
        'Incomplete Training Plan',
        `Please assign formal Learning & Training interventions for Training Paths 1–4 (*) across all 5 competencies (${incomplete.length} pending).`
      );
      return { success: false, error: 'All 5 competencies require learning and training programs for Training Paths 1–4 (*).' };
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
    setEmployeeDevelopmentThoughts(DEFAULT_EMPLOYEE_DEVELOPMENT_THOUGHTS);
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

      const selectedIndex = selectedIds.indexOf(c.id);
      const isSelected = (!isStage1 && !isStage2) && selectedIndex !== -1;
      const priorityRank = isSelected ? selectedIndex + 1 : undefined;
      const preset = COMPETENCY_4_ROW_PRESETS[c.id];
      const obj = isSelected ? (preset?.objective || '') : '';

      return {
        ...c,
        employeeEvaluation: empEval,
        managerEvaluation: mgrEval,
        isSelectedForPdp: isSelected,
        priorityRank,
        managerObjective: obj,
      };
    });

    const mockRoadmaps: DevelopmentRoadmapItem[] = (isStage1 || isStage2)
      ? []
      : selectedIds.map((id, rankIdx) => {
          const comp = mockCompetencies.find((c) => c.id === id)!;
          const preset = COMPETENCY_4_ROW_PRESETS[id] || {
            objective: '',
            rows: [
              { rowNumber: 1, activity: '', trainingPath: 'Pending LNA Team', phase: '6 Months', startDate: '01/Jul/2026', endDate: '31/Dec/2026', assignedDates: 'From: 01/Jul/2026 To: 31/Dec/2026', statusRemarks: 'Planned' },
              { rowNumber: 2, activity: '', trainingPath: 'Pending LNA Team', phase: '6 Months', startDate: '01/Jan/2027', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jan/2027 To: 30/Jun/2027', statusRemarks: 'Planned' },
              { rowNumber: 3, activity: '', trainingPath: 'Pending LNA Team', phase: '1 Year', startDate: '01/Jul/2026', endDate: '30/Jun/2027', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2027', statusRemarks: 'Planned' },
              { rowNumber: 4, activity: '', trainingPath: 'Pending LNA Team', phase: '2 Years', startDate: '01/Jul/2026', endDate: '30/Jun/2028', assignedDates: 'From: 01/Jul/2026 To: 30/Jun/2028', statusRemarks: 'Planned' },
            ],
          };

          const baseSubRows: RoadmapSubRow[] = preset.rows.map((r) => {
            const hasActivities = ['PDP_PLANNING_MANAGER', 'PENDING_LNA_TEAM', 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT', 'ACTIVE'].includes(targetStatus);
            const hasTraining = ['PENDING_EMPLOYEE_ACKNOWLEDGEMENT', 'ACTIVE'].includes(targetStatus);
            const dateInfo = calculatePhaseDates(r.phase, r.rowNumber, r.startDate);

            return {
              rowNumber: r.rowNumber,
              activity: hasActivities ? r.activity : '',
              trainingPath: hasTraining ? r.trainingPath : '',
              phase: dateInfo.duration,
              startDate: dateInfo.startDate,
              endDate: dateInfo.endDate,
              assignedDates: dateInfo.assignedDates,
              statusRemarks: targetStatus === 'ACTIVE' ? 'Active In-Progress' : (r.statusRemarks || 'Scheduled for 2026/27 Cycle'),
            };
          });

          const rows: RoadmapSubRow[] = ensureFiveSubRows(baseSubRows);

          return {
            competencyId: comp.id,
            code: comp.code,
            competencyName: comp.name,
            category: comp.category,
            priorityRank: rankIdx + 1,
            objective: comp.managerObjective || preset.objective || '',
            rows,
            developmentActivities: rows[0]?.activity || '',
            learningTrainingPlan: rows[0]?.trainingPath || 'Pending LNA Team',
            phaseMonths: '24 Months (5 Milestones)',
            statusRemarks: targetStatus === 'ACTIVE' ? 'Active In-Progress' : 'Scheduled for 2026/27 Cycle',
          };
        });

    setCompetencies(mockCompetencies);
    setRoadmapItems(mockRoadmaps);
    setEmployeeDevelopmentThoughts(DEFAULT_EMPLOYEE_DEVELOPMENT_THOUGHTS);
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

  const selectEmployeeForReview = (sub: TeamMemberSubmission, targetStatus?: PdpStatus) => {
    setEmployee(toEmployeeProfile(sub));
    const nextStatus = targetStatus || (sub.status === 'APPROVED' ? 'PENDING_HR_INITIATION' : 'PENDING_MANAGER_REVIEW');
    loadStagePreset(nextStatus);
    addToast('info', 'Employee Selected', `Loaded PDP review profile for ${sub.name}.`);
  };

  const updateManagerRemarks = (remarks: string) => {
    setManagerRemarks(remarks);
  };

  const addCommentMessage = (message: Omit<CommentMessage, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newMsg: CommentMessage = {
      id: `msg-${Date.now()}`,
      sender: message.sender,
      senderName: message.senderName,
      text: message.text,
      timestamp: message.timestamp || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '/'),
    };
    setCommentHistory((prev) => [...prev, newMsg]);
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
        employeeDevelopmentThoughts,
        updateEmployeeDevelopmentThoughts,
        managerRemarks,
        updateManagerRemarks,
        commentHistory,
        addCommentMessage,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        updateEmployeeEvaluation,
        resetEmployeeEvaluationForm,
        submitEmployeeEvaluation,
        updateManagerEvaluation,
        toggleCompetencySelection,
        updateCompetencyPriority,
        updateManagerObjective,
        submitManagerEvaluation,
        returnToEmployee,
        returnToManager,
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
        selectEmployeeForReview,
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
