"use client";
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { TiShoppingCart } from "react-icons/ti"; // เพิ่มการ import ไอคอน
import { useRouter } from 'next/navigation'; // ใช้ useRouter สำหรับเปลี่ยนเส้นทาง

const Card = ({ params }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);  // เพิ่ม state สำหรับจำนวน
  const id = params.id;  // ดึง id จาก props ที่ส่งมาจาก App Router
  const router = useRouter();  // ใช้ useRouter เพื่อเปลี่ยนเส้นทาง

  useEffect(() => {
    console.log("Item ID from URL:", id);  // ตรวจสอบว่า id ถูกดึงมาได้หรือไม่

    if (id) {
      // ดึงข้อมูลจาก API โดยใช้ id ที่ได้จาก URL
      const fetchData = async () => {
        try {
          const response = await fetch(`http://172.19.224.1:1337/api/cartadmins/${id}?populate=*`);
          const result = await response.json();
          setSelectedItem(result.data);
        } catch (error) {
          setError(error);
          console.error("Error fetching item data:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // ฟังก์ชันเพิ่มจำนวน
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // ฟังก์ชันลดจำนวน (ไม่ให้ต่ำกว่า 1)
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // ฟังก์ชันเพิ่มอุปกรณ์ไปยังรถเข็น
  const addToCart = () => {
    // จัดการข้อมูลสำหรับเพิ่มลงในรถเข็น
    const cartItem = {
      ...selectedItem,
      quantity: quantity,
    };
    let cart = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cart.push(cartItem);
    sessionStorage.setItem('cartItems', JSON.stringify(cart));
    alert("เพิ่มอุปกรณ์ลงในรถเข็นเรียบร้อยแล้ว");
  };

  // ฟังก์ชันยืมอุปกรณ์
  const borrowEquipment = () => {
    // จัดการข้อมูลสำหรับเพิ่มในรายการยืม
    const borrowedItem = {
      ...selectedItem,
      quantity: quantity,
    };
    let borrowed = JSON.parse(sessionStorage.getItem('borrowedItems')) || [];
    borrowed.push(borrowedItem);
    sessionStorage.setItem('borrowedItems', JSON.stringify(borrowed));
    
    // เปลี่ยนเส้นทางไปยังหน้ายืมอุปกรณ์
    router.push('/equipment');  // เปลี่ยนไปยังหน้า EquipmentPage
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!selectedItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-gray-100 flex flex-col min-h-screen '>
      <Layout>
        <div className='bg-white rounded-lg p-10 mx-60 flex items-start shadow-lg'>
          <div className='w-48 h-48 bg-gray-300 border-2 border-gray-500 rounded-md overflow-hidden'>
            <img 
              src={selectedItem.attributes?.image?.data?.attributes?.url || "/default.jpg"} 
              alt={selectedItem.attributes?.Label || "No image available"} 
              className='w-full h-full object-cover' 
            />
          </div>
          <div className='ml-6 flex-1'>
            <h2 className='text-2xl font-bold'>{selectedItem.attributes?.Label || "Unknown Item"}</h2>
            <p className='text-gray-500'>{selectedItem.attributes?.Category || "Unknown Category"}</p>
            <p className='text-purple-600 text-xl'>฿{selectedItem.attributes?.Price || "Unknown Price"}</p>
            <div className='mt-4'>
              <p className='text-gray-700'>จำนวน</p>
              <div className='flex items-center mt-2'>
                <button onClick={decreaseQuantity} className='px-3 py-1 bg-gray-300 rounded-l'>-</button>
                <span className='px-4 py-1 bg-white border-t border-b'>{quantity}</span>
                <button onClick={increaseQuantity} className='px-3 py-1 bg-gray-300 rounded-r'>+</button>
                <span className='ml-4 text-gray-500'>มีอุปกรณ์ทั้งหมด {selectedItem.attributes?.item || 15} ชิ้น</span>
              </div>
              <div className='flex mt-4'>
                <button className='flex items-center px-4 py-2 bg-blue-500 text-white rounded mr-2' onClick={addToCart}>
                  <TiShoppingCart className='mr-2' /> เพิ่มไปยังรถเข็น
                </button>
                <button className='px-4 py-2 bg-green-500 text-white rounded' onClick={borrowEquipment}>ยืมอุปกรณ์</button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg p-10 mt-5 mx-60 flex flex-col shadow-lg'>
          <h2 className='text-l font-bold mb-4'>รายละเอียดอุปกรณ์</h2>
          <p className='text-gray-700'>
            {selectedItem.attributes?.Detail || "No description available."}
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default Card;
