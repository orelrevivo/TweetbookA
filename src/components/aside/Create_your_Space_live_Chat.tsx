import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@lib/context/auth-context';
import { Loading } from '@components/ui/loading';
import { sendMessage, subscribeToMessages } from '@lib/firebase/Create_your_Space_live_Chat'; // Import Firebase functions
import { CustomIcon } from '@components/ui/custom-icon'; // Import CustomIcon
import { Button } from '@components/ui/button'; // Import Button

export function CreateyourSpaceliveChat(): JSX.Element {
  const { currentUser, signInWithGoogle } = useAuth(); // Get current user info from your auth context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch messages in real-time using the subscribeToMessages function
  useEffect(() => {
    const unsubscribe = subscribeToMessages((fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        setError(''); // Clear any previous errors
        await sendMessage(currentUser.uid, currentUser.displayName, newMessage);
        setNewMessage(''); // Clear input after sending
      } catch (error) {
        setError('Failed to send message');
        console.error("Failed to send message:", error);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className='ADTweetbook2352 border-light-border dark:border-dark-border border-1 xs:border p-4'>
        <p>Please log in to use the chat.</p>
        <Button onClick={signInWithGoogle} className='mt-4 flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition active:bg-[#cccccc] dark:border-0 bg-main-background dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'>
          <CustomIcon iconName='GoogleIcon' /> Sign in with Google
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className='ADTweetbook border-light-border dark:border-dark-border border-1 xs:border p-4'>
        {loading ? (
          <Loading className='flex h-52 items-center justify-center' />
        ) : (
          <motion.div className='inner:px-4 inner:py-3'>
            {/* Error message display */}
            {error && <div className='text-red-500'>{error}</div>}
            
            {/* Live chat message list */}
            <div className='chat-messages'>
              {messages.map((message) => (
                <div key={message.id} className='message p-2'>
                  <strong>{message.username}:</strong> {message.text}
                </div>
              ))}
            </div>

            {/* Input form for sending messages */}
            <form onSubmit={handleSendMessage} className='mt-4'>
              <input
                type='text'
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder='Type a message...'
                className='border rounded px-4 py-2 w-full'
              />
              <button
                type='submit'
                className='bg-black text-white px-4 py-2 mt-2'
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </section>
    </div>
  );
}
