# CloudCollect - Debt Management Platform

A modern, full-featured debt collection management platform built with React, TypeScript, and Cloudflare D1.

## 🚀 Live Demo

- **Frontend**: [https://cloudcollect-frontend.pages.dev](https://cloudcollect-frontend.pages.dev)
- **API**: [https://cloudcollect.lamado.workers.dev](https://cloudcollect.lamado.workers.dev)

## 🔐 Demo Login

Use these credentials to test the application:

- **Company Code**: `1234`
- **Email**: `admin@example.com`
- **Password**: `password`

## ✨ Features

- **Multi-Tenant Architecture**: Complete company isolation with 4-digit company codes
- **Account Management**: Comprehensive debtor account tracking with full CRUD operations
- **Payment Processing**: Secure payment handling with Authorize.net integration
- **Document Management**: Upload, generate, and organize collection documents
- **User Management**: Role-based access control with functional edit/delete operations
- **Reporting & Analytics**: Real-time dashboards and comprehensive reports
- **Import/Export**: Bulk data operations with Excel support and template generation
- **Search & Filtering**: Advanced search capabilities across all data
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Document Generation**: Professional demand letters, statements, and payment agreements

## 🏗️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages
- **Payment Processing**: Authorize.net
- **File Storage**: Cloudflare R2 (optional)
- **Document Generation**: docx library for Word documents

## 🔒 Multi-Tenant Architecture

CloudCollect uses a **4-digit numeric company code** system for complete tenant isolation:

- Each company gets a unique 4-digit code (e.g., `1234`, `5678`)
- All data is completely isolated by company
- Users can only access their company's data
- Database queries are automatically scoped to company

### Company Code Examples
- `1234` - Demo Company
- `5678` - Test Company  
- `9999` - Development Company

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cloudcollect
```

2. Install dependencies:
```bash
npm install
```

3. Install Wrangler CLI:
```bash
npm install -g wrangler
```

4. Login to Cloudflare:
```bash
wrangler login
```

### Database Setup

1. Create a D1 database:
```bash
npm run db:create
```

2. Update `wrangler.toml` with your database ID

3. Run migrations:
```bash
npm run db:migrate
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. Start the Cloudflare Workers development server:
```bash
npm run wrangler:dev
```

## 📊 Database Schema

The application uses a normalized SQLite schema with complete company isolation:

### Core Tables
- `companies` - Company information with 4-digit codes
- `debtors` - Main debtor information (company-scoped)
- `phone_numbers` - Multiple phone numbers per debtor
- `payments` - Payment history
- `scheduled_payments` - Future scheduled payments
- `notes` - Account notes and communications
- `documents` - Uploaded documents
- `actions` - Collection activities and tasks
- `co_debtors` - Co-debtor information
- `users` - System users (company-scoped)
- `roles` - User roles and permissions (company-scoped)
- `user_sessions` - Authentication sessions

### Company Isolation Features
- All tables include `company_id` foreign key
- Unique constraints are scoped to company (e.g., account numbers)
- Database indexes include company_id for optimal performance
- All queries automatically filtered by company

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Company-scoped login
- `POST /api/auth/logout` - Logout and clear session

### Debtors
- `GET /api/debtors` - List company debtors
- `GET /api/debtors/:id` - Get specific debtor
- `POST /api/debtors` - Create new debtor
- `PUT /api/debtors/:id` - Update debtor
- `DELETE /api/debtors/:id` - Delete debtor
- `GET /api/debtors/search?q=term` - Search company debtors

### Users
- `GET /api/users` - List company users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Payments
- `GET /api/payments?debtorId=:id` - Get payments for debtor
- `POST /api/payments` - Create new payment

### Dashboard
- `GET /api/dashboard/stats` - Get company dashboard statistics

## 🔐 Security Features

### Multi-Tenant Security
- Complete data isolation between companies
- Company code validation (4-digit numeric only)
- All API endpoints are company-scoped
- Session management with company context

### General Security
- CORS protection on all endpoints
- Prepared SQL statements prevent injection
- User authentication and authorization
- Role-based access control
- Secure payment processing
- Data encryption in transit and at rest

## ⚙️ Configuration

### Environment Variables

Set these in your Cloudflare Workers environment:

- `AUTHORIZE_NET_API_LOGIN_ID` - Authorize.net API Login ID
- `AUTHORIZE_NET_TRANSACTION_KEY` - Authorize.net Transaction Key
- `AUTHORIZE_NET_ENVIRONMENT` - 'sandbox' or 'production'

### Wrangler Configuration

Update `wrangler.toml` with your specific settings:

```toml
name = "cloudcollect"
main = "src/workers/api.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "cloudcollect-db"
database_id = "your-database-id-here"
```

## 🏢 Company Setup

### Adding New Companies

To add a new company to the system:

1. Generate a unique 4-digit code
2. Create company record in database:

```sql
INSERT INTO companies (id, code, name, email, status) 
VALUES ('company-uuid', '1234', 'Company Name', 'contact@company.com', 'active');
```

3. Create initial admin user for the company
4. Set up company-specific roles and permissions

### Company Code Management

- Codes must be exactly 4 digits (0000-9999)
- Each code must be unique across the system
- Codes are validated on login and API requests
- Invalid codes are rejected immediately

## 🚀 Deployment

### Frontend Deployment (Cloudflare Pages)

The frontend is automatically deployed to Cloudflare Pages when you push to the main branch.

**Manual Deployment:**
1. Build the project: `npm run build`
2. Deploy to Cloudflare Pages via dashboard or CLI

### Backend Deployment (Cloudflare Workers)

```bash
npm run wrangler:deploy
```

## ⚡ Performance Optimizations

- Database queries optimized with proper indexing
- Company-scoped indexes for fast data access
- Lazy loading of React components
- Efficient data pagination
- CDN delivery via Cloudflare
- Edge computing for low latency
- Connection pooling for database access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Ensure all tests pass
4. Test with multiple company codes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team.

---

**CloudCollect v2.0** - Professional debt management platform with multi-tenant architecture and comprehensive feature set.