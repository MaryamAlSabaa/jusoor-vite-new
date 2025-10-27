import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// REAL ChatBase API endpoint with better error handling
app.post('/api/chatbase', async (req, res) => {
  try {
    const { prompt, userData, checkInData, userResponses } = req.body;

    console.log('🚀 Calling REAL ChatBase API...');
    console.log('🔑 API Key exists:', !!process.env.VITE_CHATBASE_API_KEY);
    console.log('📝 Prompt length:', prompt?.length);
    console.log('👤 Has user data:', !!userData);
    console.log('📊 Has check-in data:', !!checkInData);

    if (!process.env.VITE_CHATBASE_API_KEY) {
      console.error('❌ MISSING API KEY');
      return res.status(500).json({ 
        error: 'Server configuration error: Missing ChatBase API key',
        solution: 'Check your .env file in the backend folder'
      });
    }

    // Validate API key format
    const apiKey = process.env.VITE_CHATBASE_API_KEY.trim();
    if (apiKey.length < 10) {
      console.error('❌ INVALID API KEY LENGTH');
      return res.status(500).json({ 
        error: 'Invalid API key format',
        solution: 'Get a valid API key from chatbase.co'
      });
    }

    console.log('🔑 API Key format OK, length:', apiKey.length);

    // ChatBase API payload
    const payload = {
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      chatbotId: "Y9zixn6pCzoMCP9cdYdx1",
      stream: false,
      temperature: 0.1
    };

    console.log('📤 Sending to ChatBase...');
    console.log('🤖 Chatbot ID:', payload.chatbotId);

    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Jusoor-MS-App/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 ChatBase response status:', response.status);
    console.log('📡 Response OK:', response.ok);

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.text();
      } catch {
        errorDetails = 'Could not read error response';
      }
      
      console.error('❌ ChatBase API error details:', {
        status: response.status,
        statusText: response.statusText,
        details: errorDetails
      });

      // Provide helpful error messages based on status code
      let userMessage = `ChatBase API error: ${response.status}`;
      let solution = 'Please try again later';

      if (response.status === 401) {
        userMessage = 'Invalid API key';
        solution = 'Check your ChatBase API key in the .env file';
      } else if (response.status === 429) {
        userMessage = 'Rate limit exceeded';
        solution = 'You have reached your API limit. Please try again later or upgrade your plan';
      } else if (response.status === 500) {
        userMessage = 'ChatBase server error';
        solution = 'ChatBase is experiencing issues. Please try again later';
      }

      return res.status(response.status).json({ 
        error: userMessage,
        details: errorDetails,
        solution: solution
      });
    }

    const data = await response.json();
    console.log('✅ REAL ChatBase API SUCCESS!');
    console.log('💬 Response type:', typeof data);
    console.log('💬 Response keys:', Object.keys(data));
    
    res.json(data);

  } catch (err) {
    console.error('💥 Server error:', err);
    console.error('💥 Error stack:', err.stack);
    
    res.status(500).json({ 
      error: 'Server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

app.listen(5000, () => {
  console.log('🚀 Backend server running at http://localhost:5000');
  console.log('🔑 API Key loaded:', !!process.env.VITE_CHATBASE_API_KEY);
  console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
});
