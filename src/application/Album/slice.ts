import { createSlice } from '@reduxjs/toolkit';

import { currentAlbumMock } from './mock';

export type AlbumTracksType = {
  name: string;
  ar: [{ name: string }, { name: string }];
  al: {
    name: string;
  };
};
export type AlbumType = {
  creator: {
    avatarUrl?: string;
    nickname?: string;
  };
  coverImgUrl?: string;
  subscribedCount?: number;
  name?: string;
  tracks: AlbumTracksType[];
};

type AlbumState = {
  currentAlbum: AlbumType;
};

const albumInitial: AlbumState = {
  currentAlbum: currentAlbumMock || { tracks: [], creator: {} },
};

const alumSlice = createSlice({
  name: 'album',
  initialState: albumInitial,
  reducers: {
    changeCurrentAlbum: (state, { payload }) => {
      state.currentAlbum = payload || albumInitial.currentAlbum;
    },
  },
});

export const { changeCurrentAlbum } = alumSlice.actions;

export default alumSlice.reducer;
