'use client';

import { useState } from "react";
import Headeradmin from "@/components/Headeradmin";
import axios from 'axios';  // นำเข้า axios

export default function AddNews() {
  const [formData, setFormData] = useState({
    label: "",
    detail: "",
    image: "", // ใช้สำหรับเก็บ URL ของรูปภาพ
  });
  const [message, setMessage] = useState(""); // สำหรับแสดงผลลัพธ์หลังการส่ง

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ส่งข้อมูลไปยัง API
      const response = await axios.put(
        "http://172.19.224.1:1337/api/addwebnew",  // URL ของ API
        formData,  // ส่งข้อมูลในรูปแบบ JSON
        {
          headers: {
            "Content-Type": "application/json",  // ส่งข้อมูลในรูปแบบ JSON
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("ข่าวสารถูกเพิ่มเรียบร้อยแล้ว!");
        // เคลียร์ข้อมูลในฟอร์มหลังจากส่งสำเร็จ
        setFormData({
          label: "",
          detail: "",
          image: "",
        });
      } else {
        setMessage("เกิดข้อผิดพลาดในการเพิ่มข่าว");
      }
    } catch (error) {
      setMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Headeradmin>
        <div className="mt-9 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4">เพิ่มข่าวสาร</h1>

            <form onSubmit={handleSubmit}>
              {/* URL ของรูปภาพ */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Label */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Label
                </label>
                <input
                  type="text"
                  name="label"
                  placeholder="Label"
                  value={formData.label}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Detail */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Detail
                </label>
                <textarea
                  name="detail"
                  placeholder="Detail"
                  value={formData.detail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* แสดงข้อความแจ้งเตือน */}
              {message && <p className="text-green-500">{message}</p>}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Headeradmin>
    </div>
  );
}
