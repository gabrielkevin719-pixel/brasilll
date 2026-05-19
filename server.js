const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from Vercel share
const envFiles = [
  '/vercel/share/.env.project',
  '/vercel/share/.env.snowflake',
  '.env',
  '.env.local'
];

envFiles.forEach(envFile => {
  try {
    const envPath = envFile.startsWith('/') ? envFile : path.join(__dirname, envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  } catch (e) {
    // Ignore errors loading env files
  }
});

const PORT = process.env.PORT || 3000;

// Debug: Log loaded credentials (masked)
console.log('[v0] SYNCPAY_CLIENT_ID:', process.env.SYNCPAY_CLIENT_ID ? process.env.SYNCPAY_CLIENT_ID.substring(0, 10) + '...' : 'NOT FOUND');
console.log('[v0] SYNCPAY_CLIENT_SECRET:', process.env.SYNCPAY_CLIENT_SECRET ? process.env.SYNCPAY_CLIENT_SECRET.substring(0, 10) + '...' : 'NOT FOUND');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// PIX API Handler
async function handlePixApi(req, res) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      const { amount, productName, customerName, customerEmail, customerCpf } = JSON.parse(body);
      
      const clientId = process.env.SYNCPAY_CLIENT_ID;
      const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        console.error('[SyncPay] Credenciais nao configuradas');
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Credenciais PIX nao configuradas. Configure SYNCPAY_CLIENT_ID e SYNCPAY_CLIENT_SECRET.' }));
      }

      // Get auth token - CORRECT ENDPOINT
      const authResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('[SyncPay Auth Error]', authResponse.status, errorText);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Falha na autenticacao com SyncPay. Verifique suas credenciais.' }));
      }

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      // Create PIX charge - CORRECT ENDPOINT
      const pixResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: amount,
          description: productName,
          client: {
            name: customerName,
            cpf: customerCpf.replace(/\D/g, ''),
            email: customerEmail,
            phone: '11999999999',
          },
        }),
      });

      if (!pixResponse.ok) {
        const errorText = await pixResponse.text();
        console.error('[SyncPay PIX Error]', errorText);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Falha ao gerar PIX' }));
      }

      const pixData = await pixResponse.json();
      
      console.log('[v0] PIX Response:', JSON.stringify(pixData));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        pixCode: pixData.pix_code,
        transactionId: pixData.identifier,
      }));

    } catch (error) {
      console.error('[Server Error]', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
    }
  });
}

// Static file server
function serveStaticFile(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Create server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Route to API
  if (req.url === '/api/pix' && req.method === 'POST') {
    return handlePixApi(req, res);
  }

  // Serve static files
  serveStaticFile(req, res);
});

server.listen(PORT, () => {
  const address = server.address();
  console.log(`Server running at http://localhost:${address.port}`);
});
