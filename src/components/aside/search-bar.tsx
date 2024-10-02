import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { query, collection, where, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../../lib/firebase/app'; // Adjust the import path as needed
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import cn from 'clsx';

export function SearchBar(): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue.length > 0) {
      const fetchResults = async () => {
        const usersRef = collection(db, 'users');
        const userQuery = query(
          usersRef,
          orderBy('username'),
          startAt(inputValue.toLowerCase()),
          endAt(inputValue.toLowerCase() + '\uf8ff')
        );

        try {
          const querySnapshot = await getDocs(userQuery);
          const results: string[] = querySnapshot.docs.map(doc => doc.data().username);
          setSearchResults(results);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchResults();
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [inputValue]);

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue) void push(`/Search?query=${inputValue}`);
  };

  const clearInputValue = (focus?: boolean) => (): void => {
    if (focus) inputRef.current?.focus();
    else inputRef.current?.blur();
    setInputValue('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleEscape = ({ key }: KeyboardEvent<HTMLInputElement>): void => {
    if (key === 'Escape') clearInputValue()();
  };

  const handleSelect = (username: string) => (): void => {
    setInputValue(username);
    setSearchResults([]);
    setShowDropdown(false);
    void push(`/user/${username}`); // Navigate to the user's profile or desired page
  };
  // Line 5709
  return (
    <div className='search-bar123 sticky top-6 flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-dark-secondary'>
      <form
        className='hover-animation sticky top-0 z-10 -my-2 py-2'
        onSubmit={handleSubmit}
      >
        {/* TweetbookSearch */}
        <label
        className='group flex items-center justify-between gap-4 rounded-full
                   bg-main-search-background px-4 py-2 focus-within:bg-main-background
                   focus-within:ring-2 focus-within:ring-main-accent h-[40px]'
      >
          <i>
            <HeroIcon
              className='h-5 w-5 text-light-secondary transition-colors 
                         group-focus-within:text-main-accent dark:text-dark-secondary'
              iconName='MagnifyingGlassIcon'
            />
          </i>
          <input
            className='TweetbookSearchinput peer flex-1 bg-transparent outline-none 
                       placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
            type='text'
            placeholder='Search Tweetbook'
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            onKeyUp={handleEscape}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
          />
          <Button
            className={cn(
              'accent-tab scale-50 bg-main-accent p-1 opacity-0 transition hover:brightness-90 disabled:opacity-0',
              inputValue &&
                'focus:scale-100 focus:opacity-100 peer-focus:scale-100 peer-focus:opacity-100'
            )}
            onClick={clearInputValue(true)}
            disabled={!inputValue}
          >
            <HeroIcon className='h-3 w-3 stroke-white' iconName='XMarkIcon' />
          </Button>
        </label>
        {showDropdown && (
          <div className='absolute top-[44px] right-[0] mt-2 menu-container w-[100%]'>
            <div className='p-4'>
              {searchResults.length > 0 ? (
                searchResults.map((username) => (
                  <div
                    key={username}
                    className='cursor-pointer custom-button accent-tab hover-card block w-full text-main-accent'
                    style={{ borderRadius: '0' }} // Setting border-radius to zero
                    onClick={handleSelect(username)}
                  >
                    {username}
                  </div>
                ))
              ) : (
                <p className='informationAccountSettingsUScss'>Try searching for people, lists, or keywords</p>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}





// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
// import { query, collection, where, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
// import { db } from '../../lib/firebase/app'; // Adjust the import path as needed
// import { HeroIcon } from '@components/ui/hero-icon';
// import { Button } from '@components/ui/button';
// import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
// import cn from 'clsx';

// export function SearchBar(): JSX.Element {
//   const [inputValue, setInputValue] = useState('');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchResults, setSearchResults] = useState<string[]>([]);
//   const { push } = useRouter();
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (inputValue.length > 0) {
//       const fetchResults = async () => {
//         const usersRef = collection(db, 'users');
//         const userQuery = query(
//           usersRef,
//           orderBy('username'),
//           startAt(inputValue.toLowerCase()),
//           endAt(inputValue.toLowerCase() + '\uf8ff')
//         );

//         try {
//           const querySnapshot = await getDocs(userQuery);
//           const results: string[] = querySnapshot.docs.map(doc => doc.data().username);
//           setSearchResults(results);
//         } catch (error) {
//           console.error('Error fetching users:', error);
//         }
//       };

//       fetchResults();
//       setShowDropdown(true);
//     } else {
//       setSearchResults([]);
//       setShowDropdown(false);
//     }
//   }, [inputValue]);

//   const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
//     setInputValue(value);
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
//     if (inputValue) void push(`/Search?query=${inputValue}`);
//   };

//   const clearInputValue = (focus?: boolean) => (): void => {
//     if (focus) inputRef.current?.focus();
//     else inputRef.current?.blur();
//     setInputValue('');
//     setSearchResults([]);
//     setShowDropdown(false);
//   };

//   const handleEscape = ({ key }: KeyboardEvent<HTMLInputElement>): void => {
//     if (key === 'Escape') clearInputValue()();
//   };

//   const handleSelect = (username: string) => (): void => {
//     setInputValue(username);
//     setSearchResults([]);
//     setShowDropdown(false);
//     void push(`/user/${username}`); // Navigate to the user's profile or desired page
//   };

//   return (
//     <div className='TweetbookSearch sticky top-6 flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-dark-secondary'>
//       <form
//         className=''
//         onSubmit={handleSubmit}
//       >
//         <label
//           className=' group flex items-center justify-between gap-4 rounded-[30px]
//                       px-4 py-2 
//                      focus-within:ring-2 focus-within:ring-main-accent border-light-border dark:border-dark-border border-1 xs:border'
//         >
//           <i>
//             <HeroIcon
//               className='h-5 w-5 text-light-secondary transition-colors 
//                          group-focus-within:text-main-accent dark:text-dark-secondary'
//               iconName='MagnifyingGlassIcon'
//             />
//           </i>
//           <input
//             className='TweetbookSearchinput peer flex-1 bg-transparent outline-none 
//                        placeholder:text-light-secondary dark:placeholder:text-dark-secondary'
//             type='text'
//             placeholder='Search Tweetbook'
//             ref={inputRef}
//             value={inputValue}
//             onChange={handleChange}
//             onKeyUp={handleEscape}
//             onFocus={() => setShowDropdown(true)}
//             onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
//           />
//           <Button
//             className={cn(
//               'accent-tab scale-50 bg-main-accent p-1 opacity-0 transition hover:brightness-90 disabled:opacity-0',
//               inputValue &&
//                 'focus:scale-100 focus:opacity-100 peer-focus:scale-100 peer-focus:opacity-100'
//             )}
//             onClick={clearInputValue(true)}
//             disabled={!inputValue}
//           >
//             <HeroIcon className='h-3 w-3 stroke-white' iconName='XMarkIcon' />
//           </Button>
//         </label>
//         {showDropdown && (
//           <div className='absolute top-[35px] left-0 right-0 mt-2 menu-container'>
//             <div className='p-4'>
//               {searchResults.length > 0 ? (
//                 searchResults.map((username) => (
//                   <div
//                     key={username}
//                     className='cursor-pointer custom-button accent-tab hover-card block w-full text-main-accent'
//                     style={{ borderRadius: '0' }} // Setting border-radius to zero
//                     onClick={handleSelect(username)}
//                   >
//                     {username}
//                   </div>
//                 ))
//               ) : (
//                 <p className='informationAccountSettingsUScss'>Try searching for people, lists, or keywords</p>
//               )}
//             </div>
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }
