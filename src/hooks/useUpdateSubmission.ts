import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubmission } from '@/api/mockApi';
import type { Submission, SubmissionUpdate } from '@/types/types';
import { ApiError } from '@/types/types';

interface UpdateSubmissionMutation {
  submissionId: string;
  updates: SubmissionUpdate;
}
export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation<Submission, ApiError, UpdateSubmissionMutation>({
    mutationFn: ({ submissionId, updates }) => updateSubmission(submissionId, updates),
    onSuccess: (updatedSubmission) => {
      queryClient.setQueryData<Submission[]>(
        ['submissions', updatedSubmission.assessmentId],
        (old) =>
          old?.map((sub) =>
            sub.id === updatedSubmission.id ? updatedSubmission : sub
          ) ?? [updatedSubmission]
      );
    },
    onError: (error) => {
      console.error('Submission update failed:', error.message);
    },
  });
};

