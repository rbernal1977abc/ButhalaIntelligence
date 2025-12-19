// api/proxy.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// ✅ Enable CORS for your frontend domain
// Replace 'https://bathala-intelligence.vercel.app' with your actual Vercel URL
app.use(cors({
  origin: ['https://bathala-intelligence.vercel.app', 'http://localhost:3000'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ DeepSeek Proxy Endpoint
app.post('/proxy/deepseek/chat', async (req, res) => {
  try {
    const apiKey = req.headers.authorization; // Forward the key from frontend

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Bathala proxy is running' });
});

// ✅ Export for Vercel serverless function
export default app;
