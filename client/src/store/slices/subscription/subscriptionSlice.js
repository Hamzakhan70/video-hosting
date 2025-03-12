import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch subscribed channels for a user
export const fetchSubscribedChannels = createAsyncThunk(
  "subscription/fetchSubscribedChannels",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subscriptions/u/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// Fetch subscribers of a channel
export const fetchSubscribers = createAsyncThunk(
  "subscription/fetchSubscribers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/channel/c/${channelId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// Toggle subscription (Subscribe/Unsubscribe)
export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/subscriptions/c/${channelId}`
      );
      return { channelId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle subscription"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscribedChannels: [],
    subscribers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Subscribed Channels
      .addCase(fetchSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload;
      })
      .addCase(fetchSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Subscribers
      .addCase(fetchSubscribers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload;
      })
      .addCase(fetchSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle Subscription
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const { channelId } = action.payload;
        if (state.subscribedChannels.includes(channelId)) {
          state.subscribedChannels = state.subscribedChannels.filter(
            (id) => id !== channelId
          );
        } else {
          state.subscribedChannels.push(channelId);
        }
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
