import { useState, useEffect, ChangeEvent, ReactElement, ReactNode } from 'react';
import { useAuth } from '@lib/context/auth-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { Button } from '@components/ui/button';
import { CustomIcon } from '@components/ui/custom-icon';
import { useRouter } from 'next/router';
import { createOrUpdateList, getListsByUser, deleteList, searchListsByName } from '../lib/firebaseService'; // Adjust path as needed
import type { List } from '../lib/firebaseService'; // Ensure correct import path for List type

export default function UserLists(): JSX.Element {
  const { user, signInWithGoogle } = useAuth();
  const [listName, setListName] = useState<string>('');
  const [listBio, setListBio] = useState<string>(''); // State for the bio
  const [lists, setLists] = useState<List[]>([]);
  const [filteredLists, setFilteredLists] = useState<List[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showSquare, setShowSquare] = useState<boolean>(false); // State for toggling the square
  const [showCreateButton, setShowCreateButton] = useState<boolean>(true); // State for button visibility
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (user) {
      loadUserLists(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (query.listId) {
      // Fetch list details based on listId if available in query
      // For now, we'll assume a function fetchListDetails is available
      // fetchListDetails(query.listId as string);
    }
  }, [query.listId]);

  useEffect(() => {
    if (searchQuery) {
      filterLists(searchQuery);
    } else {
      setFilteredLists(lists);
    }
  }, [searchQuery, lists]);

  const loadUserLists = async (userId: string) => {
    try {
      const userLists = await getListsByUser(userId);
      setLists(userLists);
      setFilteredLists(userLists); // Initialize filteredLists with all user lists
    } catch (error) {
      console.error("Failed to load user lists", error);
    }
  };

  const filterLists = async (query: string) => {
    try {
      const filtered = await searchListsByName(query);
      setFilteredLists(filtered);
    } catch (error) {
      console.error("Failed to filter lists", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/user-lists'); // Redirect to user lists page
    } catch (error) {
      console.error("Sign in with Google failed", error);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleCreateList = async () => {
    if (user && listName && listBio.length <= 100) {
      try {
        await createOrUpdateList(Date.now().toString(), listName, user.id, imageFile, listBio);
        setListName('');
        setListBio(''); // Clear the bio input
        setImageFile(null);
        loadUserLists(user.id); // Refresh the list
      } catch (error) {
        console.error("Failed to create list", error);
      }
    } else if (listBio.length > 100) {
      alert("Bio can only be up to 100 characters.");
    }
  };

  const handleListClick = (listId: string) => {
    router.push({
      pathname: '/user-lists',
      query: { listId },
    });
  };

  const handleBackClick = () => {
    router.push('/user-lists');
  };

  const toggleSquare = () => {
    setShowSquare(!showSquare);
    setShowCreateButton(!showCreateButton); // Toggle the button visibility
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleDeleteClick = async (event: React.MouseEvent<HTMLButtonElement>, listId: string) => {
    event.stopPropagation(); // Prevents the click from affecting the list item
    try {
      // Assuming deleteList is a function that deletes a list from the database
      await deleteList(listId);
      setLists(prevLists => prevLists.filter(list => list.id !== listId));
      setFilteredLists(prevLists => prevLists.filter(list => list.id !== listId));
    } catch (error) {
      console.error("Failed to delete list", error);
    }
  };

  return (
    <MainContainer>
      <SEO title="User Lists / Tweetbook" />
      <div className="flex-1 ml-4 md:ml-0">
        <MainHeader className="flex items-center justify-between">
          <div className="-mb-1 flex flex-col">
            <h2 className="-mt-1 text-xl font-bold">User Lists</h2>
            <p className="text-xs text-light-secondary dark:text-dark-secondary">Manage your lists</p>
          </div>
        </MainHeader>
        <div className="flex flex-col items-center mt-6">
          {showCreateButton && (
            <Button onClick={toggleSquare} className='lists-buttond23'>
              Create a new list
            </Button>
          )}
          <div className="box-you-Lists">
            <br />
            <h4 className="Yourtex43 text-lg font-bold">Your Lists</h4>
            <input
              className='textListssdasw2'
              type="text"
              placeholder='Search for existing listings?'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {filteredLists.length === 0 ? (
              <span className='WhenYou324'>You haven't created or followed any Lists. When you do, they'll show up here.</span>
            ) : (
              <ul>
                {filteredLists.map(list => (
                  <li key={list.id} className="listYour-button" onClick={() => handleListClick(list.id)}>
                    {list.name}
                    {list.imageUrl && <img src={list.imageUrl} alt="List Image" className="w-16 h-16 object-cover rounded-full mt-2" />}
                    <p className="text-sm text-gray-600 mt-2">{list.bio}</p> {/* Display the bio */}
                    <button
                      onClick={(e) => handleDeleteClick(e, list.id)}
                      className="Deletefassg2 ml-2 text-red-500 hover:text-red-700"
                      aria-label="Delete List"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {showSquare && (
            <div className="box2424 bg-main-background relative w-full max-w-md mx-auto p-4 border border-gray-300 rounded-lg">
              <button
                onClick={toggleSquare}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                X
              </button>
              <h3 className="text-lg font-bold">Create a List</h3>
              <div className="mb-4">
                <label htmlFor="list-name" className="block text-sm font-medium text-gray-700">List Name:</label>
                <input
                  placeholder='List Name'
                  type="text"
                  id="list-name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-main-background"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="list-bio" className="block text-sm font-medium text-gray-700">Bio:</label>
                <input
                  placeholder='Bio'
                  type="text"
                  id="list-bio"
                  value={listBio}
                  onChange={(e) => setListBio(e.target.value)}
                  maxLength={100} // Limit to 100 characters
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-main-background"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="list-image" className="block text-sm font-medium text-gray-700">Upload Image:</label>
                <input
                  type="file"
                  id="list-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleCreateList}
                className='flexitems-center535'
              >
                Create List
              </Button>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
       Top ↑?
      </button>
    </MainContainer>
  );
}
UserLists.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);

// import { useAuth } from '@lib/context/auth-context';
// import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
// import { MainLayout } from '@components/layout/main-layout';
// import { SEO } from '@components/common/seo';
// import { MainHeader } from '@components/home/main-header';
// import { MainContainer } from '@components/home/main-container';
// import { Button } from '@components/ui/button';
// import { CustomIcon } from '@components/ui/custom-icon';
// import { useRouter } from 'next/router';
// import type { ReactElement, ReactNode } from 'react';

// export default function Lists(): JSX.Element {
//   const { user, signInWithGoogle } = useAuth();
//   const router = useRouter();

//   const handleSignInWithGoogle = async () => {
//     try {
//       await signInWithGoogle();
//       // Redirect to a new page after successful login
//       router.push('/your-new-page'); // Change '/your-new-page' to your desired route
//     } catch (error) {
//       console.error("Sign in with Google failed", error);
//     }
//   };

//   if (!user) {
//     // Render the Google Sign-In button if the user is not authenticated
//     return (
//       <MainContainer>
//         <SEO title="Login / Tweetbook" />
//         <div className="flex-1 ml-4 md:ml-0 flex flex-col items-center justify-center h-screen">
//           <MainHeader className="flex items-center justify-between">
//             <div className="-mb-1 flex flex-col">
//               <h2 className="-mt-1 text-xl font-bold">Login</h2>
//               <p className="text-xs text-light-secondary dark:text-dark-secondary">Sign in to continue</p>
//             </div>
//           </MainHeader>
//           <div className="flex flex-col items-center mt-6">
//             <Button
//               className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
//                 hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
//                 dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
//               onClick={handleSignInWithGoogle}
//             >
//               <CustomIcon iconName='GoogleIcon' /> Sign in with Google
//             </Button>
//           </div>
//         </div>
//       </MainContainer>
//     );
//   }

//   // Render the original content if the user is authenticated
//   return (
//     <MainContainer>
//             <br />
//             <br />
//             <br />
//       <SEO title="Lists / Tweetbook" />
//       {/* Sidebar */}
//       {/* Main content */}
//       <div className="flex-1 ml-4 md:ml-0">
//         <MainHeader className="flex items-center justify-between">
//           <div className="-mb-1 flex flex-col">
//             <h2 className="-mt-1 text-xl font-bold">Lists</h2>
//             <p className="text-xs text-light-secondary dark:text-dark-secondary">Your chosen username: @{user?.username}</p>
//           </div>
//         </MainHeader>
//       </div>
//     </MainContainer>
//   );
// }

// Lists.getLayout = (page: ReactElement): ReactNode => (
//   <ProtectedLayout>
//     <MainLayout>
//       <HomeLayout>{page}</HomeLayout>
//     </MainLayout>
//   </ProtectedLayout>
// );