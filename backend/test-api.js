import dotenv from 'dotenv';
dotenv.config();

console.log('🔑 Testing ChatBase API Key...');
console.log('API Key exists:', !!process.env.VITE_CHATBASE_API_KEY);
console.log('API Key length:', process.env.VITE_CHATBASE_API_KEY?.length);
console.log('API Key starts with:', process.env.VITE_CHATBASE_API_KEY?.substring(0, 10) + '...');

// Test the API key with correct format
const testApiKey = async () => {
  try {
    const payload = {
      messages: [
        { 
          role: "user", 
          content: "Hello, please recommend one safe seated exercise for someone with Multiple Sclerosis and fatigue level 6 out of 10." 
        }
      ],
      chatId: "test-" + Date.now(),
      stream: false,
      temperature: 0.1
    };

    console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://www.chatbase.co/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_CHATBASE_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('📄 Response body:', text);

    if (response.ok) {
      console.log('✅ SUCCESS: API key is working!');
    } else {
      console.log('❌ FAILED: API key or request format issue');
    }

  } catch (error) {
    console.error('💥 Error:', error.message);
  }
};

testApiKey();
EOF