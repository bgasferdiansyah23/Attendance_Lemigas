import React, { useState, useEffect } from 'react';
import { Clock, Calendar, FileText, MapPin, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getCurrentUser } from '../../lib/auth';
import { AttendanceSummary } from './AttendanceSummary';
import { 
  getTodayAttendance, 
  checkIn, 
  checkOut, 
  generateQRCode,
  AttendanceRecord 
} from '../../lib/attendance';
import { format } from 'date-fns';

export const InternDashboard: React.FC = () => {
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const user = getCurrentUser();

  useEffect(() => {
    loadTodayAttendance();
    generateTodayQR();
  }, []);

  const loadTodayAttendance = async () => {
    if (!user) return;
    
    const attendance = await getTodayAttendance(user.id);
    setTodayAttendance(attendance);
  };

  const generateTodayQR = async () => {
    if (!user) return;
    
    const today = format(new Date(), 'yyyy-MM-dd');
    const qrData = `LEMIGAS-ATTENDANCE-${user.id}-${today}`;
    
    try {
      const qr = await generateQRCode(qrData);
      setQrCode(qr);
    } catch (error) {
      console.error('QR Generation failed:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const success = await checkIn(user.id);
      if (success) {
        await loadTodayAttendance();
      }
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const success = await checkOut(user.id);
      if (success) {
        await loadTodayAttendance();
      }
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>;
      case 'late':
        return <Badge variant="warning">Late</Badge>;
      case 'early_leave':
        return <Badge variant="warning">Early Leave</Badge>;
      case 'absent':
        return <Badge variant="error">Absent</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  const currentTime = format(new Date(), 'HH:mm:ss');
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.full_name}!</h1>
        <p className="text-blue-100 mt-1">{currentDate}</p>
        <p className="text-blue-100 text-lg font-mono mt-2">{currentTime}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAttendance ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(todayAttendance.status)}
                  </div>
                  
                  {todayAttendance.check_in_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Check In:</span>
                      <span className="font-medium">
                        {format(new Date(todayAttendance.check_in_time), 'HH:mm:ss')}
                      </span>
                    </div>
                  )}
                  
                  {todayAttendance.check_out_time && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Check Out:</span>
                      <span className="font-medium">
                        {format(new Date(todayAttendance.check_out_time), 'HH:mm:ss')}
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-3 mt-4">
                    {!todayAttendance.check_in_time && (
                      <Button 
                        onClick={handleCheckIn}
                        loading={loading}
                        className="flex-1"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Check In
                      </Button>
                    )}
                    
                    {todayAttendance.check_in_time && !todayAttendance.check_out_time && (
                      <Button 
                        onClick={handleCheckOut}
                        loading={loading}
                        variant="secondary"
                        className="flex-1"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No attendance record for today</p>
                  <Button 
                    onClick={handleCheckIn}
                    loading={loading}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5 text-blue-600" />
              QR Code for Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              {qrCode ? (
                <>
                  <img 
                    src={qrCode} 
                    alt="Attendance QR Code" 
                    className="mx-auto mb-3 border rounded-lg"
                  />
                  <p className="text-sm text-gray-600">
                    Scan this QR code for attendance verification
                  </p>
                </>
              ) : (
                <div className="py-8">
                  <div className="animate-pulse bg-gray-200 h-64 w-64 mx-auto rounded-lg"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">22/23</p>
              <p className="text-sm text-green-600">Days Present</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Schedule</p>
              <p className="text-2xl font-bold text-gray-900">8:00</p>
              <p className="text-sm text-blue-600">Start Time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Leave Requests</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Summary */}
      <AttendanceSummary />
    </div>
  );
};