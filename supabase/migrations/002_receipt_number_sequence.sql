-- Migration: Add receipt number sequence and generation function
-- This creates clean receipt numbers like "REC-000001" instead of ugly "REC-M5XQWZ9ABC-21EE"

-- Add receipt number counter to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS next_receipt_number INTEGER DEFAULT 1;

-- Function to generate clean receipt numbers (e.g., REC-000001)
CREATE OR REPLACE FUNCTION generate_receipt_number(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  receipt_num TEXT;
BEGIN
  -- Get user's next receipt number
  SELECT next_receipt_number
  INTO next_num
  FROM users
  WHERE id = p_user_id;
  
  -- Handle case where user doesn't exist or column is null
  IF next_num IS NULL THEN
    next_num := 1;
  END IF;
  
  -- Generate receipt number (e.g., REC-000001)
  receipt_num := 'REC-' || LPAD(next_num::TEXT, 6, '0');
  
  -- Increment the next receipt number
  UPDATE users
  SET next_receipt_number = COALESCE(next_receipt_number, 0) + 1
  WHERE id = p_user_id;
  
  RETURN receipt_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_receipt_number(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_receipt_number(UUID) TO service_role;
