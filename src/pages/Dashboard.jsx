import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { deleteBlog, getBlogs } from "../features/Actions/blogActions";
import { toast } from "react-toastify";

const ListBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, paginate } = useSelector((state) => state.blog);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const totalPages = Math.ceil(paginate?.total / paginate?.limit);

  const handlePageClick = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    dispatch(getBlogs({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleDelete = (blogId) => {
    setSelectedBlogId(blogId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteBlog(selectedBlogId)).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(getBlogs({ page: currentPage }));
         toast.success("Blog deleted successfully");
      }
  })
        // Handle error if needed;
    if (Array.isArray(blogs) && blogs.length === 1 && currentPage > 1) {
      dispatch(getBlogs({ page: currentPage - 1 }));
    } else if (Array.isArray(blogs)) {
      dispatch(getBlogs({ page: currentPage }));
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="">
      <section className="bg-gray-50 rounded-xl p-4 md:p-6">
        <div className="mx-auto max-w-screen-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Blog Management
            </h1>
            <Link
              to="create-blogs"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Blog
            </Link>
          </div>

          {/* Blog Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Image</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Author</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Published</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs?.length > 0 ? (
                    blogs.map((blog, index) => (
                      <tr key={blog._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {paginate?.limit * (currentPage - 1) + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={
                              blog.thumbImage?.secure_url ||
                              "https://via.placeholder.com/80"
                            }
                            alt={blog.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                          {blog.title}
                        </td>
                        <td className="px-6 py-4">
                          {blog?.author?.fullName || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          {blog.category?.blogCategoryName || "Uncategorized"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {moment(blog.publishedAt).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => navigate(`/blog/${blog._id}`)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                            >
                              View
                            </button>
                            <Link
                              to={`/update_blog/${blog._id}`}
                              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="text-gray-500 text-lg">No blogs found</div>
                        <Link
                          to="create-blogs"
                          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                        >
                          Create your first blog
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Confirm Delete Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Confirm Deletion
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this blog? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 p-4">
    <button
      onClick={() => handlePageClick(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded-md border ${
        currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, index) => {
      const page = index + 1;
      return (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      );
    })}

    <button
      onClick={() => handlePageClick(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-md border ${
        currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default ListBlogs;
