import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res, next) => {
    //TODO: create tweet
    const { content } = req.body;
    if (!content) {
        return next(new ApiError(400, "Content is Required."))
    }
    try {
        const createdContent = await Tweet.create(
            {
                content,
                owner: req.user._id
            }
        )
        return res.status(200).json(
            new ApiResponse(200, createdContent, "Tweet Created Successfully.")
        )
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error."));
    }
})

const getUserTweets = asyncHandler(async (req, res, next) => {
    // TODO: get user tweets
    try {
        const userTweets = await Tweet.find({ owner: req.user._id })
            .populate("owner", "username email") // ✅ Fetch only necessary fields from User
            .select("_id content createdAt updatedAt owner") // ✅ Select only required tweet fields
            .lean(); // ✅ Convert Mongoose documents into plain JavaScript objects (better performance)

        return res.status(200).json(
            new ApiResponse(200, userTweets, "Tweet fetched Successfully.")
        )
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error."));
    }
})

const updateTweet = asyncHandler(async (req, res, next) => {
    //TODO: update tweet
    const { tweetId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return next(new ApiError(400, "Invalid video ID"));
    }
    const { content } = req.body;
    if (!content || content.trim() === "") {
        return next(new ApiError(400, "Content is Required."))
    }
    try {
        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId, {
            $set: { ...(content && { content }) }
        }, { new: true }
        )

        if (!updatedTweet) {
            return next(new ApiError(401, "Error Updating"));
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedTweet, "Tweet Updated Successfully")
            );
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error."));
    }
})

const deleteTweet = asyncHandler(async (req, res, next) => {
    const { tweetId } = req.params;
    // TODO: remove video from playlist
    if (
        !mongoose.Types.ObjectId.isValid(tweetId)
    ) {
        return next(new ApiError(401, "Invalid tweet ID"));
    }
    try {
        // Check if the playlist exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return next(new ApiError(404, "tweet not found"));
        }
        const deleteTweet = await Tweet.findByIdAndDelete(tweetId,
        )
        res
            .status(200)
            .json(
                new ApiResponse(
                    200,{},
                    "Tweet Deleted successfully"
                )
            );
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error"));
    }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
