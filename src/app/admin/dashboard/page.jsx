"use client";
import React, { useEffect, useState } from "react";
import Headeradmin from '@/components/Headeradmin';
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const BorrowSummaryPage = () => {
  const [borrowSummary, setBorrowSummary] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [totalReturned, setTotalReturned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [borrowRes, inventoryRes] = await Promise.all([
          fetch("http://172.31.0.1:1337/api/borrows"),
          fetch("http://172.31.0.1:1337/api/cartadmins")
        ]);

        if (!borrowRes.ok || !inventoryRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const borrowData = await borrowRes.json();
        const inventoryData = await inventoryRes.json();
        const borrows = borrowData.data;
        const inventoryItems = inventoryData.data;

        // ✅ ดึงปีการศึกษาทั้งหมด
        const yearList = [...new Set(borrows.map((borrow) => borrow.attributes.Year || "ไม่ระบุปี"))];
        setYears(yearList);

        // ✅ จัดกลุ่มข้อมูลตามปี
        const groupedBorrowData = borrows.reduce((acc, borrow) => {
          const year = borrow.attributes.Year || "ไม่ระบุปี";
          const label = borrow.attributes.label || "ไม่ระบุชื่ออุปกรณ์";
          const amount = borrow.attributes.amount || 0;
          const isReturned = borrow.attributes.status === "คืนแล้ว";

          if (!acc[year]) {
            acc[year] = { borrowed: {}, returned: {} };
          }
          if (!acc[year].borrowed[label]) {
            acc[year].borrowed[label] = 0;
          }
          if (!acc[year].returned[label]) {
            acc[year].returned[label] = 0;
          }

          if (isReturned) {
            acc[year].returned[label] += amount;
          } else {
            acc[year].borrowed[label] += amount;
          }

          return acc;
        }, {});

        setBorrowSummary(groupedBorrowData);

        // ✅ จัดเก็บข้อมูลจำนวนอุปกรณ์ทั้งหมด
        const inventoryMap = inventoryItems.reduce((acc, item) => {
          const label = item.attributes.Label || "ไม่ระบุชื่ออุปกรณ์";
          const total = item.attributes.item || 0;
          acc[label] = total;
          return acc;
        }, {});

        setInventoryData(inventoryMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ คำนวณจำนวนอุปกรณ์ที่ถูกยืมและคืนเฉพาะปีที่เลือก
  useEffect(() => {
    if (selectedYear && borrowSummary[selectedYear]) {
      const totalForSelectedYear = Object.values(borrowSummary[selectedYear].borrowed || {}).reduce((sum, num) => sum + num, 0);
      const totalReturnedForSelectedYear = Object.values(borrowSummary[selectedYear].returned || {}).reduce((sum, num) => sum + num, 0);

      setTotalBorrowed(totalForSelectedYear);
      setTotalReturned(totalReturnedForSelectedYear);
    } else {
      setTotalBorrowed(0);
      setTotalReturned(0);
    }
  }, [selectedYear, borrowSummary]);

  // ✅ เตรียมข้อมูลสำหรับกราฟ
  const chartData = {
    labels: selectedYear ? Object.keys(borrowSummary[selectedYear]?.borrowed || {}) : [],
    datasets: [
      {
        label: "จำนวนที่ถูกยืม (ชิ้น)",
        data: selectedYear ? Object.values(borrowSummary[selectedYear]?.borrowed || {}) : [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "จำนวนที่คืนแล้ว (ชิ้น)",
        data: selectedYear ? Object.values(borrowSummary[selectedYear]?.returned || {}) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Headeradmin>
        <div className="container mx-auto mt-10">
          <h1 className="text-4xl font-bold text-center mb-10">📊 สรุปการยืมอุปกรณ์ตามปีการศึกษา</h1>

          {loading ? (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">เลือกปีการศึกษา</h2>

              {/* ✅ แสดงยอดรวมอุปกรณ์ที่ถูกยืมและคืนแล้ว */}
              <div className="flex justify-center bg-blue-200 p-4 mb-6 rounded-md text-lg font-semibold">
                <div className="mr-6">📌 อุปกรณ์ที่ถูกยืมในปี {selectedYear || "ที่เลือก"}: {totalBorrowed} ชิ้น</div>
                <div>✅ อุปกรณ์ที่คืนแล้ว: {totalReturned} ชิ้น</div>
              </div>

              {/* ✅ เลือกปีการศึกษา */}
              <div className="flex justify-center mb-6">
                <select
                  className="border p-2 rounded-md shadow-md"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">-- กรุณาเลือกปีการศึกษา --</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* ✅ แสดงกราฟ */}
              <div className="bg-white p-6 shadow-md rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4">📈 สถิติการยืมและคืนอุปกรณ์</h2>
                <Bar data={chartData} />
              </div>

              {/* ✅ แสดงตารางข้อมูล */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">📋 รายการอุปกรณ์</h2>
                <table className="w-full border border-gray-300 text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">ชื่ออุปกรณ์</th>
                      <th className="border p-2">ยืมไป</th>
                      <th className="border p-2">คืนแล้ว</th>
                      <th className="border p-2">คงเหลือ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedYear && Object.entries(borrowSummary[selectedYear]?.borrowed || {}).map(([label, borrowed], index) => {
                      const total = inventoryData[label] || 0;
                      const returned = borrowSummary[selectedYear]?.returned[label] || 0;
                      const remaining = total - borrowed + returned; // ✅ คำนวณจำนวนคงเหลือ
                      return (
                        <tr key={index}>
                          <td className="border p-2">{label}</td>
                          <td className="border p-2">{borrowed} ชิ้น</td>
                          <td className="border p-2">{returned} ชิ้น</td>
                          <td className="border p-2">{remaining} ชิ้น</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Headeradmin>
    </div>
  );
};

export default BorrowSummaryPage;
