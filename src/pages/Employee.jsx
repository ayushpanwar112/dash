import { Users, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmployeeList from "../components/Employee/EmployeeList";

const Employee = () => {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/employees/add');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Employee Management
            </h1>
          </div>

          <button
            onClick={handleAddEmployee}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Add Employee</span>
          </button>
        </div>

        <EmployeeList />
      </div>
    </div>
  );
};

export default Employee;