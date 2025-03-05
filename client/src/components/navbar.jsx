import { FaSearch, FaVideo, FaBell } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import ytLogo from "../assets/yt-logo.png";
import userAvatar from "../assets/user-avatar.png";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
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
        <button className="hover:text-gray-400 ">
          <FaSearch className="text-black hover:text-gray-600" />
        </button>
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center space-x-4">
        <button className="hidden sm:block text-xl hover:text-gray-400">
          <FaVideo className="text-black hover:text-gray-600" />
        </button>
        <button className="text-xl hover:text-gray-400">
          <FaBell className="text-black hover:text-gray-600" />
        </button>
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
