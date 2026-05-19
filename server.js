const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

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

      // Get auth token
      const authResponse = await fetch('https://api.syncpayments.com.br/auth/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.SYNCPAY_CLIENT_ID,
          client_secret: process.env.SYNCPAY_CLIENT_SECRET,
        }),
      });

      if (!authResponse.ok) {
        const errorText = await authResponse.text();
        console.error('[SyncPay Auth Error]', errorText);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Falha na autenticacao' }));
      }

      const authData = await authResponse.json();
      const accessToken = authData.access_token;

      // Create PIX charge
      const pixResponse = await fetch('https://api.syncpayments.com.br/api/v1/pix/cash-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          description: productName,
          external_id: `order_${Date.now()}`,
          payer: {
            name: customerName,
            email: customerEmail,
            document: customerCpf.replace(/\D/g, ''),
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        qrCode: pixData.qr_code || pixData.qrcode,
        qrCodeBase64: pixData.qr_code_base64 || pixData.qrcode_base64,
        pixCode: pixData.pix_code || pixData.emv || pixData.copy_paste,
        transactionId: pixData.id || pixData.transaction_id,
        expiresAt: pixData.expires_at,
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
