"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { FaBars, FaBell, FaSignOutAlt, FaThList, FaNewspaper, FaHome } from "react-icons/fa";
import { SlGlobe } from "react-icons/sl";
import { BsChatDotsFill } from "react-icons/bs";
import { IoSearchCircleSharp, IoChatboxEllipsesSharp } from 'react-icons/io5';
import { TiShoppingCart } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { MdOutlinePostAdd } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import { RiFileListLine } from "react-icons/ri";
import Logout from "@/components/Logout";
import Link from 'next/link';

const MainHeader = ({ session }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Mock function to simulate search
  const searchDevices = (term) => {
    const devices = [
      "Computer",
      "Laptop",
      "Mouse",
      "Keyboard",
      "Monitor",
      "Printer",
      "Scanner",

      "Webcam",
      "Headphones",
    ];
    return devices.filter(device => device.toLowerCase().includes(term.toLowerCase()));
  };

  useState(() => {
    if (searchTerm) {
      const results = searchDevices(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className='bg-cyan-100 flex justify-between items-center px-6 p-4 mb-4'>
      <div>
        <Image src="/logo/hw_web_logo.svg" width={200} height={60} alt="hw_web_logo" />
      </div>
      <div className='flex border p-3 rounded-lg bg-white h-10 items-center px-4'>
        <input
          type='text'
          placeholder='Search devices...'
          value={searchTerm}
          onChange={handleSearch}
          className='bg-transparent w-full outline-none text-gray-700'
        />
        <IoSearchCircleSharp className='h-9 w-8 text-gray-500' />
      </div>
      <div className='flex px-5 p-2 items-center gap-6'>
        <div>
          <BsChatDotsFill className='cursor-pointer h-6 w-7 text-gray-400' />
        </div>
        <div>
          <SlGlobe className='cursor-pointer h-6 w-7 text-gray-400' />
        </div>
        <div>
          <FaBell className='cursor-pointer h-6 w-7 text-gray-400' />
        </div>
        <FaBars className='cursor-pointer h-6 w-7 text-gray-400 mb:hidden' onClick={toggleMenu} />
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
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Logout
              </button>
            </Link>
          )}
        </div>

      </div>
      {menuVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}
      <div className={`fixed right-0 top-0 h-full bg-white w-64 shadow-lg z-50 transform ${menuVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <ul className='p-4'>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <FaHome className='mr-2' />
            <Link href="/homepage">หน้าแรก</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <TiShoppingCart className='mr-2' />
            <Link href="/cart">รถเข็น</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <FaThList className='mr-2' />
            <Link href="/equipment">ยืมอุปกรณ์</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <CiBoxList className='mr-2' />
            <Link href="/rentalinfo">แสดงข้อมูลการยืม</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <MdOutlinePostAdd className='mr-2' />
            <Link href="/comment">Comment</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <FaNewspaper className='mr-2' />
            <Link href="/webnew">ข่าวสารเว็บไซต์</Link>
          </li>

          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <GrContactInfo className='mr-2' />
            <Link href="/contact">ข้อมูลการติดต่อ</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4'>
            <RiFileListLine className='mr-2 ' />
            <Link href="/agreement">ข้อตกลงการใช้งาน</Link>
          </li>
          <li className='flex justify-start items-center hover:bg-blue-200 hover:text-blue-800 rounded-xl p-4 '>
            <FaSignOutAlt className='mr-2 ' />
            <Logout />
          </li>
        </ul>
      </div>
      {searchResults.length > 0 && (
        <div className='absolute top-16 left-0 right-0 bg-white shadow-lg p-4'>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index} className='p-2 border-b'>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MainHeader;
