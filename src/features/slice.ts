import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AssessmentState {
  currentAssessmentId: string | null;
}

const initialState: AssessmentState = {
  currentAssessmentId: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentAssessmentId(state, action: PayloadAction<string | null>) {
      state.currentAssessmentId = action.payload;
    },
  },
});

export const { setCurrentAssessmentId } = assessmentSlice.actions;
export default assessmentSlice.reducer;