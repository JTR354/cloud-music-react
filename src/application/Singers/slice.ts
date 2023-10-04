import { createSlice } from '@reduxjs/toolkit';

export type SingerState = {
  singerList: { picUrl: string; name: string; accountId: number; id: number }[];
  enterLoading: boolean; //控制进场Loading
  pullUpLoading: boolean; //控制上拉加载动画
  pullDownLoading: boolean; //控制下拉加载动画
  pageCount: number; //这里是当前页数，我们即将实现分页功能
};
const initialState: SingerState = {
  singerList: [],
  enterLoading: false, //控制进场Loading
  pullUpLoading: false, //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  pageCount: 0, //这里是当前页数，我们即将实现分页功能
};

export const singerSlice = createSlice({
  name: 'singer',
  initialState,
  reducers: {
    changeSingerList: (state, { payload }) => {
      state.singerList = payload || initialState.singerList;
    },
    changeEnterLoading: (state, { payload }) => {
      state.enterLoading = payload || initialState.enterLoading;
    },
    changePullDownLoading: (state, { payload }) => {
      state.pullDownLoading = payload || initialState.pullDownLoading;
    },
    changePullUpLoading: (state, { payload }) => {
      state.pullUpLoading = payload || initialState.pullUpLoading;
    },
    changePageCount: (state, { payload }) => {
      state.pageCount = payload || initialState.pageCount;
    },
  },
});

export const {
  changeSingerList,
  changeEnterLoading,
  changePullDownLoading,
  changePullUpLoading,
  changePageCount,
} = singerSlice.actions;

export default singerSlice.reducer;
