// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
// import MainHeader from "@/components/MainHeader";

// const Home = () => {
//   const [data, setData] = useState(null);    // สถานะเก็บข้อมูลจาก API
//   const [loading, setLoading] = useState(true);  // สถานะการโหลด
//   const [error, setError] = useState(null);  // สถานะข้อผิดพลาด
//   const [selectedCategory, setSelectedCategory] = useState(null); // เก็บประเภทที่เลือก

//   const router = useRouter(); // ใช้ useRouter จาก next/navigation

//   // useEffect เพื่อดึงข้อมูลเมื่อ component ถูก mount
//   useEffect(() => {
//     fetch('http://172.19.224.1:1337/api/cartadmins?populate=*') // ดึงข้อมูลจาก API
//       .then((response) => {
//         if (!response.ok) {
//           // ถ้าตอบกลับไม่สำเร็จ ให้โยน error
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json(); // แปลงข้อมูลที่ได้เป็น JSON
//       })
//       .then((data) => {
//         setData(data); // บันทึกข้อมูลลง state
//         setLoading(false); // หยุดการแสดง Loading
//       })
//       .catch((error) => {
//         setError(error); // บันทึก error ลง state
//         setLoading(false); // หยุดการแสดง Loading
//       });
//   }, []); // ทำงานแค่ครั้งเดียวหลังจาก mount

//   // ถ้ายังอยู่ในสถานะการโหลดข้อมูล
//   if (loading) {
//     return <div>Loading...</div>; // แสดง Loading เมื่อยังไม่ได้ข้อมูล
//   }

//   // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
//   if (error) {
//     return <div>Error: {error.message}</div>; // แสดงข้อผิดพลาดเมื่อดึงข้อมูลไม่สำเร็จ
//   }

//   // ฟังก์ชันสำหรับจัดการเมื่อคลิกที่การ์ดของอุปกรณ์
//   const handleCardClick = (category) => {
//     setSelectedCategory(category); // บันทึกประเภทที่ถูกเลือก
//   };

//   // ฟังก์ชันสำหรับแสดงการ์ดของอุปกรณ์ที่กรองตามประเภทที่เลือก
//   const renderItemsByCategory = () => {
//     // ถ้าไม่ได้เลือกหมวดหมู่ใด แสดงการ์ดทั้งหมด
//     if (!selectedCategory) {
//       return data.data.map((item, index) => (
//         <div 
//           key={index} 
//           className="relative bg-gray-200 rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
//           onClick={() => handleCardClick(item.attributes?.Category)} // เมื่อกดการ์ด จะแสดงอุปกรณ์ในหมวดหมู่นั้น
//         >
//           {/* แสดงรูปภาพของอุปกรณ์ */}
//           {item.attributes?.image?.data?.attributes?.url && (
//             <img 
//               src={item.attributes.image.data.attributes.url} 
//               className="w-full h-36 object-cover mb-4 mt-1 rounded-lg" 
//               alt={item.attributes?.Label}
//             />
//           )}
//           {/* แสดงชื่อและหมวดหมู่ของอุปกรณ์ */}
//           <div className="text-center">
//             <div className="font-bold text-sm">{item.attributes?.Label}</div>
//             <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
//           </div>
//         </div>
//       ));
//     }

//     // ถ้าเลือกหมวดหมู่แล้ว แสดงอุปกรณ์เฉพาะหมวดหมู่นั้น
//     return data.data
//       .filter((item) => item.attributes?.Category === selectedCategory) // กรองตามหมวดหมู่ที่เลือก
//       .map((item, index) => (
//         <div 
//           key={index} 
//           className="relative bg-gray-200 rounded-lg p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
//         >
//           {/* แสดงรูปภาพของอุปกรณ์ */}
//           {item.attributes?.image?.data?.attributes?.url && (
//             <img 
//               src={item.attributes.image.data.attributes.url} 
//               className="w-full h-36 object-cover mb-4 mt-1 rounded-lg" 
//               alt={item.attributes?.Label}
//             />
//           )}
//           {/* แสดงชื่อและหมวดหมู่ของอุปกรณ์ */}
//           <div className="text-center">
//             <div className="font-bold text-sm">{item.attributes?.Label}</div>
//             <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
//           </div>
//         </div>
//       ));
//   };

//   return (
//     <div className='bg-gray-100 min-h-screen flex flex-col'>
//       <MainHeader />
      
//       <div className="flex justify-center items-start flex-wrap mt-0">
//         {/* ถ้ามี selectedCategory ให้แสดงปุ่มย้อนกลับ */}
//         {selectedCategory && (
//           <button 
//             className="mb-5 p-2 bg-blue-500 text-white rounded"
//             onClick={() => setSelectedCategory(null)} // กดเพื่อยกเลิกการกรองหมวดหมู่
//           >
//             Back to All Items
//           </button>
//         )}
//         {renderItemsByCategory()} {/* แสดงรายการอุปกรณ์ตามหมวดหมู่ */}
//       </div>
//     </div>
//   );
// };

// export default Home;