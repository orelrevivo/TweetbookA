import { useState, useEffect } from 'react';
import { formatDate } from '@lib/date';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { UserName } from './user-name';
import { UserFollowing } from './user-following';
import { UserFollowStats } from './user-follow-stats';
import type { IconName } from '@components/ui/hero-icon';
import type { User } from '@lib/types/user';
import { UpdateUsername } from '@components/home/update-username';
import { Button } from '@components/ui/button';
import cn from 'clsx';
import { useRouter } from 'next/router';

type UserDetailsProps = Pick<
  User,
  | 'id'
  | 'bio'
  | 'name'
  | 'website'
  | 'username'
  | 'location'
  | 'verified'
  | 'createdAt'
  | 'following'
  | 'followers'
>;

type DetailIcon = [string | null, IconName];

function DetailsModal({
  id,
  bio,
  name,
  website,
  username,
  location,
  verified,
  createdAt,
  following,
  followers,
  onClose
}: UserDetailsProps & { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500 milliseconds

    return () => clearTimeout(timer);
  }, []);

  const detailIcons: Readonly<DetailIcon[]> = [
    [location, 'MapPinIcon'],
    [website, 'LinkIcon'],
    [`Joined ${formatDate(createdAt, 'joined')}`, 'CalendarDaysIcon']
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative h-[600px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <HeroIcon iconName="XMarkIcon" className="h-6 w-6" />
            </button>

            {/* About Section */}
            <div className="mb-4">
              <h2 className="text-lg font-bold">About</h2>
              {bio && <p className="whitespace-pre-line break-words">{bio}</p>}
            </div>

            {/* Links Section */}
            <div className="mb-4">
              <h2 className="text-lg font-bold">Links</h2>
              <div className="flex flex-col gap-2">
                <a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-main-accent"
                >
                  <HeroIcon iconName="LinkIcon" className="h-5 w-5" />
                  {website}
                </a>
                {/* Add more links here */}
              </div>
            </div>

            {/* Channel Details Section */}
            <div>
              <h2 className="text-lg font-bold">Channel details</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary dark:text-dark-secondary">
                {detailIcons.map(
                  ([detail, icon], index) =>
                    detail && (
                      <div className="flex items-center gap-1" key={icon}>
                        <i>
                          <HeroIcon className="h-5 w-5" iconName={icon} />
                        </i>
                        {index === 1 ? (
                          <a
                            className="custom-underline text-main-accent"
                            href={`https://${detail}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail}
                          </a>
                        ) : index === 2 ? (
                          <button className="custom-underline group relative">
                            {detail}
                            <ToolTip
                              className="translate-y-1"
                              tip={formatDate(createdAt, 'full')}
                            />
                          </button>
                        ) : (
                          <p>{detail}</p>
                        )}
                      </div>
                    )
                )}
              </div>
              <br />
                <UserFollowStats following={following} followers={followers} />    
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function UserDetails({
  id,
  bio,
  name,
  website,
  username,
  location,
  verified,
  createdAt,
  following,
  followers
}: UserDetailsProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const handleDisplaySettingsClickCogIcon = () => {
    router.push('/premium'); // Updated path to the correct destination
  }
  const detailIcons: Readonly<DetailIcon[]> = [
    [location, 'MapPinIcon'],
    [website, 'LinkIcon'],
    [`Joined ${formatDate(createdAt, 'joined')}`, 'CalendarDaysIcon']
  ];
  return (
    <>
      <div>
        <div className="block lg:hidden">
          {/* <UserName
            className="-mb-1 text-xl"
            name={name}
            iconClassName="w-6 h-6"
            verified={verified}
          /> */}
          <div className="flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
            <p>@{username}</p>
            <UserFollowing userTargetId={id} />
          </div>
          <UserFollowStats following={following} followers={followers} />
        </div>
        <div className="hidden lg:block">
          <UserName
            className="-mb-1 text-xl"
            name={name}
            iconClassName="w-6 h-6"
            verified={verified}
          />
         <p>@{username}</p>
          {!verified && (  
            <Button
              className={cn(
                'Message-button322 dark-bg-tab self-start border border-light-line-reply px-4 py-1.5 font-bold hover:bg-light-primary/10 active:bg-light-primary/20 dark:border-light-secondary dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
              )}
              onClick={handleDisplaySettingsClickCogIcon}
            >
              <p className="btnH12Pfggsgse222">
              <svg
                className='svgclassName722'
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            width: '18px',
            height: '18px',
            fill: 'rgb(15, 20, 25)',
            marginRight: '10px', // Adds space between icon and text
          }}
        >
          <g>
          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
          </g>
        </svg>
              </p>
              <p className="btnH12P2422224">Get verified</p>
            </Button>
          )}
              {bio && <p className="whitespace-pre-line break-words">{bio}</p>}

      
          <div className=" flex items-center gap-1 text-light-secondary dark:text-dark-secondary">
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-light-secondary dark:text-dark-secondary">
                {detailIcons.map(
                  ([detail, icon], index) =>
                    detail && (
                      <div className="flex items-center gap-1" key={icon}>
                        <i>
                          <HeroIcon className="h-5 w-5" iconName={icon} />
                        </i>
                        {index === 1 ? (
                          <a
                            className="custom-underline text-main-accent"
                            href={`https://${detail}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {detail}
                          </a>
                        ) : index === 2 ? (
                          <button className="custom-underline group relative">
                            {detail}
                            <ToolTip
                              className="translate-y-1"
                              tip={formatDate(createdAt, 'full')}
                            />
                          </button>
                        ) : (
                          <p>{detail}</p>
                        )}
                      </div>
                    )
                )}
              </div>
          </div>
          <UserFollowStats following={following} followers={followers} />
        </div>
      </div>
      {isModalOpen && (
        <DetailsModal
          id={id}
          bio={bio}
          name={name}
          website={website}
          username={username}
          location={location}
          verified={verified}
          createdAt={createdAt}
          following={following}
          followers={followers}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}


// import { formatDate } from '@lib/date';
// import { HeroIcon } from '@components/ui/hero-icon';
// import { ToolTip } from '@components/ui/tooltip';
// import { UserName } from './user-name';
// import { UserFollowing } from './user-following';
// import { UserFollowStats } from './user-follow-stats';
// import type { IconName } from '@components/ui/hero-icon';
// import type { User } from '@lib/types/user';
// import { UpdateUsername } from '@components/home/update-username';
// type UserDetailsProps = Pick<
//   User,
//   | 'id'
//   | 'bio'
//   | 'name'
//   | 'website'
//   | 'username'
//   | 'location'
//   | 'verified'
//   | 'createdAt'
//   | 'following'
//   | 'followers'
// >;

// type DetailIcon = [string | null, IconName];

// export function UserDetails({
//   id,
//   bio,
//   name,
//   website,
//   username,
//   location,
//   verified,
//   createdAt,
//   following,
//   followers
// }: UserDetailsProps): JSX.Element {
//   const detailIcons: Readonly<DetailIcon[]> = [
//     [location, 'MapPinIcon'],
//     [website, 'LinkIcon'],
//     [`Joined ${formatDate(createdAt, 'joined')}`, 'CalendarDaysIcon']
//   ];

//   return (
//     <>
//       <div>
//         <UserName
//           className='-mb-1 text-xl'
//           name={name}
//           iconClassName='w-6 h-6'
//           verified={verified}
//         />
//         <div className='flex items-center gap-1 text-light-secondary dark:text-dark-secondary'>
//           <p>@{username}</p>
//           <UpdateUsername />
//           <UserFollowing userTargetId={id} />
//         </div>
//       </div>
//       <div className='flex flex-col gap-2'>
//         {bio && <p className='whitespace-pre-line break-words'>{bio}</p>}
//         <div className='flex flex-wrap gap-x-3 gap-y-1 text-light-secondary dark:text-dark-secondary'>
//           {detailIcons.map(
//             ([detail, icon], index) =>
//               detail && (
//                 <div className='flex items-center gap-1' key={icon}>
//                   <i>
//                     <HeroIcon className='h-5 w-5' iconName={icon} />
//                   </i>
//                   {index === 1 ? (
//                     <a
//                       className='custom-underline text-main-accent'
//                       href={`https://${detail}`}
//                       target='_blank'
//                       rel='noreferrer'
//                     >
//                       {detail}
//                     </a>
//                   ) : index === 2 ? (
//                     <button className='custom-underline group relative'>
//                       {detail}
//                       <ToolTip
//                         className='translate-y-1'
//                         tip={formatDate(createdAt, 'full')}
//                       />
//                     </button>
//                   ) : (
//                     <p>{detail}</p>
//                   )}
//                 </div>
//               )
//           )}
//         </div>
//       </div>
//       <UserFollowStats following={following} followers={followers} />
//     </>
//   );
// }
