import { DatabaseService, initializeDatabase, Env } from '../lib/database';
import { CloudflareDebtorAPI } from '../api/debtors';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Serve API routes
      if (path.startsWith('/api/')) {
        if (!env.DB) {
          throw new Error('Database binding not found');
        }

        await initializeDatabase(env.DB);
        
        // For now, we'll use a default company ID since we don't have authentication
        const defaultCompanyId = 'company-1234';
        const dbService = new DatabaseService(env.DB, defaultCompanyId);
        const debtorAPI = new CloudflareDebtorAPI(dbService);

        // Route handling
        if (path.startsWith('/api/debtors')) {
          return handleDebtorRoutes(request, debtorAPI, corsHeaders);
        } else if (path.startsWith('/api/payments')) {
          return handlePaymentRoutes(request, dbService, corsHeaders);
        } else if (path.startsWith('/api/dashboard')) {
          return handleDashboardRoutes(request, dbService, corsHeaders);
        } else if (path.startsWith('/api/users')) {
          return handleUserRoutes(request, dbService, corsHeaders);
        }

        return new Response('API endpoint not found', { status: 404, headers: corsHeaders });
      }

      // Serve the React app for all other routes (SPA routing)
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CloudCollect - Debt Management Platform</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
      }
      
      .container {
        background: white;
        border-radius: 20px;
        padding: 3rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        text-align: center;
        max-width: 500px;
        width: 90%;
        position: relative;
        overflow: hidden;
      }
      
      .container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
      }
      
      .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      }
      
      .logo span {
        color: white;
        font-size: 2rem;
        font-weight: 800;
      }
      
      h1 {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
      }
      
      .subtitle {
        color: #666;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        font-weight: 500;
      }
      
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
      }
      
      .spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .demo-info {
        background: #f8fafc;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem 0;
        border-left: 4px solid #667eea;
      }
      
      .demo-info h3 {
        color: #374151;
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .demo-info p {
        color: #6b7280;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
      
      .demo-info code {
        background: #e5e7eb;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 0.8rem;
      }
      
      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 2rem;
        padding: 1rem;
        background: #f0fdf4;
        border-radius: 8px;
        border: 1px solid #bbf7d0;
      }
      
      .status-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .btn {
        display: inline-block;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 1rem;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <span>CC</span>
      </div>
      
      <h1>CloudCollect</h1>
      <p class="subtitle">Professional Debt Management Platform</p>
      
      <div class="loading">
        <div class="spinner"></div>
        <span>Initializing application...</span>
      </div>
      
      <div class="demo-info">
        <h3>🚀 Demo Credentials</h3>
        <p><strong>Company Code:</strong> <code>1234</code></p>
        <p><strong>Email:</strong> <code>admin@example.com</code></p>
        <p><strong>Password:</strong> <code>password</code></p>
      </div>
      
      <div class="status">
        <div class="status-dot"></div>
        <span>System Status: All services operational</span>
      </div>
      
      <a href="/dashboard" class="btn">Access Dashboard</a>
    </div>
    
    <script>
      // Try to load the React app
      setTimeout(() => {
        // Check if we can access the API
        fetch('/api/dashboard/stats')
          .then(response => {
            if (response.ok) {
              console.log('✅ API is working');
              // Try to redirect to login
              window.location.href = '/dashboard';
            } else {
              console.log('⚠️ API response:', response.status);
            }
          })
          .catch(error => {
            console.log('❌ API error:', error);
          });
      }, 2000);
      
      // Fallback: redirect after 5 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 5000);
    </script>
  </body>
</html>`;

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Server Error:', error);
      
      // Return a beautiful error page
      const errorHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CloudCollect - Service Error</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        color: #333;
      }
      .error-container {
        background: white;
        border-radius: 20px;
        padding: 3rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        text-align: center;
        max-width: 500px;
        width: 90%;
      }
      .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      h1 {
        color: #dc2626;
        margin-bottom: 1rem;
      }
      p {
        color: #666;
        margin-bottom: 2rem;
      }
      .btn {
        background: #667eea;
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h1>Service Temporarily Unavailable</h1>
      <p>We're experiencing technical difficulties. Please try again in a few moments.</p>
      <p><small>Error: ${error instanceof Error ? error.message : 'Unknown error'}</small></p>
      <a href="/" class="btn">Try Again</a>
    </div>
  </body>
</html>`;

      return new Response(errorHtml, {
        status: 500,
        headers: { 
          'Content-Type': 'text/html',
          ...corsHeaders 
        }
      });
    }
  },
};

