import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    tasks: taskReducer,
  },
  // Redux DevTools is enabled by default in development
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
