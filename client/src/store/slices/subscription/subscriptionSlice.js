import axiosInstance from "@/utils/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch subscribed channels for a user
export const getSubscribedChannels = createAsyncThunk(
  "subscription/getSubscribedChannels",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subscriptions/c/${channelId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);

// Fetch subscribers of a channel
export const getUserChannelSubscribers = createAsyncThunk(
  "subscription/getUserChannelSubscribers",
  async (subscriberId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/subscriptions/u/${subscriberId}`
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
      .addCase(getSubscribedChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribedChannels = action.payload;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Subscribers
      .addCase(getUserChannelSubscribers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload;
      })
      .addCase(getUserChannelSubscribers.rejected, (state, action) => {
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

        // Find if the channel is already subscribed
        const index = state.subscribedChannels.findIndex(
          (sub) => sub.channel?._id === channelId
        );

        if (index !== -1) {
          // Unsubscribe (Remove from array)
          state.subscribedChannels.splice(index, 1);
        } else {
          // Subscribe (Add to array)
          state.subscribedChannels.push({ channel: { _id: channelId } });
        }
      })

      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;
