import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createPlaylist } from "@/store/slices/playlist/playlistSlice";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.playlist);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Playlist name is required");
      return;
    }

    try {
      const resultAction = await dispatch(createPlaylist({ name, description }));

      if (createPlaylist.fulfilled.match(resultAction)) {
        toast.success("Playlist created successfully!");
        navigate("/playlists"); // Redirect to playlist page
      } else {
        throw new Error(resultAction.payload || "Failed to create playlist");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Create Playlist</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-2/5"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-2/5"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 w-2/5"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CreatePlaylist;
