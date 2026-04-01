-- CONTACT MESSAGES TABLE
-- Unified lead capture system for the portfolio
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages
CREATE POLICY "Public can send messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can see/manage messages
CREATE POLICY "Admins can view messages" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update messages" ON messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete messages" ON messages
  FOR DELETE USING (auth.role() = 'authenticated');
