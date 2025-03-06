import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useSelector } from "react-redux";

export default function UploadVideoPage() {
  const [videos, setVideos] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/videos/?sortBy=views&sortType=asc", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setVideos(res.data?.data.videos || []); // Ensure it's an array
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {videos?.length > 0 ? (
          videos.map((video) => (
            <Card key={video.id} className="p-4">
              <CardContent>
                <video src={video.url} controls className="w-full h-40" />
                <img
                  src={video.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-20 object-cover mt-2"
                />
                <h3 className="font-semibold mt-2">{video.title}</h3>
                <p className="text-gray-600 text-sm">{video.description}</p>
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
