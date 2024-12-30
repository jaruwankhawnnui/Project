"use client";

import React, { useRef, useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";

export default function BorrowForm() {
  const formRef = useRef();
  const { data: session } = useSession();
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // ดึงข้อมูลจาก sessionStorage
    const items = JSON.parse(sessionStorage.getItem("borrowedEquipment")) || [];
    setBorrowedItems(items);

    // ตั้งค่าวันที่ปัจจุบัน
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // รูปแบบ YYYY-MM-DD
    setCurrentDate(formattedDate);
  }, []);

  const handleDownloadPDF = async () => {
    const formElement = formRef.current;
    const canvas = await html2canvas(formElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("borrow-form.pdf");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div
            className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-md"
            ref={formRef}
          >
            <h1 className="text-2xl font-bold text-center mb-8">
              แบบฟอร์มการขอยืมวัสดุ/อุปกรณ์
            </h1>
            <form className="space-y-6">
              {/* วันที่ */} 
              <div>
                <label className="block text-sm font-medium">วันที่</label>
                <input
                  type="date"
                  value={currentDate}
                  readOnly
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>

              {/* ข้อมูลผู้ยืม */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={session?.user?.name || ""}
                    readOnly
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">อีเมล</label>
                  <input
                    type="text"
                    value={session?.user?.email || ""}
                    readOnly
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
              </div>

              {/* รายการอุปกรณ์ */}
              <div>
                <p className="text-sm font-medium mb-2">
                  มีความประสงค์จะขอยืมวัสดุ/อุปกรณ์ ดังรายการต่อไปนี้:
                </p>
                <table className="w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">ลำดับ</th>
                      <th className="border border-gray-300 p-2">รายการ</th>
                      <th className="border border-gray-300 p-2">จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.attributes?.label}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {item.attributes?.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* วัตถุประสงค์การใช้งาน */}
              <div>
                <label className="block text-sm font-medium">
                  วัตถุประสงค์ของการใช้งานเพื่อ
                </label>
                <textarea
                  rows="3"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">ลงชื่อผู้ยืม:</p>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm">วันที่ยืม:</p>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">ลงชื่อผู้คืน:</p>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm">วันที่คืน:</p>
                  <input
                    type="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Official Confirmation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">ลงชื่อเจ้าหน้าที่ (ตรวจสอบ):</p>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm">วันที่:</p>
                  <input
                   
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">ลงชื่อเจ้าหน้าที่ (อนุมัติ):</p>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-2 text-sm">วันที่:</p>
                  <input
                   
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                </div>
            </form>

            {/* ปุ่มดาวน์โหลด PDF */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600"
                onClick={handleDownloadPDF}
              >
                ดาวน์โหลดเป็น PDF
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
