"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";

const API_URL = "https://coe-hardware-lab-website-ievu.onrender.com/api/categoriesadmins"; // URL ของ Strapi

const CreateCategory = () => {
  const [label, setLabel] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editCategory, setEditCategory] = useState(null); // ใช้เก็บข้อมูลหมวดหมู่ที่กำลังแก้ไข

  // ✅ ดึงข้อมูลหมวดหมู่เมื่อ Component โหลด
  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ ฟังก์ชันดึงข้อมูลหมวดหมู่จาก API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: { "pagination[limit]": 100 }, // ดึงข้อมูล 100 รายการ
      });
      setCategories(response.data.data); // ตั้งค่าหมวดหมู่ที่ดึงมา
    } catch (error) {
      console.error("❌ ไม่สามารถดึงข้อมูลหมวดหมู่ได้:", error);
    }
  };

  // ✅ จัดการการเปลี่ยนแปลงค่าของ input
  const handleInputChange = (e) => {
    setLabel(e.target.value);
  };

  // ✅ ฟังก์ชันเพิ่มหรือแก้ไขหมวดหมู่
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (editCategory) {
        // ✅ แก้ไขหมวดหมู่ที่มีอยู่
        await axios.put(`${API_URL}/${editCategory.id}`, { data: { name: label } });
        setSuccessMessage("✅ แก้ไขหมวดหมู่สำเร็จ!");
      } else {
        // ✅ เพิ่มหมวดหมู่ใหม่
        await axios.post(API_URL, { data: { name: label } });
        setSuccessMessage("🎉 เพิ่มหมวดหมู่สำเร็จ!");
      }

      setLabel("");
      setEditCategory(null);
      fetchCategories(); // รีเฟรชข้อมูล
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error.response?.data || error.message);
      setError("❌ ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ฟังก์ชันลบหมวดหมู่
  const handleDelete = async (id) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccessMessage("✅ ลบหมวดหมู่สำเร็จ!");
      fetchCategories(); // อัปเดตข้อมูล
    } catch (error) {
      console.error("❌ ลบไม่สำเร็จ:", error);
      setError("❌ ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่");
    }
  };

  // ✅ ฟังก์ชันแก้ไขหมวดหมู่ (โหลดค่าลงฟอร์ม)
  const handleEdit = (category) => {
    setLabel(category.attributes.name); // ตั้งค่าชื่อหมวดหมู่ที่จะแก้ไข
    setEditCategory(category); // ตั้งค่าหมวดหมู่ที่กำลังแก้ไข
  };

  return (
    <div className="bg-gray-100 w-full flex flex-col min-h-screen">
      <Headeradmin>
        <div className="max-w-md mx-auto mt-5 bg-white shadow-md rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">{editCategory ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}</h1>
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
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-3/5 bg-[#465B7E] text-white py-2 rounded-md hover:bg-blue-950"
                disabled={isLoading}
              >
                {isLoading ? "กำลังบันทึก..." : editCategory ? "บันทึกการแก้ไข" : "เพิ่ม"}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ ตารางแสดงหมวดหมู่ */}
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">รายการหมวดหมู่</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">ชื่อหมวดหมู่</th>
                <th className="border border-gray-300 px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr key={category.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.attributes.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-700 mr-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CreateCategory;
