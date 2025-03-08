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
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/comments/c/${commentId}`, {
        content,
      });
      return response.data;
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
      await axiosInstance.delete(`comments/c/${commentId}`);
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
    totalComments: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVideoComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payload is an array
        const commentsArray = Array.isArray(action.payload)
          ? action.payload
          : [];

        // Group by videoId
        const groupedComments = {};
        const totalComments = {};
        commentsArray.forEach((comment) => {
          const videoId = comment.video;
          if (!groupedComments[videoId]) {
            groupedComments[videoId] = [];
            totalComments[videoId] = 0;
          }
          groupedComments[videoId].push(comment);
          totalComments[videoId] += 1;
        });

        // Replace state.comments with new grouped comments
        Object.keys(groupedComments).forEach((videoId) => {
          state.comments[videoId] = groupedComments[videoId];
          state.totalComments[videoId] = totalComments[videoId];
        });
      })
      .addCase(getVideoComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const newComment = action.payload.data; // Ensure this contains full comment object
        const videoId = newComment.video; // Get the video ID

        if (!state.comments[videoId]) {
          state.comments[videoId] = []; // Initialize array if not present
        }

        // Correct immutable update using a new array reference
        state.comments[videoId] = [newComment, ...state.comments[videoId]];
        // ✅ Update totalComments count
        state.totalComments[videoId] = (state.totalComments[videoId] || 0) + 1;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload.data; // Extract updated comment from payload
        const videoId = updatedComment.video; // Get the video ID from the updated comment
        // Ensure the video exists in the state
        if (state.comments[videoId]) {
          state.comments[videoId] = state.comments[videoId].map((comment) =>
            comment._id === updatedComment._id
              ? { ...comment, content: updatedComment.content }
              : comment
          );
        }
      })

      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { videoId, commentId } = action.payload;

        if (state.comments[videoId]) {
          // Remove the comment from the list
          state.comments[videoId] = state.comments[videoId].filter(
            (comment) => comment._id !== commentId
          );

          // Ensure totalComments count is updated safely
          if (state.totalComments[videoId]) {
            state.totalComments[videoId] = Math.max(
              0,
              state.totalComments[videoId] - 1
            );
          }
        }
      });
  },
});

export default commentSlice.reducer;
