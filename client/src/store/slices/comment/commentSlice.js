import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/utils/axiosInstance";
// Get Comments for a Video
export const getVideoComments = createAsyncThunk(
  "comments/getVideoComments",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/comments/${videoId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a Comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ videoId, userId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        userId,
        content,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update a Comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/comments/${commentId}`, {
        text,
      });
      return response.data.comment;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a Comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ videoId, commentId }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/comments/${commentId}`);
      return { videoId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: {}, // Store comments by videoId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments[action.payload.videoId] = action.payload.comments;
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { video, content } = action.payload.data;
        if (state.comments[video]) {
          state.comments[video].unshift(content); // Add new comment to the beginning
        } else {
          state.comments[video] = [content];
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { videoId, commentId } = action.payload;
        if (state.comments[videoId]) {
          state.comments[videoId] = state.comments[videoId].filter(
            (comment) => comment._id !== commentId
          );
        }
      });
  },
});

export default commentSlice.reducer;
