import React from 'react';
import { Users, Clock, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { getCurrentUser } from '../../lib/auth';

export const SupervisorDashboard: React.FC = () => {
  const user = getCurrentUser();

  // Mock data for supervisor dashboard
  const stats = {
    totalInterns: 8,
    presentToday: 7,
    pendingLeaves: 2,
    avgAttendance: 92
  };

  const recentInterns = [
    { id: 1, name: 'John Doe', status: 'present', checkIn: '08:15', university: 'UI' },
    { id: 2, name: 'Jane Smith', status: 'present', checkIn: '08:05', university: 'ITB' },
    { id: 3, name: 'Mike Johnson', status: 'late', checkIn: '08:45', university: 'UGM' },
    { id: 4, name: 'Sarah Wilson', status: 'absent', checkIn: '-', university: 'UNPAD' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>;
      case 'late':
        return <Badge variant="warning">Late</Badge>;
      case 'absent':
        return <Badge variant="error">Absent</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
        <p className="text-green-100 mt-1">Welcome, {user?.full_name}</p>
        <p className="text-green-100">Manage your assigned interns and track their progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Interns</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInterns}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">{stats.presentToday}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgAttendance}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Intern Status */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Intern Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">University</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Check In</th>
                </tr>
              </thead>
              <tbody>
                {recentInterns.map((intern) => (
                  <tr key={intern.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{intern.name}</td>
                    <td className="py-3 px-4 text-gray-600">{intern.university}</td>
                    <td className="py-3 px-4">{getStatusBadge(intern.status)}</td>
                    <td className="py-3 px-4 text-gray-600">{intern.checkIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">Sick Leave - 2 days</p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-600">Personal Leave - 1 day</p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-medium">87% Present</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600">35 Present</span>
                <span className="text-red-600">5 Absent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};