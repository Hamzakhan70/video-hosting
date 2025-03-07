import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./slices/video/video_slice";
import sidebarReducer from "./slices/sidebar/sidebarSlice";
import authReducer from "./slices/auth/auth_slice";

import commentReducer from "./slices/comment/commentSlice";
import likeReducer from "./slices/like/likeSlice";

export const store = configureStore({
  reducer: {
    videos: videoReducer,
    sidebar: sidebarReducer,
    auth: authReducer,
    comments: commentReducer,
    likes: likeReducer,
  },
});
