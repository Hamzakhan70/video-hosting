import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

// Toggle Like on a Video
export const toggleVideoLike = createAsyncThunk(
  "likes/toggleVideoLike",
  async ({ videoId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
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
      return rejectWithValue(error.response?.data || "Something went wrong");
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
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Get Liked Videos
export const getLikedVideos = createAsyncThunk(
  "likes/getLikedVideos",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/likes/videos/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
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
      // Handle Toggle Video Like
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

      // Handle Toggle Comment Like
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Toggle Tweet Like
      .addCase(toggleTweetLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleTweetLike.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(toggleTweetLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Get Liked Videos
      .addCase(getLikedVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.loading = false;

        state.likedVideos = action.payload;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default likeSlice.reducer;
