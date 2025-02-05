"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Headeradmin from "@/components/Headeradmin";

const CreateCategory = ({ onNewCategoryAdded }) => {
  const [label, setLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    setLabel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        'http://172.31.0.1:1337/api/categoriesadmins', // ✅ อัปเดตให้ใช้ไอพีที่ถูกต้อง
        { data: { Label: label } },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Category Created:', response.data);
      setLabel(''); // ✅ ล้างช่องกรอกข้อมูล
      setSuccessMessage("🎉 เพิ่มหมวดหมู่สำเร็จ!");

      // ✅ อัปเดตรายการหมวดหมู่ในหน้าหลัก (ถ้ามี)
      if (onNewCategoryAdded) {
        onNewCategoryAdded();
      }
    } catch (error) {
      console.error('❌ Failed to create category:', error.response?.data || error.message);
      setError('❌ เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gray-100 w-full flex flex-col min-h-screen'>
      <Headeradmin>
        <div className="max-w-md mx-auto mt-5 bg-white shadow-md rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">เพิ่มหมวดหมู่</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="label">
                หมวดหมู่
              </label>
              <input
                type="text"
                id="label"
                name="label"
                value={label}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังเพิ่ม...' : 'เพิ่มหมวดหมู่'}
            </button>
          </form>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CreateCategory;
