"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { FaBars, FaBell, FaSignOutAlt, FaThList, FaNewspaper, FaHome } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";
import { BsChatDotsFill } from "react-icons/bs";
import { TiShoppingCart } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { GrContactInfo } from "react-icons/gr";
import { RiFileListLine } from "react-icons/ri";
import Logout from "@/components/Logout";
import Link from 'next/link';

const MainHeader = ({ session }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [overdueItems, setOverdueItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchOverdueDevices = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `http://172.31.0.1:1337/api/borrows?filters[email][$eq]=${session.user.email}&filters[status][$eq]=เลยกำหนด&populate=*`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging API response

        const overdueList = data.data.map((item) => ({
          id: item.id,
          label: item.attributes.label,
          dueDate: item.attributes.Due,
        }));

        console.log("Overdue Items:", overdueList); // Debugging parsed data

        setOverdueItems(overdueList);
        setNotificationCount(overdueList.length);
      } catch (error) {
        console.error("Error fetching overdue devices:", error);
      }
    };

    fetchOverdueDevices();
  }, [session?.user?.email]);

  useEffect(() => {
    setNotificationCount(overdueItems.length);
  }, [overdueItems]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='bg-gradient-to-br from-cyan-100 to-[#6EC7E2] flex justify-between items-center px-6 p-4 mb-4 relative'>
      <div>
        <Image src="/logo/hw_web_logo.svg" width={300} height={60} alt="hw_web_logo" priority />
      </div>

      <div className='flex px-5 p-2 items-center gap-6'>
        <div>
          <BsChatDotsFill
            className='cursor-pointer h-6 w-7 text-gray-500'
            onClick={() => window.open("https://line.me/ti/g2/7AziMh5yNWFA4IFRKflrd5g5vYJTAp2hFJXBaw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default", "_blank")}
          />
        </div>

        <div>
          <SlGlobe className='cursor-pointer h-6 w-7 text-gray-500' />
        </div>

        {/* ไอคอนแจ้งเตือน + Badge แสดงตัวเลข */}
        <div className='relative'>
          <FaBell className='cursor-pointer h-6 w-7 text-gray-500' onClick={toggleDropdown} />
          {notificationCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1'>
              {notificationCount}
            </span>
          )}

          {/* Dropdown รายการที่เลยกำหนด */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50">
              <div className="p-4 text-gray-800 font-semibold border-b">
                รายการที่เลยกำหนด
              </div>
              {overdueItems.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {overdueItems.map((item) => (
                    <li key={item.id} className="p-2 border-b text-sm">
                      {item.label} - <span className="text-red-500">{new Date(item.dueDate).toLocaleDateString("th-TH")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">ไม่มีรายการเลยกำหนด</div>
              )}
            </div>
          )}
        </div>

        <FaBars className='cursor-pointer h-6 w-7 text-gray-500 mb:hidden' onClick={toggleMenu} />

        <div>
          {session ? (
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
              onClick={toggleMenu}
            />
          ) : (
            <Link href="/">
              <button className="bg-red-500 text-white flex items-center justify-center px-4 py-2 rounded-lg mx-auto">
                <FaSignOutAlt className="mr-2" /> ออกจากระบบ
              </button>

            </Link>
          )}
        </div>
      </div>

      {menuVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}
      <div className={`fixed right-0 top-0 h-full bg-white w-64 shadow-lg z-50 transform ${menuVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <ul className="p-4">
          <Link href="/homepage" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <FaHome className="mr-2" />
              หน้าแรก
            </li>
          </Link>

          <Link href="/cart" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <TiShoppingCart className="mr-2" />
              รถเข็น
            </li>
          </Link>

          <Link href="/equipment" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <FaThList className="mr-2" />
              ยืมอุปกรณ์
            </li>
          </Link>

          <Link href="/rentalinfo" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <CiBoxList className="mr-2" />
              แสดงข้อมูลการยืม
            </li>
          </Link>

          <Link href="/webnew" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <FaNewspaper className="mr-2" />
              ข่าวสารเว็บไซต์
            </li>
          </Link>

          <Link href="/contact" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <GrContactInfo className="mr-2" />
              ข้อมูลการติดต่อ
            </li>
          </Link>

          <Link href="/agreement" className="block">
            <li className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer">
              <RiFileListLine className="mr-2" />
              ข้อตกลงการใช้งาน
            </li>
          </Link>

          {/* Logout Button */}
          <li
            className="flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 cursor-pointer"
            onClick={Logout}
          >
            <FaSignOutAlt className="mr-2" />
            ออกจากระบบ
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainHeader;
