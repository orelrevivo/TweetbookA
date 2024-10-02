import React, { useState } from 'react';
import { likeAdPost, blockAdPost, unblockAdPost, reportAdPost, deleteAdPost } from '@lib/firebase/AD'; // Import deleteAdPost
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import cn from 'clsx';

type AdProps = {
  ad: {
    id: string;
    link: string;
    text: string;
    imageUrl?: string;
    creatorId?: string;
    likes?: number;
  };
  userId: string; // User ID for block functionality
};

const PostAD: React.FC<AdProps> = ({ ad, userId }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [likeCount, setLikeCount] = useState(ad.likes || 0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReported, setIsReported] = useState(false);

  // Toggle menu visibility
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  // Handle like button click
  const handleLike = async () => {
    await likeAdPost(ad.id);
    setLikeCount((prevCount) => prevCount + 1);
  };

  // Handle block button click
  const handleBlock = async () => {
    await blockAdPost(userId, ad.id);
    setIsBlocked(true);
  };

  // Handle unblock button click
  const handleUnblock = async () => {
    await unblockAdPost(userId, ad.id);
    setIsBlocked(false);
  };

  // Handle report button click
  const handleReport = async () => {
    await reportAdPost(ad.id, 'Inappropriate content');
    setIsReported(true);
  };

  // Handle delete button click
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this ad?")) {
      await deleteAdPost(ad.id); // Call delete function from your Firebase file
      alert("Ad deleted successfully");
      // Optionally, you can trigger a re-fetch of ads or remove the deleted ad from the UI here
    }
  };

  // Close the menu
  const closeMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuVisible(false);
  };

  return (
    <div className='Postarticlemotion accent-tab hover-card relative flex-col 
             gap-y-4 px-4 py-3 outline-none duration-200  border-light-border dark:border-dark-border border-1 xs:border' style={{ position: 'relative', marginBottom: '20px' }}>
      {/* Three-dot button at the top right corner */}
      <button
        onClick={toggleMenu}
        className={cn(
          `buttonasdad main-tab group group absolute top-2 right-2 p-2 
           hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
           focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20`
        )}
      >
        <HeroIcon
          className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                     group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
          iconName='EllipsisHorizontalIcon'
        />
        {!open && <ToolTip tip='More' />}
      </button>
      <span className={cn(`buttonasdad main-tab group group absolute top-2 right-7 p-2`)}>AD</span>

      {/* Menu when visible */}
      {menuVisible && (
        <div className='BORDERASD'>
          <button onClick={closeMenu} className="">❌</button>
          <div className="ad-center-title">My Ad Center</div>
          <div className='ChangeclassNameh12'>
            <h1 className='ChangeclassNameh1'>Change how often you get this ad</h1>
            <span className='LikeUnblock23'>This ad is based on your previous interactions with the advertiser on their website, on Google services, or offline. For example, you may have visited its website, clicked its ad on Tweetbook, or bought something. To stop seeing this ad, you can block it.</span>
          </div>
          <button onClick={handleLike} className="report-button232"><span className='LikeUnblock'>👍 Like</span> ({likeCount})</button>
          {isBlocked ? (
            <button onClick={handleUnblock} className="report-button232"><span className='LikeUnblock'>🔓 Unblock Ad</span></button>
          ) : (
            <button onClick={handleBlock} className="report-button232"><span className='LikeUnblock'>🚫 Block Ad</span></button>
          )}
          {isReported ? (
            <button className="report-button232"><span className='LikeUnblock'>📝 Reported</span></button>
          ) : (
            <button onClick={handleReport} className="report-button232"><span className='LikeUnblock'>🚨 Report Ad</span></button>
          )}
          
          {/* Delete Button */}
          {/* <button onClick={handleDelete} className="delete-button">
            🗑️ Delete Ad
          </button> */}

          <button className='Customizesee'>Customize more of the ads you see <img src="https://fonts.gstatic.com/s/i/short-term/release/youtube_fill/svg/open_new_24px.svg" className="a59eQcimdgsge a59eQc-Xhs9z-SU0ZEf-Bz112c-RxTQ8e" role="presentation" alt=""></img></button>
        </div>
      )}

      <p>{ad.text}</p>
      {ad.imageUrl && <img src={ad.imageUrl} alt="Ad Image" />}
     <div className='sdgssfdhsdgsedsegg'>
     <button className='ViewPostSite' onClick={() => window.open(ad.link, '_blank')}>
        View Site
      </button>
      <button onClick={handleLike} className="ViewPostSite2"><HeroIcon className='HeartIcon' iconName='HeartIcon' /><span className='HeartIcon2'>{likeCount}</span></button>
     </div>
    </div>
  );
};

export default PostAD;
