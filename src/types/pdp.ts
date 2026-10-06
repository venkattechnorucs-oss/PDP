export type Role = 'EMPLOYEE' | 'MANAGER' | 'HR_ADMIN' | 'LNA_TEAM';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type CompetencyCategory = 'Functional' | 'Behavioural';

export type PdpStatus =
  | 'NOT_STARTED'
  | 'PENDING_EMPLOYEE_EVALUATION'
  | 'PENDING_MANAGER_REVIEW'
  | 'PENDING_HR_INITIATION'
  | 'PDP_PLANNING_MANAGER'
  | 'PENDING_LNA_TEAM'
  | 'PENDING_EMPLOYEE_ACKNOWLEDGEMENT'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'HR_VIEW';

export interface CompetencyItem {
  id: string;
  code: string;
  name: string;
  category: CompetencyCategory;
  description: string;
  idealProficiency: ProficiencyLevel;
  employeeEvaluation?: ProficiencyLevel;
  managerEvaluation?: ProficiencyLevel;
  isSelectedForPdp?: boolean;
  managerObjective?: string;
}

export interface RoadmapSubRow {
  rowNumber: number; // 1, 2, 3, 4
  activity: string;
  trainingPath: string;
  phase: string;
  startDate?: string;
  endDate?: string;
  assignedDates?: string;
  statusRemarks: string;
}

export interface DevelopmentRoadmapItem {
  competencyId: string;
  code: string;
  competencyName: string;
  category: CompetencyCategory;
  objective: string;
  rows: RoadmapSubRow[];
  // Backwards-compatible accessors
  developmentActivities?: string;
  learningTrainingPlan?: string;
  phaseMonths?: string;
  statusRemarks?: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  staffId: string;
  erpNo: string;
  grade: string;
  position: string;
  division: string;
  department: string;
  functionDept: string;
  lineManager: string;
  lineManagerTitle: string;
  dateOfJoining: string;
  serviceLength: string;
  programDuration: string;
  year: string;
  email: string;
  avatarInitials: string;
}

export interface CycleConfig {
  cycleYear: string;
  assessmentName: string;
  employeeDeadline: string;
  managerDeadline: string;
  lnaDeadline: string;
  targetGroup: string;
  isReleased: boolean;
  status: 'Draft' | 'Released' | 'Active' | 'Closed';
  releaseDate?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  role: Role;
  actor: string;
  action: string;
  details: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}
