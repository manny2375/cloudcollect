import { DatabaseService, initializeDatabase, Env } from '../lib/database';
import { CloudflareDebtorAPI } from '../api/debtors';

// Import the built frontend files
import indexHtml from '../../dist/index.html';

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
        }

        return new Response('API endpoint not found', { status: 404, headers: corsHeaders });
      }

      // Serve static assets
      if (path.startsWith('/assets/')) {
        // In a real implementation, you'd serve these from KV storage or R2
        // For now, return a 404 for assets
        return new Response('Asset not found', { status: 404 });
      }

      // Serve the React app for all other routes (SPA routing)
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>CloudCollect</title>
            <style>
              /* Inline critical CSS for faster loading */
              body { margin: 0; font-family: Inter, system-ui, sans-serif; }
              .loading { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh; 
                background: #f9fafb;
              }
              .spinner {
                width: 32px;
                height: 32px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div id="root">
              <div class="loading">
                <div class="spinner"></div>
              </div>
            </div>
            <script>
              // Configure API base URL to use same origin
              window.API_BASE_URL = '';
            </script>
            <script type="module">
              // Inline the main React app bundle here
              // In production, you'd import from built assets
              import('./assets/index.js').catch(() => {
                document.getElementById('root').innerHTML = 
                  '<div style="text-align: center; padding: 2rem;"><h1>CloudCollect</h1><p>Loading application...</p></div>';
              });
            </script>
          </body>
        </html>
      `, {
        headers: {
          'Content-Type': 'text/html',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Server Error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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