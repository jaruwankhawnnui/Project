"use client";

import React, { useEffect, useState } from "react";
import Headeradmin from "@/components/Headeradmin";
import { useSession } from "next-auth/react";

export default function ApprovalPage() {
  const { data: session } = useSession();
  const [borrowRequests, setBorrowRequests] = useState([]);

  // Fetch borrow requests from API
  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const response = await fetch(`http://172.24.32.1:1337/api/borrows?populate=*`);
        if (response.ok) {
          const data = await response.json();
          const formattedRequests = data.data.map((item) => ({
            id: item.id,
            code: item.attributes.code || "N/A",
            name: item.attributes.name || "N/A",
            label: item.attributes.label || "N/A",
            borrowDate: item.attributes.Borrowing_date || "N/A",
            returnDate: item.attributes.Due || "N/A",
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
  }, []);

  const saveToCheck = async (data) => {
    try {
      const response = await fetch("http://172.24.32.1:1337/api/checks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        console.error("Error saving to /api/checks:", await response.text());
        alert("เกิดข้อผิดพลาดในการบันทึกสถานะ");
      }
    } catch (error) {
      console.error("Error saving to /api/checks:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกสถานะ");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status } }),
      });

      if (!response.ok) {
        console.error("Error updating status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating status in Strapi:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      const request = borrowRequests.find((req) => req.id === id);
      if (!request) return;

      await updateStatus(id, "กำลังยืม");

      setBorrowRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "กำลังยืม" } : request
        )
      );

      await saveToCheck({
        name: request.name,
        label: request.label,
        status: "กำลังยืม",
        Borrowing_date: request.borrowDate,
        Due: request.returnDate,
      });

      alert("การอนุมัติสำเร็จ");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ");
    }
  };

  const handleReject = async (id) => {
    try {
      const request = borrowRequests.find((req) => req.id === id);
      if (!request) return;

      await updateStatus(id, "ถูกปฏิเสธ");

      setBorrowRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "ถูกปฏิเสธ" } : request
        )
      );

      await saveToCheck({
        name: request.name,
        label: request.label,
        status: "ถูกปฏิเสธ",
        Borrowing_date: request.borrowDate,
        Due: request.returnDate,
      });

      alert("การปฏิเสธสำเร็จ");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธ");
    }
  };

  const handleMarkReturned = async (id) => {
    try {
      const request = borrowRequests.find((req) => req.id === id);
      if (!request) return;

      await updateStatus(id, "คืนแล้ว");

      setBorrowRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "คืนแล้ว" } : request
        )
      );

      await saveToCheck({
        name: request.name,
        label: request.label,
        status: "คืนแล้ว",
        Borrowing_date: request.borrowDate,
        Due: request.returnDate,
      });

      alert("การบันทึกคืนสำเร็จ");
    } catch (error) {
      console.error("Error marking item as returned:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกคืน");
    }
  };

  const getStatusClass = (status, returnDate) => {
    const now = new Date();
    if (status === "คืนแล้ว") return "bg-green-200";
    if (status === "กำลังยืม") return "bg-yellow-200";
    if (new Date(returnDate) < now) return "bg-red-200";
    if (status === "ถูกปฏิเสธ") return "bg-gray-200";
    return "";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="min-h-screen bg-gray-100 p-6">
          <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-md">
            <h1 className="text-xl font-bold">การอนุมัติการยืม</h1>
          </header>

          <section className="my-6 bg-white p-4 shadow-sm rounded-md">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 px-4 py-2">ชื่อผู้ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">สิ่งของที่ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">วันที่ยืม</th>
                  <th className="border border-gray-200 px-4 py-2">วันที่คืน</th>
                  <th className="border border-gray-200 px-4 py-2">สถานะ</th>
                  <th className="border border-gray-200 px-4 py-2">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {borrowRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={`${getStatusClass(request.status, request.returnDate)} hover:bg-gray-50`}
                  >
                    <td className="border border-gray-200 px-4 py-2">{request.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{request.label}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {new Date(request.borrowDate).toLocaleDateString("th-TH")}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {new Date(request.returnDate).toLocaleDateString("th-TH")}
                    </td>
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
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
                        onClick={() => handleMarkReturned(request.id)}
                      >
                        คืนแล้ว
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
