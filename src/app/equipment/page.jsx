"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const EquipmentPage = () => {
  const [userEquipmentItems, setUserEquipmentItems] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserEquipmentItems = async () => {
      try {
        const response = await fetch(
          `http://172.24.32.1:1337/api/equipment?filters[email][$eq]=${session.user.email}&populate=image`
        );
        if (response.ok) {
          const data = await response.json();
          const items = data.data.map((item) => ({
            id: item.id,
            attributes: item.attributes,
            imageUrl:
              item.attributes.image?.data?.length > 0
                ? item.attributes.image.data[0].attributes.url.startsWith("http")
                  ? item.attributes.image.data[0].attributes.url
                  : `http://172.24.32.1:1337${item.attributes.image.data[0].attributes.url}`
                : null,
          }));
          setUserEquipmentItems(items);
        } else {
          console.error("Failed to fetch user equipment items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user equipment items:", error);
      }
    };

    fetchUserEquipmentItems();
  }, [session?.user?.email]);

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserEquipmentItems((prevItems) => prevItems.filter((item) => item.id !== id));
        alert("อุปกรณ์ถูกลบออกจากระบบสำเร็จ");
      } else {
        console.error("Failed to delete item from Strapi:", await response.text());
        alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
      }
    } catch (error) {
      console.error("Error deleting item from Strapi:", error);
      alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
    }
  };

  const handleGoToBorrowForm = async () => {
    if (!session?.user?.email) {
      alert("กรุณาเข้าสู่ระบบก่อนดำเนินการ");
      return;
    }

    try {
      const borrowData = userEquipmentItems.map((item) => {
        const borrowingDate = new Date().toISOString();
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);

        return {
          label: item.attributes?.label || "Unknown Item",
          Price: item.attributes?.Price || 0,
          amount: item.attributes?.amount || 0,
          email: session?.user?.email || "Unknown Email",
          name: session?.user?.name || "Unknown User",
          Borrowing_date: borrowingDate,
          Due: dueDate.toISOString(),
          image: item.attributes.image?.data?.id || null,
        };
      });

      for (const data of borrowData) {
        const response = await fetch("http://172.24.32.1:1337/api/borrows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error saving to Strapi:", errorText);
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          return;
        }
      }

      alert("บันทึกข้อมูลสำเร็จ!");
      router.push("/borrow-form");
    } catch (error) {
      console.error("Error saving data to Strapi:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">อุปกรณ์ที่ยืม</h1>

          {/* รายการอุปกรณ์ที่ผู้ใช้ยืม */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">รายการอุปกรณ์</h2>
            {userEquipmentItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีอุปกรณ์ที่ยืม</div>
            ) : (
              <>
                {/* Table Headings */}
                <div className="grid grid-cols-4 gap-4 py-2 px-4 border-b font-bold text-gray-700">
                  <div>รายการ</div>
                  <div className="text-center">ราคา</div>
                  <div className="text-center">จำนวน</div>
                  <div className="text-center">การจัดการ</div>
                </div>
                <div className="space-y-4">
                  {userEquipmentItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 items-center py-2 px-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <div className="flex items-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.attributes?.label || "Unknown Item"}
                            className="w-32 h-32 object-cover rounded-lg mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-gray-500">
                            ไม่มีรูปภาพ
                          </div>
                        )}
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">{item.attributes?.label}</h2>
                          <p className="text-sm text-gray-500">{item.attributes?.category || "N/A"}</p>
                        </div>
                      </div>
                      <div className="text-center">{item.attributes?.Price} ฿</div>
                      <div className="text-center">{item.attributes?.amount}</div>
                      <div className="text-center">
                        <IoClose
                          className="text-red-500 text-xl cursor-pointer hover:text-red-700"
                          onClick={() => handleDeleteItem(item.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ปุ่มพิมพ์แบบฟอร์ม */}
          <button
            className="bg-blue-500 text-white py-2 px-6 mt-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
            onClick={handleGoToBorrowForm}
          >
            พิมพ์แบบฟอร์มยืมอุปกรณ์
          </button>
        </div>
      </Layout>
    </div>
  );
};

export default EquipmentPage;
