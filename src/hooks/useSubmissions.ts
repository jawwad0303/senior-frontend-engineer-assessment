// hooks/useSubmissions.ts
import { useQuery } from '@tanstack/react-query';
import { fetchSubmissionsByAssessmentId } from '@/api/mockApi';
import type { Submission } from '@/types/types';
import { ApiError } from '@/types/types';

interface SubmissionsQueryResult {
  data: Submission[] | undefined;
  isLoading: boolean;
  error: ApiError | null;
}

export const useSubmissions = (assessmentId: string | null): SubmissionsQueryResult => {
  const { data, isLoading, error } = useQuery<Submission[], ApiError>({
    queryKey: ['submissions', assessmentId],
    queryFn: async () => {
      if (!assessmentId) {
        throw new Error('Assessment ID is required');
      }
      return fetchSubmissionsByAssessmentId(assessmentId);
    },
    enabled: Boolean(assessmentId),
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });

  return {
    data,
    isLoading,
    error: error ?? null,
  };
};
