import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface AttendanceData {
  id: string;
  user_id: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  tanggal: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const STATUS_COLORS = {
  'Hadir': '#1e3a8a',    // dark blue
  'Izin': '#eab308',     // yellow
  'Sakit': '#3b82f6',    // light blue
  'Alpha': '#6b7280'     // gray
};

const STATUS_LABELS = {
  'Hadir': 'Present',
  'Izin': 'Permission',
  'Sakit': 'Sick',
  'Alpha': 'Absent'
};

export const AttendanceSummary: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user]);

  const fetchAttendanceData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      setAttendanceData(data || []);
      processChartData(data || []);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: AttendanceData[]) => {
    const statusCounts = {
      'Hadir': 0,
      'Izin': 0,
      'Sakit': 0,
      'Alpha': 0
    };

    // Count each status
    data.forEach((record) => {
      if (record.status in statusCounts) {
        statusCounts[record.status]++;
      }
    });

    // Convert to chart data format
    const processedData: ChartData[] = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0) // Only include statuses with data
      .map(([status, count]) => ({
        name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
        value: count,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS]
      }));

    setChartData(processedData);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-medium">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show label for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchAttendanceData}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">No attendance data available</p>
            <p className="text-sm text-gray-500 mt-1">
              Start recording your attendance to see the summary
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRecords = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Internship Activity Summary</CardTitle>
        <p className="text-sm text-gray-600">
          Total Records: {totalRecords}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Legend */}
          <div className="flex flex-col justify-center space-y-4">
            <h4 className="font-medium text-gray-900 mb-2">Status Breakdown</h4>
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((item.value / totalRecords) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(STATUS_COLORS).map(([status, color]) => {
              const count = attendanceData.filter(record => record.status === status).length;
              const percentage = totalRecords > 0 ? (count / totalRecords) * 100 : 0;
              
              return (
                <div key={status} className="text-center">
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500">
                    {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                  </div>
                  <div className="text-xs text-gray-400">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};