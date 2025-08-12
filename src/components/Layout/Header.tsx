import React from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../../lib/auth';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <div className="text-white font-bold text-sm">LEMIGAS</div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">
                Internship Attendance
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.full_name}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                {user?.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.full_name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-600" />
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};