
import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function AddCustomerRecord({
  customerId,
  onRecordAdded,
  user,
  isCompleted, // ✅ new prop
}) {
  const [todayDate, setTodayDate] = useState("");
  const [todayReceivedAmount, setTodayReceivedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!todayDate || todayReceivedAmount === "") {
      toast.error("Please enter date and amount");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/records/${customerId}`, {
        todayDate,
        todayReceivedAmount: Number(todayReceivedAmount),
      });

      toast.success("Record added successfully");

      setTodayDate("");
      setTodayReceivedAmount("");
      if (onRecordAdded) onRecordAdded();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 400
          ? "This account is already completed."
          : "Failed to add record");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const resTrictDateToTodayOrPast = (e) => {
          const selectedDate = e.target.value;
          const today = new Date().toISOString().split("T")[0];
          if (selectedDate > today) {
            toast.error("You cannot select a future date");
            return;
          }
          setTodayDate(selectedDate);
        }
  // ✅ Only admins or editors can add
  if (!(user.role === "admin" || user.role === "editor")) return null;

  // ✅ Stop showing form if completed
  if (isCompleted) {
    return (
      <p className="text-green-600 font-semibold mb-4 text-center font-suse-mono">
        ✅ Payments completed for this account. No further entries allowed.
      </p>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start mx-auto md:items-center gap-4 mb-6 font-suse-mono">
      <input
        type="date"
        value={todayDate}
        onChange={(e) => resTrictDateToTodayOrPast(e)}
        max={new Date().toISOString().split("T")[0]} // ✅ restrict to today or past
        className="border border-gray-400 dark:border-gray-50/20 focus:outline-none p-2 rounded w-full md:w-auto customer-record-date-picker"
      />
      <input
        type="number"
        placeholder="Amount"
        value={todayReceivedAmount}
        onChange={(e) => setTodayReceivedAmount(e.target.value)}
        className="border border-gray-400 dark:border-gray-50/20 focus:outline-none p-2 rounded w-full md:w-auto dark:placeholder:text-gray-200 placeholder:text-gray-900"
      />
      <button
        onClick={handleSave}
        disabled={loading}
        className={`px-4 py-2 rounded text-white mx-auto ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
