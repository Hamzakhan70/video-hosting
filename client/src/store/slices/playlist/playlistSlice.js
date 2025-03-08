import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions
export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/playlist", playlistData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  "playlist/getUserPlaylists",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/playlist/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  "playlist/getPlaylistById",
  async (playlistId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/playlist/${playlistId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlist/addVideoToPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/api/playlists/${playlistId}/add`, { videoId });
      return { playlistId, video: data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  "playlist/removeVideoFromPlaylist",
  async ({ playlistId, videoId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/playlists/${playlistId}/remove/${videoId}`);
      return { playlistId, videoId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (playlistId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/playlist/${playlistId}`);
      return playlistId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlist/updatePlaylist",
  async ({ playlistId, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/playlists/${playlistId}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Playlist Slice
const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    playlists: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists.push(action.payload);
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Playlists
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        
        state.playlists = action.payload.data;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Playlist by ID
      .addCase(getPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload.data;
      })
      .addCase(getPlaylistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Video to Playlist
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(addVideoToPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const playlist = state.playlists.find((p) => p._id === action.payload.playlistId);
        if (playlist) {
          playlist.videos.push(action.payload.video);
        }
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Video from Playlist
      .addCase(removeVideoFromPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const playlist = state.playlists.find((p) => p._id === action.payload.playlistId);
        if (playlist) {
          playlist.videos = playlist.videos.filter((video) => video._id !== action.payload.videoId);
        }
      })
      .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        
        if (!Array.isArray(state.playlists)) {
            state.playlists = []; // Ensure it's an array
        }
        if (action.payload) {
            state.playlists = state.playlists.filter((p) => p._id !== action.payload);
        }
    })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.playlists[index] = action.payload;
        }
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;
