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
      
      :root {
        --primary-50: 240 249 255;
        --primary-100: 224 242 254;
        --primary-200: 186 230 253;
        --primary-300: 125 211 252;
        --primary-400: 56 189 248;
        --primary-500: 14 165 233;
        --primary-600: 2 132 199;
        --primary-700: 3 105 161;
        --primary-800: 7 89 133;
        --primary-900: 12 74 110;
        --primary-950: 8 47 73;
        
        --neutral-50: 250 250 250;
        --neutral-100: 245 245 245;
        --neutral-200: 229 229 229;
        --neutral-300: 212 212 212;
        --neutral-400: 163 163 163;
        --neutral-500: 115 115 115;
        --neutral-600: 82 82 82;
        --neutral-700: 64 64 64;
        --neutral-800: 38 38 38;
        --neutral-900: 23 23 23;
        --neutral-950: 10 10 10;
        
        --success-500: 34 197 94;
        --error-500: 239 68 68;
        --warning-500: 245 158 11;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: linear-gradient(135deg, rgb(var(--primary-50)) 0%, rgb(var(--primary-100)) 100%);
        min-height: 100vh;
        color: rgb(var(--neutral-900));
        font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
        overflow-x: hidden;
      }
      
      .app-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        position: relative;
      }
      
      .app-container::before {
        content: '';
        position: absolute;
        top: -40%;
        right: -40%;
        width: 80%;
        height: 80%;
        background: radial-gradient(circle, rgba(var(--primary-200), 0.3) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(60px);
      }
      
      .app-container::after {
        content: '';
        position: absolute;
        bottom: -40%;
        left: -40%;
        width: 80%;
        height: 80%;
        background: radial-gradient(circle, rgba(var(--primary-300), 0.2) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(60px);
      }
      
      .login-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        padding: 3rem;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 480px;
        position: relative;
        z-index: 10;
      }
      
      .logo-container {
        text-align: center;
        margin-bottom: 2.5rem;
      }
      
      .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, rgb(var(--primary-500)), rgb(var(--primary-600)));
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        box-shadow: 0 10px 25px rgba(var(--primary-500), 0.3);
        color: white;
        font-size: 2rem;
        font-weight: 800;
      }
      
      .app-title {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, rgb(var(--primary-600)), rgb(var(--primary-500)));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
      }
      
      .app-subtitle {
        color: rgb(var(--neutral-600));
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
      }
      
      .app-description {
        color: rgb(var(--neutral-500));
        font-size: 0.9rem;
      }
      
      .form-group {
        margin-bottom: 1.5rem;
      }
      
      .form-label {
        display: block;
        font-weight: 600;
        color: rgb(var(--neutral-700));
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      
      .form-input {
        width: 100%;
        padding: 1rem 1.25rem;
        border: 2px solid rgb(var(--neutral-200));
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: white;
        font-family: 'Inter', monospace;
      }
      
      .form-input:focus {
        outline: none;
        border-color: rgb(var(--primary-500));
        box-shadow: 0 0 0 3px rgba(var(--primary-500), 0.1);
      }
      
      .company-code-input {
        text-align: center;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 0.5rem;
        font-family: 'Inter', monospace;
      }
      
      .btn {
        width: 100%;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, rgb(var(--primary-600)), rgb(var(--primary-500)));
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 15px rgba(var(--primary-500), 0.3);
      }
      
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(var(--primary-500), 0.4);
      }
      
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
      
      .demo-credentials {
        background: rgb(var(--neutral-50));
        border: 1px solid rgb(var(--neutral-200));
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 2rem;
      }
      
      .demo-title {
        font-weight: 600;
        color: rgb(var(--neutral-900));
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      
      .demo-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.85rem;
      }
      
      .demo-label {
        color: rgb(var(--neutral-600));
        font-weight: 500;
      }
      
      .demo-value {
        color: rgb(var(--neutral-900));
        font-family: 'Inter', monospace;
        font-weight: 600;
      }
      
      .error-message {
        background: rgba(var(--error-500), 0.1);
        border: 1px solid rgba(var(--error-500), 0.2);
        color: rgb(var(--error-500));
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      
      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      .footer {
        text-align: center;
        margin-top: 2rem;
        color: rgb(var(--neutral-500));
        font-size: 0.8rem;
      }
      
      .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1.5rem;
        padding: 0.75rem;
        background: rgba(var(--success-500), 0.1);
        border: 1px solid rgba(var(--success-500), 0.2);
        border-radius: 8px;
        color: rgb(var(--success-500));
        font-size: 0.85rem;
        font-weight: 500;
      }
      
      .status-dot {
        width: 8px;
        height: 8px;
        background: rgb(var(--success-500));
        border-radius: 50%;
        margin-right: 0.5rem;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="app-container">
        <div class="login-card">
          <div class="logo-container">
            <div class="logo">CC</div>
            <h1 class="app-title">CloudCollect</h1>
            <p class="app-subtitle">Professional Debt Management Platform</p>
            <p class="app-description">Multi-tenant secure access</p>
          </div>
          
          <form id="loginForm">
            <div class="form-group">
              <label class="form-label" for="companyCode">
                Company Code <span style="color: rgb(var(--error-500));">*</span>
              </label>
              <input 
                type="text" 
                id="companyCode" 
                class="form-input company-code-input" 
                placeholder="0000"
                maxlength="4"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">
                Email Address <span style="color: rgb(var(--error-500));">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                class="form-input" 
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">
                Password <span style="color: rgb(var(--error-500));">*</span>
              </label>
              <input 
                type="password" 
                id="password" 
                class="form-input" 
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="btn" id="loginBtn">
              Sign in to Company <span id="companyDisplay">****</span>
            </button>
          </form>
          
          <div class="demo-credentials">
            <div class="demo-title">🚀 Demo Credentials</div>
            <div class="demo-item">
              <span class="demo-label">Company Code:</span>
              <span class="demo-value">1234</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">Email:</span>
              <span class="demo-value">admin@example.com</span>
            </div>
            <div class="demo-item">
              <span class="demo-label">Password:</span>
              <span class="demo-value">password</span>
            </div>
          </div>
          
          <div class="status-indicator">
            <div class="status-dot"></div>
            System Status: All services operational
          </div>
          
          <div class="footer">
            © 2025 CloudCollect. All rights reserved.<br>
            Secure multi-tenant debt management platform
          </div>
        </div>
      </div>
    </div>
    
    <script>
      // Company code input formatting
      const companyCodeInput = document.getElementById('companyCode');
      const companyDisplay = document.getElementById('companyDisplay');
      const loginForm = document.getElementById('loginForm');
      const loginBtn = document.getElementById('loginBtn');
      const errorMessage = document.getElementById('errorMessage');
      
      companyCodeInput.addEventListener('input', function(e) {
        // Only allow digits
        e.target.value = e.target.value.replace(/\\D/g, '').slice(0, 4);
        
        // Update display
        const code = e.target.value || '****';
        companyDisplay.textContent = code.padEnd(4, '*');
        
        // Validate
        if (e.target.value.length === 4) {
          e.target.style.borderColor = 'rgb(var(--success-500))';
        } else {
          e.target.style.borderColor = 'rgb(var(--neutral-200))';
        }
      });
      
      // Form submission
      loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const companyCode = companyCodeInput.value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate company code
        if (!/^\\d{4}$/.test(companyCode)) {
          showError('Company code must be exactly 4 digits');
          return;
        }
        
        // Show loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading-spinner"></span>Signing in...';
        hideError();
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Demo credentials check
          if (companyCode === '1234' && email === 'admin@example.com' && password === 'password') {
            // Success - redirect to dashboard
            showSuccess();
          } else {
            throw new Error('Invalid company code, email, or password');
          }
        } catch (error) {
          showError(error.message);
          loginBtn.disabled = false;
          loginBtn.innerHTML = 'Sign in to Company ' + companyCode;
        }
      });
      
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
      
      function hideError() {
        errorMessage.style.display = 'none';
      }
      
      function showSuccess() {
        // Store auth data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({
          id: 'user-1',
          name: 'Admin User',
          email: document.getElementById('email').value,
          companyId: 'company-1234',
          companyCode: document.getElementById('companyCode').value,
          role: 'Administrator'
        }));
        
        // Show success message
        loginBtn.innerHTML = '✓ Success! Redirecting...';
        loginBtn.style.background = 'rgb(var(--success-500))';
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
      
      // Auto-fill demo credentials on logo click
      document.querySelector('.logo').addEventListener('click', function() {
        companyCodeInput.value = '1234';
        document.getElementById('email').value = 'admin@example.com';
        document.getElementById('password').value = 'password';
        companyCodeInput.dispatchEvent(new Event('input'));
      });
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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
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