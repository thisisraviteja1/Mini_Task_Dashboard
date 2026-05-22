-- Run this in your Supabase SQL Editor
-- Go to: supabase.com → your project → SQL Editor → New Query

CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: seed some sample data
INSERT INTO tasks (title, description, status, due_date) VALUES
  ('Design the homepage mockup', 'Create wireframes and high-fidelity designs for the main landing page', 'in_progress', CURRENT_DATE + INTERVAL '3 days'),
  ('Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'todo', CURRENT_DATE + INTERVAL '7 days'),
  ('Write API documentation', 'Document all REST endpoints with request/response examples', 'todo', CURRENT_DATE + INTERVAL '5 days'),
  ('Fix login page bug', 'Users are getting logged out after 5 minutes due to token expiry', 'completed', CURRENT_DATE - INTERVAL '1 day'),
  ('Code review: auth module', 'Review PRs for the authentication refactor', 'completed', CURRENT_DATE - INTERVAL '2 days');
