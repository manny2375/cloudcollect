# CloudCollect Database Setup Instructions

## Quick Setup Commands

### 1. Create All Tables
```bash
wrangler d1 execute cloudcollect-db --file=create-tables-individual.sql
```

### 2. Insert Sample Data
```bash
wrangler d1 execute cloudcollect-db --file=sample-data-individual.sql
```

### 3. Verify Setup
```bash
wrangler d1 execute cloudcollect-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 4. Check Demo Company
```bash
wrangler d1 execute cloudcollect-db --command="SELECT * FROM companies;"
```

## Individual Table Creation

You can also create tables one by one using these commands:

### 1. Companies Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE companies (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT, phone TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, website TEXT, tax_id TEXT, logo_url TEXT, settings TEXT, status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);"
```

### 2. Debtors Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE debtors (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, ssn TEXT, dob TEXT, employer TEXT, account_number TEXT NOT NULL, original_balance REAL NOT NULL, current_balance REAL NOT NULL, status TEXT DEFAULT 'active', last_payment_date TEXT, last_payment_amount REAL, creditor_id TEXT, creditor_name TEXT, client_name TEXT, portfolio_id TEXT, case_file_number TEXT, client_claim_number TEXT, date_loaded TEXT, origination_date TEXT, charged_off_date TEXT, purchase_date TEXT, assigned_collector TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE);"
```

### 3. Phone Numbers Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE phone_numbers (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, type TEXT NOT NULL, number TEXT NOT NULL, is_primary BOOLEAN DEFAULT FALSE, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 4. Payments Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE payments (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, amount REAL NOT NULL, payment_date TEXT NOT NULL, method TEXT NOT NULL, status TEXT DEFAULT 'completed', reference TEXT, notes TEXT, created_by TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 5. Scheduled Payments Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE scheduled_payments (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, amount REAL NOT NULL, scheduled_date TEXT NOT NULL, method TEXT NOT NULL, status TEXT DEFAULT 'scheduled', reference TEXT, notes TEXT, created_by TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, last_updated TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 6. Notes Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE notes (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, content TEXT NOT NULL, created_by TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 7. Documents Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE documents (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, name TEXT NOT NULL, type TEXT NOT NULL, url TEXT NOT NULL, uploaded_by TEXT, uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 8. Actions Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE actions (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, type TEXT NOT NULL, description TEXT NOT NULL, due_date TEXT, completed_at TEXT, completed_by TEXT, status TEXT DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 9. Co-Debtors Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE co_debtors (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, debtor_id TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT, address TEXT, city TEXT, state TEXT, zip TEXT, ssn TEXT, dob TEXT, employer TEXT, relationship TEXT, date_added TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE, FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE);"
```

### 10. Users Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE users (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, password_hash TEXT, role_id TEXT NOT NULL, status TEXT DEFAULT 'active', last_login TEXT, department TEXT, position TEXT, phone TEXT, supervisor TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE);"
```

### 11. Roles Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE roles (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, name TEXT NOT NULL, description TEXT, permissions TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE);"
```

### 12. User Sessions Table
```bash
wrangler d1 execute cloudcollect-db --command="CREATE TABLE user_sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, company_id TEXT NOT NULL, token TEXT UNIQUE NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE, FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE);"
```

## Create Indexes

### Performance Indexes
```bash
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_companies_code ON companies(code);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_debtors_company ON debtors(company_id);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_debtors_account_number ON debtors(company_id, account_number);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_debtors_status ON debtors(company_id, status);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_phone_numbers_debtor ON phone_numbers(company_id, debtor_id);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_payments_debtor ON payments(company_id, debtor_id);"
wrangler d1 execute cloudcollect-db --command="CREATE INDEX idx_users_email ON users(company_id, email);"
```

### Unique Constraints
```bash
wrangler d1 execute cloudcollect-db --command="CREATE UNIQUE INDEX idx_debtors_company_account ON debtors(company_id, account_number);"
wrangler d1 execute cloudcollect-db --command="CREATE UNIQUE INDEX idx_users_company_email ON users(company_id, email);"
wrangler d1 execute cloudcollect-db --command="CREATE UNIQUE INDEX idx_roles_company_name ON roles(company_id, name);"
```

## Demo Login Credentials

After setup, test the application with:

- **Company Code**: `1234`
- **Email**: `admin@example.com`
- **Password**: `password`

## Database Studio

To view your data in a web interface:

```bash
wrangler d1 studio cloudcollect-db
```

## Key Features

✅ **Multi-Tenant Architecture**: Complete company isolation with 4-digit codes
✅ **12 Core Tables**: All essential debt management functionality
✅ **Performance Optimized**: Proper indexes for fast queries
✅ **Company Scoped**: All data isolated by company_id
✅ **Sample Data**: Ready-to-test demo environment

## Troubleshooting

If you encounter issues:

1. **Check database exists**:
   ```bash
   wrangler d1 list
   ```

2. **Verify table creation**:
   ```bash
   wrangler d1 execute cloudcollect-db --command="SELECT name FROM sqlite_master WHERE type='table';"
   ```

3. **Check sample data**:
   ```bash
   wrangler d1 execute cloudcollect-db --command="SELECT COUNT(*) as debtor_count FROM debtors;"
   ```