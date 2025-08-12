/*
  # Create users table for LEMIGAS attendance system

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `password` (text, not null) - bcrypt hashed
      - `full_name` (text, not null)
      - `role` (text, not null) - 'intern', 'supervisor', 'admin'
      - `photo_url` (text, nullable)
      - `supervisor_id` (uuid, foreign key to users table)
      - `internship_start_date` (date, nullable)
      - `internship_end_date` (date, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to read/update their own data
    - Add policies for supervisors to view their assigned interns
    - Add policies for admins to manage all users
*/

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Supervisors can read their assigned interns
CREATE POLICY "Supervisors can read assigned interns"
  ON users
  FOR SELECT
  TO authenticated
  USING (supervisor_id = auth.uid());

-- Admins can manage all users (role from JWT)
CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (current_setting('request.jwt.claims'::text)::json->>'role' = 'admin');