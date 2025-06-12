
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Military Asset Management System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Secure asset tracking and management platform
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
            <div className="text-right">
              <div className="font-medium text-gray-800">{user?.name}</div>
              <div className="text-sm text-emerald-600">{user?.role}</div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
