import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 
      'text-blue-700 border-b-2 border-blue-700' : 
      'text-gray-700 hover:text-blue-600';
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Dna className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">DNA Pattern Matching</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} font-medium py-2`}>
              Home
            </Link>
            <Link to="/analysis" className={`${isActive('/analysis')} font-medium py-2`}>
              Analysis Tool
            </Link>
            <Link to="/info" className={`${isActive('/info')} font-medium py-2`}>
              Learn
            </Link>
          </div>
          
          <div className="md:hidden">
            {/* Mobile menu button - simplified for this implementation */}
            <button className="text-gray-600 hover:text-blue-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;