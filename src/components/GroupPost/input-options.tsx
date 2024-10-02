import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { variants } from './input-Chat-group';
import { ProgressBar } from '../input/progress-bar';
import type { ChangeEvent, ClipboardEvent } from 'react';
import type { IconName } from '@components/ui/hero-icon';
import { ScheduleModal } from '../modal/ScheduleModal'; // Import the ScheduleModal
import { SurveyModal } from '../modal/SurveyModal'; // Import the SurveyModal

type Options = {
  name: string;
  iconName: IconName;
  disabled: boolean;
  onClick?: () => void;
}[];

const options: Readonly<Options> = [
  {
    name: 'Media',
    iconName: 'PhotoIcon',
    disabled: false
  },
  {
    name: 'GIF',
    iconName: 'GifIcon',
    disabled: false // Set to false to enable the GIF option
  },
  {
    name: 'Poll',
    iconName: 'ChartBarIcon',
    disabled: false // Set to false to enable the Poll option
  },
  {
    name: 'Emoji',
    iconName: 'FaceSmileIcon',
    disabled: false
  },
  {
    name: 'Schedule',
    iconName: 'CalendarDaysIcon',
    disabled: false
  }
];

type InputOptionsProps = {
  reply?: boolean;
  modal?: boolean;
  inputLimit: number;
  inputLength: number;
  isValidTweet: boolean;
  isCharLimitExceeded: boolean;
  handleImageUpload: (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ) => void;
};

const emojis = ['😊', '😂', '🥺', '😍', '😎', '😭']; // Example emoji list

export function InputOptions({
  reply,
  modal,
  inputLimit,
  inputLength,
  isValidTweet,
  isCharLimitExceeded,
  handleImageUpload
}: InputOptionsProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isSurveyModalOpen, setSurveyModalOpen] = useState(false);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const openFileDialog = (): void => {
    inputFileRef.current?.click();
  };

  const handleOptionClick = (name: string): void => {
    if (name === 'Schedule') {
      setScheduleModalOpen(true);
    } else if (name === 'Poll') {
      setSurveyModalOpen(true);
    } else if (name === 'GIF') {
      openFileDialog();
    } else if (name === 'Emoji') {
      setEmojiPickerOpen(!isEmojiPickerOpen);
    }
  };

  const handleEmojiSelect = (emoji: string): void => {
    setInputValue(prev => prev + emoji);
    setEmojiPickerOpen(false);
  };

  const handleSurveySubmit = async (option: string | null): Promise<void> => {
    if (option) {
      try {
        // Replace this with your actual survey submission logic
        await submitSurvey(option);
      } catch (error) {
        console.error('Error submitting survey:', error);
      }
    }
  };

  const submitSurvey = async (option: string | null): Promise<void> => {
    if (!option) throw new Error('No option selected');

    // Example submission logic, replace with actual implementation
    await fetch('/api/submit-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ option })
    });
  };

  let filteredOptions = options;

  if (reply) {
    filteredOptions = filteredOptions.filter(
      (_, index) => ![2, 4].includes(index)
    );
  }

  return (
    <>
      <motion.div className='flex justify-between' {...variants}>
        <div
          className='flex text-main-accent xs:[&>button:nth-child(n+6)]:hidden 
                     md:[&>button]:!block [&>button:nth-child(n+4)]:hidden'
        >
          <input
            className='hidden'
            type='file'
            accept='image/*,video/*'
            onChange={handleImageUpload}
            ref={inputFileRef}
            multiple
          />
          {filteredOptions.map(({ name, iconName, disabled }, index) => (
            <Button
              className='accent-tab accent-bg-tab group relative rounded-full p-2 
                         hover:bg-main-accent/10 active:bg-main-accent/20'
              onClick={name === 'Media' || name === 'GIF' ? openFileDialog : () => handleOptionClick(name)}
              disabled={disabled}
              key={name}
            >
              <HeroIcon className='h-5 w-5' iconName={iconName} />
              <ToolTip tip={name} modal={modal} />
            </Button>
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <motion.div
            className='flex items-center gap-4'
            animate={
              inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
          >
            <ProgressBar
              modal={modal}
              inputLimit={inputLimit}
              inputLength={inputLength}
              isCharLimitExceeded={isCharLimitExceeded}
            />
            {/* {!reply && (
              <>
                <i className='hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block' />
                <Button
                  className='group relative hidden rounded-full border border-light-line-reply p-[1px]
                             text-main-accent dark:border-light-secondary xs:block'
                  disabled
                >
                  <HeroIcon className='h-5 w-5' iconName='PlusIcon' />
                  <ToolTip tip='Add' modal={modal} />
                </Button>
              </>
            )} */}
          </motion.div>
          <Button
            type='submit'
            className='accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                       enabled:hover:bg-main-accent/90
                       enabled:active:bg-main-accent/75'
            disabled={!isValidTweet}
            onClick={() => {
              if (selectedOption) {
                handleSurveySubmit(selectedOption);
              }
            }}
          >
            {reply ? 'Reply' : 'Post'}
          </Button>
        </div>
      </motion.div>

      {/* Render the Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleModal onClose={() => setScheduleModalOpen(false)} />
      )}

      {/* Render the Survey Modal */}
      {isSurveyModalOpen && (
        <SurveyModal
          onClose={() => setSurveyModalOpen(false)}
          onOptionSelect={(option) => {
            setSelectedOption(option);
            handleSurveySubmit(option); // Submit the survey when an option is selected
            setSurveyModalOpen(false); // Close the modal after selection
          }}
        />
      )}

      {/* Render the Emoji Picker */}
      {isEmojiPickerOpen && (
        <div className='ScheduleModal'>
          {emojis.map((emoji, index) => (
            <Button
              key={index}
              className='text-2xl cursor-pointer'
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}