import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingFilters } from '@/types';

interface BookingState {
  filters: BookingFilters;
  selectedBookingId: string | null;
}

const initialState: BookingState = {
  filters: {
    page: 1,
    limit: 10,
  },
  selectedBookingId: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingFilters: (state, action: PayloadAction<Partial<BookingFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetBookingFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedBookingId: (state, action: PayloadAction<string | null>) => {
      state.selectedBookingId = action.payload;
    },
  },
});

export const { setBookingFilters, resetBookingFilters, setSelectedBookingId } = bookingSlice.actions;
export default bookingSlice.reducer;
