import { createSlice } from '@reduxjs/toolkit';

export type RankItem = {
  coverImgId: string;
  tracks: { first: string; second: string }[];
  updateFrequency: string;
  name: string;
  coverImgUrl: string;
};

export type RankState = {
  rankList: RankItem[];
};

const rankInitial: RankState = {
  rankList: [],
};

const rankSlice = createSlice({
  name: 'rank',
  initialState: rankInitial,
  reducers: {
    changeRankList: (state, { payload }) => {
      state.rankList = payload || rankInitial.rankList;
    },
  },
});

export const { changeRankList } = rankSlice.actions;

export default rankSlice.reducer;
