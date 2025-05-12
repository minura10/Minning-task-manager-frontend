import { combineReducers, configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "../Services/AuthService";
import { userApi } from "../Services/UserService";
import { projectApi } from "../Services/ProjectService";
import { roomApi } from "../Services/RoomService";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice

    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(projectApi.middleware)
      .concat(roomApi.middleware),
});

setupListeners(store.dispatch);
