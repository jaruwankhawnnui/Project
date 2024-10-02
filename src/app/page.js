import { cookies } from "next/headers";
import dynamic  from "next/dynamic";

import LoginForm from "@/components/LoginForm";
const LoginForm2 = dynamic(() => import('@/components/LoginForm2'), { ssr: false});

export default function Home() {
  const cookieStore = cookies()
  return (

      <div className="flex flex-col bg-gray-100 justify-center items-center ">
        <LoginForm2 />
      </div>
    
  );
}
