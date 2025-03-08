import { FaHome, FaFire, FaPlay,FaList } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`bg-gray-900 text-white h-screen fixed top-0 left-0 z-50 transition-all duration-300 ${
          isOpen ? "w-56 sm:w-56" : "w-20 sm:w-20"
        } sm:relative sm:z-10`}
      >
        {/* Navigation Menu */}
        <nav className="mt-2">
          <ul className="space-y-2 list-none">
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <Link
                to="/dashboard"
                className="text-white flex items-center p-3 hover:bg-gray-700 rounded-lg transition"
              >
                <FaHome className="text-xl" />
                {isOpen && <span className="ml-4 text-sm">Home</span>}
              </Link>
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <Link
                to="/dashboard"
                className="text-white flex items-center p-3 hover:bg-gray-700 rounded-lg transition"
              >
                <FaFire className="text-xl" />
                {isOpen && <span className="ml-4 text-sm">Trending</span>}
              </Link>
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <Link
                to="/subscription"
                className="text-white flex items-center p-3 hover:bg-gray-700 rounded-lg transition"
              >
                <FaPlay className="text-xl" />
                {isOpen && <span className="ml-4 text-sm">Subscriptions</span>}
              </Link>
            </li>
            {/* Playlist Section */}
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <Link to="/playlists" className="text-white flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
                <FaList className="text-xl" />
                {isOpen && <span className="ml-4 text-sm">Playlists</span>}
              </Link>
              </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
