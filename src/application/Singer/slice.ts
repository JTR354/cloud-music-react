import { createSlice } from '@reduxjs/toolkit';

export type SingerItemState = {
  artist: { name?: string; picUrl?: string; id?: number };
  songs: {
    id: string;
    name: string;
    ar: [{ name: string }];
    artists: [{ name: string }];
    al: { name: string };
    album: { name: string };
  }[];
};

const singerStateInitial: SingerItemState = {
  artist: {},
  songs: [],
};

const singerSlice = createSlice({
  name: 'singer',
  initialState: singerStateInitial,
  reducers: {
    changeArtist: (state, { payload }) => {
      state.artist = payload || singerStateInitial.artist;
    },
    changeSongs: (state, { payload }) => {
      state.songs = payload || singerStateInitial.songs;
    },
  },
});

export default singerSlice.reducer;

export const { changeArtist, changeSongs } = singerSlice.actions;
