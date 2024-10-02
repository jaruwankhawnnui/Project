"use client";

import { FaUserCircle } from "react-icons/fa";

export default function Navbar({ children, session }) {
    return (
        <div>
            <nav className="bg-cyan-100 flex justify-between items-center px- p-4 mb-4">
                <div className="container mx-auto flex items-center justify-between py-4 px-6">
                    {/* Left Side - Logo */}
                    <div>
                        <img
                            src="/logo/hw_web_logo.svg"  width={200} height={60} alt="hw_web_logo"// Add your logo here
                            
                            className="h-10"
                        />
  
                    </div>

                    {/* Middle - Navigation Links */}
                    <div className="hidden md:flex space-x-8 font-medium">
                        <a href="/admin/addcontact" className="text-gray-700 hover:text-black">Billboard</a>
                        <a href="#" className="text-gray-700 hover:text-black">Categories</a>
                        <a href="#" className="text-gray-700 hover:text-black">ยืม-คืนอุปกรณ์</a>
                        <a href="#" className="text-gray-700 hover:text-black">อุปกรณ์</a>
                        <a href="#" className="text-gray-700 hover:text-black">Chat</a>
                        <a href="#" className="text-gray-700 hover:text-black">ข่าวสาร</a>
                        <a href="#" className="text-gray-700 hover:text-black">ข้อมูลการติดต่อ</a>
                    </div>

                    {/* Right Side - Profile Icon */}
                    <div className="flex items-center space-x-4">
                        <FaUserCircle size={30} className="text-black" />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
