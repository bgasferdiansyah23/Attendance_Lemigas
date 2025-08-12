/*
  # Create schedules table

  1. New Tables
    - `schedules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `date` (date, not null)
      - `start_time` (time, not null)
      - `end_time` (time, not null)
      - `description` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `schedules` table
    - Add appropriate policies for access control
*/

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL DEFAULT '08:00:00',
  end_time time NOT NULL DEFAULT '17:00:00',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Users can read their own schedules
CREATE POLICY "Users can read own schedules"
  ON schedules
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Supervisors and admins can manage schedules
CREATE POLICY "Supervisors can manage interns schedules"
  ON schedules
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE supervisor_id = auth.uid()
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'supervisor')
  );