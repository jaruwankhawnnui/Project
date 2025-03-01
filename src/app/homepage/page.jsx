"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MainHeader from "@/components/MainHeader";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ เพิ่มไอคอนโหลด
import { motion } from "framer-motion";

const API_URL = "https://coe-hardware-lab-website-ievu.onrender.com/api/cartadmins?populate=*&pagination[pageSize]=100"; // ✅ โหลดข้อมูลมากกว่า 25 รายการ

const Home = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ เพิ่ม state สำหรับ Loading
  const router = useRouter();

  useEffect(() => {
    fetchCartAdmins();
  }, []);

  // ✅ ฟังก์ชันดึงข้อมูลมากกว่า 25 รายการ
  const fetchCartAdmins = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data.data); // ✅ ตั้งค่าข้อมูลที่ดึงมา
      setLoading(false);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลได้:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;
  }

  const handleCardClick = (item) => {
    setIsLoading(true); // ✅ เริ่มแสดง Loading

    setTimeout(() => {
      router.push(`/card/${item.id}`);
    }, 1000); // ✅ เพิ่ม Delay เพื่อให้โหลดก่อนเปลี่ยนหน้า
  };

  const filteredItems = data.filter((item) => {
    const label = item.attributes?.Label?.toLowerCase() || "";
    const category = item.attributes?.categoriesadmin?.data?.attributes?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return label.includes(search) || category.includes(search);
  });

  const renderItemsByCategory = () => {
    return filteredItems.map((item, index) => (
      <motion.div
        key={index}
        className="relative bg-gradient-to-br from-[#6EC7E2] to-cyan-50 shadow-xl rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
        onClick={() => handleCardClick(item)}
        whileHover={{ scale: 1.05 }} // ✅ เอฟเฟกต์ขยายเมื่อ Hover
        whileTap={{ scale: 0.95 }} // ✅ เอฟเฟกต์ย่อเมื่อคลิก
      >
        {item.attributes?.image?.data?.attributes?.url && (
          <motion.img
            src={item.attributes.image.data.attributes.url}
            className="w-full h-36 object-cover mb-4 mt-1 rounded-lg"
            alt={item.attributes?.Label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }} // ✅ เพิ่ม Animation การโหลดภาพ
          />
        )}
        <div className="text-center bg-white rounded-lg w-full h-27">
          <div className="font-bold text-sm">{item.attributes?.Label}</div>
          <div className="text-xs text-gray-500">{item.attributes.categoriesadmin?.data?.attributes?.name || "ไม่ระบุหมวดหมู่"}</div>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <MainHeader />

      {/* ✅ พื้นหลังไล่สี พร้อมข้อความต้อนรับ */}
      <motion.div
        className="bg-gradient-to-br from-[#6EC7E2] to-cyan-50 shadow-xl rounded-2xl p-6 px-32 mx-auto text-gray-700 flex items-center justify-center mt-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FaUserCircle className="text-6xl mr-6" />
        {status === "authenticated" ? (
          <motion.div>
            <motion.p
              className="font-bold text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Welcome: {session.user.name}
            </motion.p>
            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Email: {session.user.email}
            </motion.p>
            <motion.p
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              Student ID: {session.user.email.replace("@email.psu.ac.th", "") || "Not Available"}
            </motion.p>
          </motion.div>
        ) : (
          <p className="text-lg">⚠️ You are not logged in</p>
        )}
      </motion.div>

      {/* ✅ เพิ่มช่องค้นหา */}
      <motion.div
        className="flex justify-center px-32 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
      >
        <input
          type="text"
          placeholder="🔍 ค้นหาอุปกรณ์"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 mt-4 py-2 border rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>

      {/* ✅ แสดงรายการอุปกรณ์ */}
      <div className="flex justify-center items-start flex-wrap mt-0">
        {filteredItems.length > 0 ? (
          renderItemsByCategory()
        ) : (
          <p className="text-gray-500 text-lg text-center">❌ ไม่พบอุปกรณ์ที่ค้นหา</p>
        )}
      </div>

      {/* ✅ แสดง Loading Overlay พร้อมไอคอนหมุน */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AiOutlineLoading3Quarters className="text-5xl text-blue-500 animate-spin" /> {/* ✅ ไอคอนหมุน */}
            <p className="text-xl font-bold text-blue-500 mt-3">กำลังโหลด...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
