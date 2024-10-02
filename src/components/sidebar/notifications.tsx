import { useEffect, useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import type { ReactElement, ReactNode } from 'react';

export default function Notifications(): JSX.Element {
  const { user } = useAuth();
  const userId = user?.id as string;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch(`/api/notifications?userId=${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, [userId]);

  return (
    <MainContainer>
      <SEO title="Notifications / Tweetbook" />
      <div className="flex-1 ml-4 md:ml-0">
        <MainHeader className="flex items-center justify-between">
          <div className="-mb-1 flex flex-col">
            <h2 className="-mt-1 text-xl font-bold">Notifications</h2>
            <p className="text-xs text-light-secondary dark:text-dark-secondary">
              Your chosen username: @{user?.username}
            </p>
          </div>
        </MainHeader>

        {isLoading ? (
          <p>Loading notifications...</p>
        ) : (
          <div className="mt-4">
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li key={notification.id} className="p-4 border border-light-secondary rounded-lg">
                    <p className="font-semibold">{notification.type}</p>
                    <p>{notification.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications yet.</p>
            )}
          </div>
        )}
      </div>
    </MainContainer>
  );
}

Notifications.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);


// import { useEffect, useState } from "react";
// import { useAuth } from '@lib/context/auth-context';
// import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
// import { MainLayout } from '@components/layout/main-layout';
// import { SEO } from '@components/common/seo';
// import { MainHeader } from '@components/home/main-header';
// import { MainContainer } from '@components/home/main-container';
// import type { ReactElement, ReactNode } from 'react';

// export default function Notifications(): JSX.Element {
//   const { user } = useAuth();
//   const userId = user?.id as string;

//   const [notifications, setNotifications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         // Simulate API call to fetch notifications
//         const response = await fetch(`/api/notifications?userId=${userId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch notifications');
//         }
//         const data = await response.json();
//         setNotifications(data.notifications);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//         setIsLoading(false);
//       }
//     };

//     fetchNotifications();

//     // Simulate real-time updates (replace with actual socket or real-time API)
//     const socket = new WebSocket("ws://localhost:5000");
//     socket.onmessage = (event) => {
//       const newNotification = JSON.parse(event.data);
//       setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
//     };

//     return () => {
//       socket.close();
//     };
//   }, [userId]);

//   const displayNotification = (notification) => {
//     let action;
//     switch (notification.type) {
//       case 'like':
//         action = 'liked your post.';
//         break;
//       case 'comment':
//         action = 'commented on your post.';
//         break;
//       case 'save':
//         action = 'saved your post.';
//         break;
//       case 'follow':
//         action = 'started following you.';
//         break;
//       default:
//         action = '';
//     }
//     return (
//       <div key={notification.id} className="notification-item">
//         <span className="notification">{`${notification.senderName} ${action}`}</span>
//       </div>
//     );
//   };

//   return (
//     <MainContainer>
//       <SEO title="Notifications / Tweetbook" />
//       <div className="flex-1 ml-4 md:ml-0">
//         <MainHeader className="flex items-center justify-between">
//           <div className="-mb-1 flex flex-col">
//             <h2 className="-mt-1 text-xl font-bold">Notifications</h2>
//             <p className="text-xs text-light-secondary dark:text-dark-secondary">Your chosen username: @{user?.username}</p>
//           </div>
//         </MainHeader>

//         <section className="mt-4 flex flex-col items-center">
//           {isLoading ? (
//             <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center">
//               <p className="text-gray-600">Loading</p>
//               <div className="loading-dots ml-2">
//                 <div className="dot"></div>
//                 <div className="dot"></div>
//                 <div className="dot"></div>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//               {notifications.length > 0 ? (
//                 notifications.map((n) => displayNotification(n))
//               ) : (
//                 <p className="text-gray-600">No notifications to show.</p>
//               )}
//             </div>
//           )}
//         </section>
//       </div>
//     </MainContainer>
//   );
// }

// Notifications.getLayout = (page: ReactElement): ReactNode => (
//   <ProtectedLayout>
//     <MainLayout>
//       <HomeLayout>{page}</HomeLayout>
//     </MainLayout>
//   </ProtectedLayout>
// );
