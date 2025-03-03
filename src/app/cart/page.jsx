"use client";

import React, { useState, useEffect } from "react";
import { RiCheckboxBlankLine, RiCheckboxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // ✅ เพิ่มไอคอนโหลด
import { motion } from "framer-motion";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCheckedPrice, setTotalCheckedPrice] = useState(0);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!session?.user?.email) {
        console.error("User is not logged in");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://coe-hardware-lab-website-ievu.onrender.com/api/adds?filters[email][$eq]=${session.user.email}&populate=image`
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
      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/adds/${id}`, {
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
    setIsLoading(true);
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
              : `https://coe-hardware-lab-website-ievu.onrender.com${item.attributes.image.data[0].attributes.url}`
            : null;

        console.log("Final Image URL:", imageUrl);

        // ค้นหาอุปกรณ์ใน Strapi ที่มีชนิดเดียวกัน
        const searchResponse = await fetch(
          `https://coe-hardware-lab-website-ievu.onrender.com/api/equipment?filters[label][$eq]=${item.attributes?.label}&populate=image`
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
            `https://coe-hardware-lab-website-ievu.onrender.com/api/equipment/${existingEquipment.id}`,
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
            const imageResponse = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/upload", {
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

          const createResponse = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/equipment", {
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
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <div className="container mx-auto px-4 sm:px-4 lg:px-4 pb-8">
          <h1 className="text-4xl font-bold my-6">รถเข็นของฉัน</h1>
          {loading ? (
            <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">ไม่มีอุปกรณ์ในประวัติการยืม</div>
          ) : (
            <div>
              <div className="">
                <div className="shadow-lg bg-cyan-50 p-4 rounded-lg overflow-x-auto">
                  {items.map((item, index) => {
                    const totalPrice = item.attributes?.Price * item.quantity;
                    const imageUrl = item.attributes?.image.data[0].attributes.url;

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-[auto,auto,0.5fr,auto,auto,auto,auto] items-center 
                        gap-4 py-2 px-4 rounded-lg shadow-lg bg-white  min-w-[900px] "
                      >
                        <div onClick={() => handleCheckboxChange(index)} className="cursor-pointer w-fit">
                          {checkedItems[index] ? (
                            <RiCheckboxLine className="w-6 h-6 text-green-500" />
                          ) : (
                            <RiCheckboxBlankLine className="w-6 h-6" />
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <img
                            src={imageUrl}
                            // alt={item.attributes?.image.data[0].attributes.url || "Unknown Item"}
                            // item.attributes.image?.data?.attributes?.url
                            className="w-16 mx-6 h-16 object-cover rounded-lg"
                          />
                        </div>

                        <div>
                          <h2 className="text-sm sm:text-base font-bold text-gray-800">
                            {item.attributes?.label || "Unknown Item"}
                          </h2>
                        </div>

                        <div>
                          <p className="text-sm px-6 text-gray-500">{item.attributes?.Price || 0} ฿</p>
                        </div>

                        <div className="flex items-center gap-1 px-6">
                          <button
                            className="bg-gray-300 hover:bg-gray-400 px-1  rounded-l"
                            onClick={() => decreaseQuantity(index)}
                          >
                            <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            className="bg-gray-300 hover:bg-gray-400 px-1  rounded-r"
                            onClick={() => increaseQuantity(index)}
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                          </button>
                        </div>


                        <div className="text-gray-800 font-bold text-md px-8">{totalPrice} ฿</div>
                        <button onClick={() => deleteItem(item.id, index)}
                          className="bg-red-500 text-white flex items-center justify-center px-1 py-1 rounded-lg mx-auto">
                          <IoClose
                            className="text-white cursor-pointer w-5 h-5"
                          />
                        </button>

                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center bg-[#4691D3]
               text-white p-4 rounded-lg mt-4 shadow-lg ">
                <div className="flex justify-between w-full sm:w-auto items-center mb-3 sm:mb-0">
                  <div onClick={handleSelectAllChange} className="flex items-center cursor-pointer">
                    {isSelectAllChecked ? (
                      <RiCheckboxLine className="w-6 h-6 text-green-500" />
                    ) : (
                      <RiCheckboxBlankLine className="w-6 h-6" />
                    )}
                    <span className="ml-2 text-white font-medium">เลือกทั้งหมด</span>
                  </div>
                  <span className="text-white font-medium ml-6">รวม: {checkedCount} ชิ้น</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left w-full sm:w-auto">
                  <span className="text-white font-bold">ราคารวมทั้งหมด: {totalCheckedPrice} ฿</span>

                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
                    onClick={handleBorrowItems}
                  >
                    ยืมอุปกรณ์
                  </button>
                </div>

                {isLoading && (
                  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
                    <motion.div
                      className="flex flex-col items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AiOutlineLoading3Quarters className="text-5xl text-blue-500 animate-spin" />
                      <p className="text-xl font-bold text-blue-500 mt-3">กำลังโหลด...</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>

          )}
        </div>

      </Layout>
    </div>
  );
};

export default Cart;
