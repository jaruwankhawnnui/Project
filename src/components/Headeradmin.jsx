"use client";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ children }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(
          `http://172.31.0.1:1337/api/borrows?filters[status][$eq]=รอดำเนินการ`
        );
        if (response.ok) {
          const data = await response.json();
          setPendingCount(data.meta.pagination.total || 0);
        } else {
          console.error("Error fetching pending requests:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div>
      <nav className="bg-cyan-100 p-6 mb-4">
        <div className="max-w-screen-xl mx-2 flex items-center justify-between">
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
            <a href="/admin/dashboard" className="text-gray-700 hover:text-black">Dashboard</a>
            <a href="/admin/CreateCategory" className="text-gray-700 hover:text-black">Categories</a>
            <a href="/admin/year" className="text-gray-700 hover:text-black">ปีการศึกษา</a>
            <a href="/admin/cartadmin" className="text-gray-700 hover:text-black">อุปกรณ์</a>
            <a href="/admin/addwebnew" className="text-gray-700 hover:text-black">ข่าวสาร</a>
            <a href="/admin/addcontact" className="text-gray-700 hover:text-black">ข้อมูลการติดต่อ</a>
            <a href="/admin/Listadmin" className="text-gray-700 hover:text-black">รายการอุปกรณ์</a>
            
            {/* ✅ เพิ่มตัวเลขแจ้งเตือนสีแดงที่ "ยืม-คืนอุปกรณ์" */}
            <a href="/admin/check" className="relative text-gray-700 hover:text-black">
              ยืม-คืนอุปกรณ์
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {pendingCount}
                </span>
              )}
            </a>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
