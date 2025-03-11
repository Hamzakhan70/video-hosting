import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createPlaylist = asyncHandler(async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validate input
    if (!name?.trim() || !description?.trim()) {
      return next(new ApiError(400, "Name and description are required"));
    }

    // Create playlist
    const playlist = await Playlist.create({
      name,
      description,
      owner: req.user._id, // Ensure only the user ID is stored
    });

    if (!playlist) {
      return next(new ApiError(500, "Failed to create playlist"));
    }

    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Internal server error"));
  }
});

const getUserPlaylists = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  //TODO: get user playlists
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, "Invalid user ID"));
  }
  try {
    const playlists = await Playlist.aggregate([
      {
        $match: { owner: new mongoose.Types.ObjectId(userId) },
      },
    ]);
    if (!playlists) {
      return next(401, "Error Fetching Playlist");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists Fechted Successfully!"));
  } catch (error) {
    next(new ApiError(500, error || "Internet Server Error"));
  }
});

const getPlaylistById = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return next(new ApiError(401, "Invalid Playlist ID"));
  }
  try {
    const playlist = await Playlist.findById(playlistId).populate("videos");
    if (!playlist) {
      return next(401, "Playlist not found in the database");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Fetched Playlist Successfully"));
  } catch (error) {
    next(new ApiError(500, error || "Internet Server Error"));
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return next(new ApiError(401, "Invalid playlist/video ID"));
  }
  try {
    // Check if the playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return next(new ApiError(404, "Playlist not found"));
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return next(new ApiError(404, "Video not found"));
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $addToSet: { videos: videoId },
      },
      { new: true }
    ).populate("videos");
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Video added to playlist successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internet Server Error"));
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res, next) => {
  const { id, videoId } = req.params;
  // TODO: remove video from playlist

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return next(new ApiError(401, "Invalid playlist/video ID"));
  }
  try {
    // Check if the playlist exists
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return next(new ApiError(404, "Playlist not found"));
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return next(new ApiError(404, "Video not found"));
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        $pull: { videos: videoId },
      },
      { new: true }
    ).populate("videos");
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internet Server Error"));
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return next(new ApiError(401, "Invalid playlist ID"));
  }
  try {
    // Check if the playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return next(new ApiError(404, "Playlist not found"));
    }
    // Delete the playlist
    await Playlist.findByIdAndDelete(playlistId);
    res.status(200).json(new ApiResponse(200, "Playlist deleted successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Internet Server Error"));
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return next(new ApiError(401, "Invalid playlist/video ID"));
  }
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {
        $set: { ...(name && { name }), ...(description && { description }) },
      },
      { new: true }
    );

    if (!updatedPlaylist) {
      return next(new ApiError(401, "Error Updating"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully")
      );
  } catch (error) {
    return next(new ApiError(500, error.message || "Internet Server Error"));
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
