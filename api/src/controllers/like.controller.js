import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return next(new ApiError(400, "Invalid video ID"));
    }
    try {
        const videoExists = await Video.findById(videoId);
        if (!videoExists) {
            return next(new ApiError(404, "Video not found"));
        }
        const existingLike = await Like.findOne({ video: videoId, likedBy: req.user._id });
        if (existingLike) {
            const unlikedVideo = await Like.findByIdAndDelete(existingLike._id);
            return res.status(200).json(new ApiResponse(200, unlikedVideo, "Video Unliked Successfully."))
        } else {
            const likedVideo = await Like.create({
                video: videoId, likedBy: req.user._id
            })
            return res.status(200).json(new ApiResponse(200, likedVideo, "Video Liked Succesfully."))
        }
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return next(new ApiError(400, "Invalid comment ID"));
    }
    try {
        const commentExists = await Comment.findById(commentId);
        if (!commentExists) {
            return next(new ApiError(404, "Comment not found"));
        }
        const existingComment = await Like.findOne({ comment: commentId, likedBy: req.user._id });
        if (existingComment) {
            const unlikedComment = await Like.findByIdAndDelete(existingComment._id);
            return res.status(200).json(new ApiResponse(200, unlikedComment, "Comment Unliked Successfully."))
        } else {
            const likedComment = await Like.create({
                comment: commentId, likedBy: req.user._id
            })
            return res.status(200).json(new ApiResponse(200, likedComment, "Comment Liked Succesfully."))
        }
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error"));
    }

})

const toggleTweetLike = asyncHandler(async (req, res, next) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        return next(new ApiError(400, "Invalid tweet ID"));
    }
    try {
        const tweetExists = await Tweet.findById(tweetId);
        if (!tweetExists) {
            return next(new ApiError(404, "Tweet not found"));
        }
        const existingTweet = await Tweet.findOne({ tweet: tweetId, likedBy: req.user._id });
        if (existingTweet) {
            const unlikedTweet = await Tweet.findByIdAndDelete(existingTweet._id);
            return res.status(200).json(new ApiResponse(200, unlikedTweet, "Tweet Unliked Successfully."))
        } else {
            const LikedTweet = await Like.create({
                tweet: tweetId, likedBy: req.user._id
            })
            return res.status(200).json(new ApiResponse(200, LikedTweet, "Comment Liked Succesfully."))
        }
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error"));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res, next) => {
    //TODO: get all liked videos
    try {
        const allVideos = await Like.aggregate([
            { $match: { likedBy: new mongoose.Types.ObjectId(req.user._id) } },
            { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
            { $unwind: "$videoDetails" },
            { $project: { videoDetails: 1, _id: 0 } }


        ])
        return res.status(200).json(
            new ApiResponse(200, allVideos, "All Liked Videos Fetched Successfully.")
        )
    } catch (error) {
        return next(new ApiError(500, error.message || "Internet Server Error"));
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}