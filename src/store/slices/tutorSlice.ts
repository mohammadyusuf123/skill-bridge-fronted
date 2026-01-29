import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TutorFilters } from '@/types';

interface TutorState {
  filters: TutorFilters;
  selectedTutorId: string | null;
}

const initialState: TutorState = {
  filters: {
    page: 1,
    limit: 12,
    sortBy: 'averageRating',
  },
  selectedTutorId: null,
};

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TutorFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedTutorId: (state, action: PayloadAction<string | null>) => {
      state.selectedTutorId = action.payload;
    },
  },
});

export const { setFilters, resetFilters, setSelectedTutorId } = tutorSlice.actions;
export default tutorSlice.reducer;
