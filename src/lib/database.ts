export interface Env {
  DB: D1Database;
}

// Database schema initialization
export const initializeDatabase = async (db: D1Database) => {
  // Create tables if they don't exist
  await db.exec(`
    -- Companies table for multi-tenant support
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL CHECK(length(code) = 4 AND code GLOB '[0-9][0-9][0-9][0-9]'),
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
      settings TEXT, -- JSON settings
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS debtors (
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
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
      UNIQUE(company_id, account_number)
    );

    CREATE TABLE IF NOT EXISTS phone_numbers (
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

    CREATE TABLE IF NOT EXISTS payments (
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

    CREATE TABLE IF NOT EXISTS scheduled_payments (
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

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      debtor_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
      FOREIGN KEY (debtor_id) REFERENCES debtors (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS documents (
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

    CREATE TABLE IF NOT EXISTS actions (
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

    CREATE TABLE IF NOT EXISTS co_debtors (
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

    CREATE TABLE IF NOT EXISTS users (
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
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
      UNIQUE(company_id, email)
    );

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      company_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      permissions TEXT, -- JSON array of permission codes
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
      UNIQUE(company_id, name)
    );

    -- Authentication sessions table
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_companies_code ON companies(code);
    CREATE INDEX IF NOT EXISTS idx_debtors_company ON debtors(company_id);
    CREATE INDEX IF NOT EXISTS idx_debtors_account_number ON debtors(company_id, account_number);
    CREATE INDEX IF NOT EXISTS idx_debtors_status ON debtors(company_id, status);
    CREATE INDEX IF NOT EXISTS idx_debtors_creditor ON debtors(company_id, creditor_id);
    CREATE INDEX IF NOT EXISTS idx_phone_numbers_company ON phone_numbers(company_id);
    CREATE INDEX IF NOT EXISTS idx_phone_numbers_debtor ON phone_numbers(company_id, debtor_id);
    CREATE INDEX IF NOT EXISTS idx_payments_company ON payments(company_id);
    CREATE INDEX IF NOT EXISTS idx_payments_debtor ON payments(company_id, debtor_id);
    CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(company_id, payment_date);
    CREATE INDEX IF NOT EXISTS idx_notes_company ON notes(company_id);
    CREATE INDEX IF NOT EXISTS idx_notes_debtor ON notes(company_id, debtor_id);
    CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
    CREATE INDEX IF NOT EXISTS idx_documents_debtor ON documents(company_id, debtor_id);
    CREATE INDEX IF NOT EXISTS idx_actions_company ON actions(company_id);
    CREATE INDEX IF NOT EXISTS idx_actions_debtor ON actions(company_id, debtor_id);
    CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(company_id, status);
    CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(company_id, email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
  `);
};

// Database service class with company isolation
export class DatabaseService {
  constructor(private db: D1Database, private companyId?: string) {}

