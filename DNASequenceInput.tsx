import React, { useState, ChangeEvent } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface DNASequenceInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const DNASequenceInput: React.FC<DNASequenceInputProps> = ({ value, onChange, label = "DNA Sequence" }) => {
  const [error, setError] = useState<string | null>(null);
  
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.toUpperCase();
    // Only allow A, T, G, C, and N
    if (/^[ATGC]*$/.test(newValue)) {
      onChange(newValue);
    }
  };
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check if file is .fasta or .txt
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'fasta' && fileExt !== 'txt') {
      setError('Please upload a .fasta or .txt file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      
      // Process FASTA format if needed
      let sequence = content;
      if (content.startsWith('>')) {
        // This is a FASTA file, extract sequence part
        const lines = content.split('\n');
        sequence = lines.slice(1).join(''); // Skip the header line
      }
      
      validateAndUpdate(sequence);
    };
    
    reader.readAsText(file);
  };
  
  const validateAndUpdate = (sequence: string) => {
    // Check if sequence contains only valid DNA characters (A, T, C, G, N) and whitespace
    const cleanSequence = sequence.replace(/\s/g, '').toUpperCase();
    
    if (cleanSequence.length === 0) {
      setError(null);
      onChange(sequence);
      return;
    }
    
    const invalidChars = cleanSequence.replace(/[ATCGN]/g, '');
    
    if (invalidChars.length > 0) {
      const uniqueInvalid = [...new Set(invalidChars)].join(', ');
      setError(`Invalid characters found: ${uniqueInvalid}`);
    } else {
      setError(null);
    }
    
    onChange(sequence);
  };
  
  // Get character count (excluding whitespace)
  const characterCount = value.replace(/\s/g, '').length;
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={handleTextChange}
          placeholder="Enter DNA sequence (A, T, G, C only)"
          className={`w-full h-40 px-3 py-2 resize-y border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                     ${error ? 'border-red-500' : 'border-gray-300'}`}
          rows={4}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <label className="inline-flex items-center px-3 py-1.5 cursor-pointer text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Upload .fasta or .txt
            <input 
              type="file" 
              accept=".fasta,.txt" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>
        
        <span className="text-sm text-gray-500">
          {characterCount} character{characterCount !== 1 ? 's' : ''}
        </span>
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

export default DNASequenceInput;