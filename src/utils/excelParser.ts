import * as XLSX from 'xlsx';

export interface ParsedDebtorData {
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  accountNumber: string;
  originalBalance: number;
  currentBalance: number;
  status: string;
  creditorName?: string;
  clientName?: string;
  portfolioId?: string;
  caseFileNumber?: string;
  dateLoaded?: string;
  originationDate?: string;
  chargedOffDate?: string;
  purchaseDate?: string;
}

export interface ParseError {
  row: number;
  message: string;
}

export interface ParseResult {
  data: ParsedDebtorData[];
  errors: ParseError[];
}

export const parseExcelFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const result = parseDebtorData(jsonData as any[][]);
        resolve(result);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

const parseDebtorData = (rows: any[][]): ParseResult => {
  const data: ParsedDebtorData[] = [];
  const errors: ParseError[] = [];
  
  if (rows.length < 2) {
    errors.push({ row: 1, message: 'File must contain at least a header row and one data row' });
    return { data, errors };
  }
  
  const headers = rows[0].map((h: any) => String(h).toLowerCase().trim());
  
  // Required field mappings
  const fieldMappings = {
    firstName: ['first_name', 'firstname', 'first name'],
    lastName: ['last_name', 'lastname', 'last name'],
    accountNumber: ['account_number', 'accountnumber', 'account number', 'account #'],
    originalBalance: ['original_balance', 'originalbalance', 'original balance'],
    currentBalance: ['current_balance', 'currentbalance', 'current balance', 'balance'],
    status: ['status'],
    email: ['email', 'email_address'],
    address: ['address', 'street_address'],
    city: ['city'],
    state: ['state'],
    zip: ['zip', 'zipcode', 'zip_code'],
    phone: ['phone', 'phone_number', 'telephone'],
    creditorName: ['creditor_name', 'creditor', 'original_creditor'],
    clientName: ['client_name', 'client'],
    portfolioId: ['portfolio_id', 'portfolio'],
    caseFileNumber: ['case_file_number', 'case_number', 'file_number'],
    dateLoaded: ['date_loaded', 'load_date'],
    originationDate: ['origination_date', 'orig_date'],
    chargedOffDate: ['charged_off_date', 'charge_off_date'],
    purchaseDate: ['purchase_date']
  };
  
  // Find column indexes
  const columnIndexes: Record<string, number> = {};
  
  for (const [field, possibleNames] of Object.entries(fieldMappings)) {
    for (const name of possibleNames) {
      const index = headers.findIndex(h => h === name);
      if (index !== -1) {
        columnIndexes[field] = index;
        break;
      }
    }
  }
  
  // Check for required fields
  const requiredFields = ['firstName', 'lastName', 'accountNumber', 'originalBalance'];
  for (const field of requiredFields) {
    if (columnIndexes[field] === undefined) {
      errors.push({ 
        row: 1, 
        message: `Required column '${field}' not found. Expected one of: ${fieldMappings[field as keyof typeof fieldMappings].join(', ')}` 
      });
    }
  }
  
  if (errors.length > 0) {
    return { data, errors };
  }
  
  // Process data rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 1;
    
    try {
      // Extract required fields
      const firstName = String(row[columnIndexes.firstName] || '').trim();
      const lastName = String(row[columnIndexes.lastName] || '').trim();
      const accountNumber = String(row[columnIndexes.accountNumber] || '').trim();
      const originalBalance = parseFloat(String(row[columnIndexes.originalBalance] || '0').replace(/[^0-9.-]/g, ''));
      
      // Validate required fields
      if (!firstName) {
        errors.push({ row: rowNumber, message: 'First name is required' });
        continue;
      }
      
      if (!lastName) {
        errors.push({ row: rowNumber, message: 'Last name is required' });
        continue;
      }
      
      if (!accountNumber) {
        errors.push({ row: rowNumber, message: 'Account number is required' });
        continue;
      }
      
      if (isNaN(originalBalance) || originalBalance <= 0) {
        errors.push({ row: rowNumber, message: 'Original balance must be a positive number' });
        continue;
      }
      
      // Extract optional fields
      const currentBalance = columnIndexes.currentBalance !== undefined 
        ? parseFloat(String(row[columnIndexes.currentBalance] || originalBalance).replace(/[^0-9.-]/g, ''))
        : originalBalance;
      
      const status = columnIndexes.status !== undefined 
        ? String(row[columnIndexes.status] || 'active').toLowerCase().trim()
        : 'active';
      
      // Validate status
      const validStatuses = ['active', 'paid', 'inactive', 'disputed'];
      if (!validStatuses.includes(status)) {
        errors.push({ row: rowNumber, message: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}` });
        continue;
      }
      
      // Validate email if provided
      const email = columnIndexes.email !== undefined ? String(row[columnIndexes.email] || '').trim() : '';
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ row: rowNumber, message: 'Invalid email format' });
        continue;
      }
      
      // Create debtor object
      const debtor: ParsedDebtorData = {
        firstName,
        lastName,
        accountNumber,
        originalBalance,
        currentBalance: isNaN(currentBalance) ? originalBalance : currentBalance,
        status,
        email: email || undefined,
        address: columnIndexes.address !== undefined ? String(row[columnIndexes.address] || '').trim() || undefined : undefined,
        city: columnIndexes.city !== undefined ? String(row[columnIndexes.city] || '').trim() || undefined : undefined,
        state: columnIndexes.state !== undefined ? String(row[columnIndexes.state] || '').trim() || undefined : undefined,
        zip: columnIndexes.zip !== undefined ? String(row[columnIndexes.zip] || '').trim() || undefined : undefined,
        phone: columnIndexes.phone !== undefined ? String(row[columnIndexes.phone] || '').trim() || undefined : undefined,
        creditorName: columnIndexes.creditorName !== undefined ? String(row[columnIndexes.creditorName] || '').trim() || undefined : undefined,
        clientName: columnIndexes.clientName !== undefined ? String(row[columnIndexes.clientName] || '').trim() || undefined : undefined,
        portfolioId: columnIndexes.portfolioId !== undefined ? String(row[columnIndexes.portfolioId] || '').trim() || undefined : undefined,
        caseFileNumber: columnIndexes.caseFileNumber !== undefined ? String(row[columnIndexes.caseFileNumber] || '').trim() || undefined : undefined,
        dateLoaded: columnIndexes.dateLoaded !== undefined ? String(row[columnIndexes.dateLoaded] || '').trim() || undefined : undefined,
        originationDate: columnIndexes.originationDate !== undefined ? String(row[columnIndexes.originationDate] || '').trim() || undefined : undefined,
        chargedOffDate: columnIndexes.chargedOffDate !== undefined ? String(row[columnIndexes.chargedOffDate] || '').trim() || undefined : undefined,
        purchaseDate: columnIndexes.purchaseDate !== undefined ? String(row[columnIndexes.purchaseDate] || '').trim() || undefined : undefined,
      };
      
      data.push(debtor);
      
    } catch (error) {
      errors.push({ row: rowNumber, message: `Error processing row: ${(error as Error).message}` });
    }
  }
  
  return { data, errors };
};

export const generateExcelTemplate = (): Blob => {
  const templateData = [
    [
      'first_name',
      'last_name',
      'email',
      'account_number',
      'original_balance',
      'current_balance',
      'status',
      'address',
      'city',
      'state',
      'zip',
      'phone',
      'creditor_name',
      'client_name',
      'portfolio_id',
      'case_file_number',
      'date_loaded',
      'origination_date',
      'charged_off_date',
      'purchase_date'
    ],
    [
      'John',
      'Doe',
      'john.doe@example.com',
      'ACC-12345',
      '1000.00',
      '750.00',
      'active',
      '123 Main St',
      'Chicago',
      'IL',
      '60601',
      '(555) 123-4567',
      'First Financial',
      'Legal Recovery Services',
      'Portfolio-2024',
      'CASE-123456',
      '2024-01-01',
      '2023-06-15',
      '2023-12-01',
      '2024-01-01'
    ],
    [
      'Jane',
      'Smith',
      'jane.smith@example.com',
      'ACC-12346',
      '2500.00',
      '2000.00',
      'active',
      '456 Oak Ave',
      'New York',
      'NY',
      '10001',
      '(555) 987-6543',
      'Credit Corp',
      'Legal Recovery Services',
      'Portfolio-2024',
      'CASE-123457',
      '2024-01-02',
      '2023-07-20',
      '2023-12-15',
      '2024-01-02'
    ]
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Accounts Template');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};