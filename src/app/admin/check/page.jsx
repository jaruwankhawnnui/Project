import React from "react";
import Headeradmin from "@/components/Headeradmin";

export default function ApprovalPage() {
  return (
    <div className="bg-gray-100  min-h-screen">
    <Headeradmin>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      
      <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-md">
        <h1 className="text-xl font-bold">การอนุมัติการยืม</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="ค้นหา..."
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            กลับ
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="my-6 bg-white p-4 shadow-sm rounded-md">
        <div className="flex items-center gap-4">
          <label className="font-medium">สถานะ:</label>
          <select className="border border-gray-300 rounded-md px-4 py-2">
            <option>ทั้งหมด</option>
            <option>รอการอนุมัติ</option>
            <option>อนุมัติแล้ว</option>
            <option>ถูกปฏิเสธ</option>
          </select>
          <label className="font-medium">วันที่:</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <span>ถึง</span>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </section>

      {/* Table */}
      <section className="bg-white p-4 shadow-sm rounded-md">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-200 px-4 py-2">รหัสคำขอ</th>
              <th className="border border-gray-200 px-4 py-2">ชื่อผู้ยืม</th>
              <th className="border border-gray-200 px-4 py-2">สิ่งของที่ยืม</th>
              <th className="border border-gray-200 px-4 py-2">วันที่ยืม</th>
              <th className="border border-gray-200 px-4 py-2">วันที่คืน</th>
              <th className="border border-gray-200 px-4 py-2">สถานะ</th>
              <th className="border border-gray-200 px-4 py-2">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">001</td>
              <td className="border border-gray-200 px-4 py-2">นาย A</td>
              <td className="border border-gray-200 px-4 py-2">คอมพิวเตอร์</td>
              <td className="border border-gray-200 px-4 py-2">01/12/2024</td>
              <td className="border border-gray-200 px-4 py-2">10/12/2024</td>
              <td className="border border-gray-200 px-4 py-2">รอการอนุมัติ</td>
              <td className="border border-gray-200 px-4 py-2 flex gap-2">
                <button className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600">
                  อนุมัติ
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600">
                  ปฏิเสธ
                </button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </section>
    </div>
    </Headeradmin>
    </div>
  );
}
