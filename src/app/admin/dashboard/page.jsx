"use client";

import React, { useEffect, useState } from "react";
import Headeradmin from '@/components/Headeradmin';

const BorrowSummaryPage = () => {
  const [borrowSummary, setBorrowSummary] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowData = async () => {
      try {
        const response = await fetch("http://172.31.0.1:1337/api/borrows");
        if (!response.ok) {
          throw new Error("Failed to fetch borrow data");
        }

        const data = await response.json();
        const borrows = data.data;

        // ✅ ดึงปีการศึกษาทั้งหมดที่มีข้อมูลการยืม
        const yearList = [...new Set(borrows.map((borrow) => borrow.attributes.Year || "ไม่ระบุปี"))];
        setYears(yearList);

        // ✅ จัดกลุ่มข้อมูลตามปีการศึกษา และรวมจำนวนอุปกรณ์ที่มีชื่อเดียวกัน
        const groupedData = borrows.reduce((acc, borrow) => {
          const year = borrow.attributes.Year || "ไม่ระบุปี";
          const label = borrow.attributes.label || "ไม่ระบุชื่ออุปกรณ์";
          const amount = borrow.attributes.amount || 0;

          if (!acc[year]) {
            acc[year] = {};
          }
          if (!acc[year][label]) {
            acc[year][label] = 0;
          }
          acc[year][label] += amount;

          return acc;
        }, {});

        setBorrowSummary(groupedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
       <Headeradmin>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">สรุปการยืมอุปกรณ์ตามปีการศึกษา</h1>

          {loading ? (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">เลือกรายการที่ต้องการดู</h2>

              {/* ✅ เลือกปีการศึกษา */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">เลือกปีการศึกษา</label>
                  <select
                    className="border p-2 rounded-md w-full"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">-- ทั้งหมด --</option>
                    {years.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ✅ แสดงผลข้อมูล */}
              {!selectedYear ? (
                <p className="text-center text-gray-500">กรุณาเลือกปีการศึกษาเพื่อดูข้อมูล</p>
              ) : !borrowSummary[selectedYear] ? (
                <p className="text-center text-gray-500">ไม่มีข้อมูลการยืมในปีการศึกษานี้</p>
              ) : (
                <table className="w-full border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">ชื่ออุปกรณ์</th>
                      <th className="border p-2">จำนวนที่ถูกยืม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(borrowSummary[selectedYear]).map(([label, totalAmount], index) => (
                      <tr key={index}>
                        <td className="border p-2">{label}</td>
                        <td className="border p-2">{totalAmount} ชิ้น</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
        </Headeradmin>
    </div>
  );
};

export default BorrowSummaryPage;
