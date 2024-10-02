import { useState, useEffect, useMemo } from 'react';
import cn from 'clsx';
import { manageRetweet, manageLike, manageView } from '@lib/firebase/utils'; // Add manageView
import { ViewTweetStats } from '@components/view/view-tweet-stats';
import { TweetOption } from './tweet-option';
import { TweetShare } from './tweet-share';
import { Tweettip } from './tweet-tip';
import type { Tweet } from '@lib/types/tweet';
import { ToolTip } from '@components/ui/tooltip';

type TweetStatsProps = Pick<
  Tweet,
  'userLikes' | 'userRetweets' | 'userReplies'
> & {
  reply?: boolean;
  userId: string;
  isOwner: boolean;
  tweetId: string;
  viewTweet?: boolean;
  openModal?: () => void;
  viewCount: number;
  banned?: boolean;
};

export function TweetStats({
  reply,
  userId,
  isOwner,
  tweetId,
  userLikes,
  viewTweet,
  userRetweets,
  userReplies: totalReplies,
  openModal,
  viewCount,
  banned = false
}: TweetStatsProps): JSX.Element {
  const totalLikes = userLikes.length;
  const totalTweets = userRetweets.length;

  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });

  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  }, [totalReplies, totalLikes, totalTweets]);

  const replyMove = useMemo(
    () => (totalReplies > currentReplies ? -25 : 25),
    [totalReplies]
  );

  const likeMove = useMemo(
    () => (totalLikes > currentLikes ? -25 : 25),
    [totalLikes]
  );

  const tweetMove = useMemo(
    () => (totalTweets > currentTweets ? -25 : 25),
    [totalTweets]
  );

  const tweetIsLiked = userLikes.includes(userId);
  const tweetIsRetweeted = userRetweets.includes(userId);

  const isStatsVisible = !!(totalReplies || totalTweets || totalLikes);

  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const openAnalyticsModal = () => {
    setShowAnalyticsModal(true);
  };

  const closeAnalyticsModal = () => {
    setShowAnalyticsModal(false);
  };

  // Initialize viewCount and handle view increment when viewing the tweet
  const [views, setViews] = useState<number>(viewCount);

  useEffect(() => {
    if (viewTweet) {
      manageView(tweetId, userId);
    }
  }, [viewTweet, tweetId, userId]);

  useEffect(() => {
    // Simulate view count update
    if (viewTweet) {
      const interval = setInterval(() => {
        setViews((prev) => prev + 1);
      }, 1000); // Increment view count every second

      return () => clearInterval(interval);
    }
  }, [viewTweet]);

  return (
    <>
      {showAnalyticsModal && (
        <div className="bg-main-background analytics-modal-overlay">
          <div className="bg-main-background analytics-modal">
            <button className="analytics-modal-close" onClick={closeAnalyticsModal}>
              x
            </button>
            <div className="bg-main-background analytics-modal-content">
              <div className="analytics-view-count">
                <span className="analytics-view-count-label">Views</span>
                <span className="analytics-view-count-number">{views}</span>
              </div>
              <div className="analytics-modal-description">
                Times this post was seen by unique users. To learn more, visit the Help Center.
              </div>
              <button className="analytics-modal-dismiss" onClick={closeAnalyticsModal}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {viewTweet && (
        <ViewTweetStats
          likeMove={likeMove}
          userLikes={userLikes}
          tweetMove={tweetMove}
          replyMove={replyMove}
          userRetweets={userRetweets}
          currentLikes={currentLikes}
          currentTweets={currentTweets}
          currentReplies={currentReplies}
          isStatsVisible={isStatsVisible}
        />
      )}

      <div className={cn(
        'tweet-statsBtn2 flex text-light-secondary inner:outline-none dark:text-dark-secondary',
        viewTweet ? 'justify-around py-2' : 'max-w-md justify-between',
        banned && 'pointer-events-none opacity-70'
      )}>
        <TweetOption
          className='hover:text-accent-blue focus-visible:text-accent-blue'
          iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
          tip='Reply'
          move={replyMove}
          stats={currentReplies}
          iconName='ChatBubbleOvalLeftIcon'
          viewTweet={viewTweet}
          onClick={banned ? undefined : openModal}
          disabled={reply || banned}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-green focus-visible:text-accent-green',
            tweetIsRetweeted && 'text-accent-green [&>i>svg]:[stroke-width:2px]',
            banned && 'pointer-events-none opacity-70'
          )}
          iconClassName='group-hover:bg-accent-green/10 group-active:bg-accent-green/20 group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80'
          tip={tweetIsRetweeted ? 'Undo Repost' : 'Reposted'}
          move={tweetMove}
          stats={currentTweets}
          iconName='ArrowPathRoundedSquareIcon'
          viewTweet={viewTweet}
          onClick={banned ? undefined : manageRetweet(
            tweetIsRetweeted ? 'unretweet' : 'retweet',
            userId,
            tweetId
          )}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
            tweetIsLiked && 'text-accent-pink [&>i>svg]:fill-accent-pink',
            banned && 'pointer-events-none opacity-70'
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20 group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={tweetIsLiked ? 'Unlike' : 'Like'}
          move={likeMove}
          stats={currentLikes}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={banned ? undefined : manageLike(
            tweetIsLiked ? 'unlike' : 'like',
            userId,
            tweetId
          )}
        />
        <Tweettip userId={userId} tweetId={tweetId} viewTweet={viewTweet} />
        {/* <TweetShare userId={userId} tweetId={tweetId} viewTweet={viewTweet} /> */}
        {/* {isOwner && (
          <TweetOption
            className='hover:text-accent-blue focus-visible:text-accent-blue'
            iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
            tip='Analytics'
            iconName='ChartPieIcon'
            onClick={banned ? undefined : openAnalyticsModal}
          />
        )} */}
          <TweetOption
            className='viewCountviewTweetOption hover:text-accent-blue focus-visible:text-accent-blue'
            iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
            tip='Analytics'
            iconName='ChartPieIcon'
            stats={views}  // Updated to use the state `views`
            onClick={banned ? undefined : openAnalyticsModal}
          />
        {/* <span onClick={banned ? undefined : openAnalyticsModal} className="viewCountview hover:text-accent-blue focus-visible:text-accent-blue">
          {views}
          </span>  */} {/* Updated to use the state `views` */}
      </div>
    </>
  );
}
