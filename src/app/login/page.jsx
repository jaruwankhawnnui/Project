// "use client";

// import { Player } from "@lottiefiles/react-lottie-player";
// import { signIn } from "next-auth/react";

// export default function LoginForm2() {


//     return (
//         <div className="m-auto md:px-24 xl:px-72 2xl:px-96 md:pt-[6rem] w-full h-screen">
//             <div className="relative grid grid-cols-1 md:grid-rows-1 md:grid-cols-7 h-full md:h-[26rem] lg:h-[32rem] rounded-lg border bg-sky-100">
//                 <div className="hidden md:flex m-auto md:col-span-4 rounded-l-lg py-2 px-4">
//                     <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
//                 </div>
//                 <div className="flex flex-col col-span-3 text-center rounded-r-lg border px-6 bg-white">
//                     <img src="/logo/hw_web_logo.svg" className="h-[5rem] w-4/5 md:w-fit mt-4 md:mt-auto m-auto mb-1 px-3" alt="Hw Web_Logo" />
//                     <p className="mt-6 font-bold md:text-2xl text-4xl">สวัสดี!</p>
//                     <p className="mt-4 md:text-lg text-2xl md:px-4 px-3">ลงชื่อเข้าใช้ผ่าน PSU Passport หรือ Google เพื่อเริ่มต้นใช้งาน</p>

//                     {/* PSU Passport Login Button */}
//                     <button
//                         type="button"
//                         className="mt-10 p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60"
//                         onClick={() =>
//                             signIn("authentik", {
//                                 callbackUrl: "http://localhost:3000/api/auth/callback/authentik"
//                                 // callbackUrl: "https://test-hw-psu.japaneast.cloudapp.azure.com/api/auth/callback/authentik "
//                             })
//                         }
//                     >
//                         <img src="/logo/PSUOauth.svg" alt="PSU OAuth" />
//                     </button>

//                     {/* Google Login Button */}
//                     <button
//                         type="button"
//                         className="mt-4 p-4 m-auto bg-red-600 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60 flex items-center justify-center gap-2"
//                         onClick={() =>
//                             signIn("google", {
//                                 callbackUrl: "/admin"
//                             })
//                         }
//                     >
//                         <img src="/logo/google_logo.svg" alt="Google Login" className="w-6 h-6" />
//                         <span>Sign in with Google</span>
//                     </button>

//                     <div className="md:hidden m-auto md:col-span-4 rounded-l-lg">
//                         <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// "use client";

// import { Player } from "@lottiefiles/react-lottie-player";
// import { signIn } from "next-auth/react";
// import axios from "axios";

// export default function LoginForm2() {
//     const saveUserToStrapi = async (userData) => {
//         try {
//           const response = await axios.post("http://localhost:1337/api/user-logins", {
//             data: {
//               name: userData.name, // ต้องตรงกับฟิลด์ "name" บน Strapi
//               Email: userData.email, // ต้องตรงกับฟิลด์ "Email" บน Strapi
//               ID_student: userData.studentId, // ต้องตรงกับฟิลด์ "ID_student" บน Strapi
//             },
//           });
//           console.log("User saved to Strapi:", response.data);
//         } catch (error) {
//           console.error("Error saving user to Strapi:", error.response?.data || error.message);
//         }
//       };


//     return (
//         <div className="m-auto md:px-24 xl:px-72 2xl:px-96 md:pt-[6rem] w-full h-screen">
//             <div className="relative grid grid-cols-1 md:grid-rows-1 md:grid-cols-7 h-full md:h-[26rem] lg:h-[32rem] rounded-lg border bg-sky-100">
//                 <div className="hidden md:flex m-auto md:col-span-4 rounded-l-lg py-2 px-4">
//                     <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
//                 </div>
//                 <div className="flex flex-col col-span-3 text-center rounded-r-lg border px-6 bg-white">
//                     <img src="/logo/hw_web_logo.svg" className="h-[5rem] w-4/5 md:w-fit mt-4 md:mt-auto m-auto mb-1 px-3" alt="Hw Web_Logo" />
//                     <p className="mt-6 font-bold md:text-2xl text-4xl">สวัสดี!</p>
//                     <p className="mt-4 md:text-lg text-2xl md:px-4 px-3">ลงชื่อเข้าใช้ผ่าน PSU Passport หรือ Google เพื่อเริ่มต้นใช้งาน</p>

//                     {/* PSU Passport Login Button */}
//                     <button
//                         type="button"
//                         className="mt-10 p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60"
//                         onClick={async () => {
//                             const result = await signIn("authentik", {
//                                 callbackUrl: "http://localhost:3000/api/auth/callback/authentik",
//                             });

//                             if (result?.ok) {
//                                 // ดึงข้อมูลผู้ใช้จาก session
//                                 console.log("Login result:", result);
//                                 const userData = {
//                                     name: result.user?.name || "Unknown",
//                                     email: result.user?.email || "Unknown",
//                                     preferred_username: result.profile?.preferred_username || "Unknown",
//                                 };

