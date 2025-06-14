import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import JoditEditor from "jodit-react";
import slugify from "slugify";
import {
  createBlogs,
  getBlogCategories,
  updateBlog,
} from "../../features/Actions/blogActions";
import { useParams } from "react-router-dom";

const CreateBlogs = () => {
  const { id } = useParams();
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const blog = useSelector((state) =>
    state.blog.blogs.find((b) => b._id === id)
  );

  const { isLoading, blogCategories } = useSelector((state) => state.blog);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: `stock`,
      slug: "",
      category: "",
      content: "",
      thumbImage: null,
    },
  });

  const title = watch("title");

  useEffect(() => {
    dispatch(getBlogCategories({ pagination: false }));
  }, []);

  useEffect(() => {
    if (title) {
      const slug = slugify(title, {
        lower: true,
        strict: true,
      });
      setValue("slug", slug);
    }
  }, [title, setValue]);

  useEffect(() => {
    if (blog) {
      console.log(blog)
      setValue("title", blog.title);
      setValue("slug", blog.slug);
      setValue("category", blog.category?._id || blog.category); // category fix
      setValue("content", blog.content);
      setImagePreview(blog.thumbImage?.secure_url || blog.thumbImage || null); // image fix
    }
  }, [blog, setValue]);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("category", data.category);
    formData.append("content", data.content);
    formData.append("author", data.author);

    if (image) {
      formData.append("thumbImage", image);
    }

    if (id) {
      dispatch(updateBlog({ id, data: formData }));
    } else {
      dispatch(createBlogs(data));
    }
  };

  const config = {
    readonly: false,
    height: 400,
    toolbar: true,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "video",
      "file",
      "table",
      "link",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "selectall",
      "|",
      "print",
      "about",
    ],
    uploader: {
      insertImageAsBase64URI: true,
      url: "your-upload-url",
      format: "json",
    },
    placeholder: "Start typing here...",
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    spellcheck: true,
    allowResizeY: true,
    allowResizeX: false,
    language: "en",
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
  };

  return (
    <div className="">
      <div className="container mx-auto p-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-md shadow-md p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="thumbImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Blog Image
            </label>
            <input
              type="file"
              id="thumbImage"
              accept="image/*"
              {...register("thumbImage", {
                required: !id && "Blog image is required",
                onChange: (e) => {
                  handleImageChange(e);
                },
              })}
              className={`block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                ${
                  errors.thumbImage ? "border-red-500" : "border-gray-300"
                } 
                rounded-lg focus:ring-blue-500 focus:border-blue-500`}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="h-40 w-auto rounded-md shadow-md"
                />
              </div>
            )}
          </div>


          <div className="mb-6">
  <label htmlFor="author" className="block mb-2 text-sm font-medium text-gray-700">
    Author
  </label>
  <input
    type="text"
    id="author"
    {...register("author", { required: "Author is required" })}
    className={`shadow-sm bg-gray-50 border ${
      errors.author ? "border-red-500" : "border-gray-300"
    } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
    block w-full p-2.5`}
    placeholder="Enter author name"
  />
  {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
</div>

          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "Title is required" })}
              className={`shadow-sm bg-gray-50 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
              block w-full p-2.5`}
              placeholder="Enter blog title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              {...register("slug")}
              readOnly
              className={`shadow-sm bg-gray-50 border ${
                errors.slug ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
              block w-full p-2.5`}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category">Blog Category</label>
            <select
              {...register("category", {
                required: "Please select a category",
              })}
              className="block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose Option</option>
              {blogCategories?.map((blogCat) => (
                <option key={blogCat._id} value={blogCat._id}>
                  {blogCat.blogCategoryName}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Blog Content</label>
            <Controller
              control={control}
              name="content"
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <JoditEditor
                  ref={editorRef}
                  value={field.value}
                  config={config}
                  onBlur={field.onBlur}
                  onChange={(content) => field.onChange(content)}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content?.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoading ? "Please Wait ..." : id ? "Update Blog" : "Save Blog"}
          </button>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </form>
      </div>
    </div>
  );
};

export default CreateBlogs;
