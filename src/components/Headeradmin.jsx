"use client";

import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ children }) {
  return (
    <div>
      <nav className=" bg-cyan-100 p-6 mb-4">
        <div className=" max-w-screen-xl mx-2 flex items-center justify-between">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <img
              src="/logo/hw_web_logo.svg"
              width={200}
              height={60}
              alt="hw_web_logo"
              className="h-14"
            />
          </div>

          {/* Middle - Navigation Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <a href="/admin/" className="text-gray-700 hover:text-black">Billboard</a>
            <a href="/admin/CreateCategory" className="text-gray-700 hover:text-black">Categories</a>
            <a href="/admin/" className="text-gray-700 hover:text-black">ยืม-คืนอุปกรณ์</a>
            <a href="/admin/cartadmin" className="text-gray-700 hover:text-black">อุปกรณ์</a>
            <a href="/admin/addwebnew" className="text-gray-700 hover:text-black">ข่าวสาร</a>
            <a href="/admin/addcontact" className="text-gray-700 hover:text-black">ข้อมูลการติดต่อ</a>
            <a href="/admin/Listadmin" className="text-gray-700 hover:text-black">รายการอุปกรณ์</a>
            <a href="/admin/check" className="text-gray-700 hover:text-black">อนุมัติ</a>
          </div>

          
        </div>
      </nav>
      {children}
    </div>
  );
}
