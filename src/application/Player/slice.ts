import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { playMode } from '../../api/config';

export type PlayerState = {
  fullScreen: boolean; // 播放器是否为全屏模式
  playing: boolean; // 当前歌曲是否播放
  sequencePlayList: []; // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: PlayerState['currentSong'][];
  mode: number; // 播放模式
  currentIndex: number; // 当前歌曲在播放列表的索引位置
  showPlayList: number; // 是否展示播放列表
  currentSong: {
    id?: string | number;
    name?: string;
    al?: { picUrl?: string };
    ar?: [{ name?: string }];
    dt?: number;
  };
};

import mock from './mock';

export const playerInitial = {
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: mock.playList,
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: mock.playList[0],
};

const playerSlice = createSlice({
  name: 'player',
  initialState: playerInitial,
  reducers: {
    changeCurrentSong: (state, { payload }) => {
      state.currentSong = payload;
    },
    changeFullScreen: (state, { payload }) => {
      state.fullScreen = payload;
    },
    changePlayingState: (state, { payload }) => {
      state.playing = payload;
    },
    changeSequencePlayList: (state, { payload }) => {
      state.sequencePlayList = payload;
    },
    changePlayList: (state, { payload }) => {
      state.playList = payload;
    },
    changePlayMode: (state, { payload }) => {
      state.mode = payload;
    },
    changeCurrentIndex: (state, { payload }) => {
      state.currentIndex = payload;
    },
    changeShowPlayList: (state, { payload }) => {
      state.showPlayList = payload;
    },
  },
});

export const {
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changeSequencePlayList,
  changePlayList,
  changePlayMode,
  changeCurrentIndex,
  changeShowPlayList,
} = playerSlice.actions;

export function usePlayerHandler() {
  const dispatch = useDispatch();

  return {
    dispatch,
    toggleFullScreen(fullScreen: PlayerState['fullScreen']) {
      dispatch(changeFullScreen(fullScreen));
    },
    clickPlaying(
      e: React.MouseEvent<HTMLElement, MouseEvent>,
      playing: PlayerState['playing']
    ) {
      e.stopPropagation();
      dispatch(changePlayingState(playing));
    },
  };
}

export default playerSlice.reducer;
