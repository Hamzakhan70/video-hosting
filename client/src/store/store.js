// import { configureStore } from "@reduxjs/toolkit";
// import videoReducer from "./slices/video/video_slice";
// import sidebarReducer from "./slices/sidebar/sidebarSlice";
// import authReducer from "./slices/auth/auth_slice";

// import commentReducer from "./slices/comment/commentSlice";
// import likeReducer from "./slices/like/likeSlice";

// export const store = configureStore({
//   reducer: {
//     videos: videoReducer,
//     sidebar: sidebarReducer,
//     auth: authReducer,
//     comments: commentReducer,
//     likes: likeReducer,
//   },
// });
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import videoReducer from "./slices/video/video_slice";
import sidebarReducer from "./slices/sidebar/sidebarSlice";
import authReducer from "./slices/auth/auth_slice";
import commentReducer from "./slices/comment/commentSlice";
import likeReducer from "./slices/like/likeSlice";
import playlistReducer from "./slices/playlist/playlistSlice";
import subscriptionReducer from './slices/subscription/subscriptionSlice'
// 🔹 Persist Config for Auth State
const authPersistConfig = {
  key: "auth",
  storage,
};

// 🔹 Wrap Auth Reducer with PersistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// 🔹 Configure Redux Store
export const store = configureStore({
  reducer: {
    video: videoReducer,
    sidebar: sidebarReducer,
    auth: persistedAuthReducer, // Persisted Auth Reducer
    comments: commentReducer,
    likes: likeReducer,
    playlist:playlistReducer,
    subscription: subscriptionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows FormData and non-serializable values
    }),
});

// 🔹 Persistor to Rehydrate State
export const persistor = persistStore(store);
