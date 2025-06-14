import { useEffect, useState } from "react";
import { axiosInstance } from "../service/axiosInterceptor";

const TableYearComponent = () => {
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    Year: "",
    carriedForward: "",
    received: "",
    resolved: "",
    pending: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      const response = await axiosInstance.get(`/api/tableYearly`);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Year" ? value : Number(value) || "",
    });
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing entry
        await axiosInstance.put(`/api/tableYearly/${editingId}`, formData);
        setTableData((prev) => prev.map((item) => (item._id === editingId ? { ...item, ...formData } : item)));
        setEditingId(null);
      } else {
        // Add new entry
        const response = await axiosInstance.post(`/api/tableYearly`, formData);
        setTableData((prev) => [...prev, response.data.data]);
      }
      setFormData({ Year: "", carriedForward: "", received: "", resolved: "", pending: "" });
    } catch (error) {
      console.error("Error adding/updating entry:", error);
    }
  };

  const handleEdit = (id) => {
    const selectedRow = tableData.find((item) => item._id === id);
    setFormData(selectedRow);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/tableYearly/${id}`);
      setTableData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Table Data For Yearly</h2>

      <form onSubmit={handleAddEntry} className="mb-6 grid grid-cols-2 gap-4">
        <input type="text" name="Year" placeholder="Year" value={formData.Year} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="number" name="carriedForward" placeholder="Carried Forward" value={formData.carriedForward} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="number" name="received" placeholder="Received" value={formData.received} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="number" name="resolved" placeholder="Resolved" value={formData.resolved} onChange={handleChange} required className="border p-2 rounded w-full" />
        <input type="number" name="pending" placeholder="Pending" value={formData.pending} onChange={handleChange} required className="border p-2 rounded w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded col-span-2">
          {editingId ? "Update Entry" : "Add Entry"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white text-black">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border p-2">Sr. No.</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Carried Forward</th>
              <th className="border p-2">Received</th>
              <th className="border p-2">Resolved</th>
              <th className="border p-2">Pending</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row._id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{row.Year}</td>
                <td className="border p-2">{row.carriedForward}</td>
                <td className="border p-2">{row.received}</td>
                <td className="border p-2">{row.resolved}</td>
                <td className="border p-2">{row.pending}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(row._id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(row._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableYearComponent;