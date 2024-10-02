"use client";
import React, { useState, useEffect } from 'react';
import Headeradmin from '@/components/Headeradmin';
import axios from 'axios';

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]); // State to hold fetched items
  const [loading, setLoading] = useState(true); // Loading state to manage fetch

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.19.224.1:1337/api/cartadmins?populate=*');
        console.log("Fetched data:", response.data);
        const fetchedItems = response.data.data.map(item => ({
          id: item.id,
          name: item.attributes.Label,
          item: item.attributes.item || 0,  // Replace with actual field
          used: item.attributes.used || 0,    // Replace with actual field
          remaining: item.attributes.remaining || 0,  // Replace with actual field
          image: item.attributes.image?.data?.attributes?.url || "/default-image.jpg"
        }));
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='bg-gray-100  min-h-screen'>
    <Headeradmin>
      <div className="p-8">
        <div className="flex  justify-between items-center  bg-white mb-4 mx-20 ">
          <h1 className="mt-4 shadow-lg h-28 w-full text-3xl pl-10  font-mono ">รายการอุปกรณ์</h1>
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 mx-20 rounded hover:bg-blue-700">
          + Add New
        </button>

        <div className="bg-white shadow-md mt-5 rounded-lg mx-20 p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:shadow-outline"
            />
          </div>

          {loading ? (
            <div>Loading...</div> // Loading indicator
          ) : (
            <table className="mx-10 bg-white">
              <thead>
                <tr>
                  <th className="px-10 py-2 border-b">รูปภาพ</th>
                  <th className="px-20 py-2 border-b">รายการ</th>
                  <th className="px-10 py-2 border-b">จำนวนทั้งหมด</th>
                  <th className="px-10 py-2 border-b">จำนวนยืม</th>
                  <th className="px-10 py-2 border-b">คงเหลือ</th>
                  <th className="px-20 py-2 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 border-b">
                      {item.image && (
                        <img
                          src={item.image.startsWith('http') ? item.image : `http://172.19.224.1:1337${item.image}`}
                          className="w-32 h-32  object-cover rounded"
                        />
                      )}
                    </td>

                    <td className="px-10  py-2 border-b">{item.name}</td>
                    <td className="px-20 py-2 border-b">{item.item} ชิ้น</td>
                    <td className="px-20 py-2 border-b">{item.used} ชิ้น</td>
                    <td className="px-20 py-2 border-b">{item.remaining} ชิ้น</td>
                    <td className="px-4 py-2 border-b text-right">
                      <button className="text-gray-500 hover:text-gray-700">...</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center mt-4">
            <button className="text-gray-600 hover:text-gray-800">Previous</button>
            <button className="text-gray-600 hover:text-gray-800">Next</button>
          </div>
        </div>
      </div>
    </Headeradmin>
    </div>
  );
};

export default InventoryList;
