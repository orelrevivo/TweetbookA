import React, { useEffect, useState } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';

import { useRouter } from 'next/router';
export default function Ads(): JSX.Element {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // New state for search query
  const [groups, setGroups] = useState<any[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAllGroups, setShowAllGroups] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<string | null>(null); // State to manage group options visibility
  const router = useRouter();

  return (
    <MainContainer>
      <SEO title="User Lists / Tweetbook" />
      <MainHeader className="flex items-center justify-between">
        <div className="-mb-1 flex flex-col">
          <h2 className="-mt-1 text-xl font-bold">Ads - Page</h2>
          <p className="text-xs text-light-secondary dark:text-dark-secondary">Manage your Ads</p>
        </div>
      </MainHeader>

    </MainContainer>
  );
}

// Wrapping the page with layouts
Ads.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};