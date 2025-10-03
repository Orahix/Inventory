/*
  # Create User Accounts with Default Password

  1. User Account Creation
    - Creates Supabase auth users for all 7 authorized emails
    - Sets default password "Solar123" for all accounts
    - Links users to their staff profiles in user_profiles table
  
  2. Security
    - All accounts use the same initial password for simplicity
    - Users can change passwords later through Supabase auth
    - Email confirmation is disabled for internal company use
  
  3. User Profile Linking
    - Automatically creates user_profiles entries
    - Links auth users to existing staff_members
    - Maintains role-based access control
*/

-- Create user accounts with default password Solar123
DO $$
DECLARE
  user_data RECORD;
  auth_user_id UUID;
  staff_record RECORD;
BEGIN
  -- Array of user data (email, role)
  FOR user_data IN 
    SELECT * FROM (VALUES
      ('ivan.braskic@azimut.rs', 'Staff'),
      ('filip.radovanovic@azimut.rs', 'Staff'),
      ('lazar@azimut.rs', 'Admin'),
      ('vladimir@azimut.rs', 'Admin'),
      ('zoran.ciric@azimut.rs', 'Staff'),
      ('gavro.novovic@azimut.rs', 'Manager'),
      ('stefan.stosic@azimut.rs', 'Admin')
    ) AS t(email, role)
  LOOP
    -- Check if user already exists in auth.users
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = user_data.email;
    
    -- If user doesn't exist, create them
    IF auth_user_id IS NULL THEN
      -- Insert into auth.users (this is a simplified approach)
      -- In production, you would use Supabase Admin API or dashboard
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        user_data.email,
        crypt('Solar123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
      ) RETURNING id INTO auth_user_id;
    END IF;
    
    -- Get the corresponding staff member
    SELECT * INTO staff_record 
    FROM staff_members 
    WHERE email = user_data.email;
    
    -- Create or update user profile
    INSERT INTO user_profiles (
      user_id,
      staff_id,
      email,
      role
    ) VALUES (
      auth_user_id,
      staff_record.id,
      user_data.email,
      user_data.role::text
    )
    ON CONFLICT (email) DO UPDATE SET
      user_id = auth_user_id,
      staff_id = staff_record.id,
      role = user_data.role::text,
      updated_at = NOW();
    
  END LOOP;
END $$;