// api/proxy.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Extract provider from URL path
    const path = req.url || '';
    let provider = '';
    
    if (path.includes('/deepseek')) provider = 'deepseek';
    else if (path.includes('/openai')) provider = 'openai';
    else if (path.includes('/grok')) provider = 'grok';
    
    if (!provider) {
      return res.status(400).json({ error: 'Provider not specified in URL path' });
    }
    
    const { authorization } = req.headers;
    
    if (!authorization) {
      return res.status(401).json({ error: 'No API key provided' });
    }
    
    // Map providers to their actual API endpoints
    const endpoints = {
      deepseek: 'https://api.deepseek.com/chat/completions',
      openai: 'https://api.openai.com/v1/chat/completions',
      grok: 'https://api.x.ai/v1/chat/completions'
    };
    
    const apiUrl = endpoints[provider];
    
    if (!apiUrl) {
      return res.status(400).json({ error: 'Invalid provider' });
    }
    
    // Forward the request to the actual API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    
    // Return the API response
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message,
      note: 'Make sure your API key is valid and you have credits'
    });
  }
}
