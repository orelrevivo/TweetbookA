// components/ui/textarea.tsx
import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
}: TextAreaProps) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full border border-gray-300 p-2 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
