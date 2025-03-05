import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/video/video_slice";
import sidebarReducer from "./slices/sidebar/sidebarSlice";

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    sidebar: sidebarReducer,
  },
});
