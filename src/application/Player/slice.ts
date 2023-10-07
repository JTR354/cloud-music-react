import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { playMode } from '../../api/config';
import { findIndex } from '../../api/utils';

export type PlayerState = {
  fullScreen: boolean; // 播放器是否为全屏模式
  playing: boolean; // 当前歌曲是否播放
  sequencePlayList: PlayerState['playList']; // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: PlayerState['currentSong'][];
  mode: number; // 播放模式
  currentIndex: number; // 当前歌曲在播放列表的索引位置
  showPlayList: boolean; // 是否展示播放列表
  currentSong: {
    id?: string | number;
    name?: string;
    al?: { picUrl: string };
    ar?: [{ name: string }];
    dt?: number;
  };
};

// import mock from './mock';

export const playerInitial: PlayerState = {
  fullScreen: false, // 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前歌曲在播放列表的索引位置
  showPlayList: false, // 是否展示播放列表
  currentSong: {},
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
    insertSong: (state, { payload }) => {
      const song = payload;
      const { currentIndex: index, playList, sequencePlayList } = state;
      let currentIndex = index;
      //看看有没有同款
      const fpIndex = findIndex(song, playList);
      // 如果是当前歌曲直接不处理
      if (fpIndex === currentIndex && currentIndex !== -1) return state;
      currentIndex++;
      // 把歌放进去,放到当前播放曲目的下一个位置
      playList.splice(currentIndex, 0, song);
      // 如果列表中已经存在要添加的歌
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          playList.splice(fpIndex, 1);
          currentIndex--;
        } else {
          playList.splice(fpIndex + 1, 1);
        }
      }
      let sequenceIndex =
        findIndex(playList[currentIndex], sequencePlayList) + 1;
      const fsIndex = findIndex(song, sequencePlayList);
      sequencePlayList.splice(sequenceIndex, 0, song);
      if (fsIndex > -1) {
        if (sequenceIndex > fsIndex) {
          sequencePlayList.splice(fsIndex, 1);
          sequenceIndex--;
        } else {
          sequencePlayList.splice(fsIndex + 1, 1);
        }
      }
      state.currentIndex = currentIndex;
      state.playList = playList;
      state.sequencePlayList = sequencePlayList;
    },
    deleteSong: (state, { payload: song }) => {
      const { playList, currentIndex: index, sequencePlayList } = state;
      let currentIndex = index;
      const fpIndex = findIndex(song, playList);
      playList.splice(fpIndex, 1);
      if (fpIndex < currentIndex) currentIndex--;

      const fsIndex = findIndex(song, sequencePlayList);
      sequencePlayList.splice(fsIndex, 1);

      state.currentIndex = currentIndex;
      state.playList = playList;
      state.sequencePlayList = sequencePlayList;
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
  insertSong,
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
    toggleShowPlayList(
      e: React.MouseEvent<HTMLElement, MouseEvent>,
      bool: boolean
    ) {
      e.stopPropagation();
      dispatch(changeShowPlayList(bool));
    },
  };
}

export default playerSlice.reducer;
