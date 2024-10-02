import React, { useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { createOrUpdateGroup, getGroups, addMemberToGroup } from '@lib/firebase/utils';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { MainContainer } from '@components/home/main-container-me2';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import {
  getGroupMessages,
  uploadImage,
  createPost,
  addComment,
  manageLike,
} from '@lib/firebase/post';
import cn from 'clsx';

export default function VerifiedCommunities(): JSX.Element {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // State for description
  const [groups, setGroups] = useState<any[]>([]);

  const handleCreateGroup = async () => {
    if (user && groupName.trim() && description.trim()) {
      try {
        const groupId = await createOrUpdateGroup(user, groupName, description); // Pass description
        await addMemberToGroup(groupId, user); // Add the creator as a member
        const newGroups = await getGroups();
        setGroups(newGroups);
        setGroupName(''); // Clear the input
        setDescription(''); // Clear the description input
      } catch (error) {
        console.error('Error creating group:', error);
      }
    } else {
      console.error('User is not authenticated or group name/description is missing.');
    }
  };

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
    <div className='InputisMobile2'>
      <div className="MainContainer">
        <MainHeader className="flex items-center justify-between">
          <div className="-mb-1 flex flex-col">
            <h2 className="-mt-1 text-xl font-bold">Create a New Community</h2>
            <p className="text-xs text-light-secondary dark:text-dark-secondary">Manage your Community</p>
          </div>
          <Button className='CreateBtnPost222' onClick={() => window.history.back()}>
            <HeroIcon
              className='h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary'
              iconName='ArrowLeftIcon'
            />
          </Button>
        </MainHeader>
        <div className="GroupBorder2 mt-4 p-4">
          <label className='GroupBorder214 group flex items-center justify-between gap-4 rounded-[5px] px-4 py-2 transition focus-within:ring-2 focus-within:ring-main-accent'>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            />
          </label>
          <br />
          <label className='GroupBorder214 group flex items-center justify-between gap-4 rounded-[5px] px-4 py-2 transition focus-within:ring-2 focus-within:ring-main-accent'>
            <input
              type="text"
              placeholder="Enter group description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            />
          </label>
          <Button className='CreateBtnPost22222' onClick={handleCreateGroup}>
            <HeroIcon
              className='h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary'
              iconName='PaperAirplaneIcon'
            />
          </Button>
        </div>
      </div>
      </div>
      </div>
  );
}

VerifiedCommunities.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
