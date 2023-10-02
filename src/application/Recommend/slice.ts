import { createSlice } from '@reduxjs/toolkit';

export interface recommendState {
  bannerList: unknown[];
  recommendList: unknown[];
}

const initialState: recommendState = {
  bannerList: [],
  recommendList: [],
};

export const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {
    updateBranchList: (state, { payload }) => {
      state.bannerList = payload || initialState.bannerList;
    },
    updateRecommendList: (state, { payload }) => {
      state.recommendList = payload || initialState.recommendList;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateBranchList, updateRecommendList } = recommendSlice.actions;

export default recommendSlice.reducer;
