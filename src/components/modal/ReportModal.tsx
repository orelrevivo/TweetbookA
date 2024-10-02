import { useState } from 'react';
import { reportUser, blockUser } from '@lib/firebase/messages'; // Ensure this path is correct

type ReportModalProps = {
  onClose: () => void;
  userId: string; // Added userId prop to identify the user being reported
};

// ReportModal.tsx
export function ReportModal({ onClose, userId }: ReportModalProps): JSX.Element {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const handleReportSubmit = async () => {
      if (selectedReason) {
        try {
          // Handle the report submission logic
          await reportUser(userId, selectedReason);
          console.log('Report submitted for reason:', selectedReason);
          onClose();
        } catch (error) {
          console.error('Error submitting report:', error);
        }
      }
    };

    const handleBlockUser = async () => {
      try {
        // Handle user blocking logic
        await blockUser(userId);
        console.log('User blocked.');
        onClose();
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    };

    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50'>
        <div className='bg-main-background p-4 rounded shadow-lg w-1/3'>
        <button
              className='main-tabdsgasgaweg22 ml-2 bg-gray-100 text-black px-4 py-2 rounded'
              onClick={onClose}
            >
              <svg className='scaggas22gawsfw' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

            </button>
          <h2 className='issuesagw2 text-xl font-semibold'>Report an issue</h2>
          <span className='SpamInappropriate2'>Help us understand the issue. What’s the problem with this conversation?</span>
          <div className='mt-2'>
            <br />
            <label className='SpamBtn block mt-2'>
              <input
                type='radio'
                value='Spam'
                checked={selectedReason === 'Spam'}
                onChange={() => setSelectedReason('Spam')}
                className='inputSpamInappropriate'
              />
              <p className='SpamInappropriate'>Spam</p>
            </label>
            <hr />
            <label className='SpamBtn2 block mt-2'>
              <input
                type='radio'
                value='Inappropriate Content'
                checked={selectedReason === 'Inappropriate Content'}
                onChange={() => setSelectedReason('Inappropriate Content')}
                className='inputSpamInappropriate'
              />
              <p className='SpamInappropriate'>Inappropriate Content</p>
            </label>
            <hr className='SpamInappropriate222'/>
            {/* Add more reasons as needed */}
          </div>
          <div className='mt-4'>
            <button
             className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
              style={{ borderRadius: '0' }} // Setting border-radius to zero
              onClick={handleReportSubmit}
            >
              Submit Report
            </button>
            <button
             className="custom-button2hyeh custom-button accent-tab hover-card block w-full"
             style={{ borderRadius: '0' }} // Setting border-radius to zero
              onClick={handleBlockUser}
            >
              Block User
            </button>
          </div>
        </div>
      </div>
    );
}
