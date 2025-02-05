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
          `http://172.31.0.1:1337/api/adds?filters[email][$eq]=${session.user.email}&populate=image`
        );

        if (response.ok) {
          const data = await response.json();
          const enrichedItems = data.data.map((item) => ({
            id: item.id,
            quantity: item.attributes.amount || 1,
            attributes: item.attributes,
          }));
          setItems(enrichedItems);
          setCheckedItems(new Array(enrichedItems.length).fill(false));
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

  const deleteItem = async (id, index) => {
    try {
      const response = await fetch(`http://172.31.0.1:1337/api/adds/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setCheckedItems(checkedItems.filter((_, i) => i !== index));
        alert("ลบอุปกรณ์สำเร็จ");
      } else {
        const errorText = await response.text();
        console.error("Error deleting item from Strapi:", errorText);
        alert(`เกิดข้อผิดพลาดในการลบข้อมูล: ${errorText}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleBorrowItems = async () => {
    console.log("Starting handleBorrowItems...");
    const borrowedItems = items.filter((_, index) => checkedItems[index]);
    console.log("Borrowed items:", borrowedItems);
  
    if (borrowedItems.length === 0) {
      alert("กรุณาเลือกอุปกรณ์ที่ต้องการยืม");
      return;
    }
  
    try {
      for (const item of borrowedItems) {
        console.log("Processing item:", item);
  
        const imageUrl =
          item.attributes?.image?.data?.length > 0
            ? item.attributes.image.data[0].attributes.url.startsWith("http")
              ? item.attributes.image.data[0].attributes.url
              : `http://172.31.0.1:1337${item.attributes.image.data[0].attributes.url}`
            : null;
  
        console.log("Final Image URL:", imageUrl);
  
        // ค้นหาอุปกรณ์ใน Strapi ที่มีชนิดเดียวกัน
        const searchResponse = await fetch(
          `http://172.31.0.1:1337/api/equipment?filters[label][$eq]=${item.attributes?.label}&populate=image`
        );
  
        if (!searchResponse.ok) {
          const searchErrorText = await searchResponse.text();
          console.error("Error searching equipment:", searchErrorText);
          alert("เกิดข้อผิดพลาดในการค้นหาอุปกรณ์");
          return;
        }
  
        const searchData = await searchResponse.json();
        console.log("Search result:", searchData);
  
        const existingEquipment = searchData.data[0]; // หากพบอุปกรณ์ชนิดเดียวกัน
        console.log("Existing equipment:", existingEquipment);
  
        if (existingEquipment) {
          // หากมีอุปกรณ์ชนิดเดียวกัน ให้เพิ่มจำนวน
          const updatedAmount = existingEquipment.attributes.amount + item.quantity;
          console.log("Updated amount:", updatedAmount);
  
          const updateResponse = await fetch(
            `http://172.31.0.1:1337/api/equipment/${existingEquipment.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  amount: updatedAmount,
                },
              }),
            }
          );
  
          if (!updateResponse.ok) {
            const updateErrorText = await updateResponse.text();
            console.error("Error updating equipment:", updateErrorText);
            alert("เกิดข้อผิดพลาดในการเพิ่มจำนวนอุปกรณ์");
            return;
          }
  
          console.log("Successfully updated equipment:", existingEquipment.id);
        } else {
          // หากไม่มีอุปกรณ์ชนิดเดียวกัน ให้สร้างใหม่
          const formData = new FormData();
          if (imageUrl) {
            try {
              const imageBlob = await fetch(imageUrl).then((res) => res.blob());
              formData.append("files", imageBlob, "image.jpg");
              console.log("Image prepared for upload.");
            } catch (error) {
              console.error("Error fetching or preparing image:", error);
              alert("เกิดข้อผิดพลาดในการดึงหรือเตรียมรูปภาพ");
              return;
            }
          }
  
          let uploadedImageId = null;
          if (imageUrl) {
            const imageResponse = await fetch("http://172.31.0.1:1337/api/upload", {
              method: "POST",
              body: formData,
            });
  
            if (!imageResponse.ok) {
              const imageErrorText = await imageResponse.text();
              console.error("Image upload error:", imageErrorText);
              alert(`เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: ${imageErrorText}`);
              return;
            }
  
            const imageData = await imageResponse.json();
            uploadedImageId = imageData[0]?.id;
            console.log("Uploaded image ID:", uploadedImageId);
          }
  
          const createResponse = await fetch("http://172.31.0.1:1337/api/equipment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: {
                name: session.user.name || "Unknown User",
                email: session.user.email,
                label: item.attributes?.label || "Unknown Item",
                amount: item.quantity,
                Price: item.attributes?.Price,
                totalPrice: item.attributes?.Price * item.quantity,
                image: uploadedImageId, // บันทึก ID ของรูปภาพ
              },
            }),
          });
  
          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error("Error creating equipment:", errorText);
            alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${errorText}`);
            return;
          }
  
          console.log("Successfully created new equipment.");
        }
      }
  
      alert("การยืมอุปกรณ์สำเร็จ");
      router.push("/equipment");
    } catch (error) {
      console.error("Error saving items:", error);
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
                  const imageUrl = item.attributes?.image.data[0].attributes.url;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-gray-200"
                    >
                      <div onClick={() => handleCheckboxChange(index)} className="cursor-pointer">
                        {checkedItems[index] ? (
                          <RiCheckboxLine className="w-6 h-6 text-green-500" />
                        ) : (
                          <RiCheckboxBlankLine className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-1">
                        <img
                          src={imageUrl}
                          // alt={item.attributes?.image.data[0].attributes.url || "Unknown Item"}
                          // item.attributes.image?.data?.attributes?.url
                          className="w-16 mx-6 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h2 className="text-lg font-bold px-6 text-gray-800">
                            {item.attributes?.label || "Unknown Item"}
                          </h2>
                          <p className="text-sm px-6 text-gray-500">{item.attributes?.Price || 0} ฿</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-6">
                        <button
                          className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-l text-sm"
                          onClick={() => decreaseQuantity(index)}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded-r text-sm"
                          onClick={() => increaseQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                      <div className="text-gray-800 text-sm px-8">{totalPrice} ฿</div>
                      <IoClose
                        className="text-red-500 cursor-pointer hover:text-red-600"
                        onClick={() => deleteItem(item.id, index)}
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
                  <span className="ml-2 text-gray-800 font-medium">เลือกทั้งหมด</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-800 font-medium">รวม: {checkedCount} ชิ้น</span>
                  <span className="text-gray-800 font-bold">ราคารวมทั้งหมด: {totalCheckedPrice} ฿</span>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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
