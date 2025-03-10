import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaTrash, FaEdit } from "react-icons/fa";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../../store/slices/comment/commentSlice";
import {
  getLikedVideos,
  toggleVideoLike,
} from "../../store/slices/like/likeSlice";

import axios from "axios";

export default function UploadVideoPage() {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const { likes } = useSelector((state) => state.likes);
  const { accessToken, user } = useSelector((state) => state.auth);
  const { comments, totalComments } = useSelector((state) => state.comments);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");

  // Fetch videos & their comments
  useEffect(() => {
    if (!user?._id) return;

    axios
      .get("http://localhost:8000/api/v1/videos/?sortBy=views&sortType=asc", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(async (res) => {
        const fetchedVideos = res.data?.data.videos || [];

        // Fetch comments for each video
        fetchedVideos.forEach((video) => dispatch(getVideoComments(video._id)));

        // Fetch liked videos
        const likedVideos = await dispatch(getLikedVideos(user._id)).unwrap();

        // Update `isLiked` based on the liked videos
        const updatedVideos = fetchedVideos.map((video) => ({
          ...video,
          isLiked: likedVideos.data?.some((likedVideo) => {
            const a = likedVideo.videoDetails._id === video._id;
            return a;
          }),
          // Check if video is in likedVideos
        }));

        setVideos(updatedVideos);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, [accessToken, dispatch, user?._id]);

  const handleLike = async (videoId) => {
    try {
      const response = await dispatch(toggleVideoLike({ videoId })).unwrap();

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, isLiked: !video.isLiked } : video
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = (videoId) => {
    if (!newComment[videoId].trim()) return;
    dispatch(
      addComment({ videoId, userId: user._id, content: newComment[videoId] })
    );
    // Clear only the comment for this specific video
    setNewComment((prev) => ({ ...prev, [videoId]: "" }));
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setUpdatedComment(comment.content);
  };

  const handleUpdateComment = (videoId, commentId) => {
    if (!updatedComment.trim()) return;
    dispatch(updateComment({ commentId, content: updatedComment }));
    setEditingComment(null);
    setUpdatedComment("");
  };

  const handleDeleteComment = (videoId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment({ videoId, commentId }));
    }
  };
  useEffect(() => {
    console.log(likes, "likes");
  }, []);
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <Card key={video._id} className="p-4">
              <CardContent>
                {video.videoFile ? (
                  <video
                    src={video.videoFile}
                    controls
                    className="w-full h-40 object-cover rounded-md"
                  />
                ) : (
                  <img
                    src={video.thumbnail || "/default-thumbnail.jpg"}
                    alt="Video Thumbnail"
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                <h3 className="font-semibold mt-2">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.description}</p>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(video._id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                  >
                    {video.isLiked ? (
                      <AiFillLike className="text-blue-500" />
                    ) : (
                      <AiOutlineLike />
                    )}
                    {video.likes}
                  </button>

                  <button
                    onClick={() => handleLike(video._id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
                  >
                    <FaRegComment /> {totalComments[video._id] || 0}
                  </button>
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={newComment[video._id] || ""}
                    onChange={(e) =>
                      setNewComment((prev) => ({
                        ...prev,
                        [video._id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment..."
                    className="border px-2 py-1 w-full rounded"
                  />
                  <button
                    onClick={() => handleAddComment(video._id)}
                    className="mt-1 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Comment
                  </button>
                </div>

                {comments[video._id]?.map((comment) => (
                  <div key={comment._id} className="mt-2 flex justify-between">
                    {editingComment === comment._id ? (
                      <>
                        <input
                          type="text"
                          value={updatedComment}
                          onChange={(e) => setUpdatedComment(e.target.value)}
                          className="border px-2 py-1 w-full rounded"
                        />
                        <button
                          onClick={() =>
                            handleUpdateComment(video._id, comment._id)
                          }
                          className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-700">
                        <strong>
                          {comment.owner?.username || user.username}:
                        </strong>{" "}
                        {comment.content}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteComment(video._id, comment._id)
                        }
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No videos found</p>
        )}
      </div>
    </div>
  );
}
