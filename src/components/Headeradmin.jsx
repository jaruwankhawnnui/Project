"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { signOut } from "next-auth/react";


export default function Navbar({ children }) {
  const [pendingCount, setPendingCount] = useState(0);
  const router = useRouter();
  const currentPath = router.pathname; // ✅ ได้ค่า URL ปัจจุบัน

  useEffect(() => {
    // ดึงข้อมูลการขอยืมที่รอดำเนินการ
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch(
          `https://coe-hardware-lab-website-ievu.onrender.com/api/borrows?filters[status][$eq]=รอดำเนินการ`
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

  // ✅ ฟังก์ชันตรวจสอบว่าหน้าไหนถูกเลือก
  const isActive = (path) =>
    currentPath === path
      ? "bg-blue-600 text-white px-4 py-2 rounded-md shadow-md" // ✅ เปลี่ยนเป็นพื้นหลังน้ำเงินเข้ม
      : "text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md";

  return (
    <div>
      <nav className="bg-gradient-to-br from-cyan-100 to-[#6EC7E2] p-6 ">
        <div className="  flex items-center justify-between">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <img
              src="/logo/hw_web_logo.svg"
              width={300}
              height={60}
              alt="hw_web_logo"
              className="h-18"
            />
          </div>

          {/* Middle - Navigation Links */}
          <div className="hidden md:flex text-sm font-bold">
            <a href="/admin/dashboard" className={isActive("/admin/dashboard ")}>
              แดชบอร์ด
            </a>
            <a href="/admin/CreateCategory" className={isActive("/admin/CreateCategory")}>
              หมวดหมู่
            </a>
            <a href="/admin/year" className={isActive("/admin/year")}>
              ปีการศึกษา
            </a>
            <a href="/admin/cartadmin" className={isActive("/admin/cartadmin")}>
              อุปกรณ์
            </a>
            <a href="/admin/addwebnew" className={isActive("/admin/addwebnew")}>
              ข่าวสาร
            </a>
            <a href="/admin/addcontact" className={isActive("/admin/addcontact")}>
              ข้อมูลการติดต่อ
            </a>
            <a href="/admin/Listadmin" className={isActive("/admin/Listadmin")}>
              รายการอุปกรณ์
            </a>

            {/* ✅ เพิ่มตัวเลขแจ้งเตือนสีแดงที่ "ยืม-คืนอุปกรณ์" */}
            <a href="/admin/check" className={`relative ${isActive("/admin/check")}`}>
              ยืม-คืนอุปกรณ์
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {pendingCount}
                </span>
              )}
            </a>
          </div>

          {/* Right Side - Admin Role */}
          <div
            className="flex items-center text-white space-x-2 ml-12 border border-red-400 rounded-md px-4 py-2 shadow-md bg-red-500 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/auth/login" })} // ✅ Redirect ไปหน้า Login
          >
            <FaUserCircle className="text-4xl" />
            <span className="text-l font-bold">Logout ADMIN</span>
          </div>


        </div>

      </nav>
      {children}
    </div>
  );
}
