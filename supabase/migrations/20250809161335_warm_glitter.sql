/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text, not null)
      - `message` (text, not null)
      - `type` (text, not null)
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add appropriate policies for access control
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- System can create notifications for any user
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);