import React, { useState } from 'react';

const footerLinks = [
  ['About', 
    `
    **About Tweetbook:**<br />
    Tweetbook is a social media platform designed for sharing updates, connecting with friends, and discovering content. We aim to provide a seamless experience for users to express themselves and interact with others.<br />
    **Our Mission:**<br />
    Our mission is to create a space where users can freely share their thoughts and experiences while fostering meaningful connections.<br />
    **Our Values:**<br />
    We value user privacy, community engagement, and innovation in our features.<br />
    **Contact Us:**<br />
    For any inquiries, reach out to us at contact@tweetbook.com.<br />
    **Join Us:**<br />
    Be part of our growing community and follow us on social media for updates.<br />
    `
  ],
  ['Help Center', 
    `
    **Getting Help:**<br />
    If you encounter any issues or need assistance, our Help Center is here to support you.<br />
    **FAQs:**<br />
    Browse through our frequently asked questions for quick answers to common problems.<br />
    **Contact Support:**<br />
    For personalized support, contact our help desk at support@tweetbook.com or call us at #00.<br />
    **Troubleshooting Guides:**<br />
    Find step-by-step guides to resolve common technical issues.<br />
    **Feedback:**<br />
    Share your feedback to help us improve your experience.<br />
    `
  ],
  ['Privacy Policy', 
    `
    **Data Collection:**<br />
    We collect data to improve your experience on Tweetbook. This includes profile information, posts, and interactions.<br />
    **Usage of Data:**<br />
    Your data is used to provide personalized content and advertisements.<br />
    **Data Security:**<br />
    We implement security measures to protect your data from unauthorized access.<br />
    **Third-Party Services:**<br />
    Our policy explains how data is shared with third-party services for functionality.<br />
    **User Rights:**<br />
    Learn about your rights to access, correct, and delete your personal data.<br />
    `
  ],
  ['Cookie Policy', 
    `
    **What Are Cookies?:**<br />
    Cookies are small files stored on your device to enhance your browsing experience.<br />
    **Usage of Cookies:**<br />
    We use cookies to remember your preferences and track site usage.<br />
    **Managing Cookies:**<br />
    You can manage your cookie preferences through your browser settings.<br />
    **Types of Cookies:**<br />
    Our policy details different types of cookies we use, including essential and non-essential cookies.<br />
    **Consent:**<br />
    By using Tweetbook, you consent to our use of cookies as described in this policy.<br />
    `
  ],
  ['Accessibility', 
    `
    **Accessibility Features:**<br />
    Tweetbook is designed to be accessible to all users, including those with disabilities.<br />
    **Screen Reader Compatibility:**<br />
    Our platform supports screen readers to assist visually impaired users.<br />
    **Keyboard Navigation:**<br />
    Navigate Tweetbook using keyboard shortcuts for a more accessible experience.<br />
    **Adjustable Text Sizes:**<br />
    Customize text size for better readability.<br />
    **Feedback:**<br />
    Provide feedback on accessibility features to help us improve.<br />
    `
  ],
  ['Ads Info', 
    `
    **Ad Formats:**<br />
    We offer various ad formats including banners, video ads, and sponsored posts.<br />
    **Targeting:**<br />
    Ads are targeted based on user interests and behaviors to provide relevant content.<br />
    **Ad Policies:**<br />
    Our ad policies ensure that all advertisements meet our community standards.<br />
    **Managing Ads:**<br />
    Learn how to manage and customize your ad preferences.<br />
    **Contact Us:**<br />
    For ad-related inquiries, reach out to ads@tweetbook.com.<br />
    `
  ],
  ['Blog', 
    `
    **Latest Posts:**<br />
    Stay updated with the latest news and updates from Tweetbook on our blog.<br />
    **Guest Articles:**<br />
    Read guest articles and opinions from industry experts.<br />
    **Announcements:**<br />
    Discover new features, product updates, and company announcements.<br />
    **Tips & Tricks:**<br />
    Find useful tips and tricks to enhance your Tweetbook experience.<br />
    **Subscribe:**<br />
    Subscribe to our blog for regular updates and notifications.<br />
    `
  ],
  ['Status', 
    `
    **Current Status:**<br />
    Check the current status of Tweetbook services and any ongoing issues.<br />
    **Maintenance Updates:**<br />
    Get updates on scheduled maintenance and service improvements.<br />
    **Incident Reports:**<br />
    View reports of any recent incidents affecting service availability.<br />
    **Performance Metrics:**<br />
    Monitor the performance metrics of our platform.<br />
    **Support Information:**<br />
    Access support resources if you experience service disruptions.<br />
    `
  ],
  ['Careers', 
    `
    **Open Positions:**<br />
    Explore current job openings at Tweetbook and find your next opportunity.<br />
    **Work Culture:**<br />
    Learn about our company culture and what makes Tweetbook a great place to work.<br />
    **Benefits:**<br />
    Discover the benefits and perks of working with us.<br />
    **How to Apply:**<br />
    Find out how to apply for positions and what to include in your application.<br />
    **Internships:**<br />
    Check out internship opportunities for students and recent graduates.<br />
    `
  ],
  ['Brand Resources', 
    `
    **Logos & Icons:**<br />
    Access official Tweetbook logos and icons for use in media and promotional materials.<br />
    **Brand Guidelines:**<br />
    Review our brand guidelines to ensure proper use of Tweetbook’s visual identity.<br />
    **Press Kits:**<br />
    Download press kits for media coverage and announcements.<br />
    **Media Inquiries:**<br />
    Contact us for media inquiries and press-related questions.<br />
    **Partnerships:**<br />
    Explore partnership opportunities and how to collaborate with Tweetbook.<br />
    `
  ],
  ['Advertising', 
    `
    **Ad Opportunities:**<br />
    Learn about various advertising opportunities available on Tweetbook.<br />
    **Sponsored Content:**<br />
    Explore options for sponsored content and how it can benefit your brand.<br />
    **Ad Campaigns:**<br />
    Understand how to create and manage ad campaigns effectively.<br />
    **Performance Tracking:**<br />
    Track the performance of your ad campaigns with detailed analytics.<br />
    **Contact Us:**<br />
    For more information on advertising, reach out to advertising@tweetbook.com.<br />
    `
  ],
  ['Marketing', 
    `
    **Marketing Strategies:**<br />
    Discover Tweetbook’s marketing strategies and how we promote our platform.<br />
    **User Engagement:**<br />
    Learn about strategies for increasing user engagement and interaction.<br />
    **Campaigns:**<br />
    Explore our marketing campaigns and promotional activities.<br />
    **Content Creation:**<br />
    Tips for creating engaging content to reach a broader audience.<br />
    **Collaborations:**<br />
    Find out how to collaborate with Tweetbook for mutual growth.<br />
    `
  ],
  ['Tweetbook for Business', 
    `
    **Donation Feature:**<br />
    Our new donation feature allows you to receive payments directly from your posts, regardless of your follower count. Here’s how it works:<br />
    1. **Add a Donation Button:** Each post will include a donation button, enabling others to contribute directly. We use a secure payment gateway for processing transactions.<br />
    2. **Boost Your Posts:** Users can pay to promote their posts. Boosted posts will be featured prominently, increasing their visibility and the potential for donations.<br />
    3. **Improve Post Quality:** To attract more donations, focus on creating high-quality, engaging content. Regular updates and sharing posts on other platforms can drive more traffic and donations.<br />
    4. **Regular Posting:** Frequent posting helps keep your content visible and relevant, enhancing your chances of receiving more donations.<br />
    **Enhance Your Post’s Appeal:** Use compelling visuals, engaging text, and promote your posts to maximize donation potential.<br />
    `
  ],
  ['Developers', 
    `
    OrelRevivo:<br />
    Directory information:<br />
    <a href="https://www.instagram.com/mrkokolokoo/" target="_blank" rel="noopener noreferrer">Instagram</a><br />
    <a href="https://www.facebook.com/profile.php?id=61552058932341&locale=he_IL" target="_blank" rel="noopener noreferrer">Facebook</a><br />
    <a href="https://x.com/WrRbybw84381" target="_blank" rel="noopener noreferrer">Twitter</a><br />
    <a href="https://www.tiktok.com/@.tv216" target="_blank" rel="noopener noreferrer">TikTok</a>
    `
  ],
  ['Directory', 
    `
    **Directory Information:**<br />
    Access the complete list of users and services available on Tweetbook.<br />
    **User Listings:**<br />
    Find users based on interests, locations, or other criteria.<br />
    **Service Listings:**<br />
    Discover available services and tools that enhance your Tweetbook experience.<br />
    **Search Functionality:**<br />
    Use the search feature to quickly locate specific users or services.<br />
    **Contact Us:**<br />
    For assistance with directory information, contact directory@tweetbook.com.<br />
    `
  ],
  ['Settings', 
    `
    **Privacy Controls:**<br />
    Set profile visibility to public, friends only, or private, and customize post visibility.<br />
    **Notification Preferences:**<br />
    Customize notifications for different interactions and set Do Not Disturb mode.<br />
    **Content Filters:**<br />
    Use keyword filters and content categories to manage what you see.<br />
    **Account Security:**<br />
    Enable two-factor authentication and login alerts for enhanced security.<br />
    **Data Management:**<br />
    Access an activity log and export data for backups.<br />
    **Customization Options:**<br />
    Choose themes, layouts, and personalize your profile.<br />
    **Accessibility Features:**<br />
    Adjust text size, fonts, and use voice commands for better accessibility.<br />
    **Content Management:**<br />
    Schedule posts and set reminders for updates.<br />
    **Interaction Controls:**<br />
    Mute or block users and keywords, and use reporting tools for inappropriate content.<br />
    **App Performance:**<br />
    Manage data usage and use offline mode to access content without internet.<br />
    `
  ],
  ['About Social Media', 
    `
    **Social Media Overview:**<br />
    Social media platforms allow users to connect, share content, and engage with others globally. These platforms offer various features including posting updates, commenting, messaging, and media sharing.<br />
    **Benefits:**<br />
    - **Connection:** Stay connected with friends, family, and communities around the world.<br />
    - **Information Sharing:** Share and receive news, updates, and personal achievements.<br />
    - **Networking:** Build professional relationships and expand your network.<br />
    - **Entertainment:** Access a wide range of content, from videos and articles to live streams.<br />
    **Best Practices:**<br />
    - **Be Respectful:** Engage positively and avoid sharing harmful content.<br />
    - **Protect Privacy:** Be mindful of what personal information you share.<br />
    - **Manage Time:** Balance social media use with other activities.<br />
    `
  ],
  ['Guides', 
    `
    **Getting Started:**<br />
    Learn how to create an account, set up your profile, and start connecting with others.<br />
    **Profile Management:**<br />
    Update your profile picture, bio, and privacy settings to customize your social media presence.<br />
    **Posting Content:**<br />
    Discover how to create and share posts, use hashtags, and tag other users.<br />
    **Engaging with Others:**<br />
    Tips for liking, commenting, and sharing posts, as well as managing your interactions.<br />
    **Troubleshooting:**<br />
    Solutions for common issues like login problems, account settings, and content management.<br />
    **Safety and Security:**<br />
    Learn how to secure your account, report issues, and protect yourself online.<br />
    `
  ]
] as const;

