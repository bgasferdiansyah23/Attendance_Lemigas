import { supabase } from './supabase';

export async function createDemoUsers() {
  const demoUsers = [
    {
      email: 'admin@lemigas.com',
      password: 'password123',
      full_name: 'Admin User',
      role: 'admin' as const
    },
    {
      email: 'supervisor@lemigas.com',
      password: 'password123',
      full_name: 'Supervisor User',
      role: 'supervisor' as const
    },
    {
      email: 'intern@lemigas.com',
      password: 'password123',
      full_name: 'Intern User',
      role: 'intern' as const
    }
  ];

  console.log('Creating demo users...');

  for (const userData of demoUsers) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        console.error(`Failed to create auth user ${userData.email}:`, authError.message);
        continue;
      }

      if (!authData.user) {
        console.error(`No user data returned for ${userData.email}`);
        continue;
      }

      // Insert user profile data
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
        });

      if (profileError) {
        console.error(`Failed to create profile for ${userData.email}:`, profileError.message);
      } else {
        console.log(`✓ Created demo user: ${userData.email}`);
      }
    } catch (error) {
      console.error(`Error creating user ${userData.email}:`, error);
    }
  }

  console.log('Demo user creation completed');
}