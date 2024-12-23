'use client';

import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { useRouter } from 'next/navigation';

const EquipmentPage = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const router = useRouter();

  // Fetch borrowed items from sessionStorage
  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem('borrowedItems')) || [];
    setBorrowedItems(items);
  }, []);

  // Navigate to borrowing form and store the current date
  const handleGoToBorrowForm = () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    sessionStorage.setItem('borrowDate', currentDate); // Store the date in sessionStorage
    router.push('/borrow-form'); // Navigate to the borrow form page
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Layout>
        <div className='bg-white mx-40 mr-40 shadow-lg'>
          <div className='flex h-40 '>
            <h1 className='text-4xl font-medium mx-9 mt-4'>ยืมอุปกรณ์</h1>
          </div>
          <div className='flex h-10 justify-around'>
            <h1 className='text-sm font-sans-serif font-bold w-26 text-center'>รายการอุปกรณ์</h1>
            <h1 className='text-sm font-sans-serif font-bold w-20 pl-1 text-center'>ราคาต่อชิ้น</h1>
            <h1 className='text-sm font-sans-serif font-bold w-10 pl-20 mr-30 text-center'>จำนวน</h1>
            <h1 className='text-sm font-sans-serif font-bold w-15 pl-4 text-center'>ราคารวม</h1>
          </div>
        </div>

        <div className='bg-white mx-40 mt-5 mr-40 shadow-lg'>
          {borrowedItems.length === 0 ? (
            <div className="p-8 mx-8">ไม่มีอุปกรณ์ที่ยืม</div>
          ) : (
            borrowedItems.map((item, index) => (
              <div key={index}>
                <div className='flex items-center p-8 mx-8'>
                  <img
                    src={item.attributes?.image?.data?.attributes?.url || "/default.jpg"}
                    alt={item.attributes?.Label}
                    className='w-20 h-20 object-cover'
                  />
                  <div className='flex-1 ml-4'>
                    <h2 className='text-black text-l font-bold'>{item.attributes?.Label}</h2>
                    <p className='text-gray-500 text-xs'>{item.attributes?.Category}</p>
                  </div>

                  <div className='flex-1 flex-col items-center mx-40 mr-30 pl-10 mt-2'>
                    <p className='text-black text-sm'>{item.attributes?.Price} ฿</p>
                  </div>
                  <div className='flex-1 flex-col items-center mx-32 mt-2 w-10'>
                    <p className='text-black text-sm'>{item.quantity}</p>
                  </div>
                  <div className='flex-1 flex-col items-center mx-30 mt-2 w-14'>
                    <p className='text-black text-sm'>{item.attributes?.Price * item.quantity} ฿</p>
                  </div>
                </div>

                {index < borrowedItems.length - 1 && (
                  <div className="border-b border-black mx-8"></div>
                )}
              </div>
            ))
          )}
        </div>

        <div className='bg-white mx-40 mt-5 mr-40 shadow-lg h-20'>
          <div className='flex justify-end'>
            <button
              className="shadow-lg rounded-lg shadow-indigo-500/40 bg-blue-200 h-full w-40 mt-5 mr-5"
              onClick={handleGoToBorrowForm} // Capture the current date and navigate to borrow form
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
