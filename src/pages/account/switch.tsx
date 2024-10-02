import React, { useEffect, useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container-me2';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/router';
import { createOrUpdateGroup, getGroups, addMemberToGroup } from '@lib/firebase/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import { UserCard } from '@components/user/user_card22';

export default function Groups(): JSX.Element {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [commentText, setCommentText] = useState<string>(''); 
  const [commentPostId, setCommentPostId] = useState<string | null>(null);

  return (
    <MainContainer className='InputisMobile2'>
      <SEO title="User Lists / Tweetbook" />
      <MainHeader className="flex items-center justify-between">
        <div className="-mb-1 flex flex-col">
          <h2 className="-mt-1 text-xl font-bold">Accounts</h2>
          <p className="text-xs text-light-secondary dark:text-dark-secondary">Manage your Accounts</p>
        </div>
        <Button className='CreateBtnPost222' onClick={() => window.history.back()}>
          <HeroIcon className='h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary' iconName='ArrowLeftIcon' />
        </Button>
      </MainHeader>
      <UserCard
       id={user.uid}
      bio={user.bio}
       name={user.name}
      username={user.username}
       verified={user.verified}
         photoURL={user.photoURL}
                />
      <br />
      <hr  className="post-item p-4 border-light-border dark:border-dark-border border-1 xs:border"
            style={{
              borderTop: 'none', // Replace with actual color or variable
              borderLeft: 'none',
              borderRight: 'none',
            }}/>
      {/* Display Posts */}
      <div className="posts-list mt-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No accounts to see here.</p>
        ) : (
       <div>

       </div>
        )}
      </div>
    </MainContainer>
  );
}

Groups.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>
        <HomeLayout>{page}</HomeLayout>
      </MainLayout>
    </ProtectedLayout>
  );
};
