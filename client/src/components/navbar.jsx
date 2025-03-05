import { useState } from "react";
import { FaSearch, FaVideo, FaBell } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import ytLogo from "../assets/yt-logo.png";
import userAvatar from "../assets/user-avatar.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Get tokens from localStorage (or sessionStorage)
    // let accessToken = localStorage.getItem("accessToken");
    let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjOTc3MTRlYjYxYzM0YTJjNDU2ZGQiLCJlbWFpbCI6ImpvaG4yQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJqb2huX2RvZTIiLCJmdWxsTmFtZSI6ImpvaG5fZG9lMjIiLCJpYXQiOjE3NDExOTIwOTgsImV4cCI6MTc0MTI3ODQ5OH0.o5QbbeZ4T_5TgT_zVRopzYttSixZaTMoypeUrJToq6A";
    // const refreshToken = localStorage.getItem("refreshToken");
    const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjOTc3MTRlYjYxYzM0YTJjNDU2ZGQiLCJpYXQiOjE3NDExOTIwOTgsImV4cCI6MTc0MjA1NjA5OH0.xHvz8dusu37i6A7YDGi50nvsKnLE8JkbZzRC9RXui-I";
  
    if (!accessToken) {
      alert("User not logged in. Please log in first.");
      return;
    }
  
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("videoFile", formData.videoFile);
    form.append("thumbnail", formData.thumbnail);
  
    try {
      let response = await fetch("http://localhost:8000/api/v1/videos/", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      // If token expired (401 Unauthorized), refresh it
      if (response.status === 401) {
        console.warn("Access token expired. Attempting to refresh...");
        const newAccessToken = await refreshAccessToken(refreshToken);
  
        if (newAccessToken) {
          accessToken = newAccessToken; // Update access token
          response = await fetch("http://localhost:8000/api/v1/videos/", {
            method: "POST",
            body: form,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        }
      }
  
      if (response.ok) {
        alert("Video uploaded successfully!");
        setFormData({ title: "", description: "", videoFile: null, thumbnail: null });
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <header
      className={`bg-gray-900 text-white flex items-center justify-between px-4 py-2 fixed top-0 z-50 shadow-md transition-all duration-300 ${
        isSidebarOpen ? "w-[calc(100%-14rem)]" : " w-[calc(100%-5rem)]"
      }`}
    >
      {/* Left: Sidebar Toggle & Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="text-xl focus:outline-none hover:text-gray-400"
        >
          <IoMenu className="text-black hover:text-gray-600" />
        </button>
        <img src={ytLogo} alt="YouTube" className="h-8 sm:h-10" />
      </div>

      {/* Middle: Search Bar */}
      <div className="hidden sm:flex items-center bg-gray-800 px-3 py-1 rounded-full w-96">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none w-full text-white px-2"
        />
        <button className="hover:text-gray-400">
          <FaSearch className="text-black hover:text-gray-600" />
        </button>
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center space-x-4">
        {/* Video Upload Modal Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="hidden sm:block text-xl hover:text-gray-400">
              <FaVideo className="text-white hover:text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Video</DialogTitle>
            </DialogHeader>
            {/* Video Upload Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Video Title"
                className="border p-2 rounded"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Video Description"
                className="border p-2 rounded"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              <input
                type="file"
                name="videoFile"
                className="border p-2 rounded"
                onChange={handleFileChange}
                required
              />
              {/* Thumbnail Upload Field */}
              <input
                type="file"
                name="thumbnail"
                className="border p-2 rounded"
                onChange={handleFileChange}
                required
              />
              <button type="submit" className="bg-blue-600 text-white py-2 rounded">
                Upload
              </button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Notifications */}
        <button className="text-xl hover:text-gray-400">
          <FaBell className="text-black hover:text-gray-600" />
        </button>

        {/* User Avatar */}
        <button className="text-black hover:text-gray-600">
          <img
            src={userAvatar}
            alt="User"
            className="h-6 w-6 rounded-full cursor-pointer"
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
