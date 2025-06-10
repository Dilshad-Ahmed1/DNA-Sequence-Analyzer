import React, { useState } from 'react';
import DNASequenceInput from '../components/DNASequenceInput';
import PatternInput from '../components/PatternInput';
import ResultsTable, { AlgorithmResult } from '../components/ResultsTable';
import ResultsChart from '../components/ResultsChart';
import AlignmentViewer from '../components/AlignmentViewer';
import { MutationAnalysisViewer } from '../components/MutationAnalysisViewer';
import { DiseaseAnalysisViewer } from '../components/DiseaseAnalysisViewer';
import { FamilyHistoryInput } from '../components/FamilyHistoryInput';
import { analyzeSNPs, calculateDiseaseRisk, generateInheritanceReport, DiseaseSNP } from '../algorithms/diseaseUtils';
import { naiveStringMatching, boyerMooreSearch, horspoolSearch } from '../algorithms/stringMatching';
import { needlemanWunsch, smithWaterman, AlignmentResult } from '../algorithms/alignment';
import { Mutation, MutationAnalysisResult, analyzeMutations } from '../algorithms/mutationAnalysis';
import { GAP_PENALTIES } from '../algorithms/dnaUtils';

interface Algorithm {
  id: string;
  name: string;
  selected: boolean;
}

const getMutationType = (reference: string, mutated: string): string => {
  const transitions = ['AG', 'GA', 'CT', 'TC'];
  const transversions = ['AC', 'CA', 'AT', 'TA', 'GC', 'CG', 'GT', 'TG'];
  
  const mutation = reference + mutated;
  if (transitions.includes(mutation)) {
    return 'Transition';
  } else if (transversions.includes(mutation)) {
    return 'Transversion';
  }
  return 'Unknown';
};

