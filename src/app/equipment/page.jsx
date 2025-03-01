"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ เพิ่มไอคอนโหลด
import { motion } from "framer-motion";

const EquipmentPage = () => {
  const [userEquipmentItems, setUserEquipmentItems] = useState([]);
  const [academicYears, setAcademicYears] = useState([]); // ✅ เก็บข้อมูลปีการศึกษาจาก API
  const [academicYear, setAcademicYear] = useState(""); // ✅ เก็บปีการศึกษาที่เลือก
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.email) return;

    // ✅ ดึงข้อมูลอุปกรณ์ของผู้ใช้
    const fetchUserEquipmentItems = async () => {
      try {
        const response = await fetch(
          `https://coe-hardware-lab-website-ievu.onrender.com/api/equipment?filters[email][$eq]=${session.user.email}&populate=image`
        );
        if (response.ok) {
          const data = await response.json();
          const items = data.data.map((item) => ({
            id: item.id,
            attributes: item.attributes,
            imageUrl:
              item.attributes.image?.data?.length > 0
                ? item.attributes.image.data[0].attributes.url.startsWith("http")
                  ? item.attributes.image.data[0].attributes.url
                  : `https://coe-hardware-lab-website-ievu.onrender.com/${item.attributes.image.data[0].attributes.url}`
                : null,
          }));
          setUserEquipmentItems(items);
        } else {
          console.error("Failed to fetch user equipment items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching user equipment items:", error);
      }
    };

    fetchUserEquipmentItems();
  }, [session?.user?.email]);

  useEffect(() => {
    // ✅ ดึงข้อมูลปีการศึกษาจาก /api/Years
    const fetchAcademicYears = async () => {
      try {
        const response = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/Years");
        if (response.ok) {
          const data = await response.json();
          const Years = data.data.map((year) => year.attributes.Year);
          console.log("📌 Fetched academic Years:", Years); // ✅ Debugging
          setAcademicYears(Years);
        } else {
          console.error("Failed to fetch academic Years:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching academic Years:", error);
      }
    };

    fetchAcademicYears();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/equipment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserEquipmentItems((prevItems) => prevItems.filter((item) => item.id !== id));
        alert("อุปกรณ์ถูกลบออกจากระบบสำเร็จ");
      } else {
        console.error("Failed to delete item from Strapi:", await response.text());
        alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
      }
    } catch (error) {
      console.error("Error deleting item from Strapi:", error);
      alert("เกิดข้อผิดพลาดในการลบอุปกรณ์");
    }
  };
  useEffect(() => {
    console.log(userEquipmentItems); // ตรวจสอบข้อมูล
  }, [userEquipmentItems]);



  const handleGoToBorrowForm = async () => {
    setIsLoading(true);
    if (!session?.user?.email) {
      alert("กรุณาเข้าสู่ระบบก่อนดำเนินการ");
      return;
    }

    if (!academicYear) {
      alert("กรุณาเลือกปีการศึกษาก่อนดำเนินการ");
      return;
    }

    try {
      const borrowData = userEquipmentItems.map((item) => {
        const borrowingDate = new Date().toISOString();
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 1);

        return {
          label: item.attributes?.label || "Unknown Item",
          amount: item.attributes?.amount || 0,
          Price: item.attributes?.Price || 0,
          email: session?.user?.email || "Unknown Email",
          name: session?.user?.name || "Unknown User",
          Borrowing_date: borrowingDate,
          Due: dueDate.toISOString(),
          academicYear: academicYear, // ✅ บันทึกปีการศึกษา
        };
      });
      localStorage.setItem("borrowData", JSON.stringify(borrowData));

      // ✅ อัปเดตอุปกรณ์ที่เลือกใน Strapi โดยเพิ่มปีการศึกษา
      const updateEquipmentPromises = userEquipmentItems.map((item) =>
        fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/equipment/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              academicYear: academicYear, // ✅ เพิ่มปีการศึกษาใน Strapi
            },
          }),
        })
      );

      await Promise.all(updateEquipmentPromises);
      console.log("✅ Updated equipment with academicYear:", academicYear);

      router.push("/borrow-form");
    } catch (error) {
      console.error("Error preparing data for borrow form:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen pb-32">
      <Layout>
        <div className="container mx-auto mt-10  ">

          <div className="flex justify-center  items-center bg-[#465B7E] p-3 rounded-lg">
            <h1 className="w-full text-white text-3xl pl-10 font-bold">
              อุปกรณ์ที่ยืม
            </h1>
          </div>

          <div className="mt-6 flex">
            <select
              className="border p-2 bg-white-50 rounded-md shadow-md w-1/4"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
            >
              <option value="">-- กรุณาเลือกปีการศึกษา --</option>
              {academicYears.map((Year, index) => (
                <option key={index} value={Year}>
                  {Year}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-cyan-50 mt-6 shadow-lg rounded-lg p-6">
            {/* <h2 className="text-2xl font-bold mb-6">รายการอุปกรณ์</h2> */}
            {userEquipmentItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">ไม่มีอุปกรณ์ที่ยืม</div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 py-2 px-4 border-b font-bold bg-[#5a7dbb]  
                mb-3 rounded-md text-white">
                  <div>รายการ</div>
                  <div className="text-center">ราคา</div>
                  <div className="text-center">จำนวน</div>
                  <div className="text-center">ยกเลิก</div>
                </div>
                <div className="space-y-4">
                  {userEquipmentItems.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 gap-4 items-center py-2 px-4  rounded-lg shadow-lg bg-white"
                    >
                      <div className="flex items-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.attributes?.Label || "Unknown Item"}
                            className="w-32 h-32 object-cover rounded-lg mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center text-gray-500">
                            ไม่มีรูปภาพ
                          </div>
                        )}


                        <div>
                          <h2 className="text-lg font-bold text-gray-800">{item.attributes?.label}</h2>
                          {/* <p className="text-sm text-gray-500">
                            {item.attributes.categoriesadmin?.data?.attributes?.name || "N/A"}
                          </p> */}

                        </div>
                      </div>
                      <div className="text-center">{item.attributes?.Price} ฿</div>
                      <div className="text-center">{item.attributes?.amount}</div>
                      <button onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-500 text-white flex items-center justify-center px-1 py-1 rounded-lg mx-auto">
                        <IoClose
                          className="text-white cursor-pointer w-5 h-5"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ✅ เลือกปีการศึกษาก่อนพิมพ์แบบฟอร์ม */}

          <div className="flex justify-end">
            <button
              className="bg-[#05c452] text-white py-2 px-6 mt-10 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
              onClick={handleGoToBorrowForm}
            >
              พิมพ์แบบฟอร์มยืมอุปกรณ์
            </button>
          </div>
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

      </Layout>
    </div>
  );
};

export default EquipmentPage;
