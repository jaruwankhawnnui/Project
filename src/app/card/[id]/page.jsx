"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { TiShoppingCart } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ เพิ่มไอคอนโหลด
import { motion } from "framer-motion";

const Card = ({ params }) => {
  const { data: session } = useSession();
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchItemData = async () => {
        try {
          const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/cartadmins/${id}?populate=*`);
          if (!response.ok) {
            throw new Error("Failed to fetch item data");
          }
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
    setIsLoading(true);
    try {
      const formData = new FormData();

      // ส่งข้อมูลรูปภาพ (ไฟล์)
      if (selectedItem.attributes?.image?.data?.attributes?.url) {
        const response = await fetch(selectedItem.attributes.image.data.attributes.url);
        const blob = await response.blob();
        formData.append("files.image", blob, "image.jpg");
      }

      // ส่งข้อมูลอื่น ๆ
      formData.append(
        "data",
        JSON.stringify({
          label: selectedItem.attributes?.Label || "Unknown Item",
          amount: quantity,
          username: session.user.name,
          email: session.user.email,
          Price: selectedItem.attributes?.Price || 0,
        })
      );

      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/adds`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("เพิ่มข้อมูลใน Strapi สำเร็จ",response);
        setIsLoading(false); // อัปเดต state ให้หยุด loading

      } else {
        const errorText = await response.text();
        alert(`เกิดข้อผิดพลาด: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding to Strapi:", error);
      alert("เกิดข้อผิดพลาด: ไม่สามารถเพิ่มอุปกรณ์ลงในรถเข็นได้");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedItem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  const totalItems = selectedItem.attributes?.item || 0;
  const usedItems = selectedItem.attributes?.Borrowed || 0;
  const remainingItems = totalItems - usedItems >= 0 ? totalItems - usedItems : 0; // ✅ ป้องกันค่าติดลบ

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Layout>
        <div className="bg-cyan-50 rounded-lg p-10 mx-auto max-w-5xl flex flex-col md:flex-row items-start shadow-lg">
          <div className="w-full md:w-80 h-80 bg-gray-300 border-2 border-gray-500 rounded-md overflow-hidden">
            <img
              src={selectedItem.attributes?.image?.data?.attributes?.url || "/default.jpg"}
              alt={selectedItem.attributes?.Label || "No image available"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-0 md:ml-6 flex-1 mt-6 md:mt-0">
            <h2 className="text-2xl font-bold">
              {selectedItem.attributes?.Label || "Unknown Item"}
            </h2>
            <p className="text-gray-500">
              {selectedItem.attributes.categoriesadmin.data?.attributes?.name || "Unknown Category"}
            </p>
            <p className="text-purple-600 text-xl">
              ฿{selectedItem.attributes?.Price || "Unknown Price"}
            </p>

            {/* ✅ แสดงจำนวนคงเหลือของอุปกรณ์ */}
            <p className="text-gray-700 mt-4">📦 จำนวนทั้งหมด: {totalItems} ชิ้น</p>
            <p className="text-red-600">🛒 ถูกยืมไปแล้ว: {usedItems} ชิ้น</p>
            <p className="text-green-600 font-semibold">✅ คงเหลือ: {remainingItems} ชิ้น</p>

            <div className="mt-4">
              <p className="text-gray-700">จำนวนที่ต้องการยืม</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-l"
                  disabled={isLoading || quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-white border-t border-b">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-r"
                  disabled={isLoading || quantity >= remainingItems}
                >
                  +
                </button>
              </div>

              <div className="flex mt-4">
                <button
                  className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded mr-2 ${isLoading || quantity > remainingItems ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={addToCart}
                  disabled={isLoading || quantity > remainingItems}
                >
                  <TiShoppingCart className="mr-2" />
                  {isLoading ? "กำลังเพิ่ม..." : "เพิ่มไปยังรถเข็น"}
                </button>
              </div>

            </div>

          </div>

        </div>
        <div className="bg-cyan-50 rounded-lg p-10 mx-auto max-w-5xl mt-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">รายละเอียดเพิ่มเติม</h2>
          <p className="text-gray-700">
            {selectedItem.attributes?.Detail || "ไม่มีรายละเอียดเพิ่มเติม"}
          </p>
        </div>
        {/* ✅ แสดง Loading Overlay พร้อมไอคอนหมุน */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AiOutlineLoading3Quarters className="text-5xl text-blue-500 animate-spin" /> {/* ✅ ไอคอนหมุน */}
              <p className="text-xl font-bold text-blue-500 mt-3">กำลังโหลด...</p>
            </motion.div>
          </div>
        )}

      </Layout>
    </div>
  );
};

export default Card; 