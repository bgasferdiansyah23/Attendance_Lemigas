import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginForm } from './components/Auth/LoginForm';
import { InternDashboard } from './components/Dashboard/InternDashboard';
import { SupervisorDashboard } from './components/Dashboard/SupervisorDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { AttendanceView } from './components/Attendance/AttendanceView';
import { getCurrentUser, User } from './lib/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'intern':
        return <InternDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <InternDashboard />;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'attendance':
        return <AttendanceView />;
      case 'schedule':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Schedule</h2>
            <p className="text-gray-600">Schedule management coming soon...</p>
          </div>
        );
      case 'leave':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Leave Requests</h2>
            <p className="text-gray-600">Leave request management coming soon...</p>
          </div>
        );
      case 'interns':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">My Interns</h2>
            <p className="text-gray-600">Intern management coming soon...</p>
          </div>
        );
      case 'users':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">User Management</h2>
            <p className="text-gray-600">User management coming soon...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reports</h2>
            <p className="text-gray-600">Reports and analytics coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">System settings coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleMenuClick} />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;