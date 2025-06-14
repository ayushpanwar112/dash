import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../dashboard/src/service/axiosInterceptor";

const ViewUserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/otp/users`);
        const data = response.data; // Axios automatically parses JSON response
        console.log(data);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user data");
        setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);

  const isNewUser = (createdAt) => {
    if (!createdAt) return false;
    
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    
    return hoursDifference <= 24;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Details</h1>
      
      {users && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Phone Number</th>
                <th className="p-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {isNewUser(user.createdAt) && (
                      <span className="bg-green-500 text-white text-xs font-bold mr-2 px-2 py-1 rounded">NEW</span>
                    )}
                    {user.name || user.username || 'N/A'}
                  </td>
                  <td className="p-2 border">{user.phone || user.phoneNumber || 'N/A'}</td>
                  <td className="p-2 border">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4">No users found</div>
      )}
    </div>
  );
};

export default ViewUserDetails;