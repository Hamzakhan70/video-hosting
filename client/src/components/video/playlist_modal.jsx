import {
  addVideoToPlaylist,
  getUserPlaylists,
} from "@/store/slices/playlist/playlistSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const PlaylistModal = ({ videoId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Assuming your playlists are stored in state.playlist
  const { playlists } = useSelector((state) => state.playlist); // Assuming your playlists are stored in state.playlist
  useEffect(() => {
    // Fetch playlists when the modal is opened
    dispatch(getUserPlaylists(user._id));
  }, [dispatch]);
  const handleAddToPlaylist = (playlistId) => {
    dispatch(addVideoToPlaylist({ videoId, playlistId }));
    onClose(); // Close the modal after adding
  };

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-bold">Select a Playlist</h2>
        <ul>
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className="flex justify-between items-center p-2"
            >
              <span>{playlist.name}</span>
              <button
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="text-blue-500 hover:underline"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;
