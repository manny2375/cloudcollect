-- Migration: Initial database schema
-- Created: 2025-01-01

-- Create debtors table
CREATE TABLE IF NOT EXISTS debtors (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  ssn TEXT,
  dob TEXT,
  employer TEXT,
  account_number TEXT UNIQUE NOT NULL,
  original_balance REAL NOT NULL,
  current_balance REAL NOT NULL,
  status TEXT DEFAULT 'active',
  last_payment_date TEXT,
  last_payment_amount REAL,
  creditor_id TEXT,
  creditor_name TEXT,
  client_name TEXT,
  portfolio_id TEXT,
  case_file_number TEXT,
  client_claim_number TEXT,
  date_loaded TEXT,
  origination_date TEXT,
  charged_off_date TEXT,
  purchase_date TEXT,
  assigned_collector TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create phone numbers table
CREATE TABLE IF NOT EXISTS phone_numbers (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  type TEXT NOT NULL,
  number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  reference TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create scheduled payments table
CREATE TABLE IF NOT EXISTS scheduled_payments (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  amount REAL NOT NULL,
  scheduled_date TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  reference TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create actions table
CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT,
  completed_at TEXT,
  completed_by TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create co_debtors table
CREATE TABLE IF NOT EXISTS co_debtors (
  id TEXT PRIMARY KEY,
  debtor_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  ssn TEXT,
  dob TEXT,
  employer TEXT,
  relationship TEXT,
  date_added TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TEXT,
  department TEXT,
  position TEXT,
  phone TEXT,
  supervisor TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT, -- JSON array of permission codes
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_debtors_account_number ON debtors(account_number);
CREATE INDEX IF NOT EXISTS idx_debtors_status ON debtors(status);
CREATE INDEX IF NOT EXISTS idx_debtors_creditor ON debtors(creditor_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_debtor ON phone_numbers(debtor_id);
CREATE INDEX IF NOT EXISTS idx_payments_debtor ON payments(debtor_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_notes_debtor ON notes(debtor_id);
CREATE INDEX IF NOT EXISTS idx_documents_debtor ON documents(debtor_id);
CREATE INDEX IF NOT EXISTS idx_actions_debtor ON actions(debtor_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);