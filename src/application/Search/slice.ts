import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  getHotKeyWordsRequest,
  getResultSongsListRequest,
  getSongDetailRequest,
  getSuggestListRequest,
} from '../../api/request';
import { AlbumType } from '../Album/slice';
import { insertSong } from '../Player/slice';

export type SearchState = {
  hotList: { first: string }[];
  suggestList: {
    artists?: { accountId: string; id: string; picUrl: string; name: string }[];
    playlists?: {
      accountId: string;
      id: string;
      coverImgUrl: string;
      name: string;
    }[];
  };
  songsList: AlbumType[];
  enterLoading: boolean;
};

const searchInitial: SearchState = {
  hotList: [],
  suggestList: {},
  songsList: [],
  enterLoading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState: searchInitial,
  reducers: {
    changeHotKeyWords: (state, { payload }) => {
      state.hotList = payload;
    },
    changeSuggestList: (state, { payload }) => {
      state.suggestList = payload;
    },
    changeResultSongs: (state, { payload }) => {
      state.songsList = payload;
    },
    changeEnterLoading: (state, { payload }) => {
      state.enterLoading = payload;
    },
  },
});

export const {
  changeHotKeyWords,
  changeSuggestList,
  changeEnterLoading,
  changeResultSongs,
} = searchSlice.actions;

export default searchSlice.reducer;

export function useSearchDispatch() {
  const dispatch = useDispatch();

  return {
    changeEnterLoadingDispatch(bool: SearchState['enterLoading']) {
      dispatch(changeEnterLoading(bool));
    },
    getSuggestListDispatch(query: string) {
      getSuggestListRequest(query).then((data) => {
        if (!data) return;
        const res = data.result || [];
        dispatch(changeSuggestList(res));
      });
      getResultSongsListRequest(query).then((data) => {
        if (!data) return;
        const res = data.result.songs || [];
        dispatch(changeResultSongs(res));
        dispatch(changeEnterLoading(false));
      });
    },
    getSongDetailDispatch(id: string) {
      getSongDetailRequest(id).then((data) => {
        const song = data.songs[0];
        dispatch(insertSong(song));
      });
    },
    getHotKeyWordsDispatch() {
      getHotKeyWordsRequest().then((data) => {
        const list = data.result.hots;
        dispatch(changeHotKeyWords(list));
      });
    },
  };
}
