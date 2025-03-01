"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";

const API_URL = "https://coe-hardware-lab-website-ievu.onrender.com/api/cartadmins";
const CATEGORY_URL = "https://coe-hardware-lab-website-ievu.onrender.com/api/categoriesadmins?populate=*&pagination[pageSize]=100"; // ✅ ดึงหมวดหมู่มากกว่า 25 รายการ

const Cartadmin = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    Label: "",
    Price: "",
    Category: "",
    item: "",
    Detail: "",
    image: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  // ✅ ดึงข้อมูลหมวดหมู่มากกว่า 25 รายการ
  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_URL);
      const CategoryData = response.data.data.map((cat) => ({
        id: cat.id,
        name: cat.attributes.name,
      }));
      setCategories(CategoryData);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงหมวดหมู่ได้:", error);
    }
  };

  // ✅ ดึงข้อมูลอุปกรณ์ทั้งหมด (มากกว่า 25 รายการ)
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}?populate=*&pagination[pageSize]=100`); // ✅ ดึงข้อมูลมากกว่า 25 รายการ
      setItems(response.data.data);
    } catch (error) {
      console.error("❌ ไม่สามารถดึงรายการอุปกรณ์ได้:", error);
    }
  };

  // ✅ อัปเดตค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ อัปเดตรูปภาพ
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ✅ ฟังก์ชันเพิ่มอุปกรณ์
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.image) {
      data.append("files.image", formData.image);
    }
    data.append(
      "data",
      JSON.stringify({
        Label: formData.Label,
        Price: formData.Price,
        categoriesadmin: formData.Category,
        item: formData.item,
        Detail: formData.Detail,
      })
    );

    try {
      await axios.post(API_URL, data, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData({ Label: "", Price: "", Category: "", item: "", Detail: "", image: null });
      fetchItems(); // ✅ อัปเดตรายการหลังจากเพิ่มอุปกรณ์
    } catch (error) {
      console.error("❌ ไม่สามารถเพิ่มอุปกรณ์ได้:", error.response?.data || error.message);
    }
  };

  // ✅ ฟังก์ชันลบอุปกรณ์
  const handleDelete = async (id) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์นี้?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems(); // ✅ อัปเดตรายการหลังจากลบอุปกรณ์
    } catch (error) {
      console.error("❌ ไม่สามารถลบอุปกรณ์ได้:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="mt-5 flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-md  p-10">
            <h1 className="text-2xl font-bold mb-4">เพิ่มรายการอุปกรณ์</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">อัปโหลดรูปภาพ</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">ชื่ออุปกรณ์</label>
                <input type="text" name="Label" value={formData.Label} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">ราคา</label>
                <input type="text" name="Price" value={formData.Price} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">หมวดหมู่</label>
                <select name="Category" value={formData.Category} onChange={handleChange} className="w-full p-2 border rounded-md">
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>❌ ไม่มีหมวดหมู่</option>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold">จำนวนอุปกรณ์ทั้งหมด</label>
                <input type="text" name="item" value={formData.item} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-bold">รายละเอียด</label>
                <input type="text" name="Detail" value={formData.Detail} onChange={handleChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className='flex justify-center'>
                <button type="submit" className="w-3/5 bg-[#465B7E] text-white py-2 rounded-md hover:bg-blue-950">
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ✅ แสดงรายการอุปกรณ์ */}
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">รายการอุปกรณ์</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">ชื่ออุปกรณ์</th>
                <th className="border border-gray-300 px-4 py-2">หมวดหมู่</th>
                <th className="border border-gray-300 px-4 py-2">ราคา</th>
                <th className="border border-gray-300 px-4 py-2">จำนวน</th>
               
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.attributes.Label}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.attributes.categoriesadmin?.data?.attributes?.name || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.attributes.Price}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.attributes.item}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Headeradmin>
    </div>
  );
};

export default Cartadmin;
