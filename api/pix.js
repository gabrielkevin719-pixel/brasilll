export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, productName, customerName, customerEmail, customerCpf } = req.body;
    
    // Credentials with fallback
    const clientId = (process.env.SYNCPAY_CLIENT_ID || '3859949a-26e5-4e26-931f-381f203eed15').trim();
    const clientSecret = (process.env.SYNCPAY_CLIENT_SECRET || 'd3cdd8bb-299f-4f7c-9021-b3c2753f3a2f').trim();

    // Get auth token - CORRECT ENDPOINT
    const authResponse = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
    });

    if (!authResponse.ok) {
      return res.status(500).json({ error: 'Falha na autenticacao com SyncPay' });
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
      return res.status(500).json({ error: 'Falha ao gerar PIX: ' + errorText });
    }

    const pixData = await pixResponse.json();

    return res.status(200).json({
      success: true,
      pixCode: pixData.pix_code,
      transactionId: pixData.identifier,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
