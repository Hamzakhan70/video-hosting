import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
export default function UploadVideoPage() {
  const [videos, setVideos] = useState([]);


  useEffect(() => {
    let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjOTc3MTRlYjYxYzM0YTJjNDU2ZGQiLCJlbWFpbCI6ImpvaG4yQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huX2RvZTIiLCJmdWxsTmFtZSI6ImpvaG5fZG9lMjIiLCJpYXQiOjE3NDExOTIwOTgsImV4cCI6MTc0MTI3ODQ5OH0.o5QbbeZ4T_5TgT_zVRopzYttSixZaTMoypeUrJToq6A";
  
    axios.get("http://localhost:8000/api/v1/videos/?sortBy=views&sortType=asc", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then((res) => {
      console.log("API Response:", res.data.data.vides); // Check API response
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
        <img src={video.thumbnail} alt="Thumbnail" className="w-full h-20 object-cover mt-2" />
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