//                                 // บันทึกข้อมูลไปยัง Strapi
//                                 await saveUserToStrapi(userData);
//                                 console.log("Sending data to Strapi:", userData);

//                             } else {
//                                 console.error("Login failed:", result?.error);
//                             }
//                         }}
//                     >
//                         <img src="/logo/PSUOauth.svg" alt="PSU OAuth" />
//                     </button>


//                     {/* Google Login Button */}
//                     <button
//                         type="button"
//                         className="mt-4 p-4 m-auto bg-red-600 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60 flex items-center justify-center gap-2"
//                         onClick={() =>
//                             signIn("google", {
//                                 callbackUrl: "/admin"
//                             })
//                         }
//                     >
//                         <img src="/logo/google_logo.svg" alt="Google Login" className="w-6 h-6" />
//                         <span>Sign in with Google</span>
//                     </button>

//                     <div className="md:hidden m-auto md:col-span-4 rounded-l-lg">
//                         <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


"use client";

import dynamic from "next/dynamic";
import { signIn } from "next-auth/react";
import axios from "axios";


const Player = dynamic(() => import("@lottiefiles/react-lottie-player"), { ssr: false });
export default function LoginForm2() {
    const saveUserToStrapi = async (userData) => {
        try {
            // ตรวจสอบว่าผู้ใช้มีอยู่ใน Strapi หรือไม่ (โดยใช้ email เป็นตัวระบุ)
            const checkResponse = await axios.get(
                `https://coe-hardware-lab-website-ievu.onrender.com/api/user-logins?filters[Email][$eq]=${encodeURIComponent(userData.email)}`
            );
            const existingUser = checkResponse.data.data;

            if (existingUser && existingUser.length > 0) {
                console.log("User already exists in Strapi:", existingUser);
                return; // ข้ามการบันทึกข้อมูลใหม่ หากพบผู้ใช้แล้ว
            }

            // หากไม่มีข้อมูลผู้ใช้ในระบบ ให้บันทึกข้อมูลใหม่
            const response = await axios.post("https://coe-hardware-lab-website-ievu.onrender.com/api/user-logins", {
                data: {
                    name: userData.name, // ต้องตรงกับฟิลด์ "name" บน Strapi
                    Email: userData.email, // ต้องตรงกับฟิลด์ "Email" บน Strapi
                    ID_student: userData.studentId, // ต้องตรงกับฟิลด์ "ID_student" บน Strapi
                },
            });
            console.log("User saved to Strapi:", response.data);
        } catch (error) {
            console.error("Error saving user to Strapi:", error.response?.data || error.message);
        }
    };

    return (
        <div className="m-auto md:px-24 xl:px-72 2xl:px-96 md:pt-[6rem] w-full h-screen">
            <div className="relative grid grid-cols-1 md:grid-rows-1 md:grid-cols-7 h-full md:h-[26rem] lg:h-[32rem] rounded-lg border bg-sky-100">
                <div className="hidden md:flex m-auto md:col-span-4 rounded-l-lg py-2 px-4">
                    <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
                </div>
                <div className="flex flex-col col-span-3 text-center rounded-r-lg border px-6 bg-white">
                    <img src="/logo/hw_web_logo.svg" className="h-[5rem] w-4/5 md:w-fit mt-4 md:mt-auto m-auto mb-1 px-3" alt="Hw Web_Logo" />
                    <p className="mt-6 font-bold md:text-2xl text-4xl">สวัสดี!</p>
                    <p className="mt-4 md:text-lg text-2xl md:px-4 px-3">ลงชื่อเข้าใช้ผ่าน PSU Passport เพื่อเริ่มต้นใช้งาน</p>

                    {/* PSU Passport Login Button */}
                    <button
                        type="button"
                        className="mt-10 p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60"
                        onClick={async () => {
                            const result = await signIn("authentik", {
                                callbackUrl: "http://localhost:3000/api/auth/callback/authentik",
                            });

                            if (result?.ok) {
                                // ดึงข้อมูลผู้ใช้จาก session
                                console.log("Login result:", result);
                                const userData = {
                                    name: result.user?.name || "Unknown",
                                    email: result.user?.email || "Unknown",
                                    studentId: result.profile?.preferred_username || "Unknown",
                                };

                                // บันทึกข้อมูลไปยัง Strapi
                                await saveUserToStrapi(userData);
                                console.log("Sending data to Strapi:", userData);

                            } else {
                                console.error("Login failed:", result?.error);
                            }
                        }}
                    >
                        <img src="/logo/PSUOauth.svg" alt="PSU OAuth" />
                    </button>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        className="mt-4 p-4 m-auto bg-red-600 text-white rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all w-full max-w-60 flex items-center justify-center gap-2"
                        onClick={() => {
                            window.location.href = "http://localhost:3000/admin/loginadmin";
                        }}
                    >

                        Log in with administrator
                    </button>

                    <div className="md:hidden m-auto md:col-span-4 rounded-l-lg">
                        <Player src={"/svg-animation/comAnimation.json"} loop autoplay />
                    </div>
                </div>
            </div>
        </div>
    );
}
