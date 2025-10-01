/*
  # Add comments column to transactions table

  1. Changes
    - Add `comment` column to `transactions` table
    - Column is optional (nullable) to maintain compatibility with existing data
    - Uses text type for flexible comment length

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'comment'
  ) THEN
    ALTER TABLE transactions ADD COLUMN comment text;
  END IF;
END $$;