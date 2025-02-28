'use client';

import React, { useState } from "react";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";

const AddContact = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    website: "", // เปลี่ยนจากการอัปโหลดไฟล์เป็นการใส่ URL แทน
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
    };

    try {
      const response = await axios.put(
        "http://172.19.32.1:1337/api/addcontacts/14", // URL ของ API สำหรับเพิ่มข้อมูล
        {
          data: contactData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      // onNewItemAdded(); // ทำงานหลังจากเพิ่มข้อมูลสำเร็จ

      // Reset form fields after successful submit
      setFormData({
        phone: "",
        email: "",
        website: "",
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="mt-9 flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-10">
            <h1 className="text-2xl font-bold mb-4">แก้ไขข้อมูลการติดต่อ</h1>
            <form onSubmit={handleSubmit}>
              {/* ฟิลด์ phone */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="phone">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="กรอกเบอร์โทรศัพท์"
                  required
                />
              </div>

              {/* ฟิลด์ email */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="email">
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="กรอกอีเมล"
                  required
                />
              </div>

              {/* ฟิลด์ website */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="website">
                  เว็บไซต์
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="กรอกลิงก์เว็บไซต์"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-3/5 bg-[#465B7E] text-white py-2 rounded-md hover:bg-blue-950"
                >
                  ยืนยัน
                </button>
              </div>
            </form>
          </div>
        </div>
      </Headeradmin>
    </div>
  );
};

export default AddContact;
