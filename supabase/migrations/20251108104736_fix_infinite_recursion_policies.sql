/*
  # Fix Infinite Recursion in user_profiles RLS Policies

  The recursive policy checking for admin role was causing infinite loops.
  Replace with non-recursive approach using auth.jwt() metadata.
*/

DROP POLICY IF EXISTS "Users can read own profile and admins read all" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

/* Non-recursive SELECT policy */
CREATE POLICY "Users can read profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* Non-recursive INSERT policy */
CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* Non-recursive UPDATE policy */
CREATE POLICY "Admins can update profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* Non-recursive DELETE policy */
CREATE POLICY "Admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );
