import React, { useState, useRef } from 'react';
import { UserTooltip } from '@components/user/user-tooltip';
import { UserAvatar } from '@components/user/user-avatar';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { StatsEmpty } from '@components/Post/stats-empty';
import { useAuth } from '@lib/context/auth-context';
import { useRouter } from 'next/router';
export function SubscribeModal({ closeModal, tweetUserData }: { closeModal: () => void, tweetUserData: any }) {
  const { user } = useAuth(); // Get the user context
  const { name, username, verified, photoURL } = tweetUserData;

  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // State for button click
  const [inputValue, setInputValue] = useState(''); // State for input value

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = isScrolledDown ? 0 : container.scrollHeight; // Scroll to the bottom or back to top
      setIsScrolledDown(!isScrolledDown); // Toggle the state
    }
  };

  const handleButtonClick = () => {
    setIsButtonClicked(true); // Activate input field when button is clicked
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Set the input value
  };

  const handleSubmit = () => {
    if (!isButtonClicked || inputValue === '') {
      alert('You need to click the button and fill in the input field!');
    } else {
      alert(`Submitted: ${inputValue}`);
    }
  };
  const router = useRouter();

  // Function to handle button navigation
  const handleNavigation = (page: string) => {
    router.push(page);
  };
  return (
    <div className="bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden">
      <div className="scrollable-container" ref={scrollContainerRef}>
        <div className="fixed-top-bar33">
          <button className="Subscribebutton2">
            <span className="SubscribeSpan" onClick={() => handleNavigation('/Subscribe/Support_User')}>Subscribe</span>
          </button>
          <button onClick={scrollToBottom} className="SubscribeA↑">
            {isScrolledDown ? '↑' : '↓'}
          </button>
        </div>
        <div className="content-area">
          <div className="spanYourAccount222222">
            <div className="flex justify-center items-center relative">
              <h2 className="Subscribe_to">Subscribe to - </h2>
              <div className="flex flex-col">
                <UserTooltip {...tweetUserData}>
                  <UserName
                    className="Subscribe_to_UserName"
                    name={name}
                    username={username}
                    verified={verified}
                  />
                </UserTooltip>
              </div>
            </div>
            <span className="spanYourAccount2222">Support your favorite people on Tweetbook for bonus content and extra perks.</span>
            <div className="UserAvatar2222">
              <div className="UserAvatar22222">
                <span className="spanYourAccount22222">Thanks for your support.</span>
              </div>
              <UserAvatar src={photoURL} alt={name} username={username} className="UserAvatar222222" />
            </div>
          </div>
          <br />
          <div className="spanYourAccount23bonus flex justify-center items-center relative">
            <span className="Subscribe_to">Get bonus content when you sign up</span>
            <span className="spanYourAccount23">Thanks for your support.</span>
            <span className="spanYourAccount233"><UserUsername username={username} /></span>
          </div>
          <div className="spanYourAccount23bonus3 flex justify-center items-center relative">
            <span className="Subscribe_to">Find your people and get recognized</span>
            <span className="spanYourAccount23">You’ll get a public Subscribed badge that makes it easier to get noticed, chat, and connect.</span>
            <span className='spanYourAccount232'>@{user?.username}</span> {/* Updated to show the correct username */}
          </div>
          <div className="StatsEmptybonus">
            <StatsEmpty imageData={{ src: '/bonus.png', alt: 'No posts' }} />
          </div>
          <div className="StatsEmptybonus2">
            <StatsEmpty imageData={{ src: '/peopleSub.png', alt: 'No posts' }} />
          </div>
          <div className="spanYourAccount23bonus3 flex justify-center items-center relative">
            <span className='spanYourAccount232'>Share your email with Aesthetics. By accepting, you agree to let Tweetbook share the email address with the creator for the purpose of off-platform communication and accept the Email Sharing Terms. Learn more</span>
            <button onClick={handleSubmit} className="SubscribeSubmit" disabled={!isButtonClicked}>
            Subscribe
            </button>
          </div>
          {/* Input and button */}
          <div className="spanYourAccount23bonus32 flex justify-center items-center relative">
            <button onClick={handleButtonClick} className="SubscribeSubmit2">
            confirmation
            </button>
            <label
    className="input-field43 TweetbookSearch22 group flex items-center justify-between gap-4 rounded-[8px] px-4 py-2 focus-within:ring-2 focus-within:ring-[#c936cc] border-light-border dark:border-dark-border border-1 xs:border"
    style={{ width: '90%', height: '60px', transform: 'translateX(13px)' }}
>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={!isButtonClicked} // Disabled until button is clicked
              className="peer flex-1 bg-transparent outline-none placeholder:text-light-secondary dark:placeholder:text-dark-secondary"
            />
              </label>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollable-container {
          position: relative;
          height: 500px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .scrollable-container::-webkit-scrollbar {
          width: 12px;
        }

        .scrollable-container::-webkit-scrollbar-thumb {
          background-color: rgb(222, 222, 222);
          border-radius: 0px;
        }

        .scrollable-container::-webkit-scrollbar-thumb:hover {
          background-color: rgb(222, 222, 222);
        }

        .scrollable-container::-webkit-scrollbar-track {
          background: #f9f9f9;
        }

        .input-container {
          margin-top: 20px;
        }

        .activate-button {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .input-field {
          margin-left: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .submit-button {
          margin-left: 10px;
          background-color: #28a745;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
