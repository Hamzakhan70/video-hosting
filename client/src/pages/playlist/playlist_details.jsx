import {
  deletePlaylist,
  getPlaylistById,
  removeVideoFromPlaylist,
} from "@/store/slices/playlist/playlistSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PlaylistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null); // State to hold the currently selected video
  // Get playlist data from Redux
  const { currentPlaylist, loading, error } = useSelector(
    (state) => state.playlist
  );

  useEffect(() => {
    dispatch(getPlaylistById(id)); // Fetch playlist on mount
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (!confirmed) return;

    const result = await dispatch(deletePlaylist(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Playlist deleted successfully!");
      navigate("/playlists"); // Redirect after delete
    } else {
      toast.error("Failed to delete playlist");
    }
  };

  const handleRemoveVideo = async (videoId) => {
    const result = await dispatch(removeVideoFromPlaylist({ id, videoId }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Video removed from playlist successfully!");
    } else {
      toast.error("Failed to remove video from playlist");
    }
  };

  const handlePlayVideo = (video) => {
    setSelectedVideo(video); // Set the selected video to play
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading...</p>
      ) : currentPlaylist ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{currentPlaylist.name}</h2>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Delete Playlist
          </button>
          <h3 className="mt-4 text-xl">Videos:</h3>
          <ul className="space-y-4">
            {currentPlaylist?.videos?.map((video) => (
              <li
                key={video._id}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex-1">
                  <h4
                    className="font-semibold text-lg cursor-pointer"
                    onClick={() => handlePlayVideo(video)}
                  >
                    {video.title}
                  </h4>
                  <p className="text-gray-600">{video.description}</p>
                  <p className="text-gray-500">Duration: {video.duration}</p>
                  <p className="text-gray-500">
                    Uploaded on:{" "}
                    {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Video Player */}
          {selectedVideo && (
            <div className="mt-6">
              <h3 className="text-xl font-bold">
                Now Playing: {selectedVideo.title}
              </h3>
              <video
                className="w-full mt-2 rounded-lg shadow-lg"
                controls
                src={selectedVideo.videoUrl} // Assuming videoUrl is the source of the video
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      ) : (
        <p>Playlist not found.</p>
      )}
    </div>
  );
};

export default PlaylistDetail;
