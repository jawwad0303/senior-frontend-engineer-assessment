import { useQuery } from '@tanstack/react-query';
import { fetchAssessments } from '@/api/mockApi';
import type { Assessment } from '@/types/types';
import { ApiError } from '@/types/types';

interface AssessmentsQueryResult {
  data: Assessment[] | undefined;
  isLoading: boolean;
  error: ApiError | null;
}

export const useAssessments = (): AssessmentsQueryResult => {
  const { data, isLoading, error } = useQuery<Assessment[], ApiError>({
    queryKey: ['assessments'],
    queryFn: fetchAssessments,
    staleTime: 5 * 60 * 1000, 
  });

  return {
    data,
    isLoading,
    error: error || null,
  };
};