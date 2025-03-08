import { getUserPlaylists } from "@/store/slices/playlist/playlistSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Playlists = () => {
  const dispatch = useDispatch();

  // ✅ Get user ID from auth state
  const userId = useSelector((state) => state.auth.user?._id);
  const { playlists, loading, error } = useSelector((state) => state.playlist);

  useEffect(() => {
    if (userId) {
      dispatch(getUserPlaylists(userId)); // ✅ Pass userId to action
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <Link to="/playlists/create" className="bg-blue-500 text-white px-4 py-2 rounded">
        + Create Playlist
      </Link>

      <div className="mt-4">
        {loading ? (
          <p>Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <p>No playlists found.</p>
        ) : (
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist._id} className="border-b py-2">
                <Link to={`/playlist/${playlist._id}`} className="text-blue-600 hover:underline">
                  {playlist.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Playlists;
