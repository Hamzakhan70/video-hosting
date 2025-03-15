import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res, next) => {
  try {
    // Destructure query parameters with defaults
    const {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;

    // Convert `page` and `limit` to numbers
    const pageNumber = Math.max(1, Number(page)); // Ensure it's at least 1
    const pageSize = Math.max(1, Number(limit)); // Ensure it's at least 1

    // Build the filter query
    let filter = {};

    // If a search query is provided, apply it to relevant fields (title, description)
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // If filtering by userId, add it to the filter object
    if (userId) {
      filter.owner = userId;
    }

    // Convert sort type to MongoDB format
    const sortOrder = sortType === "asc" ? 1 : -1;

    // Fetch videos with filtering, sorting, and pagination
    const videos = await Video.find(filter)
      .populate("owner", "username email avatar") // Populate owner details
      .sort({ [sortBy]: sortOrder }) // Dynamic sorting
      .skip((pageNumber - 1) * pageSize) // Skip for pagination
      .limit(pageSize); // Limit results

    // Get total count for pagination
    const totalVideos = await Video.countDocuments(filter);

    // Send response with pagination info
    res.status(200).json(
      new ApiResponse(
        200,
        {
          videos,
          pagination: {
            totalPages: Math.ceil(totalVideos / pageSize),
            currentPage: pageNumber,
            totalVideos,
          },
        },
        "Videos fetched successfully"
      )
    );
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
});

const publishAVideo = asyncHandler(async (req, res, next) => {
  // TODO: get video, upload to cloudinary, create video
  try {
    const { title, description } = req.body;
    console.log(req.body,'body')
    if (title.trim("") == "" || description.trim("") == "") {
      throw new ApiError(400, "Title and Description are required");
    }

    // Validate required files
    const videoFile = req.files?.videoFile?.[0]?.path;
    const thumbnailFile = req.files?.thumbnail?.[0]?.path;

    if (!videoFile || !thumbnailFile) {
      throw new ApiError(400, "Video and Thumbnail files are required");
    }

    console.log(title,description,videoFile,thumbnailFile)
    // Upload files to Cloudinary
    const [cloudinaryVideo, cloudinaryThumbnail] = await Promise.all([
      uploadOnCloudinary(videoFile),
      uploadOnCloudinary(thumbnailFile),
    ]);
    console.log(title,description,videoFile,cloudinaryVideo)

    if (!cloudinaryVideo?.url || !cloudinaryThumbnail?.url) {
      throw new ApiError(500, "Failed to upload files to Cloudinary");
    }
    // Save video details in the database
    const videoData = await Video.create({
      title: title.trim(""),
      description: description.trim(""),
      videoFile: cloudinaryVideo.url,
      thumbnail: cloudinaryThumbnail.url,
      duration: Math.round(cloudinaryVideo.duration),
      owner: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, videoData, "Video published successfully"));
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

const getVideoById = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId) {
    return next(new ApiError(400, "Video ID is required"));
  }

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return next(new ApiError(404, "Video not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
});

const updateVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0]?.path;

  if (!videoId) {
    return next(new ApiError(400, "Video ID is required"));
  }

  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
          ...(thumbnailFile && { thumbnail: thumbnailFile }), // Only update thumbnail if uploaded
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedVideo) {
      return next(new ApiError(404, "Video not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
});

const deleteVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    return next(new ApiError(400, "Video ID is required"));
  }

  try {
    const video = await Video.findByIdAndDelete(videoId);
    if (!video) {
      return next(new ApiError(404, "Video not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, video, "Video deleted successfully"));
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
});

const togglePublishStatus = asyncHandler(async (req, res, next) => {
  const { videoId } = req.params;

  if (!videoId) {
    return next(new ApiError(400, "Video ID is required"));
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return next(new ApiError(404, "Video not found"));
    }

    // Toggle subscription status
    video.isPublished = !video.isPublished;

    // Save the updated video
    await video.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          video,
          "Video subscription status updated successfully"
        )
      );
  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
