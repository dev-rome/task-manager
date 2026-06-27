CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
  title TEXT NOT NULL, 
  description TEXT, 
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')), 
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN('low', 'medium', 'high')), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)