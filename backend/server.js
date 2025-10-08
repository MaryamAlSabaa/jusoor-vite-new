import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from Vite frontend
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Example endpoint for ChatBase
app.post('/api/chatbase', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_CHATBASE_API_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        chatId: 'ms-exercise-session-' + Date.now(),
        stream: false,
        temperature: 0.3,
        agentId: 'Y9zixn6pCzoMCP9cdYdx1'
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'ChatBase API error' });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(5000, () => console.log('Backend server running at http://localhost:5000'));
