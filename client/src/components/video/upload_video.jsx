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
import { toggleVideoLike } from "../../store/slices/like/likeSlice";
import axios from "axios";

export default function UploadVideoPage() {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const { accessToken, user } = useSelector((state) => state.auth);
  const comments = useSelector((state) => state.comments.comments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");

  // Fetch videos & their comments
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/videos/?sortBy=views&sortType=asc", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        const fetchedVideos = res.data?.data.videos || [];
        setVideos(fetchedVideos);
        fetchedVideos.forEach((video) => dispatch(getVideoComments(video._id)));
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, [accessToken, dispatch]);

  const handleLike = (videoId) => {
    dispatch(toggleVideoLike({ videoId, userId: user._id }));
  };

  const handleAddComment = (videoId) => {
    if (!newComment.trim()) return;
    dispatch(addComment({ videoId, userId: user._id, content: newComment }));
    setNewComment("");
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setUpdatedComment(comment.content);
  };

  const handleUpdateComment = (videoId, commentId) => {
    if (!updatedComment.trim()) return;
    dispatch(updateComment({ videoId, commentId, content: updatedComment }));
    setEditingComment(null);
    setUpdatedComment("");
  };

  const handleDeleteComment = (videoId, commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment({ videoId, commentId }));
    }
  };
  useEffect(() => {
    console.log(comments, "comment");
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
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
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
                        <strong>{comment.owner?.name}:</strong>{" "}
                        {comment.content}
                      </p>
                    )}
                    {comment.owner === user._id && (
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
                    )}
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
