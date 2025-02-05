"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Headeradmin from "@/components/Headeradmin";

const CreateAcademicYear = ({ onNewYearAdded }) => {
  const [Year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setYear(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("📌 Sending data to Strapi:", { data: { Year: Year } });

      const response = await axios.post(
        'http://172.31.0.1:1337/api/Years',  // ✅ เปลี่ยน Endpoint ให้ถูกต้อง
        { data: { Year: Year } },  // ✅ เปลี่ยนโครงสร้าง JSON ให้ตรงกับ Strapi
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Academic Year Created:", response.data);
      alert("✅ ปีการศึกษาถูกบันทึกเรียบร้อย!");

      setYear(''); // ล้างช่องกรอกข้อมูลหลังจากเพิ่มสำเร็จ
      if (onNewYearAdded) {
        onNewYearAdded(); // รีเฟรชรายการปีการศึกษาในคอมโพเนนต์หลัก
      }
    } catch (error) {
      console.error("❌ Failed to create academic Year:", error.response?.data || error.message);
      setError("❌ เกิดข้อผิดพลาดในการสร้างปีการศึกษา กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 w-full flex flex-col min-h-screen'>
      <Headeradmin>
        <div className="max-w-md mx-auto mt-5 bg-white shadow-md rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">เพิ่มปีการศึกษา</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="Year">
                ปีการศึกษา
              </label>
              <input
                type="text"
                id="Year"
                name="Year"
                value={Year}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="เช่น 2567"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังบันทึก...' : 'สร้างปีการศึกษา'}
            </button>
          </form>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CreateAcademicYear;
