"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IoRemoveCircle, IoAddCircle } from "react-icons/io5";

const StockPage = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);

  // ดึงข้อมูลอุปกรณ์ในสต๊อก
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await fetch("http://172.19.32.1:1337/api/equipment?populate=image");
        if (response.ok) {
          const data = await response.json();
          const items = data.data.map((item) => ({
            id: item.id,
            attributes: item.attributes,
            imageUrl:
              item.attributes.image?.data?.length > 0
                ? item.attributes.image.data[0].attributes.url.startsWith("http")
                  ? item.attributes.image.data[0].attributes.url
                  : `http://172.19.32.1:1337${item.attributes.image.data[0].attributes.url}`
                : null,
          }));
          setEquipmentItems(items);
        } else {
          console.error("Failed to fetch stock items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching stock items:", error);
      }
    };

    fetchStockItems();
  }, []);

  // อัปเดตจำนวนอุปกรณ์ในสต๊อก
  const handleUpdateStock = async (id, newAmount) => {
    try {
      const response = await fetch(`http://172.19.32.1:1337/api/equipment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            amount: newAmount,
          },
        }),
      });

      if (response.ok) {
        setEquipmentItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, attributes: { ...item.attributes, amount: newAmount } } : item
          )
        );
        alert("อัปเดตจำนวนสำเร็จ!");
      } else {
        console.error("Failed to update stock:", await response.text());
        alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนอุปกรณ์");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนอุปกรณ์");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">จัดการสต๊อกอุปกรณ์</h1>

          <div className="bg-white shadow-lg rounded-lg p-6">
            {equipmentItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีข้อมูลในสต๊อก</div>
            ) : (
              <div className="space-y-4">
                {equipmentItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 items-center py-2 px-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.attributes?.label || "Unknown Item"}
                          className="w-32 h-32 object-cover rounded-lg mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-gray-500">
                          ไม่มีรูปภาพ
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">{item.attributes?.label}</h2>
                        <p className="text-sm text-gray-500">{item.attributes?.category || "N/A"}</p>
                      </div>
                    </div>
                    <div className="text-center">{item.attributes?.Price} ฿</div>
                    <div className="text-center">{item.attributes?.amount}</div>
                    <div className="flex justify-center space-x-2">
                      <IoRemoveCircle
                        className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
                        onClick={() =>
                          handleUpdateStock(item.id, Math.max(item.attributes?.amount - 1, 0))
                        }
                      />
                      <IoAddCircle
                        className="text-green-500 text-2xl cursor-pointer hover:text-green-700"
                        onClick={() => handleUpdateStock(item.id, item.attributes?.amount + 1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default StockPage;
