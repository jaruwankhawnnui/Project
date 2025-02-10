"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Headeradmin from "@/components/Headeradmin"; // Assuming you have a Layout component

const CommentPage = () => {
  // State declarations
  const [comments, setComments] = useState([]); // For storing all webnews items
  const [label, setLabel] = useState(''); // For storing the label input
  const [image, setImage] = useState(null); // For storing the selected image
  const [loading, setLoading] = useState(false); // Loading status

  // Fetch webnews items from Strapi API on first load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://172.31.0.1:1337/api/webnews?populate=*'); // Correct endpoint for fetching webnews
        setComments(response.data.data); // Store the fetched webnews items
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(); // Fetch data from Strapi
  }, []);

  // Handle label input change
  const handleLabelChange = (e) => {
    setLabel(e.target.value); // Update the label input
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  // Handle form submission to add a new webnews item
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true during the request

    const formData = new FormData(); // Use FormData to send multipart data
    formData.append('data', JSON.stringify({ label })); // Add label data
    if (image) {
      formData.append('files.image', image); // Add image file if selected
    }

    try {
      const response = await axios.post('http://172.31.0.1:1337/api/webnews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct headers for file upload
        },
      });

      // Append the newly added webnews item to the state
      setComments([...comments, response.data.data]);

      // Reset the input fields
      setLabel('');
      setImage(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false); // Set loading state to false after request completion
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Headeradmin>
        <div className="max-w-2xl mt-6 mx-auto p-6 bg-white rounded-lg">
          <h1 className="text-2xl font-bold mb-4">เพิ่มข่าวสาร</h1>

          {/* Form to add new webnews */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            {/* Image Upload Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">อัปโหลดรูปภาพ</label>
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8v8"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">แนบรูปภาพ</span>
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Label Input Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">หัวข้อข่าวสาร</label>
              <input
                type="text"
                value={label}
                onChange={handleLabelChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="กรอกหัวข้อข่าวสาร"
                required
              />
            </div>

            <div className='flex justify-center'>
              <button
                type="submit"
                className="bg-[#465B7E] w-3/5 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'กำลังส่ง...' : 'เพิ่ม'}
              </button>

            </div>
          </form>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CommentPage;
