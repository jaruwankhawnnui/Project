"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { TiShoppingCart } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Card = ({ params }) => {
  const { data: session } = useSession(); // ดึงข้อมูลเซสชัน
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const id = params.id; // ดึง id จาก URL parameter
  const router = useRouter();

  useEffect(() => {
    console.log("Item ID from URL:", id);

    // ดึงข้อมูลอุปกรณ์จาก API
    if (id) {
      const fetchItemData = async () => {
        try {
          const response = await fetch(`http://172.20.160.1:1337/api/cartadmins/${id}?populate=*`);
          const result = await response.json();
          setSelectedItem(result.data);
        } catch (error) {
          setError(error);
          console.error("Error fetching item data:", error);
        }
      };

      fetchItemData();
    }
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const addToCart = async () => {
    try {
      // ตรวจสอบว่าผู้ใช้ล็อกอินแล้ว
      if (!session?.user?.name || !session?.user?.email) {
        alert("กรุณาล็อกอินก่อนเพิ่มสินค้าในรถเข็น");
        return;
      }
  
      // เตรียม payload ที่จะส่งไปยัง Strapi
      const payload = {
        data: {
          label: selectedItem.attributes?.Label || "Unknown Item", // ชื่ออุปกรณ์
          amount: quantity, // จำนวนที่เลือก
          username: session.user.name, // ชื่อผู้ใช้งาน
          email: session.user.email, // อีเมลของผู้ใช้งาน
          Price: selectedItem.attributes?.Price || 0, // ราคา
        },
      };
  
      console.log("Payload ที่จะส่งไปยัง Strapi:", payload);
  
      // ส่งคำขอ POST ไปยัง Strapi
      const response = await fetch(`http://172.20.160.1:1337/api/adds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("เพิ่มข้อมูลใน Strapi สำเร็จ:", result);
        alert("เพิ่มข้อมูลลงในรถเข็นสำเร็จ");
      } else {
        const errorText = await response.text();
        console.error("เกิดข้อผิดพลาด:", errorText);
        alert(`เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding to Strapi:", error);
      alert("เกิดข้อผิดพลาด: ไม่สามารถเพิ่มอุปกรณ์ลงในรถเข็นได้");
    }
  };
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!selectedItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Layout>
        <div className="bg-white rounded-lg p-10 mx-60 flex items-start shadow-lg">
          <div className="w-48 h-48 bg-gray-300 border-2 border-gray-500 rounded-md overflow-hidden">
            <img
              src={selectedItem.attributes?.image?.data?.attributes?.url || "/default.jpg"}
              alt={selectedItem.attributes?.Label || "No image available"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-6 flex-1">
            <h2 className="text-2xl font-bold">
              {selectedItem.attributes?.Label || "Unknown Item"}
            </h2>
            <p className="text-gray-500">
              {selectedItem.attributes?.Category || "Unknown Category"}
            </p>
            <p className="text-purple-600 text-xl">
              ฿{selectedItem.attributes?.Price || "Unknown Price"}
            </p>
            <div className="mt-4">
              <p className="text-gray-700">จำนวน</p>
              <div className="flex items-center mt-2">
                <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-300 rounded-l">
                  -
                </button>
                <span className="px-4 py-1 bg-white border-t border-b">{quantity}</span>
                <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-300 rounded-r">
                  +
                </button>
              </div>
              <div className="flex mt-4">
                <button
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded mr-2"
                  onClick={addToCart}
                >
                  <TiShoppingCart className="mr-2" /> เพิ่มไปยังรถเข็น
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-10 mx-60 mt-6 shadow-lg ">
          <h2 className="text-xl font-bold mb-2">รายละเอียดเพิ่มเติม</h2>
          <p className="text-gray-700">
            {selectedItem.attributes?.Detail || "ไม่มีรายละเอียดเพิ่มเติม"}
          </p>
        </div>
      </Layout>
    </div>
  );
};

export default Card;
