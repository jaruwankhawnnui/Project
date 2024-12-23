'use client';

import React, { useRef } from "react";
import Layout from "@/components/Layout";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function BorrowForm() {
  const formRef = useRef(); // Ref for the form content

  // Function to generate PDF
  const handleDownloadPDF = async () => {
    const formElement = formRef.current;

    // Use html2canvas to capture the form
    const canvas = await html2canvas(formElement);
    const imgData = canvas.toDataURL("image/png");

    // Create a jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("borrow-form.pdf"); // Save as "borrow-form.pdf"
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div
            className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-md"
            ref={formRef} // Attach the ref to this element
          >
            <h1 className="text-2xl font-bold text-center mb-8">
              แบบฟอร์มการขอยืมวัสดุ/อุปกรณ์
            </h1>
            <p className="text-center mb-4">
              ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยสงขลานครินทร์
            </p>

            {/* Form Content */}
            <form className="space-y-6">
              {/* Date and Personal Info */}
              <div>
                <label className="block text-sm font-medium">วันที่</label>
                <input
                  type="date"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">รหัสนักศึกษา</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">ชั้นปี</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Equipment List */}
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
                      <th className="border border-gray-300 p-2">อื่น ๆ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="border border-gray-300 p-2 text-center">
                          {i + 1}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            className="w-full border-none focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="number"
                            className="w-full border-none focus:outline-none"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="text"
                            className="w-full border-none focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Purpose Section */}
              <div>
                <label className="block text-sm font-medium">
                  วัตถุประสงค์ของการใช้งานเพื่อ
                </label>
                <textarea
                  rows="3"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              {/* Signatures */}
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
                    type="date"
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
                    type="date"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </form>

            {/* Download Button */}
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
