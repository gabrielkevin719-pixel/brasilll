const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// SyncPay credentials - hardcoded for reliability
const SYNCPAY_CLIENT_ID = '3859949a-26e5-4e26-931f-381f203eed15';
const SYNCPAY_CLIENT_SECRET = 'd3cdd8bb-299f-4f7c-9021-b3c2753f3a2f';

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
  
  req.on('data', chunk => { body += chunk.toString(); });
  
  req.on('end', async () => {
    try {
      const data = JSON.parse(body);
      const { amount, productName, customerName, customerEmail, customerCpf } = data;

      // Step 1: Get auth token
      const authResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: SYNCPAY_CLIENT_ID,
          client_secret: SYNCPAY_CLIENT_SECRET,
        }),
      });

      if (!authResponse.ok) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Falha na autenticacao' }));
      }

      const authData = await authResponse.json();

      // Step 2: Create PIX charge
      const pixResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authData.access_token}`,
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
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'Falha ao gerar PIX' }));
      }

      const pixData = await pixResponse.json();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        pixCode: pixData.pix_code,
        transactionId: pixData.identifier,
      }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
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
        fs.readFile(path.join(__dirname, 'index.html'), (err2, content2) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content2);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === '/api/pix' && req.method === 'POST') {
    return handlePixApi(req, res);
  }

  serveStaticFile(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('PIX API: POST /api/pix');
});
