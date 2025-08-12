import React from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { getCurrentUser } from '../../lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange 
}) => {
  const user = getCurrentUser();

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', name: 'Dashboard', icon: Home },
      { id: 'attendance', name: 'Attendance', icon: Clock },
      { id: 'schedule', name: 'Schedule', icon: Calendar },
      { id: 'leave', name: 'Leave Requests', icon: FileText },
    ];

    if (user?.role === 'supervisor') {
      baseItems.push(
        { id: 'interns', name: 'My Interns', icon: Users },
        { id: 'reports', name: 'Reports', icon: BarChart3 }
      );
    }

    if (user?.role === 'admin') {
      baseItems.push(
        { id: 'users', name: 'Users', icon: Users },
        { id: 'reports', name: 'Reports', icon: BarChart3 },
        { id: 'settings', name: 'Settings', icon: Settings }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30
          lg:translate-x-0 lg:static lg:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Navigation</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};