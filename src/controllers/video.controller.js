import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res, next) => {
    // TODO: get video, upload to cloudinary, create video
    try {
        const { title, description } = req.body;

        // Validate required files
        const videoFile = req.files?.videoFile?.[0]?.path;
        const thumbnailFile = req.files?.thumbnail?.[0]?.path;

        if (!videoFile || !thumbnailFile) {
            throw new ApiError(400, "Video and Thumbnail files are required");
        }

        // Upload files to Cloudinary
        const [cloudinaryVideo, cloudinaryThumbnail] = await Promise.all([
            uploadOnCloudinary(videoFile),
            uploadOnCloudinary(thumbnailFile)
        ]);

        if (!cloudinaryVideo?.url || !cloudinaryThumbnail?.url) {
            throw new ApiError(500, "Failed to upload files to Cloudinary");
        }

        // Save video details in the database
        const videoData = await Video.create({
            title,
            description,
            videoFile: cloudinaryVideo.url,
            thumbnail: cloudinaryThumbnail.url,
            duration: cloudinaryVideo.duration,
            owner: req.user._id
        });

        return res.status(201).json(new ApiResponse(201, videoData, "Video published successfully"));

    } catch (error) {
        next(error); // Pass error to global error handler
    }
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
