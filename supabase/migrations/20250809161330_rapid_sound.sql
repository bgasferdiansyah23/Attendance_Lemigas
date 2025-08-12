/*
  # Create leave requests table

  1. New Tables
    - `leave_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `leave_type` (text, not null)
      - `start_date` (date, not null)
      - `end_date` (date, not null)
      - `reason` (text, not null)
      - `approval_status` (text, not null)
      - `approved_by` (uuid, foreign key to users, nullable)
      - `approved_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `leave_requests` table
    - Add appropriate policies for access control
*/

CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type text NOT NULL CHECK (leave_type IN ('sick', 'personal', 'emergency', 'vacation')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own leave requests
CREATE POLICY "Users can read own leave requests"
  ON leave_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own leave requests
CREATE POLICY "Users can create own leave requests"
  ON leave_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Supervisors can manage their interns' leave requests
CREATE POLICY "Supervisors can manage interns leave requests"
  ON leave_requests
  FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE supervisor_id = auth.uid()
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );