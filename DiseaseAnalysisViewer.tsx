import React from 'react';
import { DiseaseSNP } from '../algorithms/diseaseUtils';

interface DiseaseAnalysisViewerProps {
  snps: DiseaseSNP[];
  diseaseRisks: { disease: string; risk: number; factors: string[] }[];
  inheritanceReport: string[];
}

export const DiseaseAnalysisViewer: React.FC<DiseaseAnalysisViewerProps> = ({
  snps,
  diseaseRisks,
  inheritanceReport
}) => {
  return (
    <div className="space-y-6">
      {/* Detected SNPs Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Detected SNPs</h3>
        <div className="space-y-2">
          {snps.map((snp, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                snp.riskLevel === 'high'
                  ? 'bg-red-50 border border-red-200'
                  : snp.riskLevel === 'medium'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{snp.rsId}</p>
                  <p className="text-sm text-gray-600">
                    Chromosome {snp.chromosome}, Position {snp.position}
                  </p>
                  <p className="text-sm">
                    {snp.reference} → {snp.variant}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    snp.riskLevel === 'high'
                      ? 'bg-red-100 text-red-800'
                      : snp.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {snp.riskLevel.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{snp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disease Risk Assessment Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Disease Risk Assessment</h3>
        <div className="space-y-4">
          {diseaseRisks.map((risk, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{risk.disease}</span>
                <span className="text-sm text-gray-600">
                  {Math.round(risk.risk * 100)}% Risk
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    risk.risk > 0.7
                      ? 'bg-red-600'
                      : risk.risk > 0.4
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${risk.risk * 100}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Contributing Factors:</p>
                <ul className="list-disc list-inside">
                  {risk.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inheritance Report Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-3">Inheritance Analysis</h3>
        <div className="space-y-2">
          {inheritanceReport.map((line, index) => (
            <p key={index} className="text-sm text-gray-700">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}; 