"use client";

import React, { useState, useEffect } from "react";
import { IoCall } from "react-icons/io5";
import { ImMail4 } from "react-icons/im";
import { SlGlobe } from "react-icons/sl";
import Layout from "@/components/Layout";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";
const Contact = () => {
  const [contact, setContact] = useState(null);

  // ฟังก์ชันสำหรับดึงข้อมูลการติดต่อจาก API สำหรับ ID 14
  const fetchContact = async () => {
    try {
      const response = await axios.get("http://172.31.0.1:1337/api/addcontacts/14?populate=*");
      setContact(response.data.data); // ตั้งค่าข้อมูลที่ดึงมาจาก API
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  // ดึงข้อมูลเมื่อ component โหลดขึ้น
  useEffect(() => {
    fetchContact();
  }, []);

  return (
    <div className='bg-gray-100'>
      <Layout>
        <div className='min-h-screen flex flex-col items-center'>
          <div className='bg-white w-full max-w-4xl mt-10 shadow-lg rounded-lg overflow-hidden'>
            <div className='bg-gray-200 p-4'>
              <h1 className='text-black text-3xl'>ข้อมูลการติดต่อ</h1>
            </div>
            <div className='p-6'>
              <h2 className='text-center text-xl text-red-600 mb-8'>ติดต่อเราได้ที่นี้</h2>
              <div className='flex flex-col space-y-4 items-center'>
                {contact ? (
                  <div className="w-full max-w-md">
                    {/* แสดงผล Phone */}
                    <div className='flex items-center bg-gray-200 rounded-full p-4 mb-4'>
                      <IoCall className='text-gray-600 w-6 h-6' />
                      <span className='ml-4 text-gray-700'>{contact.attributes.phone}</span>
                    </div>

                    {/* แสดงผล Email */}
                    <div className='flex items-center bg-gray-200 rounded-full p-4 mb-4'>
                      <ImMail4 className='text-red-600 w-6 h-6' />
                      <span className='ml-4 text-gray-700'>{contact.attributes.email}</span>
                    </div>

                    {/* แสดงผล Website */}
                    <div className='flex items-center bg-gray-200 rounded-full p-4 mb-4'>
                      <SlGlobe className='text-gray-600 w-6 h-6' />
                      <a
                        href={contact.attributes.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='ml-4 text-gray-700'
                      >
                        {contact.attributes.website}
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p>No contact information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Contact;
