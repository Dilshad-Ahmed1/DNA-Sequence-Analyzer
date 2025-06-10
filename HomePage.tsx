import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Clock, LineChart, Dna, Activity, Heart } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          DNA Analysis Laboratory
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mb-10">
          Advanced DNA sequence analysis tool featuring pattern matching, mutation detection, and disease risk assessment.
          Compare algorithms, visualize mutations, and understand genetic variations with comprehensive analysis tools.
        </p>
        
        <Link 
          to="/analysis" 
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Start Analysis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>

        <div className="grid md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pattern Matching</h3>
            <p className="text-gray-600">
              Efficiently search for DNA patterns using multiple algorithms optimized for biological sequences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <Dna className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mutation Analysis</h3>
            <p className="text-gray-600">
              Detect and analyze point mutations and frameshifts with detailed impact assessment and visualization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Comparison</h3>
            <p className="text-gray-600">
              Compare algorithm efficiency with detailed metrics and interactive visualizations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Disease Risk Analysis</h3>
            <p className="text-gray-600">
              Assess disease risks based on SNPs, family history, and lifestyle factors with comprehensive reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-gray-600">
              Watch algorithms in action with step-by-step visualization and detailed performance metrics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
              <LineChart className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Reports</h3>
            <p className="text-gray-600">
              Get detailed reports on mutations, disease risks, and inheritance patterns with visual representations.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Mutation Detection</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Point mutation analysis</li>
                <li>• Frameshift detection</li>
                <li>• Impact assessment</li>
                <li>• Visual mutation mapping</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Disease Risk Assessment</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• SNP analysis</li>
                <li>• Family history integration</li>
                <li>• Lifestyle factor consideration</li>
                <li>• Risk score calculation</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Algorithm Comparison</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Brute Force</li>
                <li>• Boyer-Moore</li>
                <li>• Horspool</li>
                <li>• Performance metrics</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Visualization Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Interactive charts</li>
                <li>• Sequence alignment view</li>
                <li>• Mutation visualization</li>
                <li>• Risk factor breakdown</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;