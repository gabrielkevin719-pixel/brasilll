export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, productName, customerName, customerEmail, customerCpf } = req.body;

    // Get auth token
    const authResponse = await fetch('https://api.syncpayments.com.br/auth/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.SYNCPAY_CLIENT_ID,
        client_secret: process.env.SYNCPAY_CLIENT_SECRET,
      }),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('[SyncPay Auth Error]', errorText);
      return res.status(500).json({ error: 'Falha na autenticacao' });
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
        amount: Math.round(amount * 100), // Convert to cents
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
      return res.status(500).json({ error: 'Falha ao gerar PIX' });
    }

    const pixData = await pixResponse.json();

    return res.status(200).json({
      success: true,
      qrCode: pixData.qr_code || pixData.qrcode,
      qrCodeBase64: pixData.qr_code_base64 || pixData.qrcode_base64,
      pixCode: pixData.pix_code || pixData.emv || pixData.copy_paste,
      transactionId: pixData.id || pixData.transaction_id,
      expiresAt: pixData.expires_at,
    });

  } catch (error) {
    console.error('[SyncPay Error]', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
