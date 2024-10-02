import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container-home';
import { ProtectedLayout, HomeLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout2';
import { HeroIcon } from '@components/ui/hero-icon';
import { useState, useEffect, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore'; // Updated this line
import { db } from '../../lib/firebase/app';
import { Button } from '@components/ui/button';
import { StatsEmpty } from '@components/Post/stats-empty';
import debounce from 'lodash/debounce';
import { UserCard } from '@components/user/user_card2';
import { MainHeader } from '@components/home/main-header';

export default function Chat(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [messageText, setMessageText] = useState('');
    const router = useRouter();
    const { user } = useAuth();
    const userId = user?.id as string;
    const selectedUserId = router.query.userId as string;

    // State for scroll arrow functionality
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const fetchUsers = async (term: string) => {
            const usersRef = collection(db, 'users');
            const lowerCaseTerm = term.toLowerCase();
            const q = query(usersRef, where('username', '>=', lowerCaseTerm), where('username', '<=', lowerCaseTerm + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            const usersList = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id,
            }));
            setUsers(usersList);
        };

        const debouncedFetchUsers = debounce((term: string) => {
            if (term.trim() !== '') {
                fetchUsers(term);
            }
        }, 300);

        debouncedFetchUsers(searchTerm);
        return () => debouncedFetchUsers.cancel();
    }, [searchTerm]);

    useEffect(() => {
        const fetchSelectedUser = async (userId: string) => {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setSelectedUser({ uid: userSnap.id, ...userSnap.data() });
            } else {
                console.error("No such user!");
            }
        };

        if (selectedUserId) {
            fetchSelectedUser(selectedUserId);
        }
    }, [selectedUserId]);

    useEffect(() => {
        if (selectedUserId && userId) {
            const chatId = [userId, selectedUserId].sort().join('-');
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            const q = query(messagesRef, orderBy('createdAt', 'asc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(msgs);
            });

            return () => unsubscribe();
        }
    }, [selectedUserId, userId]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedUserId) return;

        const chatId = [userId, selectedUserId].sort().join('-');
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        await addDoc(messagesRef, {
            senderId: userId,
            receiverId: selectedUserId,
            text: messageText,
            createdAt: new Date(),
        });

        setMessageText('');
    };

    // Scroll to the bottom or top based on the current position
    const handleScroll = () => {
        if (isAtBottom) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        setIsAtBottom(!isAtBottom);
    };

    // Check scroll position to toggle the arrow direction
    useEffect(() => {
        const handleScrollEvent = () => {
            const isUserAtBottom = (window.innerHeight + window.scrollY) >= document.body.scrollHeight - 10;
            setIsAtBottom(isUserAtBottom);
        };

        window.addEventListener('scroll', handleScrollEvent);
        return () => window.removeEventListener('scroll', handleScrollEvent);
    }, []);

    return (
        <MainContainer>
            <div className="flex flex-col">
                <MainHeader className='ForyouFollowingdgojes flex items-center justify-between'>
                    <Button className='SubscribeButtoUnblockn12422 text-main-accent dark-bg-tab min-w-[36px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent focus-visible:border-accent dark:border-light-secondary dark:text-light-border
                        dark-bg-tab group relative border border-light-line-reply p-2
                        hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                        dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20' onClick={() => window.history.back()}>
                        <HeroIcon className='iodfueuhfedsfe h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary' iconName='ArrowLeftIcon' />
                    </Button>
                </MainHeader>
                {selectedUser && (
                    <div className="flex items-center notificationSettingsBoxSettingsUScss2222 accent-tab hover-card">
                        <div className='UserCardclassName'>
                            <UserCard
                                id={selectedUser.uid}
                                bio={selectedUser.bio}
                                name={selectedUser.name}
                                username={selectedUser.username}
                                verified={selectedUser.verified}
                                photoURL={selectedUser.photoURL}
                            />
                        </div>
                    </div>
                )}

                <div className="chat-window">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <p 
                                key={msg.id} 
                                className={`p-2 my-1 rounded-md ${
                                    msg.senderId === userId ? 
                                    'TextMfefsfdfef2 border-light-border dark:border-dark-border border-1 xs:border' : 
                                    'TextMfefsfdfef border-light-border dark:border-dark-border border-1 xs:border'
                                }`}
                            >
                                {msg.text}
                            </p>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            {/* <StatsEmpty
                                title="No messages yet."
                                description="Connect with users for more engaging conversations and a better overall experience."
                            /> */}
                        </p>
                    )}
                </div>
            </div>
            <div className='border-light-border dark:border-dark-border border-1 xs:border'></div>
            <label className="inputDisplay13fdfew">
                
            <Button
                    onClick={handleScroll}
                    className="SubscribeButtoUnblockn124224334 text-main-accent dark-bg-tab min-w-[36px] self-start border border-light-line-reply px-4 py-1.5 font-bold hover:border-accent focus-visible:border-accent dark:border-light-secondary dark:text-light-border
                        dark-bg-tab group relative border border-light-line-reply p-2
                        hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary 
                        dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20 bg-main-background"
                    >
                    <HeroIcon className='iodfueuhfedsfe h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary' iconName={isAtBottom ? 'ArrowUpIcon' : 'ArrowDownIcon'} />
            </Button>
            </label>
            <label className="inputDisplay13 group flex items-center gap-4 p-2 border rounded-md focus-within:ring-2 
                focus-within:ring-main-accent border-light-border dark:border-dark-border bg-main-background">
                <input
                    type="text"
                    className="flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
                    placeholder="Start a new message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.currentTarget.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSendMessage();
                        }
                    }}
                />
            </label>
        </MainContainer>
    );
}

Chat.getLayout = (page: ReactElement): ReactNode => (
    <ProtectedLayout>
        <MainLayout>
            <HomeLayout>{page}</HomeLayout>
        </MainLayout>
    </ProtectedLayout>
);
