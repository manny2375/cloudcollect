export interface PhoneNumber {
  type: 'cell' | 'work' | 'home' | 'custom1' | 'custom2' | 'custom3' | 'custom4' | 'custom5';
  number: string;
  primary?: boolean;
}

export interface Company {
  id: string;
  code: string; // 4-digit numeric code
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  tax_id?: string;
  logo_url?: string;
  settings?: Record<string, any>;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Debtor {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phones: PhoneNumber[];
  email: string;
  ssn?: string;
  dob?: string;
  employer?: string;
  account_number: string;
  original_balance: number;
  current_balance: number;
  status: 'active' | 'paid' | 'inactive' | 'disputed';
  last_payment_date?: string;
  last_payment_amount?: number;
  notes: Note[];
  documents: Document[];
  actions: Action[];
  payments: Payment[];
  scheduled_payments: ScheduledPayment[];
  creditor_id: string;
  creditor_name: string;
  client_name: string;
  portfolio_id: string;
  co_debtor?: CoDebtor;
  case_file_number: string;
  client_claim_number?: string;
  date_loaded: string;
  origination_date?: string;
  charged_off_date?: string;
  purchase_date?: string;
  assigned_collector?: string;
  created_at: string;
  updated_at: string;
}

export interface CoDebtor {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phones: PhoneNumber[];
  email: string;
  ssn?: string;
  dob?: string;
  employer?: string;
  relationship: string;
  date_added: string;
}

export interface Payment {
  id: string;
  company_id: string;
  amount: number;
  payment_date: string;
  method: 'cash' | 'check' | 'credit' | 'debit' | 'ach';
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface ScheduledPayment {
  id: string;
  company_id: string;
  amount: number;
  scheduled_date: string;
  method: 'credit' | 'debit' | 'ach';
  status: 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  last_updated: string;
}

export interface Note {
  id: string;
  company_id: string;
  content: string;
  created_at: string;
  created_by: string;
}

export interface Document {
  id: string;
  company_id: string;
  name: string;
  type: string;
  uploaded_at: string;
  uploaded_by: string;
  url: string;
}

export interface Action {
  id: string;
  company_id: string;
  type: string;
  description: string;
  due_date?: string;
  completed_at?: string;
  completed_by?: string;
  status: 'pending' | 'completed' | 'overdue';
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface Role {
  id: string;
  company_id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
  phone?: string;
  department?: string;
  position?: string;
  supervisor?: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  company_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface ImportResult {
  successful: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export interface DashboardStats {
  totalAccounts: number;
  activeAccounts: number;
  totalDebt: number;
  collectedDebt: number;
  monthlyCollection: number;
  successRate: number;
}

export interface AuthContext {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  login: (companyCode: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Validation utilities
export const validateCompanyCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};

export const formatCompanyCode = (code: string): string => {
  return code.replace(/\D/g, '').slice(0, 4);
};