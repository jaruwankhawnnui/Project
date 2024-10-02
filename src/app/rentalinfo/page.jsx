import Layout from "@/components/Layout";
import { auth } from "@/auth";
import React from 'react';
import { IoClose } from "react-icons/io5";

const rentailinfo = async () => {
  const session = await auth();

  const items = [
    { text: "Arduino\nBOARD", image: "/Arduino.jpg", price: 300, quantity: 1, status: 'borrowing', borrowDate: "2024-01-01", returnDate: "2024-01-10" },
    { text: "Banana ject\nDIP", image: "/Banana.jpg", price: 20, quantity: 10, status: 'returned', borrowDate: "2024-01-02", returnDate: "2024-01-12" },
    { text: "Esp32\nBOARD", image: "/es-p.jpg", price: 450, quantity: 2, status: 'not_returned', borrowDate: "2024-01-03", returnDate: "2024-01-13" },
    { text: "Multimeter\nAC/DC", image: "/mutti.jpg", price: 150, quantity: 3, status: 'returned', borrowDate: "2024-01-04", returnDate: "2024-01-14" }
  ];

  // Sort the items so that 'not_returned' comes first, followed by 'borrowing', and then 'returned'
  const sortedItems = items.sort((a, b) => {
    const statusOrder = ['not_returned', 'borrowing', 'returned'];
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_returned':
        return 'bg-red-200';
      case 'borrowing':
        return 'bg-yellow-200';
      case 'returned':
        return 'bg-green-200';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_returned':
        return 'ไม่คืน';
      case 'borrowing':
        return 'กำลังยืม';
      case 'returned':
        return 'คืนแล้ว';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-100">
      <Layout session={session}>
        <div className=''>
          <div className='bg-white mx-40 mt-1 mr-40 shadow-lg'>
            <div className='flex h-40'>
              <h1 className='flex text-4xl mx-9 mt-6 font-medium-9'>แสดงข้อมูลการยืม</h1>
            </div>
            <div className='flex h-10'>
              <h1 className='text-sm font-sans-serif font-bold flex- pl-28  text-center'>รายการอุปกรณ์</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-20 text-center'>ราคาต่อชิ้น</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-18 text-center'>จำนวน</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-18  text-center'>ราคารวม</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-18 text-center'>วันที่ยืม</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-18 text-center'>กำหนดคืน</h1>
              <h1 className='text-sm font-sans-serif font-bold flex-1 pl-18 text-center'>ยกเลิก</h1>
            </div>
          </div>

          {sortedItems.map((item, index) => (
            <div key={index} className={`mx-40 mt-5 mr-40 shadow-lg ${getStatusColor(item.status)}`}>
              <div className='flex items-center p-6'>

                
                <div className="">
                  <img src={item.image} alt={item.text.split('\n')[0]} className='h-32 w-46 mt-5 object-cover rounded-lg shadow-xl' />
                </div>
                <div className='flex-1 ml-4 '>
                  <div className='text-black text-l mt-10 font-bold'>{item.text.split('\n')[0]}</div>
                  <div className='text-gray-500 text-xs'>{item.text.split('\n')[1]}</div>
                </div>
                <div className='flex-1 flex-col items-center mt-9 pl-7 w-20'>
                  <p className='text-black text-sm'>{item.price} ฿</p>
                </div>
                <div className='flex-1 flex-col items-center mt-9 pl-8 w-10'>
                  <p className='text-black text-sm'>{item.quantity}</p>
                </div>
                <div className='flex-1 flex-col items-center mt-9 w-10'>
                  <p className='text-black text-sm'>{item.price * item.quantity} ฿</p>
                </div>
                <div className='flex-1 flex-col items-center pr-5 mt-9 w-10'>
                  <p className='text-black text-sm'>{item.borrowDate}</p>
                </div>
                <div className='flex-1 flex-col items-center mt-9 pr-2 w-18'>
                  <p className='text-black text-sm'>{item.returnDate}</p>
                </div>
                <div className='flex justify-center mt-9 w-20'>
                  <button className='text-red-500'><IoClose size={20} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default rentailinfo;
