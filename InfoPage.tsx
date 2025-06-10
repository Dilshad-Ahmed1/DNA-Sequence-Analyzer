import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const InfoPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Understanding DNA Pattern Matching Algorithms
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Brute-Force Algorithm</h2>
        <p className="text-gray-700 mb-4">
          The simplest approach to pattern matching. It checks every possible position in the DNA sequence 
          by comparing each character of the pattern with the corresponding character in the sequence.
        </p>
        <div className="mb-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Start at the first position of the DNA sequence</li>
            <li>Compare each character of the pattern with the corresponding character in the sequence</li>
            <li>If all characters match, record a match</li>
            <li>Move to the next position and repeat until the end of the sequence</li>
          </ol>
        </div>
        <div>
          <h3 className="font-medium mb-2">Time Complexity:</h3>
          <p className="bg-gray-100 p-2 rounded">O(n×m) where n is the sequence length and m is the pattern length</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Horspool Algorithm</h2>
        <p className="text-gray-700 mb-4">
          An optimization of the Boyer-Moore algorithm that only uses the bad character rule. It precomputes a "bad character" 
          shift table to skip portions of the text when a mismatch occurs.
        </p>
        <div className="mb-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Create a bad character shift table for the pattern</li>
            <li>Start comparing characters from the end of the pattern</li>
            <li>If a mismatch occurs, shift the pattern according to the bad character table</li>
            <li>If all characters match, record a match and shift by 1</li>
          </ol>
        </div>
        <div>
          <h3 className="font-medium mb-2">Time Complexity:</h3>
          <p className="bg-gray-100 p-2 rounded">
            Best case: O(n/m), Worst case: O(n×m)
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Boyer-Moore Algorithm</h2>
        <p className="text-gray-700 mb-4">
          Considered one of the most efficient string matching algorithms. It uses two heuristics: the "bad character rule" 
          and the "good suffix rule" to skip portions of the text, reducing the number of comparisons needed.
        </p>
        <div className="mb-4">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Create both bad character and good suffix tables for the pattern</li>
            <li>Start comparing characters from the end of the pattern</li>
            <li>When a mismatch occurs, shift the pattern by the maximum of the bad character and good suffix shifts</li>
            <li>If all characters match, record a match and shift to continue searching</li>
          </ol>
        </div>
        <div>
          <h3 className="font-medium mb-2">Time Complexity:</h3>
          <p className="bg-gray-100 p-2 rounded">
            Best case: O(n/m), Average case: O(n/m), Worst case: O(n×m)
          </p>
        </div>
      </div>
      
      <div className="text-center mt-12 mb-8">
        <Link 
          to="/analysis" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Try the Analysis Tool
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;