import { createSlice } from '@reduxjs/toolkit';

const initialState = { input: '', brand: null };
const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    inputChanged(state, { payload }) {
      state.input = payload;
      state.brand = null;
    },
    brandSelected(state, { payload }) {
      state.brand = payload;
    },
  },
});

export const { inputChanged, brandSelected } = slice.actions;

export const searchReducer = slice.reducer;
