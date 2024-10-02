"use client";

import { doSocialLogin } from "@/app/actions";
import { signIn } from "next-auth/react";

const LoginForm = () => {
    return (
        <form action={doSocialLogin}>

            <div className='flex justify-center items-start min-h-screen '>
                <div className='bg-white w-96 mt-4 shadow-lg p-10 rounded-l'>
                    <div className='flex flex-col justify-center mb-4'>
                        <div className='text-2xl text-black text-center'>
                            ยินดีต้อนรับสู่
                        </div>
                        <div className='text-sm text-blue-900 text-center mt-2'>
                            Computer Hardware Laboratory Website
                        </div>
                        <div className='text-l text-gray-300 text-center mt-6'>
                            Login/เข้าสู่ระบบ
                        </div>
                    </div>
                    <div className='mt-4'>
                        <input
                            type='text'
                            className='w-full h-12 rounded-xl p-4 border border-gray-400 text-gray-700 outline-none mb-4'
                            placeholder='อีเมลหรือชื่อผู้ใช้'
                        />
                        <input
                            type='password'
                            className='w-full h-12 rounded-xl p-4 border border-gray-400 text-gray-700 outline-none mb-4'
                            placeholder='รหัสผ่าน'
                        />
                    </div>
                    <div className='mt-4'>

                        <button className='w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl font-bold'>
                            เข้าสู่ระบบ
                        </button>

                        <div className='flex items-center mt-4'>
                            <div className='flex-grow border-t border-black'></div>
                            <span className='mx-4 text-gray-500'>or</span>
                            <div className='flex-grow border-t border-black'></div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                            type="button"
                            className="text-white rounded-lg transition-all w-full hover:scale-125"
                            name="action"
                            value="google"
                            >
                                <img src="/logo/web_neutral_rd_ctn.svg" className="w-full"/>
                            </button>
                        </div>
                        
                        <div className="flex justify-center mt-6">
                            <button
                                type="button"
                                className='p-4 bg-blue-900 text-white rounded-lg shadow transition-all w-full hover:bg-blue-800 hover:scale-125 '
                                onClick={() =>
                                    signIn("authentik", {})
                                }
                            >
                                <img src="/logo/PSUOauth.svg" />
                            </button>
                        </div>
                        

                    </div>
                </div>



            </div>
        </form>
    );
};

export default LoginForm;
