import { deletePlaylist, getPlaylistById } from "@/store/slices/playlist/playlistSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const PlaylistDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get playlist data from Redux
  const { playlists, loading, error } = useSelector((state) => state.playlist);

  useEffect(() => {
    dispatch(getPlaylistById(id)); // ✅ Fetch playlist on mount
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmed) return;

    const result = await dispatch(deletePlaylist(id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Playlist deleted successfully!");
      navigate("/playlists"); // ✅ Redirect after delete
    } else {
      toast.error("Failed to delete playlist");
    }
  };
  return (
    <div className="p-6">
      {loading ? (
        <p>Loading...</p>
      ) : playlists ? (
        <>
          <h2 className="text-2xl font-bold">{playlists.name}</h2>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2">
            Delete Playlist
          </button>

          <h3 className="mt-4 text-xl">Videos:</h3>
          <ul>
            {playlists?.videos?.map((video) => (
              <li key={video._id}>{video.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Playlist not found.</p>
      )}
    </div>
  
  );
};

export default PlaylistDetail;
