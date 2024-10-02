import { useState, useEffect } from 'react';
import { ReactElement, ReactNode } from 'react';
import { ProtectedLayout } from '@components/layout/common-layout-U';
import { MainLayout } from '@components/layout/main-layout-U';
import { createAdPost, fetchAdPosts, deleteAdPost } from '@lib/firebase/AD';

export default function AD(): JSX.Element {
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [deleteAfter, setDeleteAfter] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTextVisible, setIsTextVisible] = useState(false); // State for toggling text visibility

  const handleCreateAdPost = async () => {
    const postData = { link, text, deleteAfter };
    await createAdPost(postData, file);
    const newAds = await fetchAdPosts();
    setAds(newAds);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDeleteAd = async (postId: string) => {
    await deleteAdPost(postId);
    const updatedAds = ads.filter((ad) => ad.id !== postId);
    setAds(updatedAds);
  };

  useEffect(() => {
    const fetchAds = async () => {
      const fetchedAds = await fetchAdPosts();
      setAds(fetchedAds);
    };
    fetchAds();
    setCurrentUserId('currentUser123'); // Replace with real user ID fetching
  }, []);

  return (
    <div className='EnterADdiv'>
      <h1 className='TweetbookCreateadvancedText'>Create the best and most advanced ads with Tweetbook</h1>
      <input
        className='inputtextAD'
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter ad text"
      />
      <input
        className='inputtextAD'
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link"
      />
      <div className="flex items-center">
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="fileInputFile"
        >
          <span className='fileInputFiletexy'>Select File</span>
        </label>
      </div>
      <br />
      <div>
        <label htmlFor="deleteAfter" className="block mb-2">Delete after:</label>
        <select
          id="deleteAfter"
          className="block w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setDeleteAfter(parseInt(e.target.value))}
        >
          <option value="">Select duration</option>
          <option value="43200">30 Days</option>
          <option value="20160">2 Weeks</option>
          <option value="10080">1 Week</option>
          <option value="1440">1 Day</option>
        </select>
      </div>
      <br />
      <button className="fileInputFile2" onClick={handleCreateAdPost}>
        <span className='fileInputFiletexy2'>Create Ad</span>
      </button>
      
      <button
        className="fileInputFile23"
        onClick={() => setIsTextVisible(!isTextVisible)}
      >
        <span className='fileInputFiletexy2'>{isTextVisible ? 'Learn less about AD Tweetbook' : 'Learn more about AD Tweetbook'}</span>
      </button>
      {isTextVisible && (
        <div>
          <span className='TweetbookspanAD'>In Tweetbook, users can create posts that double as advertisements by</span>
          <br />
          <span className='TweetbookspanAD'>selecting the "Sponsored" option during the post creation process.</span>
          <br />
          <span className='TweetbookspanAD'>These ads feature a dedicated label and are prominently displayed</span>
          <br />
          <span className='TweetbookspanAD'>to reach a wider audience. With tailored targeting options, Tweetbook</span>
          <br />
          <span className='TweetbookspanAD'>ensures that sponsored content is shown to users who are most likely to engage with it.</span>
        </div>
      )}
    </div>
  );
}

AD.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
