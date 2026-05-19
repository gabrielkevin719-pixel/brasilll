// Vercel Serverless Function for PIX API
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Credentials
  const CLIENT_ID = '3859949a-26e5-4e26-931f-381f203eed15';
  const CLIENT_SECRET = 'd3cdd8bb-299f-4f7c-9021-b3c2753f3a2f';

  try {
    const { amount, productName, customerName, customerEmail, customerCpf } = req.body;

    // Step 1: Auth
    const authRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
    });

    const authData = await authRes.json();
    
    if (!authRes.ok || !authData.access_token) {
      console.log('[PIX API] Auth failed:', JSON.stringify(authData));
      return res.status(500).json({ success: false, error: 'Falha na autenticacao', details: authData });
    }

    const accessToken = authData.access_token;

    // Step 2: Create PIX
    const pixRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        description: productName,
        client: {
          name: customerName,
          cpf: customerCpf.replace(/\D/g, ''),
          email: customerEmail,
          phone: '11999999999',
        },
      }),
    });

    const pixData = await pixRes.json();
    
    console.log('[PIX API] PIX response:', JSON.stringify(pixData));

    if (!pixRes.ok) {
      return res.status(500).json({ success: false, error: 'Falha ao gerar PIX', details: pixData });
    }

    // Try different field names that SyncPay might use
    const pixCode = pixData.pix_code || pixData.pixCode || pixData.qr_code || pixData.qrcode || pixData.emv || pixData.copy_paste || pixData.brcode || '';
    const transactionId = pixData.identifier || pixData.id || pixData.transaction_id || pixData.txid || '';

    return res.status(200).json({
      success: true,
      pixCode: pixCode,
      transactionId: transactionId,
      rawResponse: pixData, // Include raw response for debugging
    });

  } catch (error) {
    console.log('[PIX API] Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
