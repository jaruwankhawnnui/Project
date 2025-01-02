"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { TiShoppingCart } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
          const response = await fetch(`http://172.29.80.1:1337/api/cartadmins/${id}?populate=*`);
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
  
      const response = await fetch(`http://172.29.80.1:1337/api/adds`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("เพิ่มข้อมูลใน Strapi สำเร็จ:", result);
        alert("เพิ่มข้อมูลลงในรถเข็นสำเร็จ");
      } else {
        const errorText = await response.text();
        alert(`เกิดข้อผิดพลาด: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding to Strapi:", error);
      alert("เกิดข้อผิดพลาด: ไม่สามารถเพิ่มอุปกรณ์ลงในรถเข็นได้");
    }
  };
  

  if (!selectedItem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
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
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-l"
                  disabled={isLoading}
                >
                  -
                </button>
                <span className="px-4 py-1 bg-white border-t border-b">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-1 bg-gray-300 rounded-r"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
              <div className="flex mt-4">
                <button
                  className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded mr-2 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                  onClick={addToCart}
                  disabled={isLoading}
                >
                  <TiShoppingCart className="mr-2" />
                  {isLoading ? "กำลังเพิ่ม..." : "เพิ่มไปยังรถเข็น"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-10 mx-60 mt-6 shadow-lg">
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
