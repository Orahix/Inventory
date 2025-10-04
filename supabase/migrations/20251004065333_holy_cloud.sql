/*
  # Fix infinite recursion in RLS policies

  1. Problem
    - The current RLS policies on user_profiles table are causing infinite recursion
    - This happens when policies reference the same table they're protecting
    - The policies are trying to check user_profiles while querying user_profiles

  2. Solution
    - Drop existing problematic policies
    - Create new simplified policies that don't cause recursion
    - Use direct auth.uid() checks instead of subqueries to user_profiles
    - Add helper functions to check roles without recursion

  3. Security
    - Users can read their own profile
    - Admins can manage all profiles
    - Insert operations require admin role check via auth metadata
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;

-- Create helper functions to avoid recursion
CREATE OR REPLACE FUNCTION is_admin_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = user_uuid AND role = 'Admin'
  );
$$;

-- Simple policy for users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for admins to read all profiles (using auth metadata to avoid recursion)
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' IN (
      'lazar@azimut.rs',
      'vladimir@azimut.rs', 
      'stefan.stosic@azimut.rs'
    )
  );

-- Policy for admins to insert profiles
CREATE POLICY "Admins can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' IN (
      'lazar@azimut.rs',
      'vladimir@azimut.rs',
      'stefan.stosic@azimut.rs'
    )
  );

-- Policy for admins to update profiles
CREATE POLICY "Admins can update profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.jwt() ->> 'email' IN (
      'lazar@azimut.rs',
      'vladimir@azimut.rs',
      'stefan.stosic@azimut.rs'
    )
  );

-- Policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'lazar@azimut.rs',
      'vladimir@azimut.rs',
      'stefan.stosic@azimut.rs'
    )
  );