  // Company operations
  async createCompany(company: any) {
    // Validate 4-digit numeric code
    if (!/^\d{4}$/.test(company.code)) {
      throw new Error('Company code must be exactly 4 digits');
    }

    return await this.db.prepare(`
      INSERT INTO companies (
        id, code, name, email, phone, address, city, state, zip, website, tax_id, settings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      company.id,
      company.code,
      company.name,
      company.email,
      company.phone,
      company.address,
      company.city,
      company.state,
      company.zip,
      company.website,
      company.taxId,
      JSON.stringify(company.settings || {})
    ).run();
  }

  async getCompanyByCode(code: string) {
    // Validate 4-digit numeric code
    if (!/^\d{4}$/.test(code)) {
      return null;
    }

    return await this.db.prepare(`
      SELECT * FROM companies WHERE code = ? AND status = 'active'
    `).bind(code).first();
  }

  async getCompanyById(id: string) {
    return await this.db.prepare(`
      SELECT * FROM companies WHERE id = ? AND status = 'active'
    `).bind(id).first();
  }

  // Debtor operations with company isolation
  async createDebtor(debtor: any) {
    if (!this.companyId) throw new Error('Company ID required');
    
    const { phones, ...debtorData } = debtor;
    
    // Insert debtor
    const result = await this.db.prepare(`
      INSERT INTO debtors (
        id, company_id, first_name, last_name, email, address, city, state, zip, ssn, dob,
        employer, account_number, original_balance, current_balance, status,
        last_payment_date, last_payment_amount, creditor_id, creditor_name,
        client_name, portfolio_id, case_file_number, client_claim_number,
        date_loaded, origination_date, charged_off_date, purchase_date,
        assigned_collector
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      debtorData.id,
      this.companyId,
      debtorData.firstName,
      debtorData.lastName,
      debtorData.email,
      debtorData.address,
      debtorData.city,
      debtorData.state,
      debtorData.zip,
      debtorData.ssn,
      debtorData.dob,
      debtorData.employer,
      debtorData.accountNumber,
      debtorData.originalBalance,
      debtorData.currentBalance,
      debtorData.status,
      debtorData.lastPaymentDate,
      debtorData.lastPaymentAmount,
      debtorData.creditorId,
      debtorData.creditorName,
      debtorData.clientName,
      debtorData.portfolioId,
      debtorData.caseFileNumber,
      debtorData.clientClaimNumber,
      debtorData.dateLoaded,
      debtorData.originationDate,
      debtorData.chargedOffDate,
      debtorData.purchaseDate,
      debtorData.assignedCollector
    ).run();

    // Insert phone numbers
    if (phones && phones.length > 0) {
      for (const phone of phones) {
        await this.db.prepare(`
          INSERT INTO phone_numbers (id, company_id, debtor_id, type, number, is_primary)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(),
          this.companyId,
          debtorData.id,
          phone.type,
          phone.number,
          phone.primary || false
        ).run();
      }
    }

    return result;
  }

  async getDebtors(limit = 50, offset = 0) {
    if (!this.companyId) throw new Error('Company ID required');
    
    const debtors = await this.db.prepare(`
      SELECT * FROM debtors 
      WHERE company_id = ?
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(this.companyId, limit, offset).all();

    // Get phone numbers for each debtor
    for (const debtor of debtors.results) {
      const phones = await this.db.prepare(`
        SELECT type, number, is_primary as primary
        FROM phone_numbers 
        WHERE company_id = ? AND debtor_id = ?
        ORDER BY is_primary DESC, created_at ASC
      `).bind(this.companyId, debtor.id).all();
      
      debtor.phones = phones.results;
    }

    return debtors.results;
  }

  async getDebtorById(id: string) {
    if (!this.companyId) throw new Error('Company ID required');
    
    const debtor = await this.db.prepare(`
      SELECT * FROM debtors WHERE company_id = ? AND id = ?
    `).bind(this.companyId, id).first();

    if (!debtor) return null;

    // Get related data
    const [phones, payments, notes, documents, actions] = await Promise.all([
      this.db.prepare(`SELECT * FROM phone_numbers WHERE company_id = ? AND debtor_id = ?`).bind(this.companyId, id).all(),
      this.db.prepare(`SELECT * FROM payments WHERE company_id = ? AND debtor_id = ? ORDER BY payment_date DESC`).bind(this.companyId, id).all(),
      this.db.prepare(`SELECT * FROM notes WHERE company_id = ? AND debtor_id = ? ORDER BY created_at DESC`).bind(this.companyId, id).all(),
      this.db.prepare(`SELECT * FROM documents WHERE company_id = ? AND debtor_id = ? ORDER BY uploaded_at DESC`).bind(this.companyId, id).all(),
      this.db.prepare(`SELECT * FROM actions WHERE company_id = ? AND debtor_id = ? ORDER BY created_at DESC`).bind(this.companyId, id).all()
    ]);

    return {
      ...debtor,
      phones: phones.results,
      payments: payments.results,
      notes: notes.results,
      documents: documents.results,
      actions: actions.results
    };
  }

  async updateDebtor(id: string, updates: any) {
    if (!this.companyId) throw new Error('Company ID required');
    
    const { phones, ...debtorUpdates } = updates;
    
    // Update debtor
    const setClause = Object.keys(debtorUpdates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(debtorUpdates);
    values.push(this.companyId, id);

    await this.db.prepare(`
      UPDATE debtors 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE company_id = ? AND id = ?
    `).bind(...values).run();

    // Update phone numbers if provided
    if (phones) {
      // Delete existing phones
      await this.db.prepare(`DELETE FROM phone_numbers WHERE company_id = ? AND debtor_id = ?`).bind(this.companyId, id).run();
      
      // Insert new phones
      for (const phone of phones) {
        await this.db.prepare(`
          INSERT INTO phone_numbers (id, company_id, debtor_id, type, number, is_primary)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          crypto.randomUUID(),
          this.companyId,
          id,
          phone.type,
          phone.number,
          phone.primary || false
        ).run();
      }
    }
  }

  async deleteDebtor(id: string) {
    if (!this.companyId) throw new Error('Company ID required');
    return await this.db.prepare(`DELETE FROM debtors WHERE company_id = ? AND id = ?`).bind(this.companyId, id).run();
  }

  // Payment operations with company isolation
  async createPayment(payment: any) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      INSERT INTO payments (
        id, company_id, debtor_id, amount, payment_date, method, status, reference, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      payment.id,
      this.companyId,
      payment.debtorId,
      payment.amount,
      payment.date,
      payment.method,
      payment.status,
      payment.reference,
      payment.notes,
      payment.createdBy
    ).run();
  }

  async getPaymentsByDebtor(debtorId: string) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      SELECT * FROM payments 
      WHERE company_id = ? AND debtor_id = ? 
      ORDER BY payment_date DESC
    `).bind(this.companyId, debtorId).all();
  }

  // Note operations with company isolation
  async createNote(note: any) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      INSERT INTO notes (id, company_id, debtor_id, content, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      note.id,
      this.companyId,
      note.debtorId,
      note.content,
      note.createdBy
    ).run();
  }

  // User operations with company isolation
  async createUser(user: any) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      INSERT INTO users (
        id, company_id, first_name, last_name, email, password_hash, role_id, 
        department, position, phone, supervisor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.id,
      this.companyId,
      user.firstName,
      user.lastName,
      user.email,
      user.passwordHash,
      user.roleId,
      user.department,
      user.position,
      user.phone,
      user.supervisor
    ).run();
  }

  async getUserByEmail(email: string) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      SELECT u.*, r.name as role_name, r.permissions
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.company_id = ? AND u.email = ? AND u.status = 'active'
    `).bind(this.companyId, email).first();
  }

  // Search functionality with company isolation
  async searchDebtors(searchTerm: string, limit = 20) {
    if (!this.companyId) throw new Error('Company ID required');
    
    const term = `%${searchTerm}%`;
    
    return await this.db.prepare(`
      SELECT d.*, GROUP_CONCAT(p.number) as phone_numbers
      FROM debtors d
      LEFT JOIN phone_numbers p ON d.id = p.debtor_id AND d.company_id = p.company_id
      WHERE d.company_id = ? AND (
        d.first_name LIKE ? 
        OR d.last_name LIKE ? 
        OR d.account_number LIKE ?
        OR d.ssn LIKE ?
        OR p.number LIKE ?
      )
      GROUP BY d.id
      ORDER BY d.last_name, d.first_name
      LIMIT ?
    `).bind(this.companyId, term, term, term, term, term, limit).all();
  }

  // Dashboard statistics with company isolation
  async getDashboardStats() {
    if (!this.companyId) throw new Error('Company ID required');
    
    const [totalAccounts, activeAccounts, totalDebt, collectedThisMonth] = await Promise.all([
      this.db.prepare(`SELECT COUNT(*) as count FROM debtors WHERE company_id = ?`).bind(this.companyId).first(),
      this.db.prepare(`SELECT COUNT(*) as count FROM debtors WHERE company_id = ? AND status = 'active'`).bind(this.companyId).first(),
      this.db.prepare(`SELECT SUM(current_balance) as total FROM debtors WHERE company_id = ?`).bind(this.companyId).first(),
      this.db.prepare(`
        SELECT SUM(amount) as total 
        FROM payments 
        WHERE company_id = ? AND payment_date >= date('now', 'start of month')
      `).bind(this.companyId).first()
    ]);

    return {
      totalAccounts: totalAccounts.count,
      activeAccounts: activeAccounts.count,
      totalDebt: totalDebt.total || 0,
      collectedDebt: collectedThisMonth.total || 0,
      monthlyCollection: collectedThisMonth.total || 0,
      successRate: totalAccounts.count > 0 ? 
        Math.round((activeAccounts.count / totalAccounts.count) * 100) : 0
    };
  }

  // Session management
  async createSession(userId: string, token: string, expiresAt: string) {
    if (!this.companyId) throw new Error('Company ID required');
    
    return await this.db.prepare(`
      INSERT INTO user_sessions (id, user_id, company_id, token, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      userId,
      this.companyId,
      token,
      expiresAt
    ).run();
  }

  async getSessionByToken(token: string) {
    return await this.db.prepare(`
      SELECT s.*, u.first_name, u.last_name, u.email, c.code as company_code, c.name as company_name
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN companies c ON s.company_id = c.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `).bind(token).first();
  }

  async deleteSession(token: string) {
    return await this.db.prepare(`DELETE FROM user_sessions WHERE token = ?`).bind(token).run();
  }
}