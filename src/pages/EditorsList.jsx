import { useEffect, useState } from "react";
import api from "../api/axios";
import { Toaster, toast } from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import AddEditor from "./AddEditor";
import { FaTimes } from "react-icons/fa";

export default function EditorsList() {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", email: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState(null);

  const fetchEditors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/get-editors");
      setEditors(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load editors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  const handleEditClick = (editor) => {
    setEditingId(editor._id);
    setEditedData({ name: editor.name, email: editor.email });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({ name: "", email: "" });
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/users/update-editor/${id}`, editedData);
      toast.success("Editor updated successfully");
      setEditors((prev) =>
        prev.map((editor) =>
          editor._id === id
            ? { ...editor, name: editedData.name, email: editedData.email }
            : editor
        )
      );
      setEditingId(null);
    } catch (err) {
      if (err.response?.data?.message?.includes("E11000 duplicate key")) {
        toast.error("Editor with duplicate email cannot be added");
      } else {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to update editor"
        );
      }
    }
  };

  const handleDelete = async (email) => {
    try {
      await api.delete(`/users/delete-editor/${email}`);
      toast.success("Editor deleted successfully");
      setEditors((prev) => prev.filter((editor) => editor.email !== email));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete editor");
    } finally {
      setModalOpen(false);
      setSelectedEditor(null);
    }
  };

  const handleOpenModal = (editor) => {
    setSelectedEditor(editor);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ when new editor is added successfully
  const handleEditorAdded = (newEditor) => {
    setEditors((prev) => [...prev, newEditor]);
    setShowAddModal(false);
    toast.success("Editor added successfully");
  };

  return (
    <div className="flex-1 w-full flex flex-col font-suse-mono items-start justify-center  rounded-2xl bg-gray-100 dark:bg-gray-900 p-8 min-h-0">
      <Toaster position="top-right" />

      <ConfirmModal
        open={modalOpen}
        message={`Are you sure you want to delete ${selectedEditor?.name}?`}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => handleDelete(selectedEditor.email)}
      />

      {/* ✅ Add Editor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 bg-opacity-50">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
            <AddEditor
              onClose={() => setShowAddModal(false)}
              onAddEditorSuccess={handleEditorAdded}
              onClick={() => setShowAddModal(false)}
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

      {/* ✅ Header + Button */}
      <div className="flex justify-between items-center mb-4 w-full max-w-5xl mx-auto">
        <h2 className="text-xl font-bold font-suse-mono text-gray-800 dark:text-white"></h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Editor
        </button>
      </div>

      {/* ✅ Table */}
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading...
          </p>
        ) : editors.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No editors found.
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-[360px] md:min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="font-bold">
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {editors.map(
                  (editor) =>
                    editor && (
                      <tr key={editor._id || editor.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                          {editingId === editor._id ? (
                            <input
                              type="text"
                              name="name"
                              value={editedData.name}
                              onChange={handleChange}
                              className="p-1 border rounded w-full dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            editor.name
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                          {editingId === editor._id ? (
                            <input
                              type="email"
                              name="email"
                              value={editedData.email}
                              onChange={handleChange}
                              className="p-1 border rounded w-full dark:bg-gray-700 dark:text-white"
                            />
                          ) : (
                            editor.email
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                          {editor.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                          {editingId === editor._id ? (
                            <>
                              <button
                                onClick={() => handleSave(editor._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
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
                                onClick={() => handleEditClick(editor)}
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleOpenModal(editor)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
