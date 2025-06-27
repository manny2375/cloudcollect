import { DatabaseService } from '../lib/database';

export interface DebtorAPI {
  getAll: (limit?: number, offset?: number) => Promise<any[]>;
  getById: (id: string) => Promise<any>;
  create: (debtor: any) => Promise<any>;
  update: (id: string, updates: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  search: (term: string) => Promise<any[]>;
}

export class CloudflareDebtorAPI implements DebtorAPI {
  constructor(private db: DatabaseService) {}

  async getAll(limit = 50, offset = 0) {
    return await this.db.getDebtors(limit, offset);
  }

  async getById(id: string) {
    return await this.db.getDebtorById(id);
  }

  async create(debtor: any) {
    return await this.db.createDebtor(debtor);
  }

  async update(id: string, updates: any) {
    return await this.db.updateDebtor(id, updates);
  }

  async delete(id: string) {
    return await this.db.deleteDebtor(id);
  }

  async search(term: string) {
    return await this.db.searchDebtors(term);
  }
}

// API client for frontend
export class APIClient {
  private baseUrl: string;

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Debtor endpoints
  async getDebtors(limit = 50, offset = 0) {
    return this.request(`/debtors?limit=${limit}&offset=${offset}`);
  }

  async getDebtor(id: string) {
    return this.request(`/debtors/${id}`);
  }

  async createDebtor(debtor: any) {
    return this.request('/debtors', {
      method: 'POST',
      body: JSON.stringify(debtor),
    });
  }

  async updateDebtor(id: string, updates: any) {
    return this.request(`/debtors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteDebtor(id: string) {
    return this.request(`/debtors/${id}`, {
      method: 'DELETE',
    });
  }

  async searchDebtors(term: string) {
    return this.request(`/debtors/search?q=${encodeURIComponent(term)}`);
  }

  // Payment endpoints
  async createPayment(payment: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async getPayments(debtorId: string) {
    return this.request(`/payments?debtorId=${debtorId}`);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}