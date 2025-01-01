"use client";

import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const RentalInfo = () => {
  const [rentalItems, setRentalItems] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRentalData = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `http://172.24.32.1:1337/api/borrows?filters[email][$eq]=${session.user.email}&populate=*`
        );

        if (response.ok) {
          const data = await response.json();
          const items = data.data.map((item) => ({
            id: item.id,
            label: item.attributes.label,
            price: item.attributes.Price,
            quantity: item.attributes.amount,
            borrowDate: item.attributes.borrowDate,
            returnDate: item.attributes.returnDate,
            status: item.attributes.status,
            image: item.attributes.image?.data?.attributes?.url || "/default.jpg",
          }));
          setRentalItems(items);
        } else {
          console.error("Failed to fetch rental data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching rental data:", error);
      }
    };

    fetchRentalData();
  }, [session?.user?.email]);

  const getStatusColor = (status) => {
    switch (status) {
      case "not_returned":
        return "bg-red-200";
      case "borrowing":
        return "bg-yellow-200";
      case "returned":
        return "bg-green-200";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "not_returned":
        return "ไม่คืน";
      case "borrowing":
        return "กำลังยืม";
      case "returned":
        return "คืนแล้ว";
      default:
        return "สถานะไม่ระบุ";
    }
  };

  const handleCancelItem = async (id) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRentalItems(rentalItems.filter((item) => item.id !== id));
        alert("ยกเลิกการยืมสำเร็จ");
      } else {
        console.error("Failed to cancel item:", await response.text());
        alert("เกิดข้อผิดพลาดในการยกเลิก");
      }
    } catch (error) {
      console.error("Error canceling item:", error);
      alert("เกิดข้อผิดพลาดในการยกเลิก");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">แสดงข้อมูลการยืม</h1>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {/* Header Row */}
            <div className="grid grid-cols-8 text-gray-700 font-semibold border-b pb-4 mb-4 text-center">
              <div>รายการอุปกรณ์</div>
              <div>ราคาต่อชิ้น</div>
              <div>จำนวน</div>
              <div>ราคารวม</div>
              <div>วันที่ยืม</div>
              <div>กำหนดคืน</div>
              <div>สถานะ</div>
              <div>ยกเลิก</div>
            </div>

            {rentalItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีข้อมูลการยืม</div>
            ) : (
              rentalItems.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-8 gap-4 items-center py-4 px-4 mb-4 rounded-lg shadow ${getStatusColor(
                    item.status
                  )}`}
                >
                  <div className="flex items-center">
                    {/* <img
                      src={item.image}
                      alt={item.label}
                      className="h-12 w-12 object-cover rounded-lg shadow-md"
                    /> */}
                    <div className="ml-4">
                      <p className="text-lg font-bold text-gray-800">{item.label}</p>
                    </div>
                  </div>
                  <div className="text-center">{item.price} ฿</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">{item.price * item.quantity} ฿</div>
                  <div className="text-center">{item.borrowDate || "N/A"}</div>
                  <div className="text-center">{item.returnDate || "N/A"}</div>
                  <div className="text-center">{getStatusText(item.status)}</div>
                  <div className="text-center">
                    <IoClose
                      className="text-red-500 text-xl mx-24 cursor-pointer hover:text-red-700"
                      onClick={() => handleCancelItem(item.id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default RentalInfo;
