"use client";

import React, { useEffect, useState } from "react";
import Headeradmin from "@/components/Headeradmin";
import { useSession } from "next-auth/react";

export default function ApprovalPage() {
  const { data: session } = useSession();
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("รอดำเนินการ"); // Tab เริ่มต้น
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [searchTerm, setSearchTerm] = useState(""); // สำหรับการค้นหา
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  // Fetch borrow requests from API
  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const response = await fetch(`http://172.31.0.1:1337/api/borrows?populate=*`);
        if (response.ok) {
          const data = await response.json();
          const formattedRequests = data.data.map((item) => ({
            id: item.id,
            code: item.attributes.code || "N/A",
            name: item.attributes.name || "N/A",
            label: item.attributes.label || "N/A",
            borrowDate: item.attributes.Borrowing_date || "N/A",
            returnDate: item.attributes.Due || "N/A",
            status: item.attributes.status || "รอดำเนินการ",
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

  const filteredRequests = (status) =>
    borrowRequests.filter(
      (request) =>
        request.status === status &&
        (request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.label.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://172.31.0.1:1337/api/borrows/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: newStatus } }),
      });
      if (response.ok) {
        setBorrowRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: newStatus } : req
          )
        );
        alert("สถานะถูกอัปเดตเรียบร้อยแล้ว");
      } else {
        console.error("Failed to update status:", await response.text());
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const viewPDF = async (id) => {
    try {
      const response = await fetch(`http://172.31.0.1:1337/api/borrows/${id}?populate=form`);
      if (response.ok) {
        const data = await response.json();
        console.log("Borrow Data:", data);

        const formArray = data?.data?.attributes?.form?.data;

        if (!formArray || formArray.length === 0) {
          alert("❌ ฟอร์มยังไม่ได้เชื่อมโยงกับไฟล์ PDF ในระบบ");
          return;
        }

        const form = formArray[0]; // เข้าถึงข้อมูลใน form.data[0]
        const pdfUrl = form.attributes?.url;

        console.log("Full PDF URL:", pdfUrl);

        if (pdfUrl) {
          window.open(pdfUrl, "_blank");
        } else {
          alert("❌ ไม่พบ URL ของไฟล์ PDF");
        }
      } else {
        console.error("Error fetching form PDF:", await response.text());
        alert("❌ เกิดข้อผิดพลาดในการดึงฟอร์ม PDF");
      }
    } catch (error) {
      console.error("Error fetching form PDF:", error);
      alert("❌ เกิดข้อผิดพลาดในการดึงฟอร์ม PDF");
    }
  };



  const getStatusClass = (status) => {
    switch (status) {
      case "รอดำเนินการ":
        return "bg-blue-50";
      case "กำลังยืม":
        return "bg-yellow-50";
      case "เลยกำหนด":
        return "bg-red-100";
      case "คืนแล้ว":
        return "bg-green-100";
      case "ถูกปฏิเสธ":
        return "bg-gray-200";
      default:
        return "";
    }
  };

  const tabs = [
    { label: "รอดำเนินการ", status: "รอดำเนินการ" },
    { label: "รายการกำลังยืม", status: "กำลังยืม" },
    { label: "รายการที่เลยกำหนด", status: "เลยกำหนด" },
    { label: "รายการที่คืนแล้ว", status: "คืนแล้ว" },
    { label: "รายการที่ถูกปฏิเสธ", status: "ถูกปฏิเสธ" },
  ];

  // Pagination Logic
  const requests = filteredRequests(activeTab);
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = requests.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="min-h-screen  bg-gray-100 p-6">
          {/* Tab Navigation */}
          <nav className="flex  font-bold  text-lg bg-blue-100 text-gray-700  rounded-lg mb-6 h-14">
            {tabs.map((tab) => (
              <button
                key={tab.status}
                onClick={() => {
                  setActiveTab(tab.status);
                  setSearchTerm(""); // รีเซ็ตคำค้นหาเมื่อเปลี่ยนแท็บ
                  setCurrentPage(1); // รีเซ็ตหน้าเมื่อเปลี่ยนแท็บ
                }}
                className={`px-20 py-6 h-full flex items-center justify-center
        ${activeTab === tab.status ? "bg-blue-400" : "bg-blue-100"} 
        hover:bg-blue-400 focus:outline-none transition rounded-lg`}
              >
                {tab.label}
              </button>
            ))}
          </nav>


          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="ค้นหาในส่วนนี้"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md p-2  text-sm w-full"
            />
          </div>

          {/* Render Active Tab Content */}
          <section className="my-6 bg-white p-4 shadow-sm rounded-md">
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            <table className="w-full border-collapse  border border-gray-300  table-fixed">
              <thead>
                <tr className="bg-[#6EC7E2]  text-lg ">
                  <th className="border border-gray-400 px-28 text-center py-4 w-1/4">ผู้ยืม</th>
                  <th className="border border-gray-400 px-28  text-center py-4 w-1/4">รายการ</th>
                  <th className="border border-gray-400 px-26 text-center py-4 w-1/6">วันที่ยืม</th>
                  <th className="border border-gray-400 px-26 text-center py-4 w-1/6">กำหนดคืน</th>
                  <th className="border border-gray-400 px-28 text-center py-4 w-1/4">สถานะ</th>
                  <th className="border border-gray-400 px-28 text-center py-4 w-1/3">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((request) => (
                  <tr
                    key={request.id}
                    className={`${getStatusClass(request.status)} hover:bg-gray-200 text-center text-lg border-t`}
                  >
                    <td className="border border-gray-300 px-4 py-2">{request.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{request.label}</td>
                    
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(request.borrowDate).toLocaleDateString("th-TH")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(request.returnDate).toLocaleDateString("th-TH")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{request.status}</td>
                    <td className="border  border-gray-300  px-4 py-2 flex justify-center gap-2">
                      {activeTab === "รอดำเนินการ" && (
                        <>
                          <button
                            className="bg-green-500 border-gray-300  text-white px-3 py-1 rounded-md hover:bg-green-600"
                            onClick={() => updateStatus(request.id, "กำลังยืม")}
                          >
                            อนุมัติ
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            onClick={() => updateStatus(request.id, "ถูกปฏิเสธ")}
                          >
                            ปฏิเสธ
                          </button>

                          
                        </>
                      )}
                      {activeTab === "กำลังยืม" && (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                          onClick={() => updateStatus(request.id, "คืนแล้ว")}
                        >
                          คืนแล้ว
                        </button>
                      )}
                      <button
                        className="bg-blue-400 text-white px-3 py-1 rounded-md hover:bg-gray-600"
                        onClick={() => viewPDF(request.id)}
                      >
                        รายละเอียด
                      </button>

                      {activeTab === "เลยกำหนด" && (
                      <td className="border  ">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                          onClick={() =>
                            sendReminderEmail(request.email, request.name, request.label, request.returnDate)
                          }
                        >
                          ส่งแจ้งเตือน
                        </button>
                      </td>
                    )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                className="bg-[#4691D3] w-28 h-12 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center justify-center"
                disabled={currentPage === 1}
              >
                ← ก่อนหน้า
              </button>

              <button
                onClick={handleNextPage}
                className="bg-[#4691D3] w-28 h-12 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center justify-center"
                disabled={currentPage === totalPages}
              >
                ถัดไป →
              </button>

            </div>
          </section>
        </div>
      </Headeradmin>
    </div>
  );
}
