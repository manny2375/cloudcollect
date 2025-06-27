-- Sample Data for CloudCollect Database
-- Insert demo company and initial data

-- 1. Create Demo Company
INSERT INTO companies (id, code, name, email, phone, status) VALUES 
('company-1234', '1234', 'Demo Company', 'contact@democompany.com', '(555) 123-4567', 'active');

-- 2. Create Admin Role
INSERT INTO roles (id, company_id, name, description, permissions) VALUES 
('role-admin-1234', 'company-1234', 'Administrator', 'Full system access', 
'["accounts:view","accounts:edit","payments:process","reports:view","users:manage","roles:manage","documents:view","documents:upload","settings:manage"]');

-- 3. Create Manager Role
INSERT INTO roles (id, company_id, name, description, permissions) VALUES 
('role-manager-1234', 'company-1234', 'Manager', 'Department manager with elevated privileges', 
'["accounts:view","accounts:edit","payments:process","reports:view","documents:view","documents:upload"]');

-- 4. Create Collector Role
INSERT INTO roles (id, company_id, name, description, permissions) VALUES 
('role-collector-1234', 'company-1234', 'Collector', 'Standard collector role', 
'["accounts:view","accounts:edit","payments:process","documents:view","documents:upload"]');

-- 5. Create Viewer Role
INSERT INTO roles (id, company_id, name, description, permissions) VALUES 
('role-viewer-1234', 'company-1234', 'Viewer', 'Read-only access', 
'["accounts:view","documents:view","reports:view"]');

-- 6. Create Admin User
INSERT INTO users (id, company_id, first_name, last_name, email, role_id, department, position) VALUES 
('user-admin-1234', 'company-1234', 'Admin', 'User', 'admin@example.com', 'role-admin-1234', 'Administration', 'System Administrator');

-- 7. Create Sample Debtors
INSERT INTO debtors (
  id, company_id, first_name, last_name, email, address, city, state, zip,
  account_number, original_balance, current_balance, status, creditor_name,
  client_name, portfolio_id, case_file_number, date_loaded, purchase_date
) VALUES 
('debtor-1', 'company-1234', 'John', 'Doe', 'john.doe@example.com',
 '123 Main St', 'Chicago', 'IL', '60601', 'ACC-12345', 5000.00, 3500.00,
 'active', 'First Financial', 'Legal Recovery Services', 'Portfolio-2024',
 'CASE-123456', '2024-01-01', '2024-01-01'),

('debtor-2', 'company-1234', 'Jane', 'Smith', 'jane.smith@example.com',
 '456 Oak Ave', 'New York', 'NY', '10001', 'ACC-12346', 7500.00, 6000.00,
 'active', 'Credit Corp', 'Legal Recovery Services', 'Portfolio-2024',
 'CASE-123457', '2024-01-02', '2024-01-02'),

('debtor-3', 'company-1234', 'Bob', 'Johnson', 'bob.johnson@example.com',
 '789 Pine Rd', 'Los Angeles', 'CA', '90210', 'ACC-12347', 3000.00, 0.00,
 'paid', 'Bank of America', 'Legal Recovery Services', 'Portfolio-2024',
 'CASE-123458', '2024-01-03', '2024-01-03'),

('debtor-4', 'company-1234', 'Sarah', 'Wilson', 'sarah.wilson@example.com',
 '321 Elm St', 'Miami', 'FL', '33101', 'ACC-12348', 4500.00, 3200.00,
 'active', 'Chase Bank', 'Legal Recovery Services', 'Portfolio-2024',
 'CASE-123459', '2024-01-04', '2024-01-04'),

('debtor-5', 'company-1234', 'Michael', 'Brown', 'michael.brown@example.com',
 '654 Maple Ave', 'Seattle', 'WA', '98101', 'ACC-12349', 6200.00, 4800.00,
 'active', 'Wells Fargo', 'Legal Recovery Services', 'Portfolio-2024',
 'CASE-123460', '2024-01-05', '2024-01-05');

-- 8. Add Phone Numbers
INSERT INTO phone_numbers (id, company_id, debtor_id, type, number, is_primary) VALUES 
('phone-1', 'company-1234', 'debtor-1', 'cell', '(555) 123-4567', true),
('phone-2', 'company-1234', 'debtor-1', 'work', '(555) 987-6543', false),
('phone-3', 'company-1234', 'debtor-2', 'cell', '(555) 234-5678', true),
('phone-4', 'company-1234', 'debtor-2', 'home', '(555) 876-5432', false),
('phone-5', 'company-1234', 'debtor-3', 'cell', '(555) 345-6789', true),
('phone-6', 'company-1234', 'debtor-4', 'cell', '(555) 456-7890', true),
('phone-7', 'company-1234', 'debtor-4', 'work', '(555) 765-4321', false),
('phone-8', 'company-1234', 'debtor-5', 'cell', '(555) 567-8901', true);

-- 9. Add Sample Payments
INSERT INTO payments (id, company_id, debtor_id, amount, payment_date, method, status, created_by) VALUES 
('payment-1', 'company-1234', 'debtor-1', 500.00, '2024-01-15', 'credit', 'completed', 'Admin User'),
('payment-2', 'company-1234', 'debtor-2', 750.00, '2024-01-20', 'ach', 'completed', 'Admin User'),
('payment-3', 'company-1234', 'debtor-3', 3000.00, '2024-01-25', 'check', 'completed', 'Admin User'),
('payment-4', 'company-1234', 'debtor-4', 300.00, '2024-01-28', 'credit', 'completed', 'Admin User'),
('payment-5', 'company-1234', 'debtor-5', 400.00, '2024-01-30', 'ach', 'completed', 'Admin User');

-- 10. Add Sample Notes
INSERT INTO notes (id, company_id, debtor_id, content, created_by) VALUES 
('note-1', 'company-1234', 'debtor-1', 'Initial contact made. Debtor agreed to payment plan.', 'Admin User'),
('note-2', 'company-1234', 'debtor-2', 'Left voicemail requesting callback.', 'Admin User'),
('note-3', 'company-1234', 'debtor-3', 'Account paid in full. Case closed.', 'Admin User'),
('note-4', 'company-1234', 'debtor-4', 'Debtor requested payment extension. Approved for 30 days.', 'Admin User'),
('note-5', 'company-1234', 'debtor-5', 'Updated contact information. New phone number verified.', 'Admin User');

-- 11. Add Sample Actions
INSERT INTO actions (id, company_id, debtor_id, type, description, due_date, status) VALUES 
('action-1', 'company-1234', 'debtor-1', 'Phone Call', 'Follow up on payment arrangement', '2024-02-01', 'pending'),
('action-2', 'company-1234', 'debtor-2', 'Send Letter', 'Send demand letter', '2024-01-30', 'pending'),
('action-3', 'company-1234', 'debtor-4', 'Phone Call', 'Check on payment extension status', '2024-02-15', 'pending'),
('action-4', 'company-1234', 'debtor-5', 'Send Letter', 'Send payment confirmation letter', '2024-02-05', 'pending');