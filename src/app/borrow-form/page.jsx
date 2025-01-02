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
    if (session?.user?.email) {
      // Fetch data from /api/equipment for the logged-in user
      fetch(
        `http://172.29.80.1:1337/api/equipment?filters[email][$eq]=${session.user.email}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            const formattedData = data.data.map((item) => ({
              name: item.attributes.name,
              label: item.attributes.label,
              amount: item.attributes.amount,
            }));
            setBorrowedItems(formattedData);
          } else {
            setBorrowedItems([]);
          }
        })
        .catch((error) => console.error("Error fetching equipment:", error));
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  }, [session]);

  const handleDownloadPDF = async () => {
    const formElement = formRef.current;

    try {
      const canvas = await html2canvas(formElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      } else {
        let pageHeightLeft = imgHeight;

        while (pageHeightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
          pageHeightLeft -= pdfHeight;
          position = -pageHeightLeft;

          if (pageHeightLeft > 0) {
            pdf.addPage();
          }
        }
      }

      pdf.save("borrow-form.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด PDF");
    }
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
            <form className="space-y-4">
              {/* วันที่ */}
              <div className="space-y-4">
                <div>
                  <div className="border  rounded-md p-2 text-center text-s font-medium">
                   วันที่  :   {currentDate}
                 
                  </div>
                  
                </div>

                {/* ชื่อ-นามสกุล และ อีเมล */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-100 text-center text-s font-medium">
                      ชื่อ-นามสกุล :  {session?.user?.name || ""}
                    </div>
                  </div>

                  <div>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-100 text-center text-s font-medium">
                      อีเมล : {session?.user?.email || ""}
                    </div>
                  
                  </div>
                </div>
              </div>

              {/* รายการอุปกรณ์ */}
              <div>
                <p className="text-sm font-medium mb-2">
                  มีความประสงค์จะขอยืมวัสดุ/อุปกรณ์ ดังรายการต่อไปนี้:
                </p>
                <table className="w-full mt-3 border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">ลำดับ</th>
                      <th className="border border-gray-300 p-2">ชื่ออุปกรณ์</th>
                      <th className="border border-gray-300 p-2">จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedItems.length > 0 ? (
                      borrowedItems.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.label}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="border border-gray-300 p-2 text-center text-gray-500"
                        >
                          ไม่มีข้อมูล
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* วัตถุประสงค์ */}
              <div>
                <label className="block text-sm font-medium">
                  วัตถุประสงค์ของการใช้งานเพื่อ
                </label>
                <textarea
                  rows="3"
                  className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm mt-3  font-medium">ลงชื่อผู้ยืม:</p>
                  <input
                    type="text"
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-3 text-sm">วันที่ยืม:</p>
                  <input
                   
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm mt-3 font-medium">ลงชื่อผู้คืน:</p>
                  <input
                    type="text"
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-3 text-sm">วันที่คืน:</p>
                  <input
                  
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Official Confirmation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm mt-3 font-medium">ลงชื่อเจ้าหน้าที่ (ตรวจสอบ):</p>
                  <input
                    type="text"
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-3 text-sm">วันที่:</p>
                  <input
                   
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <p className="text-sm mt-3 font-medium">ลงชื่อเจ้าหน้าที่ (อนุมัติ):</p>
                  <input
                    type="text"
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                  <p className="mt-3 text-sm">วันที่:</p>
                  <input
                   
                    className="w-full mt-3 p-2 border border-gray-300 rounded-md"
                  />
                </div>
                </div>
            </form>

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
