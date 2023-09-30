import { createSlice } from '@reduxjs/toolkit';

export interface CounterState {
  bannerList: [];
  recommendList: [];
}

const initialState: CounterState = {
  bannerList: [],
  recommendList: [],
};

export const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {
    updateBranchList: (state, { payload }) => {
      state.bannerList = payload;
    },
    updateRecommendList: (state, { payload }) => {
      state.recommendList = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBranchList, updateRecommendList } = recommendSlice.actions;

export default recommendSlice.reducer;
