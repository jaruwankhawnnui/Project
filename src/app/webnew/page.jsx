
"use client"
import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [webnews, setWebnews] = useState([]); // State to store fetched webnews items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch webnews items from the API when the component mounts
  useEffect(() => {
    const fetchWebnews = async () => {
      try {
        const response = await axios.get('http://172.20.64.1:1337/api/webnews?populate=*');
        setWebnews(response.data.data); // Store the fetched data
      } catch (error) {
        setError("Error fetching webnews"); // Handle errors
        console.error("Error fetching webnews:", error);
      } finally {
        setLoading(false); // Stop loading when request is done
      }
    };

    fetchWebnews(); // Call the fetch function
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Display a loading indicator while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Display error if fetching fails
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Layout>
        <main className="p-4">
          <div className="bg-white p-6 rounded-lg shadow-l">
            <h2 className="text-3xl font-bold mb-8">ข่าวสารเว็บไซต์ !</h2>
            <div className="grid grid-cols-4 gap-2">
              {/* Render each webnews item dynamically */}
              {webnews.length > 0 ? (
                webnews.map((newsItem) => (
                  <div key={newsItem.id} className="bg-gray-200 p-4 h-72 rounded-l">
                    {/* If image exists, display it */}
                    {newsItem.attributes.image && (
                      <img
                      src={newsItem.attributes.image.data[0].attributes.url} // Use full Cloudinary URL
                      alt={newsItem.attributes.label || "News Image"}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    )}
                    {/* Display the label */}
                    <p className="font-bold text-gray-600">{newsItem.attributes.label}</p>
                  </div>
                ))
              ) : (
                <p>No news available</p> // Show if there are no webnews items
              )}
            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
}
