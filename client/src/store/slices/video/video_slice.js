import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Fetch user data & videos
export const fetchVideos = createAsyncThunk("video/fetchData", async (userId) => {
  const response = await axiosInstance.get(`/videos?userId=${userId}`);
  return response.data;
});

// Add new video
export const addNewVideo = createAsyncThunk(
  "video/addVideo",
  async (formData, { rejectWithValue }) => {
    try {
      console.log(formData, "video data");

      const response = await axiosInstance.post("/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
console.log('this is response',response)
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const videoSlice = createSlice({
  name: "video",
  initialState: {
    videos: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.videos = action.payload?.data?.videos ?? [];
      }).addCase(fetchVideos.rejected, (state) => {
        state.loading = false; // ✅ Reset loading on failure
      })
      .addCase(addNewVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewVideo.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload, 'video.payload')
        state.videos = [...state.videos, action.payload];
      })
      .addCase(addNewVideo.rejected, (state) => {
        state.loading = false;
      });
  },
});


export default videoSlice.reducer;
