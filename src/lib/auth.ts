import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'intern' | 'supervisor' | 'admin';
  photo_url?: string;
  supervisor_id?: string;
  internship_start_date?: string;
  internship_end_date?: string;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    // Use Supabase Auth for secure authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new Error('Invalid credentials');
    }

    // Fetch user profile data from public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, full_name, role, photo_url, supervisor_id, internship_start_date, internship_end_date')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !userProfile) {
      throw new Error('User profile not found');
    }

    // Store user session
    localStorage.setItem('user', JSON.stringify(userProfile));

    return userProfile;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  full_name: string;
  role: 'intern' | 'supervisor' | 'admin';
  supervisor_id?: string;
  internship_start_date?: string;
  internship_end_date?: string;
}): Promise<User | null> {
  try {
    // Use Supabase Auth to create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError || !authData.user) {
      throw new Error('Registration failed');
    }

    // Insert additional profile data into public.users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        supervisor_id: userData.supervisor_id,
        internship_start_date: userData.internship_start_date,
        internship_end_date: userData.internship_end_date,
      })
      .select()
      .single();

    if (profileError || !userProfile) {
      throw new Error('Failed to create user profile');
    }

    return {
      id: userProfile.id,
      email: userProfile.email,
      full_name: userProfile.full_name,
      role: userProfile.role,
      photo_url: userProfile.photo_url,
      supervisor_id: userProfile.supervisor_id,
      internship_start_date: userProfile.internship_start_date,
      internship_end_date: userProfile.internship_end_date,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem('user');
}