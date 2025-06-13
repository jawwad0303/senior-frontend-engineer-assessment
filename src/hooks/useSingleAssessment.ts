import { useQuery } from '@tanstack/react-query';
import { fetchAssessmentById } from '@/api/mockApi';
import type { Assessment, ApiError } from '@/types/types';

interface SingleAssessmentQueryResult {
  data: Assessment | undefined;
  isLoading: boolean;
  error: ApiError | null;
}

export const useAssessment = (assessmentId: string): SingleAssessmentQueryResult => {
  const { data, isLoading, error } = useQuery<Assessment, ApiError>({
    queryKey: ['assessment', assessmentId],
    queryFn: () => fetchAssessmentById(assessmentId),
    enabled: !!assessmentId, 
    staleTime: 5 * 60 * 1000,
  });
  console.log("useAssessment", { assessmentId, data, isLoading, error });

  return {
    data,
    isLoading,
    error: error || null,
  };
};
