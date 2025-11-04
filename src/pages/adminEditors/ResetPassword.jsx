
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

function ResetPassword() {
  const { tokenOrOtp } = useParams(); // Admin token (from link) or undefined
  const [email, setEmail] = useState(""); // For editor OTP
  const [otp, setOtp] = useState(""); // Editor OTP input
  const [otpVerified, setOtpVerified] = useState(false); // Unlock password after OTP
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Determine if it’s Editor flow (OTP) or Admin flow (link token)
  const params = useParams();
  const isOtpFlow =
    params.tokenOrOtp === "otp" || window.location.pathname.includes("/otp");


  // Verify OTP for editor
  const verifyOtp = async () => {
    if (!email || !otp) {
      toast.error("Email and OTP required");
      return;
    }
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified! You can now set a new password.");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify OTP");
    }
  };

  // Submit new password
  const submit = async (e) => {
    e.preventDefault();

    //* 2️⃣ Password validation
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]+@[\d]+$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must have at least 1 uppercase, 1 lowercase letter before '@', and only numbers after '@'. Example: Abc@1234"
      );
      return;
    }

    try {
      let payload;
      let url;

      if (isOtpFlow) {
        if (!otpVerified) {
          toast.error("Please verify OTP first");
          return;
        }
        url = "/auth/reset-password"; // Editor flow → no token param
        payload = { email, otp, password };
      } else {
        if (!tokenOrOtp) {
          toast.error("Invalid reset link.");
          return;
        }
        url = `/auth/reset-password/${tokenOrOtp}`; // Admin flow
        payload = { password };
      }

      await api.post(url, payload); // Axios baseURL = backend
      toast.success("Password reset successful. Go to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Reset Password
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {/* Editor OTP flow */}
          {isOtpFlow && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${
                  otpVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={otpVerified}
              />
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${
                  otpVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={otpVerified}
              />
              <button
                type="button"
                onClick={verifyOtp}
                className={`w-full py-2 rounded-md font-semibold text-white ${
                  otpVerified
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={otpVerified}
              >
                {otpVerified ? "Verified" : "Verify OTP"}
              </button>
            </>
          )}

          {/* Password input — enabled only after OTP verified */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              disabled={isOtpFlow && !otpVerified}
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

          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold">
            Reset Password
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm">
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Back to Login
          </Link>
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
