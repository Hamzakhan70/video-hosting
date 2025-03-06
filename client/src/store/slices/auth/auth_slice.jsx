import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = "http://localhost:8000/api/v1";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Registration failed");
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "Login failed");
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "auth/update",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/update-account`,
        credentials
      );
      toast.success("update successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message || "update failed");
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") ? localStorage.getItem("user") : null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshAccessToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("user"); // Clear from storage
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;

        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;

        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
