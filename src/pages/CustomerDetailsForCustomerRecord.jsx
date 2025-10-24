
import React, { useState } from "react";
import AddCustomer from "./AddCustomer";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function CustomerDetailsForCustomerRecord({ customer }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // Add at the top inside the component, replace direct prop usage
  const [customerData, setCustomerData] = useState(customer);
  const { user } = useAuth();


  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-suse-mono text-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-auto gap-4">
          {/* Account No */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Account No:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customerData.accountNo}
            </p>
          </div>

          {/* Name */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Name:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customerData.name}
            </p>
          </div>

          {/* Mobile */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Mobile:
            </label>
            <p className="text-green-400 dark:text-lime-400 underline underline-offset-4 ml-2">
              <a href={`tel:${customerData.mobile}`}>{customerData.mobile}</a>
            </p>
          </div>

          {/* Total Amount Given */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Total Amount Given:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              ₹{customerData.totalAmountGiven}
            </p>
          </div>

          {/* Daily Collection */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Daily Collection:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              ₹{customerData.dailyCollection}
            </p>
          </div>

          {/* Total Days */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Total Days:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customerData.totalDays}
            </p>
          </div>

          {/* Start Date */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              Start Date:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {new Date(customerData.startDate).toLocaleDateString()}
            </p>
          </div>

          {/* End Date */}
          <div className="flex items-center">
            <label className="font-semibold text-gray-600 dark:text-white">
              End Date:
            </label>
            <p className="text-blue-500 font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {new Date(customerData.endDate).toLocaleDateString()}
            </p>
          </div>

          {/* Update Button */}
        {user.role === "admin" && 
          <div className="flex items-center">
            <button
              onClick={() => setShowUpdateModal(true)}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              Update Customer
            </button>
          </div>}
        </div>
      </div>

      {/* Update Customer Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 overflow-y-auto min-h-screen">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-[95%] sm:max-w-lg relative my-6 max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
            >
              ×
            </button>

            <AddCustomer
              existingCustomer={customerData}
              isUpdate={true}
              onSubmit={(updatedCustomer) => {
                toast.success("Customer updated successfully");
                setCustomerData(updatedCustomer); // ✅ instantly update fields
                setShowUpdateModal(false);
              }}
            />

            <button
              onClick={() => setShowUpdateModal(false)}
              className="w-full max-w-[100px] float-right bg-red-500 text-gray-200 py-2 hover:bg-red-600 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
