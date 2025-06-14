import { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../service/axiosInterceptor";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/api/blogs/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Category name cannot be empty!");

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`/api/blogs/categories`, {
        blogCategoryName: newCategory,
      });
      alert(response.data.message || "Category added successfully!");
      setNewCategory("");
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await axiosInstance.delete(`/api/blogs/categories/${id}`);
      alert(response.data.message || "Category deleted successfully!");
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Blog Categories</h1>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="p-2 border rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </form>

      {/* Category List */}
      <h2 className="text-xl font-bold mb-4">Existing Categories</h2>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li
            key={category._id}
            className="p-4 border rounded flex justify-between items-center bg-white shadow"
          >
            <span>{category.blogCategoryName}</span>
            <button
              onClick={() => handleDeleteCategory(category._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
