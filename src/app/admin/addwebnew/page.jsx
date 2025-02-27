"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Headeradmin from "@/components/Headeradmin";

const API_URL = "http://172.21.32.1:1337/api/webnews"; // URL ของ Strapi

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [label, setLabel] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // ✅ ใช้แสดงรูปภาพที่มีอยู่แล้ว
  const [loading, setLoading] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}?populate=*`);
      setComments(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
    }
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file)); // ✅ แสดงภาพตัวอย่าง
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('data', JSON.stringify({ label }));

    if (image) {
      formData.append('files.image', image);
    }

    try {
      if (editComment) {
        // ✅ แก้ไขข้อมูลและอัปเดตรูปภาพถ้ามีการเปลี่ยนแปลง
        await axios.put(`${API_URL}/${editComment.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage("✅ แก้ไขข่าวสารสำเร็จ!");
      } else {
        // ✅ เพิ่มข่าวสารใหม่
        await axios.post(API_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage("🎉 เพิ่มข่าวสารสำเร็จ!");
      }

      setLabel('');
      setImage(null);
      setPreviewImage(null);
      setEditComment(null);
      fetchComments();
    } catch (error) {
      console.error("❌ Error posting comment:", error);
      setErrorMessage("❌ ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccessMessage("✅ ลบข่าวสารสำเร็จ!");
      fetchComments();
    } catch (error) {
      console.error("❌ ลบไม่สำเร็จ:", error);
      setErrorMessage("❌ ไม่สามารถลบข่าวสารได้ กรุณาลองใหม่");
    }
  };

  const handleEdit = (comment) => {
    setLabel(comment.attributes.label);
    setEditComment(comment);

    // ✅ โหลดรูปภาพปัจจุบัน
    const currentImage = comment.attributes.image?.data?.attributes?.url;
    setPreviewImage(currentImage || null);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Headeradmin>
        <div className="max-w-2xl mt-6 mx-auto p-6 bg-white rounded-lg">
          <h1 className="text-2xl font-bold mb-4">{editComment ? "แก้ไขข่าวสาร" : "เพิ่มข่าวสาร"}</h1>

          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">อัปโหลดรูปภาพ</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">หัวข้อข่าวสาร</label>
              <input
                type="text"
                value={label}
                onChange={handleLabelChange}
                className="w-full p-2 border rounded-md"
                placeholder="กรอกหัวข้อข่าวสาร"
                required
              />
            </div>

            <div className='flex justify-center'>
              <button
                type="submit"
                className="bg-[#465B7E] w-3/5 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : editComment ? "บันทึกการแก้ไข" : "เพิ่ม"}
              </button>
            </div>
          </form>
        </div>

        {/* ✅ แสดงรายการข่าวสาร */}
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-4">รายการข่าวสาร</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 w-10">#</th>
                
                <th className="border border-gray-300 px-4 py-2">หัวข้อข่าวสาร</th>
                <th className="border border-gray-300 px-4 py-2 w-40">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <tr key={comment.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  
                    <td className="border border-gray-300 px-4 py-2">{comment.attributes.label}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center items-center space-x-2">
                     
                      <button onClick={() => handleDelete(comment.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700">
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4">ไม่มีข่าวสาร</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Headeradmin>
    </div>
  );
};

export default CommentPage;
