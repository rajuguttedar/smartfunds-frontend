
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.method === "link") {
        toast.success("Check your email for a reset link.");
        setEmail("");
      } else if (res.data.method === "otp") {
        toast.success("Check your email for an OTP.");
        setTimeout(() => navigate("/reset-password/otp"), 2000);
      } else {
        toast.error(res?.data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Forgot Password
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold"
          >
            Send OTP / Reset Link
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
            to="/reset-password/:token"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
          >
            Go to Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}


export default ForgotPassword;