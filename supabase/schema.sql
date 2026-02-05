-- モテIQ Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id text NOT NULL,
  answers jsonb NOT NULL,
  scores jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_anon_id ON attempts(anon_id);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES attempts(id),
  anon_id text NOT NULL,
  stripe_session_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purchases_attempt_id ON purchases(attempt_id);
CREATE INDEX IF NOT EXISTS idx_purchases_anon_id ON purchases(anon_id);

-- RLS: Enable but allow all reads via anon key (no auth required for MVP)
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read attempts (needed for result/report pages)
CREATE POLICY "Allow public read attempts" ON attempts
  FOR SELECT USING (true);

-- Allow service role to insert attempts
CREATE POLICY "Allow service insert attempts" ON attempts
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read purchases (we filter by attempt_id in code)
CREATE POLICY "Allow public read purchases" ON purchases
  FOR SELECT USING (true);

-- Allow service role to manage purchases
CREATE POLICY "Allow service insert purchases" ON purchases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service update purchases" ON purchases
  FOR UPDATE USING (true);
