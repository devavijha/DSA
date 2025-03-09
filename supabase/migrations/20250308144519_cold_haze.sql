/*
  # Initial Schema Setup for AlgoXpert

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `points` (integer)
      - `created_at` (timestamp)
    
    - `problems`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `category` (text)
      - `test_cases` (jsonb)
      - `solution_template` (text)
      - `created_at` (timestamp)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `problem_id` (uuid, references problems)
      - `code` (text)
      - `language` (text)
      - `status` (text)
      - `runtime_ms` (integer)
      - `memory_kb` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create problems table
CREATE TABLE problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  test_cases jsonb NOT NULL,
  solution_template text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  problem_id uuid REFERENCES problems(id) NOT NULL,
  code text NOT NULL,
  language text NOT NULL,
  status text NOT NULL,
  runtime_ms integer,
  memory_kb integer,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Problems policies
CREATE POLICY "Problems are viewable by everyone"
  ON problems FOR SELECT
  USING (true);

-- Submissions policies
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);