export interface User {
    userId: string;
    username: string;
    fullName: string;
  }
  
  export type ExamStatus = 'active' | 'completed' | 'pending';
  
  export interface Assessment {
    id: string;
    areaName: string;
    program: string;
    course: string;
    examStatus: ExamStatus;
    assessmentName: string;
    startDate: string;
    endDate: string;
    submissionIds: string[];
    area: string;
    group: string;
    examinee: string;
    users: User[];
    version: string;

  }
  
  export type SubmissionStatus =
  | "Completed"
  | "Pending"
  | "In Progress"
  | "Auto Locked"
  | "Manual Locked"
  | "Absent"
  | "Paper Submitted"
  | "Student Submission"
  | "Rescheduled"
  | "Cheating Suspected"
  | "pending";

export interface Submission {
  id: string;
  assessmentId: string;
  user: string; // originally a User object, now a full name string
  loginTime: string;
  started: boolean;
  questionSynced: number;
  timeElapsed: string;
  status: SubmissionStatus;
  areaName: string;
  groupName: string;
  version: string;
  questionsSolved: number;
  timeSpent: string;
  browser: string;
  packagesDetected: string;
  ips: string;
  offlineTime: string;
  connectionLoss: "Yes" | "No";
  overallSessionHealth: "Good" | "Fair" | "Poor" | "Not yet computed";
  statusScore: number;
  timersScore: number;
  logsScore: number;
  resultsScore: number;
  logs: {
    timestamp: string;
    event: string;
  }[];
  action: string;
  area: string;
  group: string;
  examinee: string;
}

  
  export interface Database {
    assessments: Assessment[];
    submissions: Submission[];
  }
  
  export interface SubmissionUpdate {
    questionSynced?: number;
    timeElapsed?: number;
    status?: SubmissionStatus;
    started?: boolean;
  }
  
  export class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApiError';
    }
  }