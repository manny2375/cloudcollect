# Database Setup Instructions

## Step 1: Create Tables

Execute the main schema file to create all tables:

```bash
wrangler d1 execute cloudcollect-db --file=create-tables.sql
```

## Step 2: Insert Sample Data

Add demo company and sample data:

```bash
wrangler d1 execute cloudcollect-db --file=sample-data.sql
```

## Step 3: Verify Setup

Check that tables were created successfully:

```bash
wrangler d1 execute cloudcollect-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

Check that demo company was created:

```bash
wrangler d1 execute cloudcollect-db --command="SELECT * FROM companies;"
```

## Step 4: Update wrangler.toml

Make sure your `wrangler.toml` has the correct database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "cloudcollect-db"
database_id = "your-actual-database-id"
```

## Demo Login Credentials

After setup, you can test the application with:

- **Company Code**: `1234`
- **Email**: `admin@example.com`
- **Password**: `password`

## Key Features

✅ **Multi-Tenant Architecture**: Complete company isolation with 4-digit codes
✅ **12 Core Tables**: All essential debt management functionality
✅ **Performance Optimized**: Proper indexes for fast queries
✅ **Company Scoped**: All data isolated by company_id
✅ **Sample Data**: Ready-to-test demo environment

## Database Schema Overview

### Core Tables:
- `companies` - Multi-tenant company management
- `debtors` - Main account information
- `phone_numbers` - Multiple phone numbers per debtor
- `payments` - Payment history tracking
- `scheduled_payments` - Future payment scheduling
- `notes` - Account notes and communications
- `documents` - File attachments
- `actions` - Collection activities
- `co_debtors` - Co-debtor information
- `users` - System users (company-scoped)
- `roles` - User roles and permissions
- `user_sessions` - Authentication sessions

### Security Features:
- All tables include `company_id` for isolation
- Foreign key constraints maintain data integrity
- Unique constraints are company-scoped
- Optimized indexes for performance

## Troubleshooting

If you encounter any issues:

1. **Check database exists**:
   ```bash
   wrangler d1 list
   ```

2. **View database in browser**:
   ```bash
   wrangler d1 studio cloudcollect-db
   ```

3. **Check table structure**:
   ```bash
   wrangler d1 execute cloudcollect-db --command="PRAGMA table_info(companies);"
   ```

## Next Steps

After database setup:

1. Start the development server: `npm run dev`
2. Start the API server: `npm run wrangler:dev`
3. Test login with demo credentials
4. Explore the multi-tenant features