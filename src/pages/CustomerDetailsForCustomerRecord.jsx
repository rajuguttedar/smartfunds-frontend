import React from "react";

export default function CustomerDetailsForCustomerRecord({ customer }) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-suse-mono text-md">
      <div className="bg-white dark:bg-gray-800  shadow-lg rounded-lg p-6">
        <div className="grid grid-cols-auto gap-4">
          {/* Account No */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Account No:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customer.accountNo}
            </p>
          </div>

          {/* Name */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Name:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customer.name}
            </p>
          </div>

          {/* Mobile */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Mobile:
            </label>
            <p className=" text-green-400 dark:text-lime-400 underline underline-offset-4 ml-2">
              <a href={`tel:${customer.mobile}`}>{customer.mobile}</a>
            </p>
          </div>

          {/* Total Amount Given */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Total Amount Given:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              ₹{customer.totalAmountGiven}
            </p>
          </div>

          {/* Daily Collection */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Daily Collection:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              ₹{customer.dailyCollection}
            </p>
          </div>

          {/* Total Days */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Total Days:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {customer.totalDays}
            </p>
          </div>

          {/* Start Date */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              Start Date:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {new Date(customer.startDate).toLocaleDateString()}
            </p>
          </div>

          {/* End Date */}
          <div className="flex items-center">
            <label className=" font-semibold text-gray-600 dark:text-white">
              End Date:
            </label>
            <p className="text-blue-500  font-semibold underline underline-offset-4 dark:text-blue-500 ml-2">
              {new Date(customer.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
