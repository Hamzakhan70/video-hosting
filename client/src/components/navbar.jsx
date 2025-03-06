import { useEffect, useState } from "react";
import { FaUser, FaKey, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaVideo, FaBell } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ytLogo from "../assets/yt-logo.png";

import { useSelector } from "react-redux";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { accessToken, user } = useSelector((state) => {
    console.log(state.auth, "state.auth");
    return state.auth;
  });
  const [userAvatar, setUserAvatar] = useState(""); // Store user avatar in state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const handleLogout = () => {
    // Clear user data (update according to your auth state)
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
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

      if (response.ok) {
        alert("Video uploaded successfully!");
        setFormData({
          title: "",
          description: "",
          videoFile: null,
          thumbnail: null,
        });
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };
  // Update userAvatar when user changes
  useEffect(() => {
    if (user) {
      console.log(user, "user");
      setUserAvatar(user.avatar); // Set avatar if user exists
    }
  }, [user]); // Run when `user` changes

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
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded"
              >
                Upload
              </button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Notifications */}
        <button className="text-xl hover:text-gray-400">
          <FaBell className="text-black hover:text-gray-600" />
        </button>

        {/* Right: Profile Dropdown */}
        <div className="relative">
          <img
            src={userAvatar || "https://via.placeholder.com/40"}
            alt="User"
            className="h-8 w-8 rounded-full cursor-pointer border border-gray-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={() => navigate("/change-password")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                <FaKey /> Change Password
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                <FaCog /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-500 hover:text-white w-full text-left"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
