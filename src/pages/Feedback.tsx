import { useState, ReactElement, ReactNode, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { useModal } from '@lib/hooks/useModal';
import { MainLayout } from '@components/layout/main-layout-U';
import { ProtectedLayout } from '@components/layout/common-layout-U';
import { uploadFeedback, fetchFeedbacks } from '../lib/firebase/Feedback';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

type FeedbackData = {
  id: string;
  summary: string;
  email: string;
  details: string;
  createdAt: Date;
  files: string[];
};

export default function Feedback(): JSX.Element {
  const [feedbackSummary, setFeedbackSummary] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackData[]>([]);
  const { open, openModal, closeModal } = useModal();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(); // Get the Firebase Auth instance

    // Listen for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set user ID when authenticated
        fetchUserFeedbacks(); // Fetch feedbacks for the authenticated user
      } else {
        setUserId(null); // Reset user ID if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserFeedbacks = async () => {
    try {
      const feedbacks = await fetchFeedbacks();
      setAllFeedbacks(feedbacks);
    } catch (error) {
      console.error('Error fetching user feedbacks:', error);
    }
  };

  useEffect(() => {
    setIsFormValid(feedbackSummary.length > 0 && isEmailValid && details.length > 0);
  }, [feedbackSummary, email, details, isEmailValid]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    setIsEmailValid(emailInput.includes('@gmail.com'));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files).slice(0, 4));
    }
  };

  const handleSubmit = async () => {
    try {
      const emailToSend = email || 'No email provided';
      await uploadFeedback(feedbackSummary, emailToSend, details, files);
      setFeedbackSent(true);
      await fetchUserFeedbacks(); // Fetch updated feedbacks for the user
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleNewFeedback = () => {
    setFeedbackSummary('');
    setEmail('');
    setDetails('');
    setFiles([]);
    setFeedbackSent(false);
  };

  return (
    <section className="feedback-form bg-main-background" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {!feedbackSent ? (
        <div>
          <h2>Share your feedback</h2>
          <div>
            <label>Feedback summary *</label>
            <input
              type="text"
              maxLength={100}
              value={feedbackSummary}
              onChange={(e) => setFeedbackSummary(e.target.value)}
              className='inputSubmithandleSubmit bg-main-background'
              style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Your email *</label>
            <br />
            <span className='respondPlease'>Please leave your email in case we need to respond. Information shared will only be used to respond to your report.</span>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className='inputSubmithandleSubmit bg-main-background'
              style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            />
            {!isEmailValid && email.length > 0 && (
              <span style={{ color: 'red', fontSize: '12px' }}>Please enter a valid email ending with "@gmail.com"</span>
            )}
          </div>
          <div>
            <label>Tell us more *</label>
            <br />
            <span className='respondPlease'>Please provide as many details as possible</span>
            <textarea
              maxLength={1000}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className='inputSubmithandleSubmit bg-main-background'
              style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label>Attach a screenshot</label>
            <br />
            <span className='respondPlease'>You can upload up to 4 files</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className='inputSubmithandleSubmit bg-main-background'
              style={{ display: 'block', marginBottom: '10px' }}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className='SubmithandleSubmit'
            style={{
              backgroundColor: isFormValid ? '#fe2c55' : '#ebebeb',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              opacity: isFormValid ? 1 : 0.5,
            }}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div>
          <Button 
          className='SubmithandleSubmitNew'
                      style={{
                        backgroundColor: isFormValid ? '#fe2c55' : '#ebebeb',
                        color: 'white',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        opacity: isFormValid ? 1 : 0.5,
                      }}
          onClick={handleNewFeedback}>
            Send New Feedback
          </Button>
        </div>
      )}
      {userId && (
        <div className=''>
          <h2 className='respondPlease'>Your Feedbacks , Feedback sent</h2>
          {allFeedbacks.map((feedback) => (
            <div className='button_submit_handleSubmit2div bg-main-background' key={feedback.id} style={{ padding: '10px', marginBottom: '10px' }}>
              <p><strong>Summary:</strong> {feedback.summary}</p>
              <p><strong>Email:</strong> {feedback.email}</p>
              <p><strong>Details:</strong> {feedback.details}</p>
              <p><strong>Date:</strong> {feedback.createdAt.toDateString()}</p>
              {feedback.files.length > 0 && (
                <div>
                  <strong>Files:</strong>
                  {feedback.files.map((fileUrl, index) => (
                    <div key={index}>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">{`File ${index + 1}`}</a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


Feedback.getLayout = function getLayout(page: ReactElement): ReactNode {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
