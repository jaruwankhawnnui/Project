"use client";
import React from 'react';
import Layout from "@/components/Layout"; // Assuming you have a Layout component
import { FaCheckCircle } from 'react-icons/fa'; // Using Font Awesome icons (install react-icons if not already installed)

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 ">
      <Layout>
        
        <div className="max-w-4xl mx-auto p-8 bg-cyan-50 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-black">กฎในการยืมอุปกรณ์</h1>
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                1. เวลารับอุปกรณ์
              </h2>
              <p>
                การรับอุปกรณ์ให้รับอุปกรณ์ตั้งแต่เวลา 10:00-11:00 น. ในวันดังกล่าวเท่านั้น
                หากมารับหลังเวลาที่กำหนด ให้มารับอุปกรณ์ในวันถัดไป
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                2. เงื่อนไขการยืมอุปกรณ์ในวิชา Project
              </h2>
              <p>
                วิชา Project สามารถยืมอุปกรณ์แล้วไม่เกิน 2500 บาท/คน/เทอม
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                3. ระยะเวลาการยืม
              </h2>
              <p>
                การยืมอุปกรณ์ให้ยืมนานได้ 4 วัน โดยนับเฉพาะวันเรียนเท่านั้น
                หากเกินกำหนดเวลาให้มาส่งอุปกรณ์คืน
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                4. เวลาคืนอุปกรณ์
              </h2>
              <p>
                การคืนอุปกรณ์ให้ดำเนินการคืนในช่วงเวลา 10:00-11:30 น.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                5. ค่าปรับกรณีคืนล่าช้า
              </h2>
              <p>
                ในกรณีที่คืนอุปกรณ์ล่าช้า ท่านจะต้องเสียค่าปรับ 100% จากราคาของอุปกรณ์ต่อวัน
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                6. สภาพอุปกรณ์ที่คืน
              </h2>
              <p>
                ผู้ยืมต้องส่งคืนอุปกรณ์ในสภาพที่สมบูรณ์ หากอุปกรณ์เกิดการเสียหาย
                ท่านต้องรับผิดชอบค่าใช้จ่ายทั้งหมดในการซ่อมหรือเปลี่ยนอุปกรณ์
              </p>
            </section>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default TermsOfServicePage;
