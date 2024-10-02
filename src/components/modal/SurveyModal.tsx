import React, { useState } from 'react'; // Ensure React and useState are imported
import { Button } from '@components/ui/button';

type SurveyModalProps = {
  onClose: () => void;
  onOptionSelect: (option: string) => void;
};

export function SurveyModal({ onClose, onOptionSelect }: SurveyModalProps): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string): void => {
    setSelectedOption(option);
    onOptionSelect(option); // Notify parent component of the selection
    onClose(); // Close the modal after selection
  };

  return (
    <div className='ScheduleModal'>
      <div className=''>
        <h2 className='text-xl font-bold mb-4'>Create a Poll</h2>
        <div className='space-y-4'>
          <div className='flex flex-col'>
            <label className='mb-2'>Select an option:</label>
            <Button
              className={`p-2 border rounded-lg ${selectedOption === 'Option 1' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleOptionSelect('Option 1')}
            >
              Option 1
            </Button>
            <Button
              className={`p-2 border rounded-lg ${selectedOption === 'Option 2' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleOptionSelect('Option 2')}
            >
              Option 2
            </Button>
            <Button
              className={`p-2 border rounded-lg ${selectedOption === 'Option 3' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleOptionSelect('Option 3')}
            >
              Option 3
            </Button>
            <Button
              className={`p-2 border rounded-lg ${selectedOption === 'Option 4' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleOptionSelect('Option 4')}
            >
              Option 4
            </Button>
          </div>
        </div>
        <div className='mt-6 flex justify-end gap-4'>
          <Button
            className='bg-gray-500 text-white'
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
