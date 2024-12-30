"use client";

import React, { useState } from "react";
import axios from "axios";
import Headeradmin from "@/components/Headeradmin";

const Cartadmin = ({ onNewItemAdded }) => {
  const [formData, setFormData] = useState({
    Label: "",
    Price: "",
    Category: "",
    item: "",
    Detail: "",
    image: null,
  });

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
        "http://172.25.176.1:1337/api/cartadmins",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      onNewItemAdded();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-100  min-h-screen">
      <Headeradmin>
        <div className=" mt-9  flex justify-center items-center">
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-10">
            <h1 className="text-2xl font-bold mb-4">เพิ่มรายการอุปกรณ์</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="upload-image"
                >
                  Upload image
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
                <label
                  className="block text-gray-700 font-bold "
                  htmlFor="Label"
                >
                  Label
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
                <label
                  className="block text-gray-700 font-bold "
                  htmlFor="Price"
                >
                  Price
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
                <label
                  className="block text-gray-700 font-bold "
                  htmlFor="Category"
                >
                  Category
                </label>
                <select
                  id="Category"
                  name="Category"
                  value={formData.Category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="IC">IC</option>
                  <option value="Bord">BORD</option>
                  <option value="BORD DIGITAL">BORD DIGITAL</option>
                  <option value="CAPASITOR">
                    CAPASITOR
                  </option>
                  <option value=" DIODE">
                    DIODE
                  </option>
                  <option value="DIP JUMPER">
                    DIP JUMPER
                  </option>
                  <option value="DIGITAL MULTIMETER">Digital Multimeter
                  </option>
                  <option value="CONNECTOR">
                    CONNECTOR</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold " htmlFor="item">
                  Item
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
                <label className="block text-gray-700 font-bold " htmlFor="Detail">
                  Detail
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
                Create
              </button>
            </form>
          </div>
        </div>
      </Headeradmin>
    </div>
  );
};

export default Cartadmin;
