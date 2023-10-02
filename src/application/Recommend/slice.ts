import { createSlice } from '@reduxjs/toolkit';

import { ListPropType } from '../../components/list';
import { SliderPropType } from '../../components/slider';

export type recommendState = ListPropType & SliderPropType;

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
