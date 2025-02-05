"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import MainHeader from "@/components/MainHeader";
import { FaUserCircle } from "react-icons/fa"; // ✅ เพิ่มไอคอน

const Home = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

 
  useEffect(() => {
    fetch("http://172.31.0.1:1337/api/cartadmins?populate=*")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;
  }

  const handleCardClick = (item) => {
    router.push(`/card/${item.id}`);
  };

  const filteredItems = data.filter((item) => {
    const label = item.attributes?.Label?.toLowerCase() || "";
    const category = item.attributes?.Category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return label.includes(search) || category.includes(search);
  });

  const renderItemsByCategory = () => {
    return filteredItems.map((item, index) => (
      <div
        key={index}
        className="relative bg-gradient-to-br from-[#6EC7E2] to-cyan-50 shadow-xl rounded-lg  p-4 w-48 mx-5 h-62 mt-10 mr-6 cursor-pointer flex flex-col items-center"
        onClick={() => handleCardClick(item)}
      >
        {item.attributes?.image?.data?.attributes?.url && (
          <img
            src={item.attributes.image.data.attributes.url}
            className="w-full h-36 object-cover mb-4 mt-1 rounded-lg"
            alt={item.attributes?.Label}
          />
        )}
        <div className="text-center bg-white shadow-xl rounded-lg w-full h-27 ">
          <div className="font-bold text-sm">{item.attributes?.Label}</div>
          <div className="text-xs text-gray-500">{item.attributes?.Category}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen  flex flex-col">
      <MainHeader />

      {/* ✅ พื้นหลังไล่สี เพิ่มลูกเล่น */}
      <div className="bg-gradient-to-br from-[#6EC7E2] to-cyan-50 shadow-xl rounded-2xl p-6  px-32 mx-auto text-gray-700 flex items-center justify-center mt-6">
        <FaUserCircle className=" text-6xl mr-6" /> {/* ✅ ไอคอนผู้ใช้ */}
        {status === "authenticated" ? (
          <div>
            <p className="font-bold text-xl">👋 Welcome: {session.user.name}</p>
            <p className="text-lg">📧 Email: {session.user.email}</p>
            <p className="text-lg">
              🎓 Student ID: {session.user.email.replace("@email.psu.ac.th", "") || "Not Available"}
            </p>
          </div>
        ) : (
          <p className="text-lg">⚠️ You are not logged in</p>
        )}
      </div>

      {/* ✅ เพิ่มช่องค้นหา */}
      <div className="flex justify-center px-32 mb-6">
        <input
          type="text"
          placeholder="🔍 ค้นหาอุปกรณ์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 mt-4 py-2 border rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ✅ แสดงรายการอุปกรณ์ */}
      <div className="flex justify-center items-start flex-wrap mt-0">
        {filteredItems.length > 0 ? (
          renderItemsByCategory()
        ) : (
          <p className="text-gray-500 text-lg text-center">❌ ไม่พบอุปกรณ์ที่ค้นหา</p>
        )}
      </div>
    </div>
  );
};

export default Home;
