# Individual SQLite Table Creation Queries

## 1. Companies Table
```sql
CREATE TABLE companies (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  website TEXT,
  tax_id TEXT,
  logo_url TEXT,
  settings TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Debtors Table
```sql
CREATE TABLE debtors (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
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
  account_number TEXT NOT NULL,
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
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);
```

## 3. Phone Numbers Table
```sql
CREATE TABLE phone_numbers (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  debtor_id TEXT NOT NULL,
  type TEXT NOT NULL,
  number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 4. Payments Table
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  debtor_id TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_date TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  reference TEXT,
  notes TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 5. Scheduled Payments Table
```sql
CREATE TABLE scheduled_payments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
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
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 6. Notes Table
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  debtor_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 7. Documents Table
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  debtor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 8. Actions Table
```sql
CREATE TABLE actions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  debtor_id TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT,
  completed_at TEXT,
  completed_by TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 9. Co-Debtors Table
```sql
CREATE TABLE co_debtors (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
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
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
  FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
);
```

## 10. Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT,
  role_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TEXT,
  department TEXT,
  position TEXT,
  phone TEXT,
  supervisor TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);
```

## 11. Roles Table
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);
```

## 12. User Sessions Table
```sql
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
);
```

## Performance Indexes
```sql
CREATE INDEX idx_companies_code ON companies(code);
CREATE INDEX idx_debtors_company ON debtors(company_id);
CREATE INDEX idx_debtors_account_number ON debtors(company_id, account_number);
CREATE INDEX idx_debtors_status ON debtors(company_id, status);
CREATE INDEX idx_debtors_creditor ON debtors(company_id, creditor_id);
CREATE INDEX idx_phone_numbers_company ON phone_numbers(company_id);
CREATE INDEX idx_phone_numbers_debtor ON phone_numbers(company_id, debtor_id);
CREATE INDEX idx_payments_company ON payments(company_id);
CREATE INDEX idx_payments_debtor ON payments(company_id, debtor_id);
CREATE INDEX idx_payments_date ON payments(company_id, payment_date);
CREATE INDEX idx_notes_company ON notes(company_id);
CREATE INDEX idx_notes_debtor ON notes(company_id, debtor_id);
CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_documents_debtor ON documents(company_id, debtor_id);
CREATE INDEX idx_actions_company ON actions(company_id);
CREATE INDEX idx_actions_debtor ON actions(company_id, debtor_id);
CREATE INDEX idx_actions_status ON actions(company_id, status);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(company_id, email);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
```

## Unique Constraints (Company-Scoped)
```sql
CREATE UNIQUE INDEX idx_debtors_company_account ON debtors(company_id, account_number);
CREATE UNIQUE INDEX idx_users_company_email ON users(company_id, email);
CREATE UNIQUE INDEX idx_roles_company_name ON roles(company_id, name);
```

## Execution Commands

### Using Wrangler CLI:
```bash
# Create all tables at once
wrangler d1 execute cloudcollect-db --file=create-tables.sql

# Add sample data
wrangler d1 execute cloudcollect-db --file=sample-data.sql

# Verify setup
wrangler d1 execute cloudcollect-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Individual Table Creation:
You can also execute each CREATE TABLE statement individually using:
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE companies (...);"
```

## Key Features

✅ **Multi-Tenant Architecture**: Complete company isolation with `company_id`
✅ **12 Core Tables**: All essential debt management functionality  
✅ **Performance Optimized**: Proper indexes for fast queries
✅ **Data Integrity**: Foreign key constraints and unique indexes
✅ **Company Scoped**: All data isolated by company
✅ **Sample Data**: Ready-to-test demo environment

## Demo Credentials

After running the sample data:
- **Company Code**: `1234`
- **Email**: `admin@example.com`
- **Password**: `password`