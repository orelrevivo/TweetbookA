import React, { useState } from 'react';
import { Button } from '@components/ui/button';

interface AnewyearProps {
  onVerifyAge: (dob: string) => void;
  onClose: () => void;
}

export function Anewyear({ onVerifyAge, onClose }: AnewyearProps): JSX.Element {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value);
  };

  const handleVerifyAge = () => {
    if (verifyAge(dateOfBirth)) {
      onVerifyAge(dateOfBirth);
    } else {
      setError('You must write something in the date !!');
    }
  };

  const verifyAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 10;
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <input
        type='date'
        placeholder='Date of Birth'
        value={dateOfBirth}
        onChange={handleDateOfBirthChange}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #e1e8ed',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          fontSize: '16px',
          color: '#14171a',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />
      {error && <p className='text-red-500'>{error}</p>}
      <Button
        className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
        focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
        dark:border-light-secondary'
        onClick={handleVerifyAge}
      >
        Verify Age
      </Button>

    </div>
  );
}
