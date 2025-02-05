"use client";

import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const BorrowFormPage = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [academicYear, setAcademicYear] = useState(""); // ✅ เพิ่ม state สำหรับปีการศึกษา
  const formRef = useRef();

  useEffect(() => {
    const storedData = localStorage.getItem("borrowData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setBorrowData(parsedData);
      setAcademicYear(parsedData[0]?.academicYear || ""); // ✅ ดึงปีการศึกษาจากข้อมูลยืม
    }

    const today = new Date();
    setCurrentDate(today.toISOString().split("T")[0]);
  }, []);

  const generatePDF = async () => {
    if (!formRef.current) {
      alert("❌ ไม่สามารถสร้าง PDF ได้");
      return null;
    }

    try {
      const canvas = await html2canvas(formRef.current, { scale: 1 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
      return pdf;
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("❌ เกิดข้อผิดพลาดในการสร้าง PDF");
      return null;
    }
  };

  const handleSubmitForm = async () => {
    const pdf = await generatePDF();
    if (!pdf) return;

    const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    formData.append("files", pdfBlob, "borrow-form.pdf");

    try {
      // ✅ อัปโหลด PDF ไปยัง Strapi
      const uploadResponse = await fetch("http://172.31.0.1:1337/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("❌ Error uploading PDF:", errorText);
        throw new Error("Failed to upload PDF to Strapi");
      }

      const uploadResult = await uploadResponse.json();
      const uploadedFile = uploadResult[0];

      console.log("✅ Uploaded File:", uploadedFile);

      // ✅ สร้างข้อมูลการยืมใน Strapi (รวมฟิลด์ `year`)
      const createBorrowPromises = borrowData.map((item) => {
        return fetch("http://172.31.0.1:1337/api/borrows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              name: item.name,
              email: item.email,
              label: item.label,
              Price: item.Price,
              amount: item.amount,
              Borrowing_date: item.Borrowing_date,
              Due: item.Due,
              Year: academicYear, // ✅ เก็บปีการศึกษาใน Strapi
              status: "รอดำเนินการ",
              form: uploadedFile.id, // ผูกไฟล์ PDF กับข้อมูลการยืม
            },
          }),
        });
      });

      const results = await Promise.allSettled(createBorrowPromises);
      const failedRequests = results.filter((res) => res.status === "rejected");

      if (failedRequests.length > 0) {
        console.error("❌ Failed Requests:", failedRequests);
        throw new Error(`Failed to create ${failedRequests.length} Borrow records`);
      }

      alert("✅ ส่งแบบฟอร์มสำเร็จ และข้อมูลการยืมถูกบันทึกใน Strapi!");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งแบบฟอร์ม");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold">แบบฟอร์มการยืมอุปกรณ์</h1>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6" ref={formRef}>
            {borrowData.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีข้อมูล</div>
            ) : (
              <>
                <div className="border-b pb-4 mb-6">
                  <p className="text-gray-600 mt-2">วันที่: {currentDate}</p>
                  <h2 className="text-xl font-bold">ข้อมูลการยืม:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <span className="font-bold">ชื่อผู้ยืม:</span> {borrowData[0]?.name || "N/A"}
                    </div>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <span className="font-bold">อีเมลผู้ยืม:</span> {borrowData[0]?.email || "N/A"}
                    </div>
                    <div className="p-4 border rounded-md bg-gray-50">
                      <span className="font-bold">ปีการศึกษา:</span> {academicYear || "N/A"} {/* ✅ แสดงปีการศึกษา */}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">รายการอุปกรณ์ที่ยืม:</h2>
                  <table className="w-full border border-gray-300 text-center">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">ลำดับ</th>
                        <th className="border p-2">ชื่ออุปกรณ์</th>
                        <th className="border p-2">จำนวน</th>
                        <th className="border p-2">วันที่ยืม</th>
                        <th className="border p-2">กำหนดคืน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowData.map((item, index) => (
                        <tr key={index}>
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{item.label}</td>
                          <td className="border p-2">{item.amount}</td>
                          <td className="border p-2">
                            {new Date(item.Borrowing_date).toLocaleDateString("th-TH")}
                          </td>
                          <td className="border p-2">
                            {new Date(item.Due).toLocaleDateString("th-TH")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600"
                    onClick={handleSubmitForm}
                  >
                    ส่งแบบฟอร์ม
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default BorrowFormPage;
