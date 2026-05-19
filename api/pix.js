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

    if (!authRes.ok) {
      return res.status(500).json({ success: false, error: 'Falha na autenticacao' });
    }

    const { access_token } = await authRes.json();

    // Step 2: Create PIX
    const pixRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        amount,
        description: productName,
        client: {
          name: customerName,
          cpf: customerCpf.replace(/\D/g, ''),
          email: customerEmail,
          phone: '11999999999',
        },
      }),
    });

    if (!pixRes.ok) {
      return res.status(500).json({ success: false, error: 'Falha ao gerar PIX' });
    }

    const pixData = await pixRes.json();

    return res.status(200).json({
      success: true,
      pixCode: pixData.pix_code,
      transactionId: pixData.identifier,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
