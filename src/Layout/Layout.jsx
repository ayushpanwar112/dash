import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Adjust the import path as necessary

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="fixed " aria-label="Sidebar">
        <Navbar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-6 overflow-auto bg-gray-100" aria-label="Main Content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
