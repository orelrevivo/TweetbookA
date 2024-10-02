import React, { useState } from 'react';
import axios from 'axios';
import type { ReactElement, ReactNode } from 'react';
import { HeroIcon } from '@components/ui/hero-icon';

// Define a list of 10 different error messages
const errorMessages = [
  'Network error. Please try again later.',
  'Server not responding. Check your connection.',
  'Invalid request format.',
  'Authentication failed. Please log in again.',
  'Quota exceeded. Try again in a few minutes.',
  'Unexpected server error. Please contact support.',
  'API rate limit exceeded. Slow down.',
  'Resource not found. Please check the URL.',
  'Failed to parse response. Try again.',
  'Unknown error occurred. Please try again later.'
];

const ChatComponent = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);
  const [errorIndex, setErrorIndex] = useState(0); // Track which error message to show
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show spinner

    // Append user message to the list inside a distinct square
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'user', text: input }
    ]);

    try {
      const result = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003', // Adjust model name as needed
        prompt: input,
        max_tokens: 150, // Adjust max_tokens based on your needs
      }, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY`,
          'Content-Type': 'application/json'
        }
      });

      // Append AI response to the list
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: result.data.choices[0]?.text || 'No response from API' }
      ]);
    } catch (err) {
      // Set a different error message each time
      const error = err as any;
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'ai', text: errorMessages[errorIndex] }
      ]);

      // Update errorIndex to cycle through messages
      setErrorIndex((prevIndex) => (prevIndex + 1) % errorMessages.length);
    } finally {
      setTimeout(() => setLoading(false), 3000); // Hide spinner after 3 seconds
    }
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`error424 ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className='chatgptBotTweetbook'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Correspond with Tweetbook AI"
        />
        <button className='button1234' type="submit">
          <HeroIcon className='h-5 w-5' iconName='PaperAirplaneIcon' />
        </button>
      </form>
      {loading && <div className="spinner"></div>} {/* Show spinner when loading */}
    </div>
  );
};

export default ChatComponent;
