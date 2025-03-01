"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const LoginAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Authenticate user and get JWT token
      const response = await fetch("https://coe-hardware-lab-website-ievu.onrender.com/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      if (response.ok) {
        const authData = await response.json();
        console.log("Auth Response Data:", authData);

        const token = authData.jwt;

        // Step 2: Use the token to fetch user details including role
        const userResponse = await fetch(
          "https://coe-hardware-lab-website-ievu.onrender.com/api/users/me?populate=role",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          console.log("User Data with Role:", userData);

          // Step 3: Check if the user has the "admin" role
          if (userData.role?.type === "admin") {
            // Save token and user data to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Redirect to admin dashboard
            router.push("/admin/check");
          } else {
            setError("คุณไม่มีสิทธิ์เข้าถึง Admin Panel");
          }
        } else {
          setError("เกิดข้อผิดพลาดในการตรวจสอบ Role");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
