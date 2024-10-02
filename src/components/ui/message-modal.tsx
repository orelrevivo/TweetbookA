import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@components/ui/button';
import { InputField } from '@components/input/input-field';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Record<string, string[]>; // userId to messages mapping
  currentUser: string;
  isMyProfile: boolean;
  onSendMessage: (recipient: string, message: string) => void;
}

export function MessageModal({ isOpen, onClose, messages = {}, currentUser, isMyProfile, onSendMessage }: MessageModalProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (selectedUser && messageInput.trim()) {
      onSendMessage(selectedUser, messageInput.trim());
      setMessageInput(''); // Clear the input
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-4 rounded-lg w-[400px] h-[400px] shadow-lg flex">
          {isMyProfile ? (
            <>
              <div className="w-1/3 border-r border-gray-300">
                <h2 className="text-lg font-bold mb-2">Users</h2>
                <ul>
                  {Object.keys(messages).map(userId => (
                    <li
                      key={userId}
                      className={`cursor-pointer p-2 ${selectedUser === userId ? 'bg-gray-200' : ''}`}
                      onClick={() => setSelectedUser(userId)}
                    >
                      User {userId}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-2/3 pl-4">
                {selectedUser && (
                  <>
                    <h2 className="text-lg font-bold mb-2">Messages with User {selectedUser}</h2>
                    <div className="border border-gray-300 p-2 h-[300px] overflow-y-auto">
                      {messages[selectedUser].map((msg, index) => (
                        <p key={index} className="mb-2">{msg}</p>
                      ))}
                    </div>
                    <InputField
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message"
                      className="mt-2"
                    />
                    <Button onClick={handleSendMessage} className="mt-2">Send</Button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <h2 className="text-lg font-bold mb-2">Send a Message</h2>
              <InputField
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
                className="mt-2"
              />
              <Button onClick={handleSendMessage} className="mt-2">Send</Button>
              <Button onClick={onClose} className="mt-2">Close</Button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
