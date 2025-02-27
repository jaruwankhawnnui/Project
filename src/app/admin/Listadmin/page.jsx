"use client";
import React, { useState, useEffect } from "react";
import Headeradmin from "@/components/Headeradmin";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [borrowData, setBorrowData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [newTotalAmount, setNewTotalAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, borrowRes] = await Promise.all([
          axios.get("http://172.21.32.1:1337/api/cartadmins?populate=*"),
          axios.get("http://172.21.32.1:1337/api/borrows"),
        ]);

        console.log("Fetched inventory data:", inventoryRes.data);
        console.log("Fetched borrow data:", borrowRes.data);

        const borrowRecords = borrowRes.data.data;

        const borrowMap = borrowRecords.reduce((acc, borrow) => {
          const label = borrow.attributes.label || "Unknown";
          const amount = borrow.attributes.amount || 0;

          if (!acc[label]) {
            acc[label] = 0;
          }
          acc[label] += amount;

          return acc;
        }, {});

        const fetchedItems = inventoryRes.data.data.map((item) => {
          const itemName = item.attributes.Label;
          const totalAmount = item.attributes.item || 0;
          const usedAmount = borrowMap[itemName] || 0;
          const remainingAmount = totalAmount - usedAmount;

          return {
            id: item.id,
            name: itemName,
            item: totalAmount,
            used: usedAmount,
            remaining: remainingAmount >= 0 ? remainingAmount : 0,
            image: item.attributes.image?.data?.attributes?.url || "/default-image.jpg",
          };
        });

        setItems(fetchedItems);
        setBorrowData(borrowRecords);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ เปิดป็อปอัพและกำหนดค่าเริ่มต้น
  const openEditModal = (item) => {
    setSelectedItem(item);
    setNewTotalAmount(item.item);
    setIsModalOpen(true);
  };

  // ✅ ปิดป็อปอัพ
  const closeEditModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setNewTotalAmount("");
  };

  // ✅ บันทึกข้อมูลที่แก้ไข และอัปเดตไปยัง Strapi
  const handleSaveEdit = async () => {
    if (!selectedItem) return;

    try {
      await axios.put(`http://172.21.32.1:1337/api/cartadmins/${selectedItem.id}`, {
        data: { item: newTotalAmount },
      });

      alert("อัปเดตข้อมูลสำเร็จ!");
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === selectedItem.id ? { ...item, item: newTotalAmount } : item
        )
      );

      closeEditModal();
    } catch (error) {
      console.error("Error updating data:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="p-8">
          <div className="flex justify-center  items-center bg-[#465B7E] p-5 rounded-lg">
            <h1 className="w-full text-white text-3xl pl-10 font-bold">
              รายการอุปกรณ์
            </h1>
          </div>


          <div className="bg-white shadow-md mt-5 rounded-lg mx-auto p-4">
            <div className="mb-4 flex justify-end flex-wrap">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline text-sm 
      w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border-gray-500 max-w-sm"
              />
            </div>


            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white border-collapse min-w-max">
                  <thead className="bg-[#6EC7E2]">
                    <tr>
                      <th className="px-4 py-2 border-b text-center text-white">รูปภาพ</th>
                      <th className="px-6 py-2 border-b text-center text-white">รายการ</th>
                      <th className="px-4 py-2 border-b text-center hidden md:table-cell text-white">จำนวนทั้งหมด</th>
                      <th className="px-4 py-2 border-b text-center text-white">จำนวนยืม</th>
                      <th className="px-4 py-2 border-b text-center text-white">คงเหลือ</th>
                      <th className="px-6 py-2 border-b text-center text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-b flex justify-center">
                          {item.image && (
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `http://172.21.32.1:1337${item.image}`
                              }
                              className="w-20 h-20 sm:w-32 sm:h-32 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-2 border-b text-center">{item.name}</td>
                        <td className="px-4 py-2 border-b hidden md:table-cell text-center">{item.item} ชิ้น</td>
                        <td className="px-4 py-2 border-b text-center">{item.used} ชิ้น</td>
                        <td className="px-4 py-2 border-b text-center">{item.remaining} ชิ้น</td>
                        <td className="px-6 py-2 border-b text-center">
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-gray-500 hover:text-gray-700 px-4 py-4 w-fit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
          </div>
        </div>
      </Headeradmin>

      {/* ✅ ป็อปอัพแก้ไขจำนวน */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">แก้ไขจำนวนอุปกรณ์</h2>
            <input
              type="number"
              value={newTotalAmount}
              onChange={(e) => setNewTotalAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={closeEditModal} className="text-gray-500">ยกเลิก</button>
              <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
