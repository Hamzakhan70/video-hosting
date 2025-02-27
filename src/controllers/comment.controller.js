import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res, next) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new ApiError(400, "Invalid video ID."));
  }
  page = Math.max(1, Number(page));
  limit = Math.max(1, parseInt(limit));

  try {
    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
      return next(new ApiError(404, "Video not found"));
    }
    // Fetch total count of comments for pagination
    const totalComments = await Comment.countDocuments({ video: videoId });

    // Fetch comments with pagination & sorting
    const comments = await Comment.find({ video: videoId })
      .populate("owner", "name email") // Fetch user details
      .sort({ createdAt: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json(
      new ApiResponse(200, comments, "Comments retrieved successfully", {
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
        perPage: limit,
      })
    );
  } catch (error) {
    next(new ApiError(500, error.message || "Internet Server Error."));
  }
});

const addComment = asyncHandler(async (req, res, next) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return next(new ApiError(400, "Invalid video ID."));
  }
  if (!content || content.trim() === "") {
    return next(new ApiError(400, "Comment content is required."));
  }
  try {
    const searchedVideoId = await Video.findById(videoId);
    if (!searchedVideoId) {
      return next(new ApiError(404, "Video not found"));
    }

    const comment = await Comment.create({
      content,
      video: videoId,
      owner: req.user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment Added Successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Internet Server Error."));
  }
});

const updateComment = asyncHandler(async (req, res, next) => {
  // TODO: update a comment

  const { content } = req.body;
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return next(new ApiError(400, "Invalid comment ID"));
  }
  if (!content || content.trim() === "") {
    return next(new ApiError(400, "Comment content is required."));
  }
  try {
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return next(new ApiError(404, "Comment not found."));
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { ...(content && { content }) } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully.")
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internal server error."));
  }
});

const deleteComment = asyncHandler(async (req, res, next) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return next(new ApiError(400, "Invalid video ID."));
  }
  try {
    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(new ApiError(404, "Comment not found"));
    }
    // Delete the playlist
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Internet Server Error."));
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };
