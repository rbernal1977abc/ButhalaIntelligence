// api/proxy.js - COMPLETE VERSION
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// ✅ Enable CORS for your frontend domain
// Update with your actual Vercel URL
const ALLOWED_ORIGINS = [
  'https://bathala-intelligence.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500' // For local testing with Live Server
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ DEEPSEEK PROXY
app.post('/proxy/deepseek/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('DeepSeek proxy error:', error);
    res.status(500).json({ error: 'DeepSeek proxy failed' });
  }
});

// ✅ OPENAI PROXY
app.post('/proxy/openai/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI proxy error:', error);
    res.status(500).json({ error: 'OpenAI proxy failed' });
  }
});

// ✅ GROK PROXY
app.post('/proxy/grok/chat', async (req, res) => {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Grok proxy error:', error);
    res.status(500).json({ error: 'Grok proxy failed' });
  }
});

// ✅ TEST ENDPOINTS (for connection testing)
app.get('/proxy/deepseek/models', async (req, res) => {
  try {
    const response = await fetch('https://api.deepseek.com/models', {
      headers: { 'Authorization': req.headers.authorization }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('DeepSeek models error:', error);
    res.status(500).json({ error: 'DeepSeek models endpoint failed' });
  }
});

app.get('/proxy/openai/models', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': req.headers.authorization }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI models error:', error);
    res.status(500).json({ error: 'OpenAI models endpoint failed' });
  }
});

app.get('/proxy/grok/models', async (req, res) => {
  try {
    const response = await fetch('https://api.x.ai/v1/models', {
      headers: { 'Authorization': req.headers.authorization }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Grok models error:', error);
    res.status(500).json({ error: 'Grok models endpoint failed' });
  }
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Bathala Proxy Server Running',
    endpoints: {
      deepseek: '/proxy/deepseek/chat',
      openai: '/proxy/openai/chat',
      grok: '/proxy/grok/chat',
      models: '/proxy/[provider]/models'
    }
  });
});

// ✅ Handle preflight requests
app.options('*', cors());

export default app;
