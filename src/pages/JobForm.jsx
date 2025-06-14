import { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../service/axiosInterceptor";

const JobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    googleFormLink: "",
  });
  const [jobs, setJobs] = useState([]);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get(`/api/jobs`);
      setJobs(response.data.data); // Access the `data` key
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/jobs/add`, formData);
      alert(response.data.message);
      setFormData({ title: "", description: "", salary: "", googleFormLink: "" });
      fetchJobs(); // Refresh the job list
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/jobs/delete/${id}`);
      alert(response.data.message);
      fetchJobs(); // Refresh the job list
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Google Form Link</label>
          <input
            type="url"
            name="googleFormLink"
            value={formData.googleFormLink}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Job
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Job List</h2>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li key={job._id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.description}</p>
              <p>Salary: {job.salary}</p>
              <a href={job.googleFormLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Google Form
              </a>
            </div>
            <button
              onClick={() => handleDelete(job._id)}
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

export default JobForm;