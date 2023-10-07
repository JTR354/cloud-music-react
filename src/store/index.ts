import { configureStore } from '@reduxjs/toolkit';

import album from '../application/Album/slice';
import player from '../application/Player/slice';
import rank from '../application/Rank/slice';
import recommend from '../application/Recommend/slice';
import singer from '../application/Singer/slice';
import singers from '../application/Singers/slice';

export const store = configureStore({
  reducer: {
    recommend,
    singers,
    rank,
    album,
    singer,
    player,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
