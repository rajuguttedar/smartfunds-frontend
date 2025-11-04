
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../api/axios";
// import { useAuth } from "../hooks/useAuth";
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

const submit = async (e) => {
  e.preventDefault();

  //* 1️⃣ Email validation
  if (!email.trim()) {
    toast.error("Email is required");
    return;
  }
  if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
    toast.error("Invalid email format (must be @gmail.com)");
    return;
  }

  //* 2️⃣ Password validation
  if (!password.trim()) {
    toast.error("Password is required");
    return;
  }

  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]+@[\d]+$/;
      if (password.length < 6) {
        // if (!passwordRegex.test(password)) {
        toast.error(
          "Password must have at least 1 uppercase and 1 lowercase before '@', and only numbers after '@'. Example: Abc@1234"
        );
        return;
      }

  //* 3️⃣ All validations passed → call API
  try {
    const res = await api.post("/auth/login", { email, password });
    login(res.data);
    toast.success("Logged in successfully");
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {user ? (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user.name} 🎉
        </h1>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            Login
          </h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoFocus
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition">
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-indigo-600 hover:underline dark:text-indigo-400 text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default Login;