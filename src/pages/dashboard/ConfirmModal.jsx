import React from "react";

export default function ConfirmModal({ open, message, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-70"
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirmation
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-justify leading-9">{message}</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
