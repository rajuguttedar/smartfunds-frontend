
import { useState } from "react";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function AddEditor({ onClose, onAddEditorSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //* 1️⃣ Name validation
      if (!formData.name.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }

      //* 2️⃣ Email validation (only @gmail.com allowed)
      if (
        !formData.email.trim() ||
        !/^[A-Z0-9._%+-]+@gmail\.com$/i.test(formData.email)
      ) {
        toast.error("Invalid email format (must be @gmail.com)");
        setLoading(false);
        return;
      }

      //* 3️⃣ Password validation (min 6 chars, can customize)
      const password = formData.password;
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]+@[\d]+$/;
      // if (!formData.password.trim()) {
      if (!password.trim()) {
        toast.error("Password is required");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        //  if (!passwordRegex.test(password)) {
        toast.error("Password must be like this Abc@1234");
        setLoading(false);
        return;
      }

      // ✅ All validations passed — call API
      const res = await api.post("/users/add-editor", formData);

      toast.success("Editor added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Add to list instantly
      onAddEditorSuccess(res.data?.data || formData);
      onClose();
    } catch (err) {
      // Friendly message for duplicate email
      if (err.response?.data?.message?.includes("E11000 duplicate key")) {
        toast.error("Editor with same email cannot be added");
      } else {
        toast.error(
          err.response?.data?.message || err.message || "Failed to add editor"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-start justify-center font-suse-mono rounded-2xl bg-gray-100 dark:bg-gray-900 p-8 min-h-0">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-[360px] md:max-w-md mx-auto space-y-4"
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded w-full"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col relative">
          <label className="mb-1 font-semibold">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[72%] -translate-y-1/2 text-gray-500 dark:text-gray-300 "
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
        >
          {loading ? "Saving..." : "Add Editor"}
        </button>


      </form>
    </div>
  );
}