const Modal = ({ content, onClose }: { content: string; onClose: () => void }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg md:w-96 text-center custom-scrollbar overflow-y-auto h-96">
      <div className="custom-scrollbar overflow-y-auto max-h-80 p-4">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <button
        onClick={onClose}
        className="mt-4 bg-black text-white px-4 py-2 w-52 rounded-full hover:bg-gray-800 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  </div>
);

export function LoginFooter(): JSX.Element {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleClick = (content: string) => {
    setModalContent(content);
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <footer className='hidden justify-center p-4 text-sm text-light-secondary dark:text-dark-secondary lg:flex'>
      <nav className='flex flex-wrap justify-center gap-4 gap-y-2'>
        {footerLinks.map(([linkName, content]) => (
          <button
            className='custom-underline'
            onClick={() => handleClick(content)}
            key={linkName}
          >
            {linkName}
          </button>
        ))}
        <p>© 2024 Tweetbook, Inc.</p>
      </nav>
      {modalContent && <Modal content={modalContent} onClose={handleCloseModal} />}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #000;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .custom-underline:hover {
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}

// import React, { useState } from 'react';

// const footerLinks = [
//   ['About', 'About a user'],
//   ['Help Center', 'If you need help with technical problems, contact this hotline: #00'],
//   ['Privacy Policy', 'This is the privacy policy.'],
//   ['Cookie Policy', 'This is the cookie policy.'],
//   ['Accessibility', 'Accessibility information.'],
//   ['Ads Info', 'Advertising information.'],
//   ['Blog', 'This is the blog.'],
//   ['Status', 'Current status information.'],
//   ['Careers', 'Career opportunities.'],
//   ['Brand Resources', 'Brand resources information.'],
//   ['Advertising', 'Advertising details.'],
//   ['Marketing', 'Marketing information.'],
//   ['Tweetbook for Business', 'Information about Tweetbook for business.'],
//   ['Developers', 'Developer resources.'],
//   ['Directory', 'Directory information.'],
//   ['Settings', 'Settings details.']
// ] as const;

// const Modal = ({ content, onClose }: { content: string; onClose: () => void }) => (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg md:w-96 text-center custom-scrollbar overflow-y-auto h-96">
//       <div className="custom-scrollbar overflow-y-auto max-h-80 p-4">
//         <p>{content}</p>
//       </div>
//       <button
//         onClick={onClose}
//         className="mt-4 bg-black text-white px-4 py-2 w-52 rounded-full hover:bg-gray-800 transition-colors duration-200"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// );

// export function LoginFooter(): JSX.Element {
//   const [modalContent, setModalContent] = useState<string | null>(null);

//   const handleClick = (content: string) => {
//     setModalContent(content);
//   };

//   const handleCloseModal = () => {
//     setModalContent(null);
//   };

//   return (
//     <footer className='hidden justify-center p-4 text-sm text-light-secondary dark:text-dark-secondary lg:flex'>
//       <nav className='flex flex-wrap justify-center gap-4 gap-y-2'>
//         {footerLinks.map(([linkName, content]) => (
//           <button
//             className='custom-underline'
//             onClick={() => handleClick(content)}
//             key={linkName}
//           >
//             {linkName}
//           </button>
//         ))}
//         <p>© 2024 Tweetbook, Inc.</p>
//       </nav>
//       {modalContent && <Modal content={modalContent} onClose={handleCloseModal} />}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #000;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//       `}</style>
//     </footer>
//   );
// }
