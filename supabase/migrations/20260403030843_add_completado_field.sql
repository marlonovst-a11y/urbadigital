/*
  # Add completado field to participantes table

  1. Changes
    - Add `completado` (boolean) field to track if participant completed the game
    - Default value: false
    
  2. Notes
    - This field will be used to track completion status in the admin dashboard
    - Allows filtering between completed and incomplete sessions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participantes' AND column_name = 'completado'
  ) THEN
    ALTER TABLE participantes ADD COLUMN completado boolean DEFAULT false;
  END IF;
END $$;