export const AnalysisToolPage: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState<AlgorithmResult[]>([]);
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult | null>(null);
  const [mutationResult, setMutationResult] = useState<MutationAnalysisResult | null>(null);
  const [diseaseAnalysis, setDiseaseAnalysis] = useState<{
    snps: DiseaseSNP[];
    diseaseRisks: { disease: string; risk: number; factors: string[] }[];
    inheritanceReport: string[];
  } | null>(null);
  const [familyHistory, setFamilyHistory] = useState<{ relation: string; conditions: string[] }[]>([]);
  const [age, setAge] = useState<number>(30);
  const [lifestyleFactors, setLifestyleFactors] = useState<string[]>([]);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([
    { id: 'naive', name: 'Brute Force', selected: false },
    { id: 'boyer-moore', name: 'Boyer-Moore Algorithm', selected: false },
    { id: 'horspool', name: 'Horspool Algorithm', selected: false }
  ]);

  const handleAlgorithmChange = (id: string, selected: boolean) => {
    setAlgorithms(algorithms.map(algo =>
      algo.id === id ? { ...algo, selected } : algo
    ));
  };

  const handleRunAnalysis = () => {
    if (!sequence || !pattern) {
      alert('Please enter both a DNA sequence and a pattern');
      return;
    }
    const selectedAlgorithms = algorithms.filter(a => a.selected);
    const newResults: AlgorithmResult[] = selectedAlgorithms.map(alg => {
      const startTime = performance.now();
      let positions: number[];
      let comparisons = 0;

      switch (alg.id) {
        case 'naive':
          positions = naiveStringMatching(sequence, pattern);
          comparisons = sequence.length * pattern.length;
          break;
        case 'boyer-moore':
          positions = boyerMooreSearch(sequence, pattern);
          comparisons = sequence.length;
          break;
        case 'horspool':
          const horspoolResult = horspoolSearch(sequence, pattern);
          positions = horspoolResult.positions;
          comparisons = horspoolResult.comparisons;
          break;
        default:
          positions = [];
      }

      const endTime = performance.now();
      return {
        algorithm: alg.name,
        pattern,
        matches: positions,
        comparisons,
        executionTime: endTime - startTime
      };
    });
    setResults(newResults);
  };

  const handleAlignment = (type: 'needlemanWunsch' | 'smithWaterman') => {
    if (!sequence || !pattern) {
      alert('Please enter both sequences');
      return;
    }

    const result = type === 'needlemanWunsch'
      ? needlemanWunsch(sequence, pattern, GAP_PENALTIES.DEFAULT)
      : smithWaterman(sequence, pattern, GAP_PENALTIES.DEFAULT);

    setAlignmentResult(result);
  };

  const handleMutationAnalysis = () => {
    if (!sequence || !pattern) {
      alert('Please enter both a DNA sequence and a pattern');
      return;
    }

    // Use the imported analyzeMutations function
    const result = analyzeMutations(sequence, pattern);
    setMutationResult(result);
  };

  // Helper function to determine mutation impact
  const determineMutationImpact = (mutationType: string): 'High' | 'Medium' | 'Low' => {
    if (mutationType === 'Transition') {
      return 'Medium';
    } else if (mutationType === 'Transversion') {
      return 'High';
    }
    return 'Low';
  };

  // Helper function to determine mutation severity
  const determineMutationSeverity = (mutationType: string): 'Critical' | 'Moderate' | 'Minor' => {
    if (mutationType === 'Transversion') {
      return 'Critical';
    } else if (mutationType === 'Transition') {
      return 'Moderate';
    }
    return 'Minor';
  };

  // Helper function to find mutation hotspots
  const findMutationHotspots = (mutations: Mutation[], sequenceLength: number): { start: number; end: number; density: number }[] => {
    const windowSize = 10; // Size of the window to analyze
    const hotspots: { start: number; end: number; density: number }[] = [];
    
    // Slide a window across the sequence
    for (let i = 0; i < sequenceLength - windowSize; i++) {
      const windowMutations = mutations.filter(m => m.position >= i && m.position < i + windowSize);
      const density = windowMutations.length / windowSize;
      
      // If mutation density is above threshold, consider it a hotspot
      if (density > 0.3) { // 30% mutation rate threshold
        hotspots.push({
          start: i,
          end: i + windowSize,
          density
        });
      }
    }
    
    return hotspots;
  };

  const handleFamilyHistoryChange = (newFamilyHistory: { relation: string; conditions: string[] }[]) => {
    setFamilyHistory(newFamilyHistory);
  };

  const handleDiseaseAnalysis = () => {
    if (!pattern) {
      alert('Please enter a pattern sequence');
      return;
    }

    // Analyze SNPs in the pattern sequence
    const snps = analyzeSNPs(pattern, 0);

    // Calculate disease risks using the family history
    const diseaseRisks = calculateDiseaseRisk(
      snps,
      familyHistory,
      age,
      lifestyleFactors
    );

    // Generate inheritance report
    const inheritanceReport = generateInheritanceReport(familyHistory);

    setDiseaseAnalysis({
      snps,
      diseaseRisks,
      inheritanceReport
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">DNA Sequence Analysis Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-8">
            <DNASequenceInput
              value={sequence}
              onChange={setSequence}
              label="DNA Sequence"
            />

            <PatternInput
              value={pattern}
              onChange={setPattern}
              label="Pattern"
            />

            {/* Algorithm Selection */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Select Algorithms</h3>
              <div className="space-y-3">
                {algorithms.map((algorithm) => (
                  <label key={algorithm.name} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={algorithm.selected}
                      onChange={() => handleAlgorithmChange(algorithm.id, !algorithm.selected)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{algorithm.name}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleRunAnalysis}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Run String Matching Analysis
              </button>
            </div>

            {/* Alignment Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Sequence Alignment</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAlignment('needlemanWunsch')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Global Alignment (Needleman-Wunsch)
                </button>
                <button
                  onClick={() => handleAlignment('smithWaterman')}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Local Alignment (Smith-Waterman)
                </button>
              </div>
            </div>

            {/* Mutation Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Mutation Analysis</h3>
              <button
                onClick={handleMutationAnalysis}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Analyze Mutations
              </button>
            </div>

            {/* Disease Analysis Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Disease Analysis</h3>
              <div className="space-y-4">
                {/* Family History Input */}
                <FamilyHistoryInput onFamilyHistoryChange={handleFamilyHistoryChange} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lifestyle Factors
                  </label>
                  <div className="space-y-2">
                    {[
                      'Smoking',
                      'Obesity',
                      'High blood pressure',
                      'High cholesterol',
                      'Head injuries',
                      'Cardiovascular disease'
                    ].map((factor) => (
                      <label key={factor} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={lifestyleFactors.includes(factor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLifestyleFactors([...lifestyleFactors, factor]);
                            } else {
                              setLifestyleFactors(lifestyleFactors.filter(f => f !== factor));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{factor}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleDiseaseAnalysis}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Analyze Disease Risk
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {/* String Matching Results */}
            {results.length > 0 && (
              <>
                <ResultsTable results={results} />
                <ResultsChart results={results} />
              </>
            )}

            {/* Alignment Results */}
            {alignmentResult && (
              <AlignmentViewer
                alignedSeq1={alignmentResult.alignedSeq1}
                alignedSeq2={alignmentResult.alignedSeq2}
                stats={alignmentResult.stats}
              />
            )}

            {/* Mutation Analysis Results */}
            {mutationResult && (
              <MutationAnalysisViewer result={mutationResult} />
            )}

            {/* Disease Analysis Results */}
            {diseaseAnalysis && (
              <DiseaseAnalysisViewer
                snps={diseaseAnalysis.snps}
                diseaseRisks={diseaseAnalysis.diseaseRisks}
                inheritanceReport={diseaseAnalysis.inheritanceReport}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisToolPage;