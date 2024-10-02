import { useState, useEffect } from 'react';
import { Modal } from '@components/modal/modal'; // Assuming you have a modal component
import { Button } from '@components/ui/button'; // Assuming you have a Button component
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { MouseEvent } from 'react';

// Define translations for multiple languages
const translations = {
  en: {
    footerLinks: [
      ['Terms of Service', `
        Summary of our terms
        Terms of Service: These govern the use of tweetbook, forming a legal contract.
        Advertising: tweetbook and partners may display ads as part of accessing services.
        Content Usage: Users must comply with the User Agreement and applicable laws.
        Acceptable Use: Services must be accessed via provided interfaces; scraping is prohibited.
        Enforcement: tweetbook can enforce terms by removing content, limiting access, or legal action.
        Intellectual Property: Users retain ownership of content but grant broad rights; use of tweetbook software is licensed.
        Risk Disclaimer: Services are provided "AS IS"; tweetbook disclaims warranties and liabilities.
        Remedies: Users can terminate their agreement; tweetbook limits liability for damages.
        Privacy Policy: Terms include a Privacy Policy and other applicable terms.
        Age Requirement: Users must be at least 13 years old to use tweetbook.
        Liability Limitation: tweetbook's liability is capped at $100 USD or recent service fees.
        Copyright Protection: Procedures for reporting copyright infringement are outlined in the terms.
      `],
      ['Privacy Policy', `
        Details about our privacy policy.
        It's really hard to make everyone happy with a Privacy Policy. Most people who use tweetbook want something short and easy to understand. While we wish we could fit everything you need to know into a post, our regulators ask us to meet our legal obligations by describing them all in a lot of detail.

        With that in mind, we've written our Privacy Policy as simply as possible to empower you to make informed decisions when you use tweetbook by making sure you understand and have control over the information we collect, how it's used, and when it's shared.

        So if you skip reading every word of the Privacy Policy, at least know this:
      `],
      ['Cookie Policy', `
        Details about our cookie policy.
        Cookies and similar technologies like pixels and local storage provide you with a better, faster, and safer experience on tweetbook. Cookies are also used to operate our services, which include our websites, applications, APIs, pixels, embeds, and email communications. Specifically, tweetbook uses these technologies to:

        Keep you logged in to tweetbook.
        Deliver features and functionality of tweetbook services.
        Save and honor your preferences.
        Personalize the content you see.
        Protect you against spam and abuse.
        Show you more relevant ads.
        Provide subscription features and distribute certain content.
        Understand how you interact with our services and where we can improve.
        Measure the effectiveness of our advertising and marketing.
        Rate how our services perform and identify bugs and other quality issues.
        Gather data used to operate our business — from measuring our audience size to enforcing the tweetbook Rules.
      `],
    ]
  },
};

export function AsideFooter3(): JSX.Element {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'he'>('en'); // Default language is English

  const openModal = (content: string) => {
    setLoading(true);
    setModalContent(content);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading delay
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const handleLanguageChange = (lang: 'en' | 'he') => {
    setLanguage(lang);
  };

  const currentTranslations = translations[language];

  return (
    <footer className="ADTweetbook sticky top-16 flex flex-col gap-3 text-center text-sm text-light-secondary dark:text-dark-secondary">
      <nav className="flex flex-wrap justify-center gap-2">
        {currentTranslations.footerLinks.map(([linkName, content], index) => (
          <button
            key={index}
            onClick={() => openModal(content)}
            className="custom-underline cursor-pointer"
          >
            {linkName}
          </button>
        ))}
      </nav>
      <p>© 2024 tweetbook, Inc.</p>

      {/* Modal */}
      {modalContent && (
        <Modal open={modalContent !== null} closeModal={closeModal}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md overflow-y-auto h-[500px] relative custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                  <button
                    onClick={closeModal}
                    className="mt-4 text-sm px-3 py-2 w-52 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f1f1f1;
        }
      `}</style>
    </footer>
  );
}
