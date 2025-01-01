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
            borrowingDate: item.attributes.Borrowing_date,
            dueDate: item.attributes.Due,
            status: item.attributes.status || "N/A", // Fetch existing status
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

  const updateStatusInBorrow = async (id, status) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { status } }),
      });

      if (response.ok) {
        console.log(`Status for item ${id} updated to: ${status}`);
      } else {
        console.error(`Failed to update status for item ${id}:`, await response.text());
      }
    } catch (error) {
      console.error("Error updating status in /api/borrows:", error);
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

  const getStatusClass = (status, dueDate) => {
    const now = new Date();
    if (status === "กำลังยืม") return "bg-yellow-200";
    if (status === "ปฏิเสธ") return "bg-gray-200"; // Rejected status
    if (new Date(dueDate) < now) return "bg-red-200";
    return "";
  };

  const getStatusText = (status, dueDate) => {
    const now = new Date();
    if (status === "กำลังยืม") return "กำลังยืม";
    if (status === "ปฏิเสธ") return "ถูกปฏิเสธ"; // Rejected status
    if (new Date(dueDate) < now) return "เลยกำหนด";
    return "N/A";
  };

  useEffect(() => {
    // Update status in /api/borrows based on due dates
    rentalItems.forEach((item) => {
      const now = new Date();
      if (new Date(item.dueDate) < now && item.status !== "เลยกำหนด") {
        updateStatusInBorrow(item.id, "เลยกำหนด");
      } else if (item.status === "กำลังยืม") {
        updateStatusInBorrow(item.id, "กำลังยืม");
      }
    });
  }, [rentalItems]);

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
                  className={`grid grid-cols-8 gap-4 items-center py-4 px-4 mb-4 rounded-lg shadow ${getStatusClass(
                    item.status,
                    item.dueDate
                  )}`}
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-lg font-bold text-gray-800">{item.label}</p>
                    </div>
                  </div>
                  <div className="text-center">{item.price} ฿</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-center">{item.price * item.quantity} ฿</div>
                  <div className="text-center">
                    {new Date(item.borrowingDate).toLocaleDateString("th-TH") || "N/A"}
                  </div>
                  <div className="text-center">
                    {new Date(item.dueDate).toLocaleDateString("th-TH") || "N/A"}
                  </div>
                  <div className="text-center font-semibold">
                    {getStatusText(item.status, item.dueDate)}
                  </div>
                  <div className="text-center">
                    <IoClose
                      className="text-red-500 mx-24 text-xl cursor-pointer hover:text-red-700"
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
