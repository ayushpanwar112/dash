import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../service/axiosInterceptor";

const UpdateCredentials = () => {
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Open confirmation modal before submitting
  const handleUpdateClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    try {
      const res = await axiosInstance.patch(
        `/api/user/update-credentials`,
        formData
      );
      if (res.data.status === "success") {
        toast.success("Credentials updated successfully!");
        setFormData({ email: "", currentPassword: "", newPassword: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Credentials</h2>

      <form onSubmit={handleUpdateClick} className="space-y-4" autoComplete="off">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="New / old Email"
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Current Password (required)"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </form>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirm Update</h3>
            <p>Are you sure you want to update your credentials?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes, Update
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCredentials;
