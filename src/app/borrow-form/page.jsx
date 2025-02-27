"use client";

import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ เพิ่มไอคอนโหลด
import { motion } from "framer-motion";


const BorrowFormPage = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    const storedData = localStorage.getItem("borrowData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setBorrowData(parsedData);
      setAcademicYear(parsedData[0]?.academicYear || "");
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

      const pdf = new jsPDF("p", "mm", "a4"); // ใช้ขนาด A4
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

  const downloadPDF = async () => {
    const pdf = await generatePDF();
    if (!pdf) return;

    pdf.save("borrow-form.pdf"); // ดาวน์โหลดไฟล์ PDF
  };


  const handleSubmitForm = async () => {
    setIsLoading(true);
    const pdf = await generatePDF();
    if (!pdf) return;

    const pdfBlob = pdf.output("blob");
    const formData = new FormData();
    formData.append("files", pdfBlob, "borrow-form.pdf");

    try {
      // ✅ อัปโหลด PDF ไปยัง Strapi
      const uploadResponse = await fetch("http://172.21.32.1:1337/api/upload", {
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

      // ✅ สร้างข้อมูลการยืมใน Strapi และอัปเดตจำนวนอุปกรณ์
      await Promise.all(
        borrowData.map(async (item) => {
          // ✅ บันทึกข้อมูลการยืม
          const borrowResponse = await fetch("http://172.21.32.1:1337/api/borrows", {
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
                Year: academicYear,
                status: "รอดำเนินการ",
                form: uploadedFile.id,
              },
            }),
          });

          if (!borrowResponse.ok) {
            throw new Error("Failed to create Borrow record in Strapi");
          }

          console.log(`✅ Borrow record created for ${item.label}`);

          // ✅ อัปเดตจำนวนคงเหลือของอุปกรณ์ใน `/api/cartadmins`
          const inventoryResponse = await fetch(`http://172.21.32.1:1337/api/cartadmins?filters[Label][$eq]=${encodeURIComponent(item.label)}`);
          const inventoryData = await inventoryResponse.json();

          if (inventoryData.data.length === 0) {
            console.error(`❌ ไม่พบอุปกรณ์: ${item.label} ในระบบ`);
            return;
          }

          const canvas = await html2canvas(formRef.current, {
            scale: 1,
            backgroundColor: "#ffffff", // เพิ่มพื้นหลังเป็นสีขาว
          });


          const itemId = inventoryData.data[0].id;
          const currentItem = inventoryData.data[0].attributes;
          const newBorrowedAmount = (currentItem.Borrowed || 0) + item.amount;
          const newRemainingAmount = (currentItem.item || 0) - newBorrowedAmount;

          await fetch(`http://172.21.32.1:1337/api/cartadmins/${itemId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                Borrowed: newBorrowedAmount,
                remaining: newRemainingAmount >= 0 ? newRemainingAmount : 0,
              },
            }),
          });

          console.log(`✅ Updated inventory for ${item.label}`);
        })
      );

      alert("✅ ส่งแบบฟอร์มสำเร็จ และข้อมูลการยืมถูกบันทึกใน Strapi!");
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งแบบฟอร์ม");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Layout>
        <div className="container mx-auto mt-10">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold">แบบฟอร์มการยืมอุปกรณ์</h1>
          </div>

          <div className="bg-gray-50   p-6" ref={formRef}>
            {borrowData.length === 0 ? (
              <div className="text-center text-white py-8">ไม่มีข้อมูล</div>
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
                      <span className="font-bold">ปีการศึกษา:</span> {academicYear || "N/A"}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">รายการอุปกรณ์ที่ยืม:</h2>
                  <table className="w-full border  text-center">
                    <thead className="bg-white">
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
                          <td className="border p-2">{new Date(item.Borrowing_date).toLocaleDateString("th-TH")}</td>
                          <td className="border p-2">{new Date(item.Due).toLocaleDateString("th-TH")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    วัตถุประสงค์ของการใช้งานเพื่อ
                  </label>
                  <textarea
                    rows="3"
                    className="w-full mt-3 p-2 border  rounded-md"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mt-3  font-medium">ลงชื่อผู้ยืม:</p>
                    <input
                      type="text"
                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                    <p className="mt-3 text-sm">วันที่ยืม:</p>
                    <input

                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm mt-3 font-medium">ลงชื่อผู้คืน:</p>
                    <input
                      type="text"
                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                    <p className="mt-3 text-sm">วันที่คืน:</p>
                    <input

                      className="w-full mt-3 p-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Official Confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm mt-3 font-medium">ลงชื่อเจ้าหน้าที่ (ตรวจสอบ):</p>
                    <input
                      type="text"
                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                    <p className="mt-3 text-sm">วันที่:</p>
                    <input

                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm mt-3 font-medium">ลงชื่อเจ้าหน้าที่ (อนุมัติ):</p>
                    <input
                      type="text"
                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                    <p className="mt-3 text-sm">วันที่:</p>
                    <input

                      className="w-full mt-3 p-2 border  rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="bg-blue-500 text-white px-8 mx-2 py-2 rounded-md shadow-md hover:bg-blue-600" onClick={handleSubmitForm}>
                    ส่งแบบฟอร์ม
                  </button>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600" onClick={downloadPDF}>
                    ดาวน์โหลด PDF
                  </button>
                </div>
              </>
            )}
          </div>
          {/* ✅ แสดง Loading Overlay พร้อมไอคอนหมุน */}
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AiOutlineLoading3Quarters className="text-5xl text-blue-500 animate-spin" /> {/* ✅ ไอคอนหมุน */}
                <p className="text-xl font-bold text-blue-500 mt-3">กำลังโหลด...</p>
              </motion.div>
            </div>
          )}

        </div>
      </Layout>
    </div>
  );
};

export default BorrowFormPage;
