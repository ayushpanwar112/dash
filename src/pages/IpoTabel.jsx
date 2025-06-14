import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { axiosInstance } from '../service/axiosInterceptor';

const IpoTable = () => {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
   const [ipoInput, setIpoInput] = useState("");
  const [ipoList, setIpoList] = useState([]);
  
  const [formData, setFormData] = useState({
    company: '',
    openingDate: '',
    closingDate: '',
    listingAt: '',
    listingDate: '',
    issuePrice: '',
    issueAmountCr: '',
    blogLink: ''
  });

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/api/company/ipos`);
      setIpos(response.data);
    } catch (error) {
      setError("Failed to fetch IPOs. Please try again later.");
      console.error("Error fetching IPOs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingId) {
        await axiosInstance.put(`/api/company/ipos/${editingId}`, formData);
        setSuccessMessage('IPO updated successfully!');
      } else {
        await axiosInstance.post(`/api/company/ipos`, formData);
        setSuccessMessage('IPO added successfully!');
      }
      
      setFormData({
        company: '',
        openingDate: '',
        closingDate: '',
        listingAt: '',
        listingDate: '',
        issuePrice: '',
        issueAmountCr: '',
        blogLink: ''
      });
      setEditingId(null);
      fetchIpos();
    } catch (error) {
      setError(error.response?.data?.message || "Error saving IPO. Please try again.");
      console.error("Error saving IPO:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEdit = (ipo) => {
    setFormData({
      company: ipo.company,
      openingDate: ipo.openingDate?.substring(0, 10),
      closingDate: ipo.closingDate?.substring(0, 10),
      listingAt: ipo.listingAt,
      listingDate: ipo.listingDate,
      issuePrice: ipo.issuePrice,
      issueAmountCr: ipo.issueAmountCr,
      blogLink: ipo.blogLink
    });
    setEditingId(ipo._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this IPO?')) return;
    
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/api/company/ipos/${id}`);
      setSuccessMessage('IPO deleted successfully!');
      fetchIpos();
    } catch (error) {
      setError("Failed to delete IPO. Please try again.");
      console.error("Error deleting IPO:", error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };




  const fetchIPOs = async () => {
    try {
      const res = await axiosInstance.get(`/api/company/`);
      setIpoList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddIPO = async () => {
    const ipoArray = ipoInput
      .split(",")
      .map(item => item.trim())
      .filter(item => item);

    if (ipoArray.length === 0) return alert("Add valid IPO names");

    try {
      await axiosInstance.post(`/api/company/add`, { upcomingIpos: ipoArray });
      setIpoInput("");
      fetchIPOs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIPOName = async (name) => {
    try {
      await axiosInstance.delete(`/api/company/delete/${name}`);
      fetchIPOs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axiosInstance.delete(`/api/company/entry/${id}`);
      fetchIPOs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIPOs();
  }, []);


  const [input, setInput] = useState("");
  const [listings, setListings] = useState("");

  const fetchListings = async () => {
    try {
      const res = await axiosInstance.get(`/api/company/list`);
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const entries = input
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e);
     

    if (entries.length === 0) return alert("Enter valid listings");

    try {
      await axiosInstance.post(`/api/company/addlist`, { ipoListingsToday: entries });
      setInput("");
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

 

  const handleDeleteEntrys = async (id) => {
    try {
      await axiosInstance.delete(`/api/company/entrylist/${id}`);
      fetchListings();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);



  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

 <div className="container">

 <h2>📆 IPO Listings Today</h2>

      <input
        type="text"
        placeholder="Enter comma-separated listings"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "60%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleAdd}>Add Listings</button>

      <div style={{ marginTop: "30px" }}>
        {Array.isArray(listings) &&
          listings.map((entry) => (
            <div key={entry._id} style={{ border: "1px solid #ccc", margin: "15px", padding: "10px" }}>
              <h4> {entry.ipoListingsToday}</h4>
             
              <button onClick={() => handleDeleteEntrys(entry._id)}>🗑️ Delete Entry</button>
            </div>
          ))}
      </div>



      <h2>📈 IPO Manager</h2>

      <input
        type="text"
        placeholder="Enter IPOs (comma separated)"
        value={ipoInput}
        onChange={(e) => setIpoInput(e.target.value)}
        style={{ width: "60%", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={handleAddIPO}>Add IPOs</button>

      <div style={{ marginTop: "30px" }}>
        {Array.isArray(ipoList) && ipoList.map((entry)  => (
          <div
            key={entry._id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h4>ID: {entry._id}</h4>
            <ul>
              {entry.upcomingIpos.map((ipo, idx) => (
                <li key={idx}>
                  {ipo}{" "}
                  <button
                    onClick={() => handleDeleteIPOName(ipo)}
                    style={{ marginLeft: "10px" }}
                  >
                    ❌ Remove IPO
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleDeleteEntry(entry._id)}
              style={{ color: "red", marginTop: "10px" }}
            >
              🗑️ Delete Entire Entry
            </button>
          </div>
        ))}
      </div>
    </div>


      <h2>{editingId ? 'Edit IPO' : 'Add New IPO'}</h2>
      
      {successMessage && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {successMessage}
        </div>
      )}
      
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company*</label>
            <input 
              type="text" 
              name="company" 
              placeholder="Company" 
              value={formData.company} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Opening Date</label>
            <input 
              type="date" 
              name="openingDate" 
              value={formData.openingDate} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Closing Date</label>
            <input 
              type="date" 
              name="closingDate" 
              value={formData.closingDate} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating</label>
            <input 
              type="text" 
              name="listingAt" 
              placeholder="Rating" 
              value={formData.listingAt} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Listing Date</label>
            <input 
              type="date" 
              name="listingDate" 
              value={formData.listingDate} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Issue Price (₹)</label>
            <input 
              type="number" 
              name="issuePrice" 
              placeholder="e.g. 450" 
              value={formData.issuePrice} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Issue Amount (Cr.)</label>
            <input 
              type="number" 
              name="issueAmountCr" 
              placeholder="e.g. 1200" 
              value={formData.issueAmountCr} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Blog Link & research Report</label>
            <input 
              type="url" 
              name="blogLink" 
              placeholder="https://example.com" 
              value={formData.blogLink} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ced4da' }}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: editingId ? '#ffc107' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Processing...' : editingId ? 'Update IPO' : 'Add IPO'}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setFormData({
                company: '',
                openingDate: '',
                closingDate: '',
                listingAt: '',
                listingDate: '',
                issuePrice: '',
                issueAmountCr: '',
                blogLink: ''
              });
              setEditingId(null);
            }}
            style={{
              padding: '10px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>IPOs in India 2025</h2>
      
      {isLoading && ipos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading IPOs...</div>
      ) : ipos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>No IPOs found</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Opening Date</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Closing Date</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Listing At</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Listing Date</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Issue Price (₹)</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Amount (Cr.)</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Blog</th>
                <th style={{ padding: '12px 15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ipos.map((ipo) => (
                <tr key={ipo._id} style={{ 
                  borderBottom: '1px solid #dddddd',
                  backgroundColor: editingId === ipo._id ? '#fff3cd' : 'white',
                  ':hover': { backgroundColor: '#f8f9fa' }
                }}>
                  <td style={{ padding: '12px 15px' }}>{ipo.company}</td>
                  <td style={{ padding: '12px 15px' }}>{formatDate(ipo.openingDate)}</td>
                  <td style={{ padding: '12px 15px' }}>{formatDate(ipo.closingDate)}</td>
                  <td style={{ padding: '12px 15px' }}>{ipo.listingAt || 'N/A'}</td>
                  <td style={{ padding: '12px 15px' }}>{formatDate(ipo.listingDate)}</td>
                  <td style={{ padding: '12px 15px' }}>{ipo.issuePrice || 'N/A'}</td>
                  <td style={{ padding: '12px 15px' }}>{ipo.issueAmountCr || 'N/A'}</td>
                  <td style={{ padding: '12px 15px' }}>
                    {ipo.blogLink ? (
                      <a 
                        href={ipo.blogLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        View
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td style={{ padding: '12px 15px', display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEdit(ipo)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(ipo._id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IpoTable;