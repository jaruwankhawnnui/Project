
"use client"
import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [webnews, setWebnews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchWebnews = async () => {
      try {
        const response = await axios.get('https://coe-hardware-lab-website-ievu.onrender.com/api/webnews?populate=*');
        setWebnews(response.data.data);
      } catch (error) {
        setError("Error fetching webnews");
        console.error("Error fetching webnews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebnews();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Layout>
        <div className="px-10">
          <div className="flex justify-center  items-center bg-[#465B7E] p-3  rounded-lg w-full">
            <h1 className="w-full text-white text-3xl   font-bold">
              ข่าวสารเว็บไซต์
            </h1>
          </div>
          <main className="mt-7">
            <div className="bg-cyan-50 p-6 rounded-lg shadow-l">

              <div className="grid grid-cols-4 gap-2">

                {webnews.length > 0 ? (
                  webnews.map((newsItem) => (
                    <div key={newsItem.id} className="bg-gray-100 p-4 h-72 rounded-xl shadow-l">
                      {/* If image exists, display it */}
                      {newsItem.attributes.image && (
                        <img
                          src={newsItem.attributes.image.data[0].attributes.url} // Use full Cloudinary URL
                          alt={newsItem.attributes.label || "News Image"}
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                      )}

                      <p className="font-bold text-gray-700">{newsItem.attributes.label}</p>
                    </div>
                  ))
                ) : (
                  <p>No news available</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </div>
  );
}
