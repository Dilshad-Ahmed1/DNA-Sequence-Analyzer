import React, { useState, ChangeEvent } from 'react';
import { AlertCircle } from 'lucide-react';

interface PatternInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const PatternInput: React.FC<PatternInputProps> = ({ value, onChange, label = "Pattern" }) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Validate DNA pattern (A, T, C, G, N only)
    const cleanPattern = newValue.replace(/\s/g, '').toUpperCase();
    
    if (cleanPattern.length === 0) {
      setError(null);
      onChange(newValue);
      return;
    }
    
    const invalidChars = cleanPattern.replace(/[ATCGN]/g, '');
    
    if (invalidChars.length > 0) {
      const uniqueInvalid = [...new Set(invalidChars)].join(', ');
      setError(`Invalid characters found: ${uniqueInvalid}`);
    } else {
      setError(null);
    }
    
    onChange(newValue);
  };
  
  return (
    <div className="space-y-2">
      <label htmlFor="pattern-input" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <input
          id="pattern-input"
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="Enter DNA pattern to search (A/T/C/G/N)..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                     ${error ? 'border-red-500' : 'border-gray-300'}`}
          spellCheck="false"
        />
      </div>
      
      {error && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default PatternInput;