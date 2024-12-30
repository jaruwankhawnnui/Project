'use client';

import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { IoClose } from "react-icons/io5";
import { useRouter } from 'next/navigation';

const EquipmentPage = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const router = useRouter();

  // Fetch borrowed items from API
  useEffect(() => {
    const fetchBorrowedItems = async () => {
      try {
        const response = await fetch(`http://172.25.176.1:1337/api/addcart-anddeletes?populate=image`);
        if (response.ok) {
          const data = await response.json();
          const items = data.data.map(item => ({
            id: item.id,
            quantity: item.attributes.amount || 1,
            attributes: item.attributes,
          }));
          setBorrowedItems(items);
        } else {
          console.error("Failed to fetch items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching borrowed items:", error);
      }
    };

    fetchBorrowedItems();
  }, []);

  // Navigate to borrowing form
  const handleGoToBorrowForm = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    sessionStorage.setItem('borrowDate', currentDate);
    router.push('/borrow-form');
  };

  // Handle delete item
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://172.25.176.1:1337/api/addcart-anddeletes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBorrowedItems(borrowedItems.filter(item => item.id !== id));
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
    <div className='bg-gray-100 min-h-screen'>
      <Layout>
        <div className='container mx-auto mt-10'>
          <h1 className='text-4xl font-bold text-center mb-10'>ยืมอุปกรณ์</h1>
          <div className='bg-white shadow-md rounded-lg p-6'>
            {/* Header Row */}
            <div className='grid grid-cols-5 text-gray-700 font-semibold border-b pb-4 mb-4 text-center'>
              <div>รายการอุปกรณ์</div>
              <div>ราคาต่อชิ้น</div>
              <div>จำนวน</div>
              <div>ราคารวม</div>
              <div>ลบ</div>
            </div>

            {/* Borrowed Items */}
            {borrowedItems.length === 0 ? (
              <div className='text-center text-gray-500 py-8'>ไม่มีอุปกรณ์ที่ยืม</div>
            ) : (
              borrowedItems.map((item, index) => (
                <div
                  key={index}
                  className='grid grid-cols-5 gap-4 items-center py-4 border-b text-center'
                >
                  <div>
                    <h2 className='text-lg font-bold text-gray-800'>{item.attributes?.label}</h2>
                    <p className='text-sm text-gray-500'>{item.attributes?.category || "N/A"}</p>
                  </div>
                  <div>{item.attributes?.Price} ฿</div>
                  <div>{item.quantity}</div>
                  <div>{item.attributes?.Price * item.quantity} ฿</div>
                  <div>
                    <IoClose
                      className='text-red-500 text-xl cursor-pointer mx-32 hover:text-red-700'
                      onClick={() => handleDeleteItem(item.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Button */}
          <div className='flex justify-end mt-6'>
            <button
              className='bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200'
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
