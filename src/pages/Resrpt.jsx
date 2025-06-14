import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Resrpt = () => {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({
    category: '',
    heading: '',
    status: 'buy',
    issuePrice: '',
    issueDate: '',
    issueMonth: '',
    issueYear: '',
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/report';

  const fetchIssues = async () => {
    try {
      const res = await axios.get(API_URL);
      setIssues(res.data);
    } catch (err) {
      console.error('Error fetching issues:', err.message);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
    } else {
      await axios.post(API_URL, form);
    }

    setForm({
      category: '',
      heading: '',
      status: 'buy',
      issuePrice: '',
      issueDate: '',
      issueMonth: '',
      issueYear: '',
    });
    setEditId(null);
    fetchIssues();
  } catch (err) {
    console.error('Submit error:', err.message);
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (issue) => {
    setForm({
      category: issue.category,
      heading: issue.heading,
      status: issue.status,
      issuePrice: issue.issuePrice,
      issueDate: issue.issueDate.split('T')[0],
      issueMonth: issue.issueMonth,
      issueYear: issue.issueYear,
    });
    setEditId(issue._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchIssues();
      } catch (err) {
        console.error('Delete error:', err.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Issue' : 'Add Issue'}</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 grid-cols-2 mb-8">
        <input
          name="heading"
          type="text"
          placeholder="Heading"
          value={form.heading}
          onChange={handleChange}
          required
          className="border p-2"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="border p-2"
        >
          <option value="">Select Category</option>
          <option value="small-cap">Small Cap</option>
          <option value="mid-cap">Mid Cap</option>
          <option value="large-cap">Large Cap</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        <input
          name="issuePrice"
          type="text"
          placeholder="Issue Price (e.g. 34-234)"
          value={form.issuePrice}
          onChange={handleChange}
          required
          className="border p-2"
        />

        <input
          name="issueDate"
          type="date"
          value={form.issueDate}
          onChange={handleChange}
          required
          className="border p-2"
        />
       <select
  name="issueMonth"
  value={form.issueMonth}
  onChange={handleChange}
  required
  className="border p-2"
>
  <option value="">Select Month</option>
  <option value="January">January</option>
  <option value="February">February</option>
  <option value="March">March</option>
  <option value="April">April</option>
  <option value="May">May</option>
  <option value="June">June</option>
  <option value="July">July</option>
  <option value="August">August</option>
  <option value="September">September</option>
  <option value="October">October</option>
  <option value="November">November</option>
  <option value="December">December</option>
</select>

        <input
          name="issueYear"
          type="number"
          placeholder="Issue Year (e.g. 2025)"
          value={form.issueYear}
          onChange={handleChange}
          required
          className="border p-2"
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Saving...' : editId ? 'Update Issue' : 'Add Issue'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Issues</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Category</th>
            <th className="border p-2">Heading</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Issue Price</th>
            <th className="border p-2">Issue Date</th>
            <th className="border p-2">Issue Month</th>
            <th className="border p-2">Issue Year</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td className="border p-2">{issue.category}</td>
              <td className="border p-2">{issue.heading}</td>
              <td className="border p-2">{issue.status}</td>
              <td className="border p-2">{issue.issuePrice}</td>
              <td className="border p-2">
                {new Date(issue.issueDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{issue.issueMonth}</td>
              <td className="border p-2">{issue.issueYear}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(issue)}
                  className="bg-yellow-400 text-white px-2 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(issue._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Resrpt;
