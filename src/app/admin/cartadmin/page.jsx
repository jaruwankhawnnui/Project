"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";

const Cartadmin = ({ onNewItemAdded }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Label: "",
    Price: "",
    Category: "",
    item: "",
    Detail: "",
    image: null,
  });

  useEffect(() => {
    // ✅ ดึงข้อมูล `categories` จาก API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://172.31.0.1:1337/api/categoriesadmins");
        const categoryData = response.data.data.map((cat) => ({
          id: cat.id,
          name: cat.attributes.Label,
        }));
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

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
        Category: formData.Category,
        item: formData.item,
        Detail: formData.Detail,
      })
    );

    try {
      const response = await axios.post(
        "http:/172.31.0.1:1337/api/cartadmins",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("✅ Success:", response.data);
      onNewItemAdded();
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="mt-9 flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-10">
            <h1 className="text-2xl font-bold mb-4">เพิ่มรายการอุปกรณ์</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="upload-image">
                  อัปโหลดรูปภาพ
                </label>
                <input
                  type="file"
                  id="upload-image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="Label">
                  ชื่ออุปกรณ์
                </label>
                <input
                  type="text"
                  id="Label"
                  name="Label"
                  value={formData.Label}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="Price">
                  ราคา
                </label>
                <input
                  type="text"
                  id="Price"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="Category">
                  หมวดหมู่
                </label>
                <select
                  id="Category"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold" htmlFor="item">
                  จำนวนอุปกรณ์ทั้งหมด
                </label>
                <input
                  type="text"
                  id="item"
                  name="item"
                  value={formData.item}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 font-bold" htmlFor="Detail">
                  รายละเอียด
                </label>
                <input
                  type="text"
                  id="Detail"
                  name="Detail"
                  value={formData.Detail}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
              >
                เพิ่มอุปกรณ์
              </button>
            </form>
          </div>
        </div>
      </Headeradmin>
    </div>
  );
};

export default Cartadmin;
