import { useState } from "react";
import { FaHome, FaFire, FaPlay } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

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
        {/* Logo & Toggle Button */}
        {/* <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={toggleSidebar}
            className="p-2 text-xl focus:outline-none"
          >
            <IoMenu />
          </button>
          <span
            className={`${
              isOpen ? "block" : "hidden"
            } sm:block text-lg font-bold`}
          >
            YouTube
          </span>
        </div> */}

        {/* Navigation Menu */}
        <nav className="mt-2">
          <ul className="space-y-2 list-none">
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <FaHome className="text-xl" />
              {isOpen && <span className="ml-4 text-sm">Home</span>}
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <FaFire className="text-xl" />
              {isOpen && <span className="ml-4 text-sm">Trending</span>}
            </li>
            <li className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition">
              <FaPlay className="text-xl" />
              {isOpen && <span className="ml-4 text-sm">Subscriptions</span>}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
