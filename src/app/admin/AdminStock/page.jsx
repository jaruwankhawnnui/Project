"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { IoAdd, IoCheckmarkDone, IoTrash } from "react-icons/io5";

const HardwareStock = () => {
  const [stockItems, setStockItems] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowData, setBorrowData] = useState({
    user: "",
    item: "",
    quantity: 1,
  });

  // Fetch stock and borrowed items
  useEffect(() => {
    const fetchStockAndBorrowedItems = async () => {
      setLoading(true);
      try {
        const stockResponse = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/stockitems?populate=*");
        const borrowedResponse = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/borroweditems?populate=*");

        if (stockResponse.ok && borrowedResponse.ok) {
          const stockData = await stockResponse.json();
          const borrowedData = await borrowedResponse.json();
          setStockItems(stockData.data);
          setBorrowedItems(borrowedData.data);
        } else {
          console.error("Failed to fetch data:", await stockResponse.text(), await borrowedResponse.text());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockAndBorrowedItems();
  }, []);

  // Handle borrow action
  const handleBorrowItem = async () => {
    try {
      const response = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/borroweditems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            user: borrowData.user,
            item: borrowData.item,
            quantity: borrowData.quantity,
          },
        }),
      });

      if (response.ok) {
        const newBorrow = await response.json();
        setBorrowedItems([...borrowedItems, newBorrow.data]);
        setShowBorrowModal(false);
        setBorrowData({ user: "", item: "", quantity: 1 });
      } else {
        console.error("Failed to borrow item:", await response.text());
      }
    } catch (error) {
      console.error("Error borrowing item:", error);
    }
  };

  // Handle return action
  const handleReturnItem = async (id) => {
    try {
      const response = await fetch(`https://coe-hardware-lab-website-ievu.onrender.com/api/borroweditems/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBorrowedItems(borrowedItems.filter((item) => item.id !== id));
      } else {
        console.error("Failed to return item:", await response.text());
      }
    } catch (error) {
      console.error("Error returning item:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Hardware Stock Management</h1>
        {loading ? (
          <div className="text-center py-10">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock Items */}
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">Stock Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-center">Total</th>
                      <th className="border px-4 py-2 text-center">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">{item.attributes.label}</td>
                        <td className="border px-4 py-2 text-center">{item.attributes.totalQuantity}</td>
                        <td className="border px-4 py-2 text-center">{item.attributes.remainingQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Borrowed Items */}
            <div className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4">Borrowed Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">User</th>
                      <th className="border px-4 py-2 text-left">Item</th>
                      <th className="border px-4 py-2 text-center">Quantity</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">{item.attributes.user}</td>
                        <td className="border px-4 py-2">{item.attributes.item}</td>
                        <td className="border px-4 py-2 text-center">{item.attributes.quantity}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            className="text-green-500 hover:text-green-600 mx-2"
                            onClick={() => handleReturnItem(item.id)}
                          >
                            <IoCheckmarkDone className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Borrow Modal */}
        {showBorrowModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Borrow Item</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">User</label>
                <input
                  type="text"
                  className="w-full border px-4 py-2 rounded-lg"
                  value={borrowData.user}
                  onChange={(e) => setBorrowData({ ...borrowData, user: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Item</label>
                <select
                  className="w-full border px-4 py-2 rounded-lg"
                  value={borrowData.item}
                  onChange={(e) => setBorrowData({ ...borrowData, item: e.target.value })}
                >
                  <option value="">Select Item</option>
                  {stockItems.map((item) => (
                    <option key={item.id} value={item.attributes.label}>
                      {item.attributes.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  className="w-full border px-4 py-2 rounded-lg"
                  value={borrowData.quantity}
                  onChange={(e) => setBorrowData({ ...borrowData, quantity: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-lg"
                  onClick={() => setShowBorrowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleBorrowItem}
                >
                  Borrow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};


export default HardwareStock;
