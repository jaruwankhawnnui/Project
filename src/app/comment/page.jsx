"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // นำเข้า axios
import Layout from "@/components/Layout"; // Assuming you have a Layout component

const CommentPage = () => {
  const [comments, setComments] = useState([]); // สำหรับเก็บคอมเม้นทั้งหมด
  const [label, setLabel] = useState(''); // สำหรับเก็บ label
  const [image, setImage] = useState(null); // สำหรับเก็บไฟล์รูปภาพ
  const [loading, setLoading] = useState(false); // สถานะการโหลด

  // ดึงข้อมูลคอมเมนต์จาก API เมื่อหน้าโหลดครั้งแรก
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/comments?populate=*');
        setComments(response.data.data); // เก็บข้อมูลคอมเม้นใน state
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(); // เรียกฟังก์ชันเพื่อดึงข้อมูลคอมเม้นท์
  }, []);

  const handleLabelChange = (e) => {
    setLabel(e.target.value); // อัปเดตข้อความ label
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // เก็บไฟล์รูปภาพที่เลือก
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // เริ่มการโหลด

    const formData = new FormData(); // ใช้ FormData สำหรับการส่งข้อมูลที่มีรูปภาพ
    formData.append('data', JSON.stringify({ label })); // เพิ่ม label ลงใน FormData
    if (image) {
      formData.append('files.image', image); // เพิ่มรูปภาพถ้ามี
    }

    try {
      const response = await axios.post('http://localhost:1337/api/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // กำหนด header เป็น multipart/form-data
        },
      });

      // เพิ่มคอมเม้นใหม่ไปยัง state comments ทันที
      setComments([...comments, response.data.data]);

      // รีเซ็ตค่า input
      setLabel('');
      setImage(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false); // หยุดการโหลด
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Layout>
        <div className="max-w-2xl mx-auto p-6 bg-white bg-opacity-80 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">แสดงความคิดเห็น</h1>

          {/* ฟอร์มแสดงความคิดเห็น */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-lg"
              placeholder="พิมพ์ label ของคุณที่นี่..."
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-2"
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={loading} // ปิดปุ่มเมื่อกำลังโหลด
            >
              {loading ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
            </button>
          </form>

          {/* แสดงความคิดเห็นทั้งหมด */}
          <div>
            <h2 className="text-xl font-semibold mb-2">ความคิดเห็นทั้งหมด</h2>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow mb-2">
                  <p>{comment.attributes.label}</p>
                  {comment.attributes.image && comment.attributes.image.data && (
                    <img
                      src={`http://localhost:1337${comment.attributes.image.data.attributes.url}`} // อ้างอิง URL ของรูปภาพจาก API
                      alt="comment image"
                      className="mt-2 rounded-lg max-h-60"
                    />
                  )}
                </div>
              ))
            ) : (
              <p>ยังไม่มีความคิดเห็น</p>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default CommentPage;
