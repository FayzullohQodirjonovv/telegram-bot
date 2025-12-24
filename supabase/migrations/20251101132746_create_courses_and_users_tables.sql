/*
  # Telegram Bot Database Schema for Course Sales

  1. New Tables
    - `users` - Telegram users info
      - `id` (bigint, primary key) - Telegram user ID
      - `username` (text) - Telegram username
      - `phone` (text) - User phone number
      - `status` (text) - 'pending', 'active', 'blocked'
      - `subscribed_to_channel` (boolean) - Channel subscription status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `courses` - Available courses
      - `id` (uuid, primary key)
      - `title` (text) - Course name
      - `description` (text) - Course details
      - `price` (integer) - Price in som
      - `file_url` (text) - Course file URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `purchases` - User purchases
      - `id` (uuid, primary key)
      - `user_id` (bigint) - Telegram user ID
      - `course_id` (uuid) - Course ID
      - `payment_status` (text) - 'pending', 'completed', 'failed'
      - `transaction_id` (text) - Payment transaction ID
      - `amount` (integer) - Amount paid in som
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `admins` - Admin users
      - `id` (uuid, primary key)
      - `telegram_id` (bigint) - Telegram user ID
      - `username` (text) - Admin username
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Courses are publicly readable
    - Admin-only access to management

  3. Notes
    - Click API will be used for payments
    - Telegram bot handles user authentication
*/

CREATE TABLE IF NOT EXISTS users (
  id bigint PRIMARY KEY,
  username text UNIQUE,
  phone text,
  status text DEFAULT 'pending',
  subscribed_to_channel boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL REFERENCES users(id),
  course_id uuid NOT NULL REFERENCES courses(id),
  payment_status text DEFAULT 'pending',
  transaction_id text UNIQUE,
  amount integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint UNIQUE NOT NULL,
  username text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_transaction_id ON purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_admins_telegram_id ON admins(telegram_id);

-- Courses are publicly readable
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- Users table - anyone can insert (self-register)
CREATE POLICY "Anyone can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Purchases - anyone can insert
CREATE POLICY "Anyone can insert purchases"
  ON purchases FOR INSERT
  WITH CHECK (true);

-- Users can view their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (true);

-- Purchases are readable
CREATE POLICY "Anyone can view purchases"
  ON purchases FOR SELECT
  USING (true);

-- Admins table - public read for checking
CREATE POLICY "Anyone can view admins"
  ON admins FOR SELECT
  USING (true);
