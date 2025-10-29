
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import Pagination from "./Pagination";
import AddCustomer from "./AddCustomer";
import Find100ThDay from "./Find100ThDay";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [pendingData, setPendingData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ accountNo: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [show100thDayModal, setShow100thDayModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      const data = res.data?.data || res.data || [];

      const activeCustomers = data.filter((c) => !c.isCompleted);
      const normalized = activeCustomers.map((c) => ({
        ...c,
        createdByName:
          c.createdBy?.name || c.createdByName || c.createdBy || "—",
      }));

      // Sort by accountNo
      const sortedAccounts = normalized.sort((a, b) => {
        const aNum = parseInt(a.accountNo.split("/")[0]);
        const bNum = parseInt(b.accountNo.split("/")[0]);
        return aNum - bNum;
      });

      setCustomers(sortedAccounts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending amounts from backend
  const fetchPendingData = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/totals"); // ✅ uses backend calculation
      const pendingMap = res.data?.pendingPerCustomer || {};
      setPendingData(pendingMap);
    } catch (err) {
      toast.error("Failed to fetch pending amounts", err.message || "");
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchPendingData(); // ✅ fetch pending from backend
  }, [fetchCustomers, fetchPendingData]);

  // Search filtering applied before pagination
  const filteredCustomersAll = customers.filter((cust) =>
    cust.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Pagination logic
  const totalPages = Math.ceil(filteredCustomersAll.length / customersPerPage);
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomersAll.slice(
    indexOfFirst,
    indexOfLast
  );

  const handleEdit = (customer) => {
    setEditingId(customer._id);
    setEditData({
      accountNo: customer.accountNo || "",
      name: customer.name || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ accountNo: "", name: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const payload = {
        accountNo: editData.accountNo.trim(),
        name: editData.name.trim(),
      };
      const res = await api.put(`/customers/${id}`, payload);
      const updated = res.data?.data || res.data;

      setCustomers((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                ...payload,
                createdByName: updated?.createdBy?.name || c.createdByName,
              }
            : c
        )
      );

      toast.success("Customer updated successfully");
      setEditingId(null);
    } catch (err) {
      if (err.response?.data?.message?.includes("E11000 duplicate key")) {
        toast.error("Editor with duplicate email cannot be updated");
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to update editor"
        );
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      const updatedCustomers = customers.filter((cust) => cust._id !== id);
      setCustomers(updatedCustomers);

      // Fix pagination: if last page empty, go back one page
      const newTotalPages = Math.ceil(
        updatedCustomers.length / customersPerPage
      );
      if (currentPage > newTotalPages) setCurrentPage(newTotalPages || 1);

      toast.success("Customer deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete customer");
    } finally {
      setModalOpen(false);
      setSelectedEditor(null);
    }
  };

  const handleOpenModal = (editor) => {
    setSelectedEditor(editor);
    setModalOpen(true);
  };

  const handleRowClick = (e, cust) => {
    if (e.target.tagName === "A" || e.target.closest("button")) return;
    navigate(`/records/${cust._id}`);
  };

  return (
    <div className="w-full flex flex-col items-start justify-start font-suse-mono bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 min-h-0">
      <Toaster position="top-right" />

      <ConfirmModal
        open={modalOpen}
        message={`Are you sure you want to delete ${selectedEditor?.name}? and ${selectedEditor?.name}'s all records will also be deleted`}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDelete(selectedEditor._id)}
      />

      {/* Action Buttons */}
      <div className="w-full flex justify-end items-center gap-3 mb-4 px-2 sm:px-4">
        <button
          onClick={() => setShow100thDayModal(true)}
          className="bg-red-600/90 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-red-700 transition-all"
        >
          100th Day
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600/90 text-white font-semibold px-4 py-2 rounded-xl shadow-md hover:bg-green-700 transition-all"
        >
          Add Customer
        </button>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 overflow-y-auto min-h-screen">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-[95%] sm:max-w-lg relative my-6 max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
            >
              ×
            </button>

            <AddCustomer
              onSubmit={(newCustomer) => {
                // ✅ Add new customer locally without extra API call
                const updatedList = [...customers, newCustomer].sort(
                  (a, b) =>
                    parseInt(a.accountNo.split("/")[0]) -
                    parseInt(b.accountNo.split("/")[0])
                );
                setCustomers(updatedList);
                toast.success("Customer added successfully");
                setShowAddModal(false); // close modal
                setCurrentPage(1); // go to first page
              }}
            />
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full max-w-[100px] float-right bg-red-500 text-gray-200 py-2 hover:bg-red-600 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 100th Day Modal */}
      {show100thDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg relative overflow-y-auto">
            <button
              onClick={() => setShow100thDayModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl font-bold"
            >
              ×
            </button>

            <Find100ThDay />
            <button
              onClick={() => setShow100thDayModal(false)}
              className="w-full max-w-[100px] float-right bg-red-500 text-gray-200 py-2 hover:bg-red-600 rounded-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-xl mx-auto flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Customers List
        </h2>

        {/* Search */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when search changes
            }}
            className="border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center w-[280px] sm:w-[300px]"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        ) : currentCustomers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No customers found.
          </p>
        ) : (
          <div className="w-full overflow-x-auto max-h-[70vh]">
            <table className="min-w-[360px] w-full text-sm border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10 rounded">
                <tr className="text-gray-700 dark:text-gray-300 font-bold ">
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    S.No
                  </th>
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    A/C No
                  </th>
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    Name
                  </th>
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    Mobile
                  </th>
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    Created By
                  </th>
                  <th className="px-3 py-2 whitespace-nowrap text-start">
                    Pending
                  </th>
                  {user.role === "admin" && (
                    <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentCustomers.map((cust, i) => (
                  <tr
                    key={cust._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={(e) => handleRowClick(e, cust)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      {i + 1 + (currentPage - 1) * customersPerPage}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === cust._id ? (
                        <input
                          type="text"
                          name="accountNo"
                          value={editData.accountNo}
                          onChange={handleChange}
                          className="p-1 border rounded w-full"
                        />
                      ) : (
                        cust.accountNo
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === cust._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                          className="p-1 border rounded w-full"
                        />
                      ) : (
                        cust.name
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-green-600 dark:text-green-400">
                      <a href={`tel:${cust.mobile}`}>{cust.mobile}</a>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {cust.createdByName || cust.createdBy}
                    </td>
                    <td
                      className={`px-3 py-2 whitespace-nowrap font-semibold ${
                        (pendingData[cust._id] ?? 0) > 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {pendingData[cust._id] ?? 0}
                    </td>

                    {user.role === "admin" && (
                      <td
                        className="px-3 py-2 whitespace-nowrap flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {editingId === cust._id ? (
                          <>
                            <button
                              onClick={() => handleSave(cust._id)}
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
                            <button
                              onClick={() => handleEdit(cust)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleOpenModal(cust)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 w-full flex justify-center">
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
