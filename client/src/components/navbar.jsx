import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const { user } = useSelector((state) => {
    return state.auth;
  });
  const { loading } = useSelector((state) => {
    return state.video;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
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
      formDataObj.append("videoFile", formData.videoFile);
    }
    if (formData.thumbnail) {
      formDataObj.append("thumbnail", formData.thumbnail);
    }

    try {
      await dispatch(addNewVideo(formDataObj)).unwrap();
      toast.success("Video uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      document.getElementById("videoFile").value = "";
      document.getElementById("thumbnail").value = "";
      setIsOpen(false);
    } catch (error) {
      toast.error(`Error uploading video: ${error.message || "Unknown error"}`);
    }
  };

  const handleSearch = async () => {
    // try {
    //   const response = await fetch(
    //     `http://localhost:8000/api/v1/videos/?query=${query}&sortBy=views&sortType=asc`
    //   );
    //   const data = await response.json();
    //   if (response.ok) {
    //     setVideos(data.videos); // Update the video list
    //   } else {
    //     console.error("Error fetching videos:", data.message);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="hover:text-gray-400">
          <FaSearch
            className="text-white hover:text-gray-600"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center space-x-4">
        {/* Video Upload Modal Trigger */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <label htmlFor="title" className="font-medium text-white">
                  Video Title
                </label>
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
                <label htmlFor="description" className="font-medium text-white">
                  Video Description
                </label>
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
                <label htmlFor="videoFile" className="font-medium text-white">
                  Upload Video
                </label>
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
                <label htmlFor="thumbnail" className="font-medium text-white">
                  Upload Thumbnail
                </label>
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
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Notifications */}

        <button className="hidden bg-transparent sm:block text-xl hover:text-gray-400">
          <FaBell className="text-white " />
        </button>
        {/* Right: Profile Dropdown */}
        <DropdownMenu className="bg-slate-300">
          {/* Avatar Button (Trigger) */}
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer border border-gray-500">
              <AvatarImage
                src={userAvatar || "https://via.placeholder.com/40"}
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          {/* Dropdown Content */}
          <DropdownMenuContent align="end" className="text-black w-48">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <FaUser className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/userdashboard")}>
              <FaKey className="mr-2" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <FaCog className="mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:bg-red-100"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
