import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
// Toggle Like on a Video
export const toggleVideoLike = createAsyncThunk(
  "likes/toggleVideoLike",
  async ({ videoId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`, {
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Toggle Like on a Comment
export const toggleCommentLike = createAsyncThunk(
  "likes/toggleCommentLike",
  async ({ commentId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/comments/${commentId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Toggle Like on a Tweet
export const toggleTweetLike = createAsyncThunk(
  "likes/toggleTweetLike",
  async ({ tweetId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tweets/${tweetId}/like`, {
        userId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Liked Videos
export const getLikedVideos = createAsyncThunk(
  "likes/getLikedVideos",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}/liked-videos`);
      return response.data.videos;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState: {
    likedVideos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.likedVideos = action.payload;
      });
  },
});

export default likeSlice.reducer;
