import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (name.trim("") == "" || description.trim("") == "") {
    return next(new ApiError(401, "name and description are required"));
  }
  try {
    const owner = req.user;

    const playlist = await Playlist.create({
      name,
      description,
      videos,
      owner,
    });
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

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    next(new ApiError(500, error.message || "Internal server error"));
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res,next) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
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
