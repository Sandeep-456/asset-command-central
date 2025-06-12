
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  ShoppingCart, 
  ArrowLeftRight, 
  Users, 
  Settings,
  Database,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      roles: ['Admin', 'Base Commander', 'Logistics Officer']
    },
    { 
      path: '/purchases', 
      label: 'Purchases', 
      icon: ShoppingCart,
      roles: ['Admin', 'Base Commander', 'Logistics Officer']
    },
    { 
      path: '/transfers', 
      label: 'Transfers', 
      icon: ArrowLeftRight,
      roles: ['Admin', 'Base Commander', 'Logistics Officer']
    },
    { 
      path: '/assignments', 
      label: 'Assignments & Expenditures', 
      icon: FileText,
      roles: ['Admin', 'Base Commander']
    },
    { 
      path: '/assets', 
      label: 'Asset Registry', 
      icon: Database,
      roles: ['Admin', 'Base Commander']
    },
    { 
      path: '/users', 
      label: 'User Management', 
      icon: Users,
      roles: ['Admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className="bg-slate-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-emerald-400">MILAMS</h1>
        <p className="text-sm text-slate-300 mt-1">Military Asset Management</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          <div className="font-medium text-white">{user?.name}</div>
          <div className="text-emerald-400">{user?.role}</div>
          {user?.assignedBase && (
            <div className="text-slate-300">Base: {user.assignedBase}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
