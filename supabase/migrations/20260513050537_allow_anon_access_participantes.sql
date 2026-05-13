/*
  # Allow anonymous access to participantes

  The game is public — players are not authenticated. RLS was enabled
  but no policies existed, so all inserts, updates, and selects from
  the browser were silently rejected.

  Changes:
  - INSERT policy: anon and authenticated users can create a participant row
  - UPDATE policy: anon and authenticated users can update any participant row
    (scoped to game use; there is no auth identity to check ownership against)
  - SELECT policy: anon and authenticated users can read all participant rows
    (required for ranking display)
*/

CREATE POLICY "Anyone can insert a participant"
  ON participantes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update a participant"
  ON participantes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read participants"
  ON participantes FOR SELECT
  TO anon, authenticated
  USING (true);
