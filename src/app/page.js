import { cookies } from "next/headers";
import dynamic  from "next/dynamic";

import LoginForm from "@/components/LoginForm";
//const LoginForm2 = dynamic(() => import('@/app/login/page'), { ssr: false});
// import Home from "@/app/newhome/page";
// export default function Home2() {
//   const cookieStore = cookies()
//   return (

//       <div className="flex flex-col bg-gray-100 justify-center items-center ">
//         <Home />
//       </div>
    
//   );
// }


import Image from 'next/image';
import Link from 'next/link';


export default async function Home() {
  // Fetch the data from Strapi API
  const res = await fetch('http://172.21.0.1:1337/api/webnews?populate=*', {
    cache: 'no-store',
  });
  const data = await res.json();
  const webnews = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-blue-900 text-white">
      {/* Header Section */}
      <header className="bg-cyan-100 p-4 flex justify-between items-center">
        <div className="flex items-center p-2 mx-8">
          {/* Logo */}
          <Image
            src="/logo/hw_web_logo.svg"
            alt="Logo"
            width={300}
            height={50}
          />
          
        </div>
        {/* Login Button */}
        <div>
          <Link href="/login">
            <button className="bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-400">
              Login
            </button>
          </Link>
        </div>
      </header>
      

      {/* Content Section */}
      <main className="p-8">
        <section className="bg-gray-200 p-6 rounded-lg shadow-l text-black">
          <h2 className="text-3xl font-bold mb-4">ข่าวสารเว็บไซต์ !</h2>
          <div className="grid grid-cols-4 gap-4">
            {webnews.map((news) => (
              <div key={news.id} className="bg-white p-4 rounded-lg">
                {/* Check if image exists before trying to render it */}
                {news.attributes.image && (
                      <img
                      src={news.attributes.image.data[0].attributes.url} // Use full Cloudinary URL
                      alt={news.attributes.label || "News Image"}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    )}
                {/* Display the label */}
                <h3 className="text-l mt-4 font-bold mb-2">
                  {news.attributes.label}
                </h3>
                
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-900 p-16 text-center">
        <p>สาขาวิชาวิศวกรรมคอมพิวเตอร์, คณะวิศวกรรมศาสตร์, มหาวิทยาลัยสงขลานครินทร์</p>
        <p>Email:jaruwankhawnnui@gmail.com</p>
        <p>website:https://www.coe.psu.ac.th/</p>
        <p>โทร: +66 (0)74 287358</p>
      </footer>
    </div>
  );
}
