import { useEffect, useState } from "react";
import { FaUser, FaKey, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaVideo, FaBell } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { IoMenu } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ytLogo from "../assets/yt-logo.png";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/auth/auth_slice";
import { addNewVideo } from "@/store/slices/video/video_slice";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const {  user } = useSelector((state) => {
    return state.auth;
  });
  const [userAvatar, setUserAvatar] = useState(""); // Store user avatar in state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const handleLogout = async () => {
    try {
      dispatch(logoutUser());
      toast.success("logout successful! 🚀");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "logout failed ❌");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file inputs properly
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files.length > 1 ? [...files] : files[0], // Handle multiple files
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    
    if (formData.videoFile) {
      if (Array.isArray(formData.videoFile)) {
        formData.videoFile.forEach((file) => formDataObj.append("videoFile", file));
      } else {
        formDataObj.append("videoFile", formData.videoFile);
      }
    }
    
    if (formData.thumbnail) {
      formDataObj.append("thumbnail", formData.thumbnail);
    }

    try {
      await dispatch(addNewVideo(formDataObj)).unwrap();
      toast.success("Video uploaded successfully!");
      
      // Reset form fields
      setFormData({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });

      // Reset file input fields manually
      document.getElementById("videoFile").value = "";
      document.getElementById("thumbnail").value = "";
      
    } catch (error) {
      toast.error(`Error uploading video: ${error.message || "Unknown error"}`);
    }
  };

  // Update userAvatar when user changes
  useEffect(() => {
    if (user) {
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      {/* Video Title */}
      <div className="flex flex-col">
        <label htmlFor="title" className="font-medium text-white">Video Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter video title"
          className="border p-2 rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Video Description */}
      <div className="flex flex-col">
        <label htmlFor="description" className="font-medium text-white">Video Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter video description"
          className="border p-2 rounded"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Video File Upload */}
      <div className="flex flex-col">
        <label htmlFor="videoFile" className="font-medium text-white">Upload Video</label>
        <input
          type="file"
          id="videoFile"
          name="videoFile"
          className="border p-2 rounded"
          onChange={handleFileChange}
          multiple // Allow multiple video uploads
          required
        />
      </div>

      {/* Thumbnail Upload */}
      <div className="flex flex-col">
        <label htmlFor="thumbnail" className="font-medium text-white">Upload Thumbnail</label>
        <input
          type="file"
          id="thumbnail"
          name="thumbnail"
          className="border p-2 rounded"
          onChange={handleFileChange}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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
                onClick={() => navigate("/userdashboard")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                <FaKey /> Dashboard
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
