import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id; // The logged-in user

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    return next(new ApiError(400, "Invalid channel ID"));
  }
  if (subscriberId.toString() === channelId) {
    return next(new ApiError(400, "You cannot subscribe to yourself"));
  }

  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });

    if (existingSubscription) {
      // Unsubscribe if already subscribed
      await Subscription.deleteOne({ _id: existingSubscription._id });
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Unsubscribed successfully"));
    }

    // Subscribe if not already subscribed
    const newSubscription = await Subscription.create({
      subscriber: subscriberId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, newSubscription, "Channel Liked Successfully.")
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internet Server Error"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res, next) => {
  const { channelId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    return next(new ApiError(400, "Invalid channel ID"));
  }

  try {
    const subscribers = await Subscription.find({ channel: channelId })
      .populate("subscriber", "name email avatar") // Populating subscriber details
      .select("subscriber createdAt"); // Only return necessary fields

    return res
      .status(200)
      .json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internal server error"));
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res, next) => {
  const { subscriberId } = req.params;

  try {
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
      .populate("channel", "name email avatar") // Populating channel details
      .select("channel createdAt"); // Only return necessary fields

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscriptions,
          "Subscribed channels fetched successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internal server error"));
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
