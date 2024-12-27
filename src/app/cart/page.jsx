"use client";

import React, { useState, useEffect } from "react";
import { RiCheckboxBlankLine, RiCheckboxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCheckedPrice, setTotalCheckedPrice] = useState(0);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!session?.user?.email) {
        console.error("User is not logged in");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://172.20.160.1:1337/api/adds?filters[email][$eq]=${session.user.email}`
        );

        if (response.ok) {
          const data = await response.json();
          const enrichedItems = data.data.map((item) => ({
            id: item.id,
            quantity: item.attributes.amount || 1, // Default quantity
            attributes: item.attributes,
          }));
          setItems(enrichedItems);
          setCheckedItems(new Array(enrichedItems.length).fill(false)); // Reset checkbox states
        } else {
          console.error("Failed to fetch items:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [session?.user?.email]);

  useEffect(() => {
    const total = items.reduce((sum, item, index) => {
      if (checkedItems[index]) {
        return sum + item.attributes?.Price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalCheckedPrice(total);
    setCheckedCount(checkedItems.filter((item) => item).length);
  }, [checkedItems, items]);

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    setIsSelectAllChecked(newCheckedItems.every((item) => item));
  };

  const handleSelectAllChange = () => {
    const newCheckedState = !isSelectAllChecked;
    setIsSelectAllChecked(newCheckedState);
    setCheckedItems(checkedItems.map(() => newCheckedState));
  };

  const increaseQuantity = (index) => {
    const newItems = [...items];
    newItems[index].quantity += 1;
    setItems(newItems);
  };

  const decreaseQuantity = (index) => {
    const newItems = [...items];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
      setItems(newItems);
    }
  };

  const handleBorrowItems = async () => {
    const borrowedItems = items.filter((_, index) => checkedItems[index]);
    if (borrowedItems.length === 0) {
      alert("กรุณาเลือกอุปกรณ์ที่ต้องการยืม");
      return;
    }

    try {
      for (const item of borrowedItems) {
        const response = await fetch(`http://172.20.160.1:1337/api/adds/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              label: item.attributes?.label || "Unknown Item",
              amount: item.quantity,
              user_login: session.user.email, // ใช้ email ผู้ใช้ที่ล็อกอิน
            },
          }),
        });

        if (!response.ok) {
          console.error("Failed to borrow item:", await response.text());
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
          return;
        }
      }
      alert("การยืมอุปกรณ์สำเร็จ");
      router.push("/equipment");
    } catch (error) {
      console.error("Error borrowing items:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold my-6">รถเข็นของฉัน</h1>
          {loading ? (
            <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">ไม่มีอุปกรณ์ในประวัติการยืม</div>
          ) : (
            <div>
              <div className="shadow-lg bg-white p-4 rounded-lg">
                {items.map((item, index) => {
                  const totalPrice = item.attributes?.Price * item.quantity;
                  return (
                    <div key={index} className="flex items-center justify-between mb-4">
                      <div onClick={() => handleCheckboxChange(index)}>
                        {checkedItems[index] ? (
                          <RiCheckboxLine className="w-6 h-6 text-green-500 cursor-pointer" />
                        ) : (
                          <RiCheckboxBlankLine className="w-6 h-6 cursor-pointer" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <img
                          src={item.attributes?.image?.data?.attributes?.url || "/placeholder.png"}
                          alt={item.attributes?.label}
                          className="w-20 h-20 rounded-lg mr-4"
                        />
                        <div>
                          <h2 className="text-lg font-bold">{item.attributes?.label}</h2>
                          <p className="text-gray-500">{item.attributes?.Price} ฿</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="bg-gray-300 px-2 py-1 rounded-l"
                          onClick={() => decreaseQuantity(index)}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="bg-gray-300 px-2 py-1 rounded-r"
                          onClick={() => increaseQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                      <div>{totalPrice} ฿</div>
                      <IoClose
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          const newItems = items.filter((_, i) => i !== index);
                          setItems(newItems);
                          setCheckedItems(checkedItems.filter((_, i) => i !== index));
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg mt-4 shadow-lg">
                <div onClick={handleSelectAllChange} className="flex items-center cursor-pointer">
                  {isSelectAllChecked ? (
                    <RiCheckboxLine className="w-6 h-6 text-green-500" />
                  ) : (
                    <RiCheckboxBlankLine className="w-6 h-6" />
                  )}
                  <span className="ml-2">เลือกทั้งหมด</span>
                </div>
                <div>
                  <span>รวม: {checkedCount} ชิ้น</span>
                  <span className="ml-4">ราคารวมทั้งหมด: {totalCheckedPrice} ฿</span>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 ml-4 rounded-lg"
                    onClick={handleBorrowItems}
                  >
                    ยืมอุปกรณ์
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default Cart;
