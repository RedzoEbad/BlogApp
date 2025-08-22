import React from 'react';
import Navbar from '../Utilities/Navbar';
const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard </h1>
      <Navbar />
      <p>Welcome to your Admin Dashboeeard !</p>
      
    </div>
  );
}
export default AdminDashboard;