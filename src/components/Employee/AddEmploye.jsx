import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../service/axiosInterceptor";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from URL parameters
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch employee data if id exists
  useEffect(() => {
    if (id) {
      setIsUpdateMode(true);
      fetchEmployeeData(id);
    }
  }, [id]);

  const fetchEmployeeData = async (employeeId) => {
    setIsLoadingData(true);
    try {
      const response = await axiosInstance.get(`/api/employee/${employeeId}`);
      const employeeData = response.data;

      setFormData({
        name: employeeData.name || "",
        designation: employeeData.designation || "",
        description: employeeData.description || "",
      });

      // Set image preview if employee has an existing image
      if (employeeData.image) {
        setImagePreview(employeeData.image); // Assuming this is a URL
      }

      console.log("Employee data loaded:", employeeData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Error loading employee data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Employee Details:");
    console.log("Name:", formData.name);
    console.log("Designation:", formData.designation);
    console.log("Description:", formData.description);
    console.log("Image File:", formData.image);

    if (formData.image) {
      console.log("Image Name:", formData.image.name);
      console.log("Image Size:", formData.image.size, "bytes");
      console.log("Image Type:", formData.image.type);
    }

    try {
      // Prepare FormData for multipart/form-data
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("description", formData.description);

      // Only append image if a new one is selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      let response;
      if (isUpdateMode) {
        // Update existing employee
        response = await axiosInstance.put(`/api/employee/update/${id}`, data);
        navigate("/employee");

        toast.success("Employee updated successfully!");
      } else {
        // Add new employee
        response = await axiosInstance.post("/api/employee/add", data);
        navigate("/employee");

        toast.success("Employee added successfully!");
      }

      console.log("Server Response:", response.data);
    } catch (error) {
      console.error(
        `Error ${isUpdateMode ? "updating" : "adding"} employee:`,
        error
      );
      toast.error(
        `Error ${
          isUpdateMode ? "updating" : "adding"
        } employee. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (isUpdateMode) {
      // In update mode, refetch the original data
      fetchEmployeeData(id);
    } else {
      // In add mode, clear the form
      setFormData({
        name: "",
        designation: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
    }
  };

  // Show loading spinner while fetching data
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 flex items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-700">
            Loading employee data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {isUpdateMode ? "Update Employee" : "Add New Employee"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Employee Image
              </label>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview && (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200">
                    <img
                      src={imagePreview}
                      alt="Employee Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isUpdateMode && (
                  <p className="text-xs text-gray-500">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter employee's full name"
              />
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <label
                htmlFor="designation"
                className="block text-sm font-semibold text-gray-700"
              >
                Designation *
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Brief description about the employee's role, skills, and experience..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isUpdateMode
                      ? "Updating Employee..."
                      : "Adding Employee..."}
                  </>
                ) : isUpdateMode ? (
                  "Update Employee"
                ) : (
                  "Add Employee"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdateMode ? "Reset to Original" : "Reset Form"}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After clicking "
              {isUpdateMode ? "Update" : "Add"} Employee", the form will be
              submitted and you'll be redirected to the employee list page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
