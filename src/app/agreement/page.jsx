"use client";
import React from 'react';
import Layout from "@/components/Layout"; // Assuming you have a Layout component
import { FaCheckCircle } from 'react-icons/fa'; // Using Font Awesome icons (install react-icons if not already installed)

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Layout>
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-black">ข้อตกลงในการเข้าใช้งาน</h1>
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                1. การยอมรับข้อตกลง
              </h2>
              <p>
                โดยการเข้าใช้งานแอปพลิเคชันนี้ ท่านตกลงที่จะปฏิบัติตามและยอมรับข้อตกลงและเงื่อนไขทั้งหมดที่ได้ระบุไว้ในที่นี้ หากท่านไม่ยอมรับข้อตกลงใด ๆ โปรดหยุดการใช้งานแอปพลิเคชันนี้ทันที
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                2. การใช้งานที่เหมาะสม
              </h2>
              <p>
                ท่านยินยอมที่จะใช้งานแอปพลิเคชันนี้เฉพาะเพื่อวัตถุประสงค์ที่ถูกต้องตามกฎหมายและในลักษณะที่ไม่ละเมิดสิทธิ์ของบุคคลอื่น หรือจำกัดหรือยับยั้งการใช้งานของบุคคลอื่น
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                3. ข้อมูลส่วนบุคคล
              </h2>
              <p>
                การเก็บรวบรวมและการใช้งานข้อมูลส่วนบุคคลของท่านจะเป็นไปตามนโยบายความเป็นส่วนตัวของเรา โปรดอ่านนโยบายความเป็นส่วนตัวเพื่อทราบข้อมูลเพิ่มเติมเกี่ยวกับวิธีที่เราใช้ข้อมูลของท่าน
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                4. การเปลี่ยนแปลงข้อตกลง
              </h2>
              <p>
                เราขอสงวนสิทธิ์ในการแก้ไขหรือปรับปรุงข้อตกลงในการเข้าใช้งานได้ทุกเมื่อโดยไม่ต้องแจ้งให้ทราบล่วงหน้า ท่านควรตรวจสอบข้อตกลงเหล่านี้เป็นระยะเพื่อให้แน่ใจว่าท่านเข้าใจและยอมรับข้อตกลงล่าสุด
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                5. การสิ้นสุดการใช้งาน
              </h2>
              <p>
                เราขอสงวนสิทธิ์ในการยุติการใช้งานของท่านในกรณีที่ท่านละเมิดข้อตกลงเหล่านี้ หรือหากเราเห็นว่าการกระทำของท่านเป็นอันตรายต่อบริการหรือผู้ใช้รายอื่น
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                6. ข้อกำหนดเพิ่มเติม
              </h2>
              <p>
                อาจมีข้อกำหนดและเงื่อนไขเพิ่มเติมที่ใช้กับบริการหรือฟีเจอร์เฉพาะในแอปพลิเคชันนี้ ข้อกำหนดเพิ่มเติมดังกล่าวจะถือเป็นส่วนหนึ่งของข้อตกลงในการเข้าใช้งานนี้
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                7. การติดต่อ
              </h2>
              <p>
                หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับข้อตกลงในการเข้าใช้งานนี้ ท่านสามารถติดต่อเราได้ที่ [ข้อมูลการติดต่อ]
              </p>
            </section>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default TermsOfServicePage;
