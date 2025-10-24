
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Pagination from "./Pagination";
import ConfirmModal from "./ConfirmModal";

export default function CompletedAccounts() {
  const { user } = useAuth();
  const [completedCustomers, setCompletedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState(null); // editor to delete
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 7;

  useEffect(() => {
    const fetchCompleted = async () => {
      setLoading(true);
      try {
        const res = await api.get("/customers");
        const customers = res.data?.data || res.data || [];
        const completed = customers.filter((c) => c.isCompleted);
        setCompletedCustomers(completed);
      } catch (err) {
        toast.error("Failed to load completed accounts", err.message);
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this customer?"))
    //   return;
    try {
      await api.delete(`/customers/${id}`);
      setCompletedCustomers((prev) => prev.filter((cust) => cust._id !== id));
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

  const handleRowClick = (e, customer) => {
    if (e.target.closest("button")) return;
    navigate(`/records/${customer._id}`);
  };

  // Pagination logic
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = completedCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(completedCustomers.length / customersPerPage);

  if (!user || user.role !== "admin") return <p>Access denied.</p>;

  return (
    <div className="flex-1 w-full flex flex-col font-suse-mono items-start justify-center bg-gray-100 dark:bg-gray-900 p-4 min-h-0">
      <Toaster position="top-right" />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={modalOpen}
        message={`Are you sure you want to delete ${selectedEditor?.name}? and ${selectedEditor?.name}'s all records will also be deleted`}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDelete(selectedEditor._id)}
      />

      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Completed Accounts
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        ) : currentCustomers.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No completed accounts found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto max-h-[80vh] relative">
              <table className="min-w-[360px] md:min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                  <tr className="text-gray-700 dark:text-gray-300 font-bold">
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      A/C No
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      Created By
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      Pending
                    </th>
                    <th className="px-4 py-3 text-start whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentCustomers.map((cust, index) => (
                    <tr
                      key={cust._id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={(e) => handleRowClick(e, cust)}
                    >
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {indexOfFirst + index + 1}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {cust.accountNo}
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {cust.name}
                      </td>
                      <td className="px-4 py-2 text-green-600 dark:text-green-400 whitespace-nowrap">
                        <a href={`tel:${cust.mobile}`}>{cust.mobile}</a>
                      </td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {cust.createdBy?.name || "—"}
                      </td>
                      <td className="px-4 py-2 font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">
                        Completed
                      </td>
                      <td
                        className="px-4 py-2 flex gap-2 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          disabled
                          className="bg-blue-400 text-white px-3 py-1 rounded cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenModal(cust)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
