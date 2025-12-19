export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  try {
    const { provider } = request.query;
    const { authorization } = request.headers;
    
    if (!authorization) {
      return response.status(401).json({ error: 'No API key provided' });
    }
    
    // Map providers to their API endpoints
    const endpoints = {
      deepseek: 'https://api.deepseek.com/chat/completions',
      openai: 'https://api.openai.com/v1/chat/completions',
      grok: 'https://api.x.ai/v1/chat/completions'
    };
    
    const apiUrl = endpoints[provider];
    
    if (!apiUrl) {
      return response.status(400).json({ error: 'Invalid provider' });
    }
    
    // Forward the request to the actual API
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.body)
    });
    
    const data = await apiResponse.json();
    
    // Return the API response
    response.status(apiResponse.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    response.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