async function handleDebtorRoutes(
  request: Request, 
  debtorAPI: CloudflareDebtorAPI, 
  corsHeaders: Record<string, string>
) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  try {
    if (path === '/api/debtors') {
      if (method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const debtors = await debtorAPI.getAll(limit, offset);
        
        return new Response(JSON.stringify(debtors), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (method === 'POST') {
        const debtor = await request.json();
        const result = await debtorAPI.create(debtor);
        
        return new Response(JSON.stringify(result), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else if (path.startsWith('/api/debtors/search')) {
      const searchTerm = url.searchParams.get('q');
      if (!searchTerm) {
        return new Response(JSON.stringify({ error: 'Search term required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const results = await debtorAPI.search(searchTerm);
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else if (path.match(/^\/api\/debtors\/[^\/]+$/)) {
      const id = path.split('/').pop()!;
      
      if (method === 'GET') {
        const debtor = await debtorAPI.getById(id);
        if (!debtor) {
          return new Response(JSON.stringify({ error: 'Debtor not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(debtor), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (method === 'PUT') {
        const updates = await request.json();
        await debtorAPI.update(id, updates);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (method === 'DELETE') {
        await debtorAPI.delete(id);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Debtor API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handlePaymentRoutes(
  request: Request, 
  dbService: DatabaseService, 
  corsHeaders: Record<string, string>
) {
  const url = new URL(request.url);
  const method = request.method;

  try {
    if (method === 'POST') {
      const payment = await request.json();
      const result = await dbService.createPayment(payment);
      
      return new Response(JSON.stringify(result), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else if (method === 'GET') {
      const debtorId = url.searchParams.get('debtorId');
      if (!debtorId) {
        return new Response(JSON.stringify({ error: 'Debtor ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const payments = await dbService.getPaymentsByDebtor(debtorId);
      return new Response(JSON.stringify(payments.results || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Payment API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleDashboardRoutes(
  request: Request, 
  dbService: DatabaseService, 
  corsHeaders: Record<string, string>
) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path === '/api/dashboard/stats') {
      const stats = await dbService.getDashboardStats();
      return new Response(JSON.stringify(stats), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleUserRoutes(
  request: Request, 
  dbService: DatabaseService, 
  corsHeaders: Record<string, string>
) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  try {
    if (path === '/api/users') {
      if (method === 'GET') {
        // Get all users for the company
        const users = await dbService.db.prepare(`
          SELECT u.*, r.name as role_name 
          FROM users u 
          LEFT JOIN roles r ON u.role_id = r.id 
          WHERE u.company_id = ? 
          ORDER BY u.created_at DESC
        `).bind(dbService.companyId).all();
        
        return new Response(JSON.stringify(users.results || []), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (method === 'POST') {
        const userData = await request.json();
        const result = await dbService.createUser({
          ...userData,
          id: crypto.randomUUID()
        });
        
        return new Response(JSON.stringify(result), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else if (path.match(/^\/api\/users\/[^\/]+$/)) {
      const userId = path.split('/').pop()!;
      
      if (method === 'PUT') {
        const updates = await request.json();
        
        // Build update query dynamically
        const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        values.push(dbService.companyId, userId);
        
        await dbService.db.prepare(`
          UPDATE users 
          SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
          WHERE company_id = ? AND id = ?
        `).bind(...values).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else if (method === 'DELETE') {
        await dbService.db.prepare(`
          DELETE FROM users 
          WHERE company_id = ? AND id = ?
        `).bind(dbService.companyId, userId).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('User API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}