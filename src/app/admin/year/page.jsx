"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Headeradmin from "@/components/Headeradmin";

const API_URL = 'https://coe-hardware-lab-website-ievu.onrender.com/api/Years?pagination[pageSize]=100'; // ✅ ดึงข้อมูลมากกว่า 25 รายการ

const CreateAcademicYear = () => {
  const [Year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [academicYears, setAcademicYears] = useState([]); // ✅ เก็บข้อมูลปีการศึกษา

  // ✅ ดึงข้อมูลปีการศึกษาจาก API
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get(API_URL);
      setAcademicYears(response.data.data);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลปีการศึกษาได้:", error);
    }
  };

  const handleInputChange = (e) => {
    setYear(e.target.value);
  };

  // ✅ เพิ่มปีการศึกษา
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("📌 Sending data to Strapi:", { data: { Year: Year } });

      const response = await axios.post(
        'https://coe-hardware-lab-website-ievu.onrender.com/api/Years',
        { data: { Year: Year } },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("✅ Academic Year Created:", response.data);
      alert("✅ ปีการศึกษาถูกบันทึกเรียบร้อย!");

      setYear('');
      fetchAcademicYears(); // ✅ รีเฟรชรายการปีการศึกษา
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
                placeholder="เช่น 1/2567"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className='flex justify-center'>
              <button
                type="submit"
                className="w-3/5 bg-[#465B7E] text-white py-2 rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'กำลังบันทึก...' : 'เพิ่ม'}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ แสดงรายการปีการศึกษา */}
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">รายการปีการศึกษา</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 w-10">#</th>
                <th className="border border-gray-300 px-4 py-2">ปีการศึกษา</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.length > 0 ? (
                academicYears.map((year, index) => (
                  <tr key={year.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{year.attributes.Year}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CreateAcademicYear;
