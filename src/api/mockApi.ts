import type { Database, Assessment, Submission, SubmissionUpdate } from '@/types/types';
import { ApiError } from '@/types/types';
import db from '../data/data.json';

const database: Database = db as Database;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchAssessments = async (): Promise<Assessment[]> => {
  try {
    await delay(500);
    return database.assessments;
  } catch (error) {
    throw new ApiError('Failed to fetch assessments');
  }
};

export const fetchAssessmentById = async (id: string): Promise<Assessment> => {
  try {
    await delay(500);
    const assessment = database.assessments.find((a) => a.id === id);
    console.log("fetchAssessmentById", { id, assessment });
    if (!assessment) {
      throw new ApiError(`Assessment with ID ${id} not found`);
    }
    return assessment;
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to fetch assessment');
  }
};

export const fetchSubmissionsByAssessmentId = async (
  assessmentId: string
): Promise<Submission[]> => {
  try {
    await delay(500);
    const submissions = database.submissions.filter((s) => s.assessmentId === assessmentId);
    return submissions;
  } catch (error) {
    throw new ApiError('Failed to fetch submissions');
  }
};

export const updateSubmission = async (
  submissionId: string,
  updates: SubmissionUpdate
): Promise<Submission> => {
  try {
    await delay(500);
    const index = database.submissions.findIndex((s) => s.id === submissionId);
    if (index === -1) {
      throw new ApiError(`Submission with ID ${submissionId} not found`);
    }
    const updatedSubmission = { 
      ...database.submissions[index], 
      ...updates, 
      timeElapsed: String(updates.timeElapsed ?? database.submissions[index].timeElapsed) 
    };
    database.submissions[index] = updatedSubmission;
    return updatedSubmission;
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Failed to update submission');
  }
};

// Simulate real-time updates with polling
export const subscribeToSubmissionUpdates = (
  assessmentId: string,
  callback: (submissions: Submission[]) => void
): (() => void) => {
  const interval = setInterval(() => {
    const submissions = database.submissions.filter((s) => s.assessmentId === assessmentId);
    callback(submissions);
  }, 5000);
  return () => clearInterval(interval);
};