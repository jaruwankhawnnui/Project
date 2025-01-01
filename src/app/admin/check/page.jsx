"use client";

import React, { useEffect, useState } from "react";
import Headeradmin from "@/components/Headeradmin";
import { useSession } from "next-auth/react";

export default function ApprovalPage() {
  const { data: session } = useSession();
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch borrow requests from API
  useEffect(() => {
    const fetchBorrowRequests = async () => {
      if (!session || !session.user || !session.user.email) {
        console.error("No user session found.");
        return;
      }

      try {
        const response = await fetch(
          `http://172.24.32.1:1337/api/borrows?populate=*`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedRequests = data.data.map((item) => ({
            id: item.id,
            code: item.attributes.code || "N/A",
            name: item.attributes.name || "N/A",
            item: item.attributes.label || "N/A",
            borrowDate: item.attributes.borrowDate || "N/A",
            returnDate: item.attributes.returnDate || "N/A",
            status: item.attributes.status || "รอการอนุมัติ",
          }));
          setBorrowRequests(formattedRequests);
        } else {
          console.error("Failed to fetch borrow requests:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching borrow requests:", error);
      }
    };

    fetchBorrowRequests();
  }, [session]);

  const saveToStrapi = async (data) => {
    try {
      const response = await fetch("http://172.24.32.1:1337/api/checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        console.error("Error saving data to Strapi:", await response.text());
      } else {
        console.log("Data saved to Strapi successfully.");
      }
    } catch (error) {
      console.error("Error saving to Strapi:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: "อนุมัติแล้ว" } }),
      });

      if (response.ok) {
        setBorrowRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "อนุมัติแล้ว" } : request
          )
        );

        const request = borrowRequests.find((req) => req.id === id);
        if (request) {
          // Save approval data to Strapi
          await saveToStrapi({
            code: request.code,
            name: request.name,
            email: session.user.email,
            item: request.item,
            status: "อนุมัติแล้ว",
            borrowDate: request.borrowDate,
            returnDate: request.returnDate,
          });
        }

        alert("การอนุมัติสำเร็จ");
      } else {
        console.error("Error approving request:", await response.text());
        alert("เกิดข้อผิดพลาดในการอนุมัติ");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: "ถูกปฏิเสธ" } }),
      });

      if (response.ok) {
        setBorrowRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "ถูกปฏิเสธ" } : request
          )
        );

        const request = borrowRequests.find((req) => req.id === id);
        if (request) {
          // Save rejection data to Strapi
          await saveToStrapi({
            code: request.code,
            name: request.name,
            email: session.user.email,
            item: request.item,
            status: "ถูกปฏิเสธ",
            borrowDate: request.borrowDate,
            returnDate: request.returnDate,
          });
        }

        alert("การปฏิเสธสำเร็จ");
      } else {
        console.error("Error rejecting request:", await response.text());
        alert("เกิดข้อผิดพลาดในการปฏิเสธ");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const filteredRequests = borrowRequests.filter((request) => {
    if (statusFilter !== "ทั้งหมด" && request.status !== statusFilter) return false;
    if (startDate && new Date(request.borrowDate) < new Date(startDate)) return false;
    if (endDate && new Date(request.returnDate) > new Date(endDate)) return false;
    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="min-h-screen bg-gray-100 p-6">
          <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-md">
            <h1 className="text-xl font-bold">การอนุมัติการยืม</h1>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="ค้นหา..."
                className="border border-gray-300 rounded-md px-4 py-2"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                กลับ
              </button>
            </div>
          </header>

          <section className="my-6 bg-white p-4 shadow-sm rounded-md">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 px-4 py-2">รหัสคำขอ</th>
                  <th className="border border-gray-200 px-4 py-2">ชื่อผู้ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">สิ่งของที่ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">วันที่ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">วันที่คืน</th>
                  <th className="border border-gray-200 px-4 py-2">สถานะ</th>
                  <th className="border border-gray-200 px-4 py-2">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{request.code}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.item}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.borrowDate}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.returnDate}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.status}</td>
                    <td className="border border-gray-200 px-4 py-2 flex gap-2">
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
                        onClick={() => handleApprove(request.id)}
                      >
                        อนุมัติ
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                        onClick={() => handleReject(request.id)}
                      >
                        ปฏิเสธ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Headeradmin>
    </div>
  );
}
