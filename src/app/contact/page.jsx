"use client";

import React, { useState, useEffect } from "react";
import { IoCall } from "react-icons/io5";
import { ImMail4 } from "react-icons/im";
import { SlGlobe } from "react-icons/sl";
import Layout from "@/components/Layout";
import axios from "axios";
import { motion } from "framer-motion"; // ✅ เพิ่ม Animation
import { FaSpinner } from "react-icons/fa"; // ✅ เพิ่ม Icon Loading

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ State สำหรับโหลดข้อมูล

  // ดึงข้อมูลการติดต่อจาก API
  const fetchContact = async () => {
    try {
      const response = await axios.get("http://172.19.32.1:1337/api/addcontacts/14?populate=*");
      setContact(response.data.data);
    } catch (error) {
      console.error("❌ Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
    <Layout>
    <div className="   mt-32 flex justify-center items-center">
      
        <div className="w-full max-w-3xl shadow-xl bg-cyan-50 rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
          <motion.div
            className="bg-[#465B7E] text-white p-6 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl text-white font-bold"> ข้อมูลการติดต่อ</h1>
          </motion.div>

          <div className="p-6 flex flex-col items-center">
            <motion.h2
              className="text-xl font-semibold text-red-500 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              📌 ติดต่อเราได้ที่นี่!
            </motion.h2>

            {loading ? (
              // ✅ Skeleton Loading (แสดงระหว่างโหลด)
              <div className="flex flex-col space-y-4 w-full max-w-md">
                <div className="bg-gray-300 h-12 rounded-full animate-pulse"></div>
                <div className="bg-gray-300 h-12 rounded-full animate-pulse"></div>
                <div className="bg-gray-300 h-12 rounded-full animate-pulse"></div>
              </div>
            ) : contact ? (
              <div className="w-full max-w-md space-y-4">
                {/* 📞 แสดงผล Phone */}
                <motion.div
                  className="flex items-center bg-white shadow-md rounded-full p-4 hover:bg-gray-200 transition duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <IoCall className="text-green-500 w-6 h-6" />
                  <span className="ml-4 text-gray-700 text-lg">{contact.attributes.phone}</span>
                </motion.div>

                {/* 📧 แสดงผล Email */}
                <motion.div
                  className="flex items-center bg-white shadow-md rounded-full p-4 hover:bg-gray-200 transition duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <ImMail4 className="text-red-500 w-6 h-6" />
                  <span className="ml-4 text-gray-700 text-lg">{contact.attributes.email}</span>
                </motion.div>

                {/* 🌍 แสดงผล Website */}
                <motion.div
                  className="flex items-center bg-white shadow-md rounded-full p-4 hover:bg-gray-200 transition duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <SlGlobe className="text-blue-500 w-6 h-6" />
                  <a
                    href={contact.attributes.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-blue-700 text-lg hover:underline"
                  >
                    {contact.attributes.website}
                  </a>
                </motion.div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                ❌ ไม่พบข้อมูลการติดต่อ
              </div>
            )}

            {/* 🌟 ปุ่มรีเฟรช */}
           
          </div>
        </div>
        </div>
      </Layout>
    </div>
    
    
  );
  
};


export default Contact;
