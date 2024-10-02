import { useEffect, useState, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase/app';
import { useAuth } from '@lib/context/auth-context';
import { MainLayout } from '@components/layout/main-layout';
import { ProtectedLayout } from '@components/layout/common-layout';
import { Button } from '@components/ui/button';

export default function Chat(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const { user } = useAuth();
  const userId = user?.id as string;

  useEffect(() => {
    if (!id) return;

    const chatId = [userId, id].sort().join('-');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [id, userId]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !id) return;

    const chatId = [userId, id].sort().join('-');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    
    await addDoc(messagesRef, {
      senderId: userId,
      receiverId: id,
      text: messageText,
      createdAt: new Date(),
    });

    setMessageText('');
  };

  return (
    <div className="w-full p-4">
      <div className="chat-window">
        <h2 className="text-xl font-semibold">Chat with {id}</h2>
        <div className="messages mt-4 h-80 overflow-y-auto">
          {messages.map((msg, index) => (
            <p key={index} className="messagestext p-2 my-1">
              {msg.text}
            </p>
          ))}
        </div>
        <input
          type="text"
          className="borderMessagesinput2 w-full p-2 mt-4 border rounded"
          placeholder="Start a new message"
          value={messageText}
          onChange={(e) => setMessageText(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
}

Chat.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
