/*
  # Fix Infinite Recursion in Other Table Policies

  Replace recursive user_profiles lookups with auth.jwt() checks.
*/

/* inventory_items policies */
DROP POLICY IF EXISTS "Admins can insert inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "Admins can update inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "Admins can delete inventory_items" ON inventory_items;

CREATE POLICY "Admins can insert inventory_items"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Admins can update inventory_items"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Admins can delete inventory_items"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* staff_members policies */
DROP POLICY IF EXISTS "Admins can insert staff_members" ON staff_members;
DROP POLICY IF EXISTS "Admins can update staff_members" ON staff_members;
DROP POLICY IF EXISTS "Admins can delete staff_members" ON staff_members;

CREATE POLICY "Admins can insert staff_members"
  ON staff_members FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Admins can update staff_members"
  ON staff_members FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Admins can delete staff_members"
  ON staff_members FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* transactions policies */
DROP POLICY IF EXISTS "Admins can update transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;

CREATE POLICY "Admins can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Admins can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

/* pending_transactions policies */
DROP POLICY IF EXISTS "Users and admins can view pending transactions" ON pending_transactions;
DROP POLICY IF EXISTS "Users can create pending transactions" ON pending_transactions;
DROP POLICY IF EXISTS "Admins can update pending transactions" ON pending_transactions;

CREATE POLICY "Users and admins can view pending transactions"
  ON pending_transactions FOR SELECT
  TO authenticated
  USING (
    requested_by = (SELECT auth.uid())
    OR (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );

CREATE POLICY "Users can create pending transactions"
  ON pending_transactions FOR INSERT
  TO authenticated
  WITH CHECK (requested_by = (SELECT auth.uid()));

CREATE POLICY "Admins can update pending transactions"
  ON pending_transactions FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'Admin'
  );
