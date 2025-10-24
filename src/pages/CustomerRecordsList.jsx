import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import CustomerDetailsForCustomerRecord from "./CustomerDetailsForCustomerRecord";
import AddCustomerRecord from "./AddCustomerRecord";
import Pagination from "./Pagination";
import { FaTimes } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";

export default function CustomerRecordsList() {
  const { customerId } = useParams();
  const { user } = useAuth();

  const [customer, setCustomer] = useState(null);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ todayReceivedAmount: "" });
  const [showModal, setShowModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState(null); // editor to delete

  //* Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchRecords = useCallback(async () => {
    try {
      const res = await api.get(`/records/${customerId}`);
      setRecords(res.data.records || []);
      setCustomer(res.data.customer || null);
    } catch (err) {
      //* console.error(err);
      toast.error("Failed to fetch records", err.data?.message || err.message);
    }
  }, [customerId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = records.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const handleEdit = (record) => {
    // Allow edit if not completed OR if it's the last record
    const isLastRecord = record._id === records[records.length - 1]?._id;
    if (!customer?.isCompleted || (customer?.isCompleted && isLastRecord)) {
      setEditingId(record._id);
      setEditData({ todayReceivedAmount: record.todayReceivedAmount });
    }
  };


  const handleCancel = () => {
    setEditingId(null);
    setEditData({ todayReceivedAmount: "" });
  };

  const handleChange = (e) =>
    setEditData({ todayReceivedAmount: e.target.value });

const handleSave = async (id) => {
  if (!editData.todayReceivedAmount) {
    toast.error("Please enter received amount");
    return;
  }

  try {
    // 1️⃣ Update edited record
    await api.put(`/records/update/${id}`, {
      todayReceivedAmount: editData.todayReceivedAmount,
    });

    // 2️⃣ Refetch all records for this customer
    const res = await api.get(`/records/${customerId}`);
    const records = res.data.records || [];

    // 3️⃣ Recalculate totalReceivedAmount in order
    let runningTotal = 0;
    const updatedRecords = await Promise.all(
      records.map(async (r) => {
        runningTotal += r.todayReceivedAmount;
        r.totalReceivedAmount = runningTotal;
        await api.put(`/records/update/${r._id}`, {
          totalReceivedAmount: runningTotal,
        });
        return r;
      })
    );

    toast.success("Record updated successfully");
    setEditingId(null);
    setRecords(updatedRecords); // update frontend
  } catch (err) {
    console.error(err);
    toast.error("Failed to update record");
  }
};


  const handleDelete = async (id) => {
    if (customer?.isCompleted) return;
    // if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/records/delete/${id}`);
      toast.success("Record deleted successfully");
      fetchRecords();
    } catch (err) {
      // console.error(err);
      toast.error("Failed to delete record", err.data?.message || err.message);
    } finally {
      setModalOpen(false);
      setSelectedEditor(null);
    }
  };

  const handleOpenModal = (editor) => {
    setSelectedEditor(editor);
    setModalOpen(true);
  };

  if (!customer) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">
        Loading customer details...
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-start justify-start font-suse-mono bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 min-h-0">
      <Toaster position="top-right" />
      <ConfirmModal
        open={modalOpen}
        message={`Are you sure you want to delete ${selectedEditor?.todayReceivedAmount}?`}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDelete(selectedEditor._id)}
      />

      {/* Mobile: Button to open modal */}
      <div className="md:hidden w-full flex justify-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Customer Details
        </button>
      </div>

      {/* Desktop / tablet: Inline customer details */}
      <div className="hidden md:block w-full">
        <CustomerDetailsForCustomerRecord customer={customer} />
      </div>

      {/* Modal for mobile */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-50 p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <FaTimes size={20} />
            </button>
            <CustomerDetailsForCustomerRecord customer={customer} />
          </div>
        </div>
      )}

      {/* Add new record */}
      {!customer.isCompleted && (
        <AddCustomerRecord
          customerId={customerId}
          onRecordAdded={fetchRecords}
          user={user}
          isCompleted={customer.isCompleted}
        />
      )}

      {customer.isCompleted && (
        <p className="text-center text-green-600 font-semibold mb-4 font-suse-mono text-lg">
          ✅ This account is fully paid and completed.
        </p>
      )}

      {/* Table scroll */}
      <div className="flex-1 w-full overflow-auto mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg min-h-0">
        <table className="min-w-[360px] w-full border-collapse text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold font-suse-mono">
              <th className="px-3 py-2 whitespace-nowrap">S.No</th>
              <th className="px-3 py-2 whitespace-nowrap">Date</th>
              <th className="px-3 py-2 whitespace-nowrap">Received</th>
              <th className="px-3 py-2 whitespace-nowrap">Total Received</th>
              <th className="px-3 py-2 whitespace-nowrap">Updated By</th>
                <th className="px-3 py-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentRecords.map((r, i) => {
              const isEditing = editingId === r._id;
              const isLastRow = i === currentRecords.length - 1; // last row
              return (
                <tr
                  key={r._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 font-suse-mono"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    {indexOfFirst + i + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(r.todayDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editData.todayReceivedAmount}
                        onChange={handleChange}
                        className="p-1 border rounded w-full"
                      />
                    ) : (
                      `₹${r.todayReceivedAmount}`
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    ₹{r.totalReceivedAmount || 0}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {r.updatedBy?.name || r.updatedByName}
                  </td>

                  {(user.role === "admin" || user.role === "editor") && (
                    <td
                      className="px-3 py-2 whitespace-nowrap flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {editingId === r._id ? (
                        <>
                          <button
                            onClick={() => handleSave(r._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Admin can edit any row */}
                          {user.role === "admin" ? (
                            <>
                              <button
                                onClick={() => handleEdit(r)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleOpenModal(r)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            // Editor: only last row edit button
                            isLastRow && (
                              <button
                                onClick={() => handleEdit(r)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                Edit
                              </button>
                            )
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {customer.isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="transform -rotate-36 font-suse-mono text-3xl text-red-400 font-bold opacity-80 z-50 md:mt-50  select-none">
              ACCOUNT CLOSED
            </span>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 w-full flex justify-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
