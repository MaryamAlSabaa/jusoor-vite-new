export const ExerciseChatbotAPI = {
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_CHATBASE_API_KEY}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          chatId: conversationId || `exercise-${Date.now()}`,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Chatbase API error');
      }

      const data = await response.json();
      return {
        success: true,
        response: data.text,
        conversationId: data.chatId
      };
    } catch (error) {
      console.error('Chatbase error:', error);
      return {
        success: false,
        response: "I'm having trouble connecting. Please try simple seated stretches or deep breathing for 5-10 minutes.",
        conversationId: null
      };
    }
  }
};