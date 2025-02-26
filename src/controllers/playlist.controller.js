import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
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
    console.log(playlists);
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
    const playlist = await Playlist.findById(playlistId);
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

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
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
