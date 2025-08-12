/*
  # Create attendance table

  1. New Tables
    - `attendance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `date` (date, not null)
      - `check_in_time` (timestamp, nullable)
      - `check_out_time` (timestamp, nullable)
      - `check_in_location` (jsonb, nullable) - {lat, lng, address}
      - `check_out_location` (jsonb, nullable) - {lat, lng, address}
      - `status` (text, not null) - 'present', 'absent', 'late', 'early_leave'
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `attendance` table
    - Add policies for users to manage their own attendance
    - Add policies for supervisors and admins to view/edit attendance data
*/

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in_time timestamptz,
  check_out_time timestamptz,
  check_in_location jsonb,
  check_out_location jsonb,
  status text NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'absent', 'late', 'early_leave')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Users can read their own attendance
CREATE POLICY "Users can read own attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert/update their own attendance
CREATE POLICY "Users can manage own attendance"
  ON attendance
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Supervisors can view their interns' attendance
CREATE POLICY "Supervisors can view interns attendance"
  ON attendance
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE supervisor_id = auth.uid()
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can manage all attendance
CREATE POLICY "Admins can manage all attendance"
  ON attendance
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');