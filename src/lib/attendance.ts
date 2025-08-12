import { supabase } from './supabase';
import QRCode from 'qrcode';
import { format } from 'date-fns';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  check_in_location?: { lat: number; lng: number; address: string };
  check_out_location?: { lat: number; lng: number; address: string };
  status: 'present' | 'absent' | 'late' | 'early_leave';
  notes?: string;
}

export async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#3B82F6',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

export async function getCurrentLocation(): Promise<{ lat: number; lng: number; address: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Mock address for now - in production, you'd use a geocoding service
        const address =`${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        resolve({ lat, lng, address });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

export async function checkIn(userId: string): Promise<boolean> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const location = await getCurrentLocation();

    // Check if already checked in today
    const { data: existing } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existing && existing.check_in_time) {
      throw new Error('Already checked in today');
    }

    const checkInTime = new Date().toISOString();
    const status = new Date().getHours() > 8 ? 'late' : 'present';

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from('attendance')
        .update({
          check_in_time: checkInTime,
          check_in_location: location,
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('attendance')
        .insert({
          user_id: userId,
          date: today,
          check_in_time: checkInTime,
          check_in_location: location,
          status: status
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Check-in error:', error);
    return false;
  }
}

export async function checkOut(userId: string): Promise<boolean> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const location = await getCurrentLocation();

    const { data: existing } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (!existing || !existing.check_in_time) {
      throw new Error('Must check in first');
    }

    if (existing.check_out_time) {
      throw new Error('Already checked out today');
    }

    const checkOutTime = new Date().toISOString();
    let status = existing.status;

    // Check if leaving early (before 5 PM)
    if (new Date().getHours() < 17) {
      status = 'early_leave';
    }

    const { error } = await supabase
      .from('attendance')
      .update({
        check_out_time: checkOutTime,
        check_out_location: location,
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Check-out error:', error);
    return false;
  }
}

export async function getTodayAttendance(userId: string): Promise<AttendanceRecord | null> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get today attendance error:', error);
    return null;
  }
}

export async function getAttendanceHistory(userId: string, limit = 30): Promise<AttendanceRecord[]> {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get attendance history error:', error);
    return [];
  }
}