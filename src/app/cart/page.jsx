"use client";

import React, { useState, useEffect } from 'react';
import { RiCheckboxBlankLine, RiCheckboxLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Layout from "@/components/Layout";
import { useRouter } from 'next/navigation';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [totalCheckedPrice, setTotalCheckedPrice] = useState(0);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    setItems(cartItems);
    setCheckedItems(new Array(cartItems.length).fill(false));
  }, []);

  useEffect(() => {
    const total = items.reduce((sum, item, index) => {
      if (checkedItems[index]) {
        return sum + item.attributes?.Price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalCheckedPrice(total);
  }, [checkedItems, items]);

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);

    setCheckedCount(newCheckedItems.filter(item => item).length);
    setIsSelectAllChecked(newCheckedItems.every(item => item));
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    const newCheckedItems = checkedItems.filter((_, i) => i !== index);
    setCheckedItems(newCheckedItems);

    sessionStorage.setItem('cartItems', JSON.stringify(newItems));
    const borrowedItems = JSON.parse(sessionStorage.getItem('borrowedItems')) || [];
    const updatedBorrowedItems = borrowedItems.filter((borrowedItem) => {
      return newItems.some((item) => item.id === borrowedItem.id);
    });
    sessionStorage.setItem('borrowedItems', JSON.stringify(updatedBorrowedItems));

    setCheckedCount(newCheckedItems.filter(item => item).length);
    setIsSelectAllChecked(newCheckedItems.every(item => item));
  };

  const handleSelectAllChange = () => {
    const newCheckedState = !isSelectAllChecked;
    setIsSelectAllChecked(newCheckedState);
    const newCheckedItems = checkedItems.map(() => newCheckedState);
    setCheckedItems(newCheckedItems);
    setCheckedCount(newCheckedItems.filter(item => item).length);
  };

  const increaseQuantity = (index) => {
    const newItems = [...items];
    newItems[index].quantity += 1;
    setItems(newItems);
    sessionStorage.setItem('cartItems', JSON.stringify(newItems));
  };

  const decreaseQuantity = (index) => {
    const newItems = [...items];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
      setItems(newItems);
      sessionStorage.setItem('cartItems', JSON.stringify(newItems));
    }
  };

  const handleBorrowItems = async () => {
    const borrowedItems = items.filter((item, index) => checkedItems[index]);
    sessionStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));

    try {
      const response = await fetch('/api/carts/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: borrowedItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.attributes?.Price,
            label: item.attributes?.Label,
          }))
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log("บันทึกข้อมูลสำเร็จ:", result);
        router.push('/equipment');
      } else {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", response.statusText);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <Layout>
        <div>
          <div className='bg-white mx-40 mt-1 mr-40 shadow-lg'>
            <div className='flex h-40'>
              <h1 className='flex text-4xl mx-9 mt-5 font-medium-9'>รถเข็น</h1>
            </div>
            <div className='flex h-10 justify-around'>
              <div className='w-11'></div>
              <h1 className='text-sm font-sans-serif font-bold w-32 text-center'>รายการอุปกรณ์</h1>
              <h1 className='text-sm font-sans-serif font-bold w-20 text-center'>ราคาต่อชิ้น</h1>
              <h1 className='text-sm font-sans-serif font-bold w-10 text-center'>จำนวน</h1>
              <h1 className='text-sm font-sans-serif font-bold w-16 text-center'>ราคารวม</h1>
              <h1 className='text-sm font-sans-serif font-bold w-9 text-center'>ยกเลิก</h1>
            </div>
          </div>

          <div className='bg-white mx-40 mt-6 shadow-lg flex flex-col'>
            {items.map((item, index) => {
              const totalPrice = item.attributes?.Price * item.quantity;
              return (
                <div key={index}>
                  <div className='flex items-center justify-around'>
                    <div className='mt-14 mx-1' onClick={() => handleCheckboxChange(index)}>
                      {checkedItems[index] ? (
                        <RiCheckboxLine className='w-7 h-9 mx-2 text-green-500' />
                      ) : (
                        <RiCheckboxBlankLine className='w-7 h-9 mx-2' />
                      )}
                    </div>

                    <div className='flex flex-col items-center'>
                      <div
                        className='bg-gray-300 rounded-lg p-14 w-32 h-32 mt-6 mr-2'
                        style={{
                          backgroundImage: item.attributes?.image?.data?.attributes?.url
                            ? `url(${item.attributes?.image?.data?.attributes?.url})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      ></div>
                      <div className='mt-9 flex-1 w-32 text-sm '>
                        <div className='text-black text-sm font-bold'>{item.attributes?.Label}</div>
                      </div>
                    </div>

                    <div className='flex flex-col items-center mt-9 w-20 '>
                      <div className='text-black text-l '>{item.attributes?.Price} ฿</div>
                    </div>
                    <div className='flex flex-col items-center mt-9 w-10'>
                      <div className='flex items-center'>
                        <button onClick={() => decreaseQuantity(index)} className='px-3 py-1 bg-gray-300 rounded-l'>-</button>
                        <span className='px-4 py-1 bg-white border-t border-b'>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(index)} className='px-3 py-1 bg-gray-300 rounded-r'>+</button>
                      </div>
                    </div>
                    <div className='flex flex-col items-center mt-9 w-14'>
                      <div className='text-black text-l '>{totalPrice} ฿</div>
                    </div>
                    <div className='flex justify-center mt-9 w-9'>
                      <IoClose className='text-red-600 h-7 w-8 cursor-pointer' onClick={() => handleRemoveItem(index)} />
                    </div>
                  </div>
                  {index < items.length - 1 && <div className="border-b border-black mx-8 mt-5"></div>}
                </div>
              );
            })}
          </div>

          <div className='bg-white mx-40 mt-5 mr-40 shadow-lg h-20 flex justify-between items-center'>
            <div className='flex items-center ml-4' onClick={handleSelectAllChange}>
              {isSelectAllChecked ? (
                <RiCheckboxLine className='w-7 h-9 mx-2 text-green-500' />
              ) : (
                <RiCheckboxBlankLine className='w-7 h-9 mx-14' />
              )}
              <span className='text-l font-serif '>เลือกทั้งหมด</span>
            </div>

            <div className='flex justify-end'>
              <span className='text-l font-serif flex items-center mx-8 mt-8'>รวม: {checkedCount} ชิ้น</span>
              <span className='text-l font-serif flex items-center mx-8 mt-8'>ราคารวมทั้งหมด: {totalCheckedPrice} ฿</span>
              <button 
                className='shadow-lg shadow-indigo-500/40 bg-blue-200 h-10 w-40 mt-7 mr-5'
                onClick={handleBorrowItems}
              >
                ยืมอุปกรณ์
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Cart;
