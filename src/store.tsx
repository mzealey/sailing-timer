import { configureStore } from "@reduxjs/toolkit";

import raceReducer from "./reducers/race";

export const store = configureStore({
  reducer: {
    race: raceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
