import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import LoginForm from "@/components/LoginForm";
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // Fetch the data from Strapi API
  const res = await fetch('https://coe-hardware-lab-website-ievu.onrender.com/api/webnews?populate=*', {
    cache: 'no-store',
  });
  const data = await res.json();
  const webnews = data.data;

  return (
    <div className="min-h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('/coee.jpg')" }} // ✅ ใช้ path รูปภาพตรงๆ
>
      {/* Header Section */}
      <header className="bg-gradient-to-br from-cyan-100 to-[#6EC7E2] p-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center p-2 mx-4">
          {/* Logo */}
          <Image
            src="/logo/hw_web_logo.svg"
            alt="Logo"
            width={250}
            height={50}
            className="w-40 sm:w-60 md:w-72 lg:w-80"
          />
        </div>
        {/* Login Button */}
        <div className="mx-4">
          <Link href="/login">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition-all">
              Login
            </button>
          </Link>
        </div>
      </header>
   

      {/* Content Section */}
      <main className="p-4 md:p-8 container mx-auto">
        <section className="bg-white bg-opacity-40 backdrop-blur-sm p-6 rounded-lg shadow-lg text-black">
        <div className="text-xl sm:text-xl text-white font-bold text-center  py-2 px-2  bg-opacity-60  animate-pulse">
  กรุณาล็อกอินก่อนเข้าใช้งาน....
</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            ข่าวสารเว็บไซต์ 
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {webnews.map((news) => (
              <div key={news.id} className="bg-white p-4 rounded-lg shadow-md">
                {/* Check if image exists before trying to render it */}
                {news.attributes.image && (
                  <img
                    src={news.attributes.image.data[0].attributes.url}
                    alt={news.attributes.label || "News Image"}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                {/* Display the label */}
                <h3 className="text-lg font-semibold mt-4">
                  {news.attributes.label}
                </h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-900 p-8 text-center text-sm sm:text-base">
        <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์</p>
        <p>คณะวิศวกรรมศาสตร์  มหาวิทยาลัยสงขลานครินทร์ อำเภอหาดใหญ่ จังหวัดสงขลา 90110</p>
       
      </footer>
    </div>
  );
}
