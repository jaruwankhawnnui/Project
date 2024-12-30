"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EquipmentPage = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch equipment items from API
  useEffect(() => {
    const fetchEquipmentItems = async () => {
      try {
        const response = await fetch(`http://172.25.176.1:1337/api/equipment?populate=*`);
        if (response.ok) {
          const data = await response.json();
          const items = data.data.map((item) => ({
            id: item.id,
            attributes: item.attributes,
          }));
          setEquipmentItems(items);
        } else {
          console.error("Failed to fetch items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching equipment items:", error);
      }
    };

    fetchEquipmentItems();
  }, []);

  // Calculate total price whenever equipmentItems changes
  useEffect(() => {
    const total = equipmentItems.reduce((sum, item) => {
      return sum + (item.attributes?.Price * item.attributes?.amount || 0);
    }, 0);
    setTotalPrice(total);
  }, [equipmentItems]);

  const handleGoToBorrowForm = () => {
    // จัดเก็บข้อมูลอุปกรณ์ที่เลือกไว้ใน sessionStorage
    sessionStorage.setItem("borrowedEquipment", JSON.stringify(equipmentItems));
    router.push("/borrow-form");
  };
  

  // Handle delete item
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://172.25.176.1:1337/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEquipmentItems(equipmentItems.filter((item) => item.id !== id));
        alert("ลบอุปกรณ์สำเร็จ");
      } else {
        console.error("Error deleting item:", await response.text());
        alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">อุปกรณ์ที่ยืม</h1>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {/* Header Row */}
            <div className="grid grid-cols-4 text-gray-700 font-semibold border-b pb-4 mb-4 text-center">
              <div>รายการอุปกรณ์</div>
              <div>ราคาต่อชิ้น</div>
              <div>จำนวน</div>
              <div>ลบ</div>
            </div>

            {/* Equipment Items */}
            {equipmentItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีอุปกรณ์ที่ยืม</div>
            ) : (
              <div className="space-y-4">
                {equipmentItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 items-center py-2 px-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <div>
                      <h2 className="text-lg font-bold mx-20 text-gray-800">{item.attributes?.label}</h2>
                      <p className="text-sm mx-20 text-gray-500">{item.attributes?.category || "N/A"}</p>
                    </div>
                    <div className="text-center">{item.attributes?.Price} ฿</div>
                    <div className="text-center">{item.attributes?.amount}</div>
                    <div className="text-center">
                      <IoClose
                        className="text-red-500 mx-44 text-xl cursor-pointer hover:text-red-700"
                        onClick={() => handleDeleteItem(item.id)}
                      />
                    </div>
                  </div>
                ))}

                {/* Total Price */}
                
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
              onClick={handleGoToBorrowForm}
            >
              พิมพ์แบบฟอร์มยืมอุปกรณ์
            </button>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default EquipmentPage;
