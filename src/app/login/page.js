"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="m-auto md:px-24 xl:px-72 2xl:px-96 md:pt-[6rem] w-full h-screen">
            <div className="relative grid grid-cols-1 md:grid-rows-1 md:grid-cols-7 h-full md:h-[26rem] lg:h-[32rem] rounded-lg border bg-sky-100">
                <div className="hidden md:flex m-auto md:col-span-4 rounded-l-lg py-2 px-4">
                </div>
                <div className="flex flex-col col-span-3 text-center rounded-r-lg border px-6 bg-white">
                    <img src="/logo/psu-guide-logo-ex.svg" className="h-[5rem] w-4/5 md:w-fit mt-4 md:mt-auto m-auto mb-1 px-3" alt="PSU GUIDE Logo" />
                    <p className="mt-6 font-bold md:text-2xl text-4xl">สวัสดี!</p>
                    <p className="mt-4 md:text-lg text-2xl md:px-4 px-3">ลงชื่อเข้าใช้ผ่าน PSU Passport เพื่อเริ่มต้นใช้งาน</p>
                    <button
                        type="button"
                        className="mt-10 p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60"
                        onClick={() =>
                            signIn("authentik", {
                                //callbackUrl: "http://localhost:3000/homepage",
                            })
                        }
                    >
                        <img src="/logo/PSUOauth.svg" alt="test" />
                    </button>
                    <div className="md:hidden m-auto md:col-span-4 rounded-l-lg">

                    </div>
                </div>
            </div>
        </div>
    );
}