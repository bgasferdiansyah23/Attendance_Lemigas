import React from 'react';
import { Users, Building, FileText, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getCurrentUser } from '../../lib/auth';

export const AdminDashboard: React.FC = () => {
  const user = getCurrentUser();

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 45,
    activeInterns: 32,
    supervisors: 8,
    totalAttendance: 89,
    pendingRequests: 12,
    systemAlerts: 3
  };

  const recentActivities = [
    { id: 1, action: 'New intern registered', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Leave request approved', user: 'Jane Smith', time: '5 minutes ago', type: 'approval' },
    { id: 3, action: 'Attendance record updated', user: 'Mike Johnson', time: '10 minutes ago', type: 'attendance' },
    { id: 4, action: 'New supervisor assigned', user: 'Dr. Sarah Wilson', time: '1 hour ago', type: 'user' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'attendance':
        return <FileText className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-purple-100 mt-1">Welcome, {user?.full_name}</p>
        <p className="text-purple-100">Manage the entire internship attendance system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-blue-600">+5 this week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Interns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeInterns}</p>
              <p className="text-sm text-green-600">Across all departments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAttendance}%</p>
              <p className="text-sm text-purple-600">This month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              <p className="text-sm text-yellow-600">Need approval</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Supervisors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.supervisors}</p>
              <p className="text-sm text-indigo-600">Managing interns</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">System Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.systemAlerts}</p>
              <p className="text-sm text-red-600">Require attention</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex flex-col items-center py-6">
                <Users className="h-8 w-8 mb-2 text-blue-600" />
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <FileText className="h-8 w-8 mb-2 text-green-600" />
                <span className="text-sm">Generate Report</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <Building className="h-8 w-8 mb-2 text-purple-600" />
                <span className="text-sm">System Settings</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <AlertTriangle className="h-8 w-8 mb-2 text-red-600" />
                <span className="text-sm">View Alerts</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium">API Status</span>
              </div>
              <Badge variant="success">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium">Email Service</span>
              </div>
              <Badge variant="warning">Limited</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};