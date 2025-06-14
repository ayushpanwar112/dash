import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Image as ImageIcon, Trash2, X } from "lucide-react";
import { axiosInstance } from "../service/axiosInterceptor";

const EventDashboard = () => {
  const [eventImage, setEventImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch the event image when the component loads
  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axiosInstance.get(`/api/event`);
      if (res.data.image) {
        setEventImage(res.data.image);
      }
    } catch (err) {
      console.error("Error fetching event:", err);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Clear preview and selected file
  const clearPreview = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Upload image to the backend
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("image", selectedFile);

    setIsUploading(true);

    try {
      const res = await axiosInstance.post(`/api/event/upload`, formData);

      setEventImage(res.data.event.image); // Update with full URL returned from backend
      clearPreview();
    } catch (err) {
      console.error("Error uploading event image:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete the event image
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/event`);
      setEventImage(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="w-8 h-8" />
              Event Management
            </h2>
            <p className="text-blue-100 mt-2">
              Upload and manage your event images
            </p>
          </div>

          <div className="p-8">
            {/* Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upload New Image
              </h3>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">
                    Click to select an image
                  </span>
                  <span className="text-sm text-gray-400 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Preview</h4>
                    <button
                      onClick={clearPreview}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </>
                )}
              </button>
            </div>

            {/* Current Event Image */}
            {eventImage && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Current Event Image
                  </h3>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-lg">
                  <img
                    src={eventImage}
                    alt="Current Event"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!eventImage && !previewUrl && (
              <div className="text-center py-12 border-t border-gray-200">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Event Image
                </h3>
                <p className="text-gray-400">Upload an image to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
