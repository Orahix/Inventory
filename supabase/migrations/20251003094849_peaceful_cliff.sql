/*
  # Add Authentication System

  1. New Tables
    - `user_profiles` - Links auth users to staff members with roles
  
  2. Security
    - Enable RLS on user_profiles table
    - Add policies for user profile management
    - Update existing table policies to check authentication
  
  3. Functions
    - Function to handle new user registration
    - Function to get user role
*/

-- Create user profiles table to link auth users with staff members
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES staff_members(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('Admin', 'Manager', 'Staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(staff_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'Admin'
    )
  );

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'unauthorized');
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN get_user_role(user_uuid) = 'Admin';
END;
$$;

-- Function to check if user has access (Admin, Manager, or Staff)
CREATE OR REPLACE FUNCTION has_access(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  user_role := get_user_role(user_uuid);
  RETURN user_role IN ('Admin', 'Manager', 'Staff');
END;
$$;

-- Update existing table policies to require authentication

-- Update inventory_items policies
DROP POLICY IF EXISTS "public select inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "public insert inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "public update inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "public delete inventory_items" ON inventory_items;

CREATE POLICY "Authenticated users can read inventory_items"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (has_access(auth.uid()));

CREATE POLICY "Admins can insert inventory_items"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update inventory_items"
  ON inventory_items
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete inventory_items"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Update staff_members policies
DROP POLICY IF EXISTS "public select staff_members" ON staff_members;
DROP POLICY IF EXISTS "public insert staff_members" ON staff_members;
DROP POLICY IF EXISTS "public update staff_members" ON staff_members;
DROP POLICY IF EXISTS "public delete staff_members" ON staff_members;

CREATE POLICY "Authenticated users can read staff_members"
  ON staff_members
  FOR SELECT
  TO authenticated
  USING (has_access(auth.uid()));

CREATE POLICY "Admins can insert staff_members"
  ON staff_members
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update staff_members"
  ON staff_members
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete staff_members"
  ON staff_members
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Update transactions policies
DROP POLICY IF EXISTS "public select transactions" ON transactions;
DROP POLICY IF EXISTS "public insert transactions" ON transactions;
DROP POLICY IF EXISTS "public update transactions" ON transactions;
DROP POLICY IF EXISTS "public delete transactions" ON transactions;

CREATE POLICY "Authenticated users can read transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (has_access(auth.uid()));

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (has_access(auth.uid()));

CREATE POLICY "Admins can update transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Insert the authorized staff members if they don't exist
INSERT INTO staff_members (name, email, role, department) VALUES
  ('Ivan Braskic', 'ivan.braskic@azimut.rs', 'Staff', 'Operations'),
  ('Filip Radovanovic', 'filip.radovanovic@azimut.rs', 'Staff', 'Operations'),
  ('Lazar', 'lazar@azimut.rs', 'Admin', 'Management'),
  ('Vladimir', 'vladimir@azimut.rs', 'Admin', 'Management'),
  ('Zoran Ciric', 'zoran.ciric@azimut.rs', 'Staff', 'Operations'),
  ('Gavro Novovic', 'gavro.novovic@azimut.rs', 'Manager', 'Operations'),
  ('Stefan Stosic', 'stefan.stosic@azimut.rs', 'Admin', 'Management')
ON CONFLICT (email) DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();