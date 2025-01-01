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

  const handleApprove = async (id) => {
    try {
      const request = borrowRequests.find((req) => req.id === id);
      if (!request) return;

      const response = await fetch(`http://172.24.32.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: "กำลังยืม" } }),
      });

      if (response.ok) {
        setBorrowRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: "กำลังยืม" } : request
          )
        );

        // Save to /api/checks
        await saveToCheck({
          name: request.name,
          label: request.label,
          status: "กำลังยืม",
          Borrowing_date: request.borrowDate,
          Due: request.returnDate,
        });

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
      const request = borrowRequests.find((req) => req.id === id);
      if (!request) return;

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

        // Save to /api/checks
        await saveToCheck({
          name: request.name,
          label: request.label,
          status: "ถูกปฏิเสธ",
          Borrowing_date: request.borrowDate,
          Due: request.returnDate,
        });

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
                  <tr key={request.id} className="hover:bg-gray-50">
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
