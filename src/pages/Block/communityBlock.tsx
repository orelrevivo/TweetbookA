import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@lib/context/auth-context';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container-me2';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { getGroups } from '@lib/firebase/utils';
import cn from 'clsx';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import type { ReactElement, ReactNode } from 'react';

const communityBlock = (): JSX.Element => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchGroups() {
      if (user) {
        try {
          const fetchedGroups = await getGroups();
          // Ensure all groups have the required properties
          const validatedGroups = fetchedGroups.filter((group: any) => 
            group && typeof group.name === 'string' && typeof group.id === 'string'
          );
          setGroups(validatedGroups);
          setFilteredGroups(validatedGroups);
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      }
    }
    fetchGroups();
  }, [user]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = groups.filter((group) => 
        group.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Safely access name property
      );
      setFilteredGroups(filtered);
      setShowDropdown(true);
    } else {
      setFilteredGroups(groups);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/community/${groupId}`);
  };

  const handleSelect = (groupId: string) => (): void => {
    setSearchTerm('');
    setShowDropdown(false);
    handleGroupClick(groupId);
  };

  const clearInputValue = () => {
    setSearchTerm('');
    setFilteredGroups(groups);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  return (
    <div className={cn(
      `hover-animation flex min-h-screen w-full max-w-xl flex-col`,
    )}>
    <div className='InputisMobile2'>
        
      </div>
      </div>
  );
};

communityBlock.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

export default communityBlock;