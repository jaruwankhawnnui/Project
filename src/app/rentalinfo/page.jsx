"use client";

import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const RentalInfo = () => {
  const [rentalItems, setRentalItems] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchRentalData = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch(
          `https://coe-hardware-lab-website-ievu.onrender.com/api/borrows?filters[email][$eq]=${session.user.email}&populate=*`
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
            status: item.attributes.status || "รอดำเนินการ",
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
      await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/borrows/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { status } }),
      });
    } catch (error) {
      console.error("Error updating status in /api/borrows:", error);
    }
  };

  const getStatusClass = (status, dueDate) => {
    const now = new Date();
    if (status === "รายการกำลังยืม") return "bg-yellow-200";
    if (status === "รายการถูกปฏิเสธ") return "bg-gray-300";
    if (status === "รายการคืนสำเร็จ") return "bg-green-200";
    if (new Date(dueDate) < now) return "bg-red-200";
    return "bg-[#A2E2F8]"; // สีสำหรับ "รอดำเนินการ"
  };

  const getStatusText = (status, dueDate) => {
    const now = new Date();
    if (status === "รายการกำลังยืม") return "รายการกำลังยืม";
    if (status === "รายการถูกปฏิเสธ") return "รายการถูกปฏิเสธ";
    if (status === "รายการคืนสำเร็จ") return "รายการคืนสำเร็จ";
    if (new Date(dueDate) < now) return "รายการเกินกำหนดคืน";
    return "รอดำเนินการ";
  };

  useEffect(() => {
    rentalItems.forEach((item) => {
      const now = new Date();
      if (new Date(item.dueDate) < now && item.status !== "รายการเกินกำหนดคืน") {
        updateStatusInBorrow(item.id, "รายการเกินกำหนดคืน");
      }
    });
  }, [rentalItems]);


  const statusOrder = {
    "รายการเกินกำหนดคืน": 1,
    "รายการกำลังยืม": 2,
    "รายการคืนสำเร็จ": 3,
    "รายการถูกปฏิเสธ": 4,
    "รอดำเนินการ": 5,
  };

  const sortedRentalItems = [...rentalItems].sort((a, b) => {
    const statusA = getStatusText(a.status, a.dueDate);
    const statusB = getStatusText(b.status, b.dueDate);

    return (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mt-10 mx-auto px-4 sm:px-4 lg:px-4 pb-8">

          <div className="flex justify-center  items-center bg-[#465B7E] p-3 rounded-lg mb-6">
            <h1 className="w-full text-white text-3xl pl-10 font-bold">
              แสดงข้อมูลการยืม
            </h1>
          </div>

          <div className="bg-cyan-50 shadow-lg rounded-lg p-6 overflow-x-auto">

            <div className="grid grid-cols-7 text-white gap-4 py-3 px-4 font-bold border-b  
            mb-4 bg-[#5a7dbb] rounded-md min-w-[900px]">
              <div className="text-center">รายการอุปกรณ์</div>
              <div className="text-center">ราคา/ชิ้น</div>
              <div className="text-center">จำนวน</div>
              <div className="text-center">ราคารวม</div>
              <div className="text-center">วันที่ยืม</div>
              <div className="text-center">กำหนดคืน</div>
              <div className="text-center">สถานะ</div>
            </div>

            {sortedRentalItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีข้อมูลการยืม</div>
            ) : (
              sortedRentalItems.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-7 gap-4  min-w-[900px] items-center py-2 px-4 mb-4 rounded-lg shadow ${getStatusClass(
                    item.status,
                    item.dueDate
                  )}`}
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-md font-normal text-gray-800">{item.label}</p>
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
                  <div className="text-center">
                    {getStatusText(item.status, item.dueDate)}
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
