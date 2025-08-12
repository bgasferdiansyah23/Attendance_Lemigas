import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getCurrentUser } from '../../lib/auth';
import { getAttendanceHistory, AttendanceRecord } from '../../lib/attendance';
import { format } from 'date-fns';

export const AttendanceView: React.FC = () => {
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');
  const user = getCurrentUser();

  useEffect(() => {
    loadAttendanceHistory();
  }, []);

  const loadAttendanceHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const history = await getAttendanceHistory(user.id);
      setAttendanceHistory(history);
    } catch (error) {
      console.error('Failed to load attendance history:', error);
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

  const filteredAttendance = attendanceHistory.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  const generateReport = () => {
    // Mock PDF generation - in production, use a proper PDF library
    console.log('Generating attendance report...');
    alert('Attendance report would be generated here');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
          <p className="text-gray-600">Track your attendance records and patterns</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={generateReport}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card padding={false}>
        <div className="flex flex-wrap border-b border-gray-200">
          {[
            { key: 'all', label: 'All Records' },
            { key: 'present', label: 'Present' },
            { key: 'late', label: 'Late' },
            { key: 'absent', label: 'Absent' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Attendance List */}
      <div className="space-y-4">
        {filteredAttendance.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Start checking in to see your attendance history here.'
                  : `No ${filter} records found for the selected filter.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAttendance.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {format(new Date(record.date), 'EEEE, MMMM do, yyyy')}
                      </span>
                      {getStatusBadge(record.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      {record.check_in_time && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            Check In: {format(new Date(record.check_in_time), 'HH:mm:ss')}
                          </span>
                        </div>
                      )}
                      
                      {record.check_out_time && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-600">
                            Check Out: {format(new Date(record.check_out_time), 'HH:mm:ss')}
                          </span>
                        </div>
                      )}
                    </div>

                    {record.check_in_location && (
                      <div className="flex items-center space-x-2 mt-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">
                          Location: {record.check_in_location.address}
                        </span>
                      </div>
                    )}

                    {record.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};