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
        const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/borrows?populate=*`);
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
      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/borrows/${id}`, {
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
      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/borrows/${id}?populate=form`);
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
        return "bg-[#FAF9F3]";
      case "รายการกำลังยืม":
        return "bg-[#FAF9F3]";
      case "รายการเกินกำหนดคืน":
        return "bg-[#FAF9F3]";
      case "รายการคืนสำเร็จ":
        return "bg-[#FAF9F3]";
      case "รายการถูกปฏิเสธ":
        return "bg-[#FAF9F3]";
      default:
        return "";
    }
  };

  const tabs = [
    { label: "รอดำเนินการ", status: "รอดำเนินการ" },
    { label: "รายการกำลังยืม", status: "รายการกำลังยืม" },
    { label: "รายการเกินกำหนดคืน", status: "รายการเกินกำหนดคืน" },
    { label: "รายการคืนสำเร็จ", status: "รายการคืนสำเร็จ" },
    { label: "รายการถูกปฏิเสธ", status: "รายการถูกปฏิเสธ" },
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
          <nav className="flex font-medium  text-md bg-[#AAC5D6] text-gray-700  rounded-lg mb-6 h-10">
            {tabs.map((tab) => (
              <button
                key={tab.status}
                onClick={() => {
                  setActiveTab(tab.status);
                  setSearchTerm(""); // รีเซ็ตคำค้นหาเมื่อเปลี่ยนแท็บ
                  setCurrentPage(1); // รีเซ็ตหน้าเมื่อเปลี่ยนแท็บ
                }}
                className={`h-full flex items-center justify-center text-white
        ${activeTab === tab.status ? "bg-[#465B7E]" : "bg-[#AAC5D6]"} 
        hover:bg-gray-400 focus:outline-none transition rounded-lg w-1/5`}
              >
                {tab.label}
              </button>
            ))}
          </nav>


          {/* Search Bar */}
          <div className="mb-4 flex justify-end">
            <input
              type="text"
              placeholder="ค้นหารายชื่อ"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline text-sm 
      w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border-gray-500 max-w-sm"
            />
          </div>

          {/* Render Active Tab Content */}
          <section className="my-6 bg-white p-4 shadow-sm rounded-md min-h-80 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            <div className="flex-grow mb-5">
              <table className="w-full border-collapse  border border-gray-300  table-fixed">
                <thead>
                  <tr className="bg-[#4691D3] text-white text-md ">
                    <th className="border border-gray-400 px-1 text-center py-1 w-1/4 font-medium">ชื่อผู้ยืม</th>
                    <th className="border border-gray-400 px-1 text-center py-2 w-1/4 font-medium">รายการ</th>
                    <th className="border border-gray-400 px-1 text-center py-2 w-1/6 font-medium">วันที่ยืม</th>
                    <th className="border border-gray-400 px-1 text-center py-2 w-1/6 font-medium">กำหนดคืน</th>
                    <th className="border border-gray-400 px-1 text-center py-2 w-1/4 font-medium">สถานะ</th>
                    <th className="border border-gray-400 px-1 text-center py-2 w-1/3 font-medium">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems && currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center border border-gray-300 px-4 py-2">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  ) :
                    (
                      currentItems.map((request) => (
                        <tr
                          key={request.id}
                          className={`${getStatusClass(request.status)} hover:bg-gray-200 text-center text-md border-t`}
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
                                  className="bg-green-600 border-gray-300  text-white px-3 py-1 text-sm rounded-md hover:bg-green-600"
                                  onClick={() => updateStatus(request.id, "รายการกำลังยืม")}
                                >
                                  อนุมัติ
                                </button>
                                <button
                                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                  onClick={() => updateStatus(request.id, "รายการถูกปฏิเสธ")}
                                >
                                  ปฏิเสธ
                                </button>


                              </>
                            )}
                            {activeTab === "รายการกำลังยืม" && (
                              <button
                                className="bg-[#225EC5] text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                onClick={() => updateStatus(request.id, "รายการคืนสำเร็จ")}
                              >
                                คืนสำเร็จ
                              </button>
                            )}
                            <button
                              className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                              onClick={() => viewPDF(request.id)}
                            >
                              รายละเอียด
                            </button>

                            {activeTab === "รายการเกินกำหนดคืน" && (
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
                      ))
                    )
                  }

                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-end mt-auto">
              <button
                onClick={handlePreviousPage}
                className="bg-[#465B7E] text-white min-w-20 px-3 py-2 text-sm rounded-md hover:bg-blue-950 flex items-center justify-center"
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </button>

              <button
                onClick={handleNextPage}
                className="bg-[#465B7E] text-white min-w-20 px-3 py-2 text-sm rounded-md hover:bg-blue-950 flex items-center justify-center"
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </button>

            </div>
          </section>
        </div>
      </Headeradmin>
    </div>
  );
}
