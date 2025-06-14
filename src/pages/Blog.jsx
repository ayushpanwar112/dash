import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBlog } from "../features/Actions/blogActions";

const SingleBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleBlog, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getSingleBlog(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || "Failed to load blog"}</div>;
  if (!singleBlog) return <div>Blog not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-4">{singleBlog.title}</h1>
      <img
        src={singleBlog.thumbImage?.secure_url || "https://via.placeholder.com/800"}
        alt={singleBlog.title}
        className="w-full h-auto rounded-md mb-4"
      />
      <div className="mt-2 text-sm text-gray-600">
        By <span className="font-semibold">{singleBlog.author}</span> | Category:{" "}
        <span className="italic">{singleBlog.category?.blogCategoryName}</span>
      </div>
      <div
        className="text-gray-700 mt-4"
        dangerouslySetInnerHTML={{ __html: singleBlog.content }}
      />
      <div className="mt-4 text-sm text-gray-500">
        Updated on {new Date(singleBlog.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default SingleBlog;
