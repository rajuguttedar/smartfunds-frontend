
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import api from "../../api/axios";

export default function AddCustomer({ onSubmit, existingCustomer }) {
  const isUpdate = !!existingCustomer;
  const [formData, setFormData] = useState({
    accountNo: "",
    name: "",
    mobile: "",
    startDate: "",
    endDate: "",
    totalDays: "",
    dailyCollection: "",
    totalAmountGiven: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Pre-fill form if editing
  useEffect(() => {
    if (existingCustomer) {
      setFormData({
        accountNo: existingCustomer.accountNo || "",
        name: existingCustomer.name || "",
        mobile: existingCustomer.mobile || "",
        startDate: existingCustomer.startDate
          ? new Date(existingCustomer.startDate).toISOString().split("T")[0]
          : "",
        endDate: existingCustomer.endDate
          ? new Date(existingCustomer.endDate).toISOString().split("T")[0]
          : "",
        totalDays: existingCustomer.totalDays || "",
        dailyCollection: existingCustomer.dailyCollection || "",
        totalAmountGiven: existingCustomer.totalAmountGiven || "",
      });
    }
  }, [existingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not logged in.");
      setLoading(false);
      return;
    }

    try {
      let res;
      if (isUpdate) {
        // ✅ UPDATE EXISTING CUSTOMER
        res = await api.put(`/customers/${existingCustomer._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Customer updated successfully!");
      } else {
        // ✅ ADD NEW CUSTOMER
        const accountNoRegex = /^\d+\/\d{2}$/;
        if (!formData.accountNo.trim()) {
          toast.error("Account number is required");
          setLoading(false);
          return;
        }
        if (!accountNoRegex.test(formData.accountNo)) {
          toast.error("Account number must be in format e.g., 100/25");
          setLoading(false);
          return;
        }

        res = await api.post("/customers", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Customer added successfully!");
      }

      const updatedCustomer = res.data?.data || res.data;
      if (onSubmit) onSubmit(updatedCustomer);

      // Reset if adding new
      if (!isUpdate) {
        setFormData({
          accountNo: "",
          name: "",
          mobile: "",
          startDate: "",
          endDate: "",
          totalDays: "",
          dailyCollection: "",
          totalAmountGiven: "",
        });
      }
    } catch (err) {
      if (err.response?.data?.message?.includes("E11000 duplicate key")) {
        toast.error("Customer with same account number cannot be added");
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to save customer"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex items-start justify-center font-suse-mono rounded-2xl bg-gray-100 dark:bg-gray-900 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-[400px] md:max-w-lg mx-auto space-y-4"
      >
        {/* Account No & Name */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Account No</label>
            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Total Amount Given & Daily Collection */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Total Amount Given</label>
            <input
              type="number"
              name="totalAmountGiven"
              value={formData.totalAmountGiven}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Daily Collection</label>
            <input
              type="number"
              name="dailyCollection"
              value={formData.dailyCollection}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Total Days & Mobile */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Total Days</label>
            <input
              type="number"
              name="totalDays"
              value={formData.totalDays}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-semibold">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600/90 hover:bg-green-700 text-white rounded-md font-semibold transition"
        >
          {loading
            ? "Saving..."
            : isUpdate
            ? "Update Customer"
            : "Add Customer"}
        </button>
      </form>
    </div>
  );
}
