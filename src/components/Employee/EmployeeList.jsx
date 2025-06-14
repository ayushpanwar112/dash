import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../service/axiosInterceptor';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Fetch employee data from the server
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/employee/');
            console.log(response.data);
            setEmployees(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    // Open delete modal
    const openDeleteModal = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };

    // Close delete modal
    const closeDeleteModal = () => {
        setEmployeeToDelete(null);
        setShowDeleteModal(false);
    };
    const imagePath = import.meta.env.VITE_LOCAL_HOST;

    // Delete employee
    const handleDelete = async () => {
        if (!employeeToDelete) return;

        try {
            setDeleteLoading(employeeToDelete._id);
            await axiosInstance.delete(`/api/employee/delete/${employeeToDelete._id}`);
            
            // Remove employee from local state
            setEmployees(prev => prev.filter(emp => emp._id !== employeeToDelete._id));
            
            // Close modal and show success message
            closeDeleteModal();
            toast.success(`${employeeToDelete.name} has been deleted successfully!`);
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee. Please try again.');
        } finally {
            setDeleteLoading(null);
        }
    };

    // Handle update - you can customize this based on your routing
    const handleUpdate = (employee) => {
        navigate(`/employees/edit/${employee._id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading employees...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-600 font-medium">{error}</div>
                <button 
                    onClick={fetchEmployees} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                    Total Employees: <span className="font-semibold">{employees.length}</span>
                </div>
            </div>
            
            {employees.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-4">👥</div>
                    <div className="text-lg font-medium">No employees found</div>
                    <div className="text-sm mt-2">Add some employees to get started</div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Designation
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.map((employee, index) => (
                                    <tr key={employee._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    {employee.image ? (<>
                                                        <img 
                                                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" 
                                                            src ={`${imagePath}${employee.image}`}
                                                            alt={employee.name}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                     </>): null}
                                                    <div className={`h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg ${employee.image ? 'hidden' : 'flex'}`}>
                                                        👤
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {employee.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-mono">
                                                        ID: {employee._id.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                                {employee.designation}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate" title={employee.description}>
                                                {employee.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(employee.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleUpdate(employee)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                                    title="Edit Employee"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(employee)}
                                                    disabled={deleteLoading === employee._id}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete Employee"
                                                >
                                                    {deleteLoading === employee._id ? (
                                                        <div className="animate-spin rounded-full h-3 w-3 border border-red-700 border-t-transparent mr-1"></div>
                                                    ) : (
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && employeeToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirm Delete
                            </h3>
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 h-12 w-12 mr-4">
                                    {employeeToDelete.image ? (
                                        <img 
                                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" 
                                            src={employeeToDelete.image} 
                                            alt={employeeToDelete.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg ${employeeToDelete.image ? 'hidden' : 'flex'}`}>
                                        👤
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">{employeeToDelete.name}</h4>
                                    <p className="text-sm text-gray-500">{employeeToDelete.designation}</p>
                                </div>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">
                                            Are you sure you want to delete this employee? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px]"
                            >
                                {deleteLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    </div>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;