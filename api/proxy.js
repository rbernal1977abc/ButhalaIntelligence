// api/proxy.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { provider } = req.query;
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({ error: 'No API key' });
    }
    
    // Map providers
    const endpoints = {
      deepseek: 'https://api.deepseek.com/chat/completions',
      openai: 'https://api.openai.com/v1/chat/completions',
      grok: 'https://api.x.ai/v1/chat/completions'
    };
    
    const apiUrl = endpoints[provider];
    if (!apiUrl) return res.status(400).json({ error: 'Invalid provider' });
    
    // Forward request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
