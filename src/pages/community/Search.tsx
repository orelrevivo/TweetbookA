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

const SearchPage = (): JSX.Element => {
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
      <SEO title="Search Communities / Tweetbook" />
      <MainHeader className="flex items-center justify-between">
        <div className="-mb-1 flex flex-col">
          <h2 className="-mt-1 text-xl font-bold">Search Communities</h2>
          <p className="text-xs text-light-secondary dark:text-dark-secondary">Find your community</p>
        </div>
        <Button className='CreateBtnPost222' onClick={() => window.history.back()}>
          <HeroIcon
            className='h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary'
            iconName='ArrowLeftIcon'
          />
        </Button>
      </MainHeader>

      <div className='relative mt-4'>
        <label
          className=' group flex items-center justify-between gap-4 rounded-[30px]
                      px-4 py-2 transition
                     focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border'
          style={{ width: '95%', height: '50px', transform: 'translateX(13px)', top: '0px' }}
        >
          <HeroIcon
            className='h-5 w-5 text-light-secondary transition-colors 
              group-focus-within:text-main-accent dark:text-dark-secondary'
            iconName='MagnifyingGlassIcon'
          />
          <input
            type="text"
            placeholder="Search communities"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
            className="peer flex-1 bg-transparent outline-none 
              placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            ref={inputRef}
          />
          <Button
            className={cn(
              'accent-tab scale-50 bg-main-accent p-1 opacity-0 transition hover:brightness-90 disabled:opacity-0',
              searchTerm &&
                'focus:scale-100 focus:opacity-100 peer-focus:scale-100 peer-focus:opacity-100'
            )}
            onClick={clearInputValue}
            disabled={!searchTerm}
          >
            <HeroIcon className='h-3 w-3 stroke-white' iconName='XMarkIcon' />
          </Button>
        </label>
        {showDropdown && (
          <div className='absolute top-[50px] left-0 right-0 mt-2 menu-container'>
            <div className='p-4'>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className='cursor-pointer custom-button accent-tab hover-card block w-full text-main-accent'
                    style={{ borderRadius: '0' }} // Setting border-radius to zero
                    onClick={handleSelect(group.id)}
                  >
                    {group.name}
                  </div>
                ))
              ) : (
                <p className='informationAccountSettingsUScss'>No communities found matching your search</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="results mt-6">
        <h2 className="-mt-1 text-xl font-bold DiscoverCommunities">Discover Communities</h2>
        <hr />
        {filteredGroups.length > 0 ? (
          <ul className="group-list">
            {filteredGroups.map((group) => (
              <li
                key={group.id}
                className={cn('group-item', 'flex items-center p-4 border-b border-gray-200 dark:border-dark-divider cursor-pointer')}
                onClick={() => handleGroupClick(group.id)}
              >
                {/* <img src={group.imageUrl || '/default-group-image.png'} alt={${group.name} Image} className="w-16 h-16 rounded-full mr-4" /> */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{group.bio || 'No description available'}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-center text-gray-500'>No community found matching your search.</p>
        )}
      </div>
      </div>
      </div>
  );
};

SearchPage.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

export default SearchPage;






















// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '@lib/context/auth-context';
// import { SEO } from '@components/common/seo';
// import { MainHeader } from '@components/home/main-header';
// import { MainContainer } from '@components/home/main-container-me2';
// import { Button } from '@components/ui/button';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { getGroups, deleteGroup } from '@lib/firebase/utils'; // Import deleteGroup function
// import cn from 'clsx';
// import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
// import { MainLayout } from '@components/layout/main-layout';
// import type { ReactElement, ReactNode } from 'react';

// const SearchPage = (): JSX.Element => {
//   const { user } = useAuth();
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [groups, setGroups] = useState<any[]>([]);
//   const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     async function fetchGroups() {
//       if (user) {
//         try {
//           const fetchedGroups = await getGroups();
//           // Ensure all groups have the required properties
//           const validatedGroups = fetchedGroups.filter((group: any) => 
//             group && typeof group.name === 'string' && typeof group.id === 'string'
//           );
//           setGroups(validatedGroups);
//           setFilteredGroups(validatedGroups);
//         } catch (error) {
//           console.error('Error fetching groups:', error);
//         }
//       }
//     }
//     fetchGroups();
//   }, [user]);

//   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value.toLowerCase();
//     setSearchTerm(query);

//     if (query.trim()) {
//       const filtered = groups.filter((group) => 
//         group.name?.toLowerCase().includes(query) // Safely access name property
//       );
//       setFilteredGroups(filtered);
//     } else {
//       setFilteredGroups(groups);
//     }
//   };

//   const handleGroupClick = (groupId: string) => {
//     router.push(`/community/${groupId}`);
//   };

//   const handleDelete = async (groupId: string) => {
//     if (confirm('Are you sure you want to delete this group?')) {
//       try {
//         await deleteGroup(groupId); // Call the delete function from Firebase utils
//         // Remove the group from the state
//         const updatedGroups = groups.filter(group => group.id !== groupId);
//         setGroups(updatedGroups);
//         setFilteredGroups(updatedGroups);
//       } catch (error) {
//         console.error('Error deleting group:', error);
//       }
//     }
//   };

//   return (
//     <MainContainer className='SearchPage'>
//       <SEO title="Search Communities / Tweetbook" />
//       <MainHeader className="flex items-center justify-between">
//         <div className="-mb-1 flex flex-col">
//           <h2 className="-mt-1 text-xl font-bold">Search Communities</h2>
//           <p className="text-xs text-light-secondary dark:text-dark-secondary">Find your community</p>
//         </div>
//         <Button className='CreateBtnPost222' onClick={() => window.history.back()}>
//           <HeroIcon
//             className='h-5 w-5 text-light-secondary transition-colors group-focus-within:text-main-accent dark:text-dark-secondary'
//             iconName='ArrowLeftIcon'
//           />
//         </Button>
//       </MainHeader>

//       <div className="search-bar mt-4">
//         <label
//           className='group flex items-center justify-between gap-4 rounded-[30px]
//             bg-main-search-background px-4 py-2 transition bg-main-sidebar-background
//             focus-within:ring-2 focus-within:ring-main-accent'
//           style={{ width: '95%', height: '50px', transform: 'translateX(13px)' }}
//         >
//           <HeroIcon
//             className='h-5 w-5 text-light-secondary transition-colors 
//               group-focus-within:text-main-accent dark:text-dark-secondary'
//             iconName='MagnifyingGlassIcon'
//           />
//           <input
//             type="text"
//             placeholder="Search communities"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="peer flex-1 bg-transparent outline-none 
//               placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
//           />
//         </label>
//       </div>

//       <div className="results mt-6">
//         {filteredGroups.length > 0 ? (
//           <ul className="group-list">
//             {filteredGroups.map((group) => (
//               <li
//                 key={group.id}
//                 className={cn('group-item', 'flex items-center p-4 border-b border-gray-200 dark:border-dark-divider')}
//               >
//                 <img src={group.imageUrl || '/default-group-image.png'} alt={`${group.name} Image`} className="w-16 h-16 rounded-full mr-4" />
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold">{group.name}</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">{group.bio || 'No description available'}</p>
//                 </div>
//                 <Button
//                   className="ml-4 bg-red-500 text-white"
//                   onClick={() => handleDelete(group.id)}
//                 >
//                   Delete
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No groups found matching your search.</p>
//         )}
//       </div>
//     </MainContainer>
//   );
// };

// SearchPage.getLayout = (page: ReactElement): ReactNode => (
//   <ProtectedLayout>
//     <MainLayout>
//       <HomeLayout>{page}</HomeLayout>
//     </MainLayout>
//   </ProtectedLayout>
// );

// export default SearchPage;
