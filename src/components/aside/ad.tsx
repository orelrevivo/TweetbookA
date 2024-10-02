import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import cn from 'clsx';
import { HeroIcon } from '@components/ui/hero-icon';

export function Ad(): JSX.Element {
  const [isHidden, setIsHidden] = useState(false); // State to track if the ad is hidden
  const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
  const [reportDialogOpen, setReportDialogOpen] = useState(false); // State to track if the report dialog is open
  const [reportType, setReportType] = useState<string | null>(null); // State to track the selected report type
  const [reportContent, setReportContent] = useState<string | null>(null); // State to track the report content

  const handleHideAd = () => {
    setIsHidden(true); // Hide the ad when the "Hide" button is clicked
  };

  const handleReportButtonClick = () => {
    setReportDialogOpen(!reportDialogOpen);
  };

  const handleReportTypeClick = (type: string) => {
    setReportType(type);
    setReportContent(`You hereby agree to send the report and agree to the privacy policy ${type}`); // Example content, can be customized
  };

  const handleSendReport = () => {
    // Handle the sending of the report here
    console.log(`Report sent: ${reportType}`);
    setReportDialogOpen(false);
  };

  const handleDiscard = () => {
    setReportDialogOpen(false);
  };

  if (isHidden) return null; // If the ad is hidden, return null to remove it from the DOM
  // bg-main-sidebar-background
  return (
    <section className='ADTweetbook123ee border-light-border dark:border-dark-border border-1 xs:border'>
      <h2 className='relative text-lg font-bold mb-2 left-[10px] top-[5px]'>Subscribe to Premium</h2>
      <p className='relative text-sm text-gray-600 mb-4 left-[10px]'>
      Subscribe to Premium to access exclusive features 
      <br />
      and potentially earn from ad revenue.
      </p>
      <div className='relative'>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
           className={cn(
                `main-tab group group absolute top-2 right-2 p-2 
                 hover:bg-accent-blue/10 focus-visible:bg-accent-blue/10
                 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20 
                 absolute top-[-88px] right-[4px] main-tab80px`,
              )}
        >
                         <HeroIcon
                  className='h-5 w-5 text-light-secondary group-hover:text-accent-blue
                             group-focus-visible:text-accent-blue dark:text-dark-secondary/80'
                  iconName='EllipsisHorizontalIcon'
                />
        </button>
        {menuOpen && (
          <ul className='absolute top-[-55px] left-0 right-0 mt-2 menu-container'>
            <li>
              <button
                onClick={handleHideAd}
                className='block w-full text-left px-4 py-2 text-gray-700 accent-tab hover-card block'
              >
                Hide
              </button>
            </li>
            <li>
              <button
                onClick={handleReportButtonClick}
                className='block w-full text-left px-4 py-2 text-gray-700 accent-tab hover-card block'
              >
                Report
              </button>
            </li>
          </ul>
        )}
      </div>

      {reportDialogOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
          <div className='bg-main-background p-6 rounded-lg shadow-lg w-96'>
            <div className='flex'>
              <div className='w-1/3 flex flex-col'>
                <button
                  onClick={() => handleReportTypeClick('Bug Report')}
                  className='Report mb-2 p-2'
                >
                  <p className='opReport'>Bug Report</p>
                </button>
                <button
                  onClick={() => handleReportTypeClick('Spam Report')}
                  className='Report mb-2 p-2'
                >
                  <p className='opReport'>Spam Report</p>
                </button>
                <button
                  onClick={() => handleReportTypeClick('Error Report')}
                  className='Report p-2'
                >
                  <p className='opReport'>Error Report</p>
                </button>
              </div>
              <div className='w-2/3 pl-4'>
                {reportContent && (
                  <div className='bg-gray-100 p-4 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-2'>{reportType}</h3>
                    <p>{reportContent}</p>
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-end mt-4'>
              <button
                onClick={handleSendReport}
                className='Report2 px-4 py-2'
                disabled={!reportType}
              >
                Send
              </button>
              <button
                onClick={handleDiscard}
                className='Report2 ml-2 px-4 py-2'
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <Link href="/premium" passHref>
        <motion.button className='custom-button accent-tab hover-card block w-full rounded-2xl
                         rounded-t-none text-center text-main-accent'>
         <span className='Subscribetext13'>Subscribe</span>
        </motion.button>
      </Link>
    </section>
  );
}
// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Loading } from '@components/ui/loading'; // Import Loading component

// export function Ad(): JSX.Element {
//   const [isHidden, setIsHidden] = useState(false); // State to track if the ad is hidden
//   const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
//   const [reportDialogOpen, setReportDialogOpen] = useState(false); // State to track if the report dialog is open
//   const [reportType, setReportType] = useState<string | null>(null); // State to track the selected report type
//   const [reportContent, setReportContent] = useState<string | null>(null); // State to track the report content
//   const [loading, setLoading] = useState(true); // State to track loading status

//   useEffect(() => {
//     // Simulate loading or fetch calls here, e.g., with a timeout
//     const timer = setTimeout(() => {
//       setLoading(false); // Simulate loading complete
//     }, 2000); // 2-second loading simulation
//     return () => clearTimeout(timer); // Cleanup
//   }, []);

//   const handleHideAd = () => {
//     setIsHidden(true); // Hide the ad when the "Hide" button is clicked
//   };

//   const handleReportButtonClick = () => {
//     setReportDialogOpen(!reportDialogOpen);
//   };

//   const handleReportTypeClick = (type: string) => {
//     setReportType(type);
//     setReportContent(`You hereby agree to send the report and agree to the privacy policy ${type}`); // Example content, can be customized
//   };

//   const handleSendReport = () => {
//     console.log(`Report sent: ${reportType}`);
//     setReportDialogOpen(false);
//   };

//   const handleDiscard = () => {
//     setReportDialogOpen(false);
//   };

//   if (isHidden) return null; // If the ad is hidden, return null to remove it from the DOM

//   if (loading) {
//     // Display loading spinner when loading
//     return (
//       <div className='flex h-52 items-center justify-center p-4'>
//         <Loading />
//       </div>
//     );
//   }

//   return (
//     <section className='ADTweetbook23 ADTweetbook p-4 border border-gray-200 rounded-lg'>
//       <h2 className='text-lg font-bold mb-2 '>Join Premium</h2>
//       <p className='text-sm text-gray-600 mb-4'>
//         Join Premium to access exclusive features and potentially earn from ad revenue.
//       </p>
//       <div className='relative'>
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className='absolute top-0 right-0 text-gray-600'
//         >
//           &#x22EE;
//         </button>
//         {menuOpen && (
//           <ul className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
//             <li>
//               <button
//                 onClick={handleHideAd}
//                 className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
//               >
//                 Hide
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={handleReportButtonClick}
//                 className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
//               >
//                 Report
//               </button>
//             </li>
//           </ul>
//         )}
//       </div>

//       {reportDialogOpen && (
//         <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50'>
//           <div className='bg-main-background p-6 rounded-lg shadow-lg w-96'>
//             <div className='flex'>
//               <div className='w-1/3 flex flex-col'>
//                 <button
//                   onClick={() => handleReportTypeClick('Bug Report')}
//                   className='Report mb-2 p-2'
//                 >
//                   <p className='opReport'>Bug Report</p>
//                 </button>
//                 <button
//                   onClick={() => handleReportTypeClick('Spam Report')}
//                   className='Report mb-2 p-2'
//                 >
//                   <p className='opReport'>Spam Report</p>
//                 </button>
//                 <button
//                   onClick={() => handleReportTypeClick('Error Report')}
//                   className='Report p-2'
//                 >
//                   <p className='opReport'>Error Report</p>
//                 </button>
//               </div>
//               <div className='w-2/3 pl-4'>
//                 {reportContent && (
//                   <div className='bg-gray-100 p-4 rounded-lg'>
//                     <h3 className='text-lg font-semibold mb-2'>{reportType}</h3>
//                     <p>{reportContent}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className='flex justify-end mt-4'>
//               <button
//                 onClick={handleSendReport}
//                 className='Report2 px-4 py-2'
//                 disabled={!reportType}
//               >
//                 Send
//               </button>
//               <button
//                 onClick={handleDiscard}
//                 className='Report2 ml-2 px-4 py-2'
//               >
//                 Discard
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <Link href="/premium" passHref>
//         <motion.button className='glow-on-hover self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90 focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90 dark:active:bg-light-border/75'>
//           Join now
//         </motion.button>
//       </Link>
//     </section>
//   );
// }