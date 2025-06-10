// Common disease-associated SNPs
export interface DiseaseSNP {
  rsId: string;
  chromosome: string;
  position: number;
  reference: string;
  variant: string;
  disease: string;
  riskLevel: 'high' | 'medium' | 'low';
  inheritance: 'dominant' | 'recessive' | 'complex';
  description: string;
}

// Sample disease-associated SNPs database
export const DISEASE_SNPS: DiseaseSNP[] = [
  {
    rsId: 'rs1801133',
    chromosome: '1',
    position: 1,
    reference: 'C',
    variant: 'T',
    disease: 'Cardiovascular Disease',
    riskLevel: 'medium',
    inheritance: 'complex',
    description: 'MTHFR C677T polymorphism associated with increased cardiovascular risk'
  },
  {
    rsId: 'rs53576',
    chromosome: '3',
    position: 2,
    reference: 'A',
    variant: 'G',
    disease: 'Autism Spectrum Disorder',
    riskLevel: 'low',
    inheritance: 'complex',
    description: 'OXTR gene variant associated with social behavior'
  },
  {
    rsId: 'rs1800497',
    chromosome: '11',
    position: 3,
    reference: 'C',
    variant: 'T',
    disease: 'Parkinson\'s Disease',
    riskLevel: 'medium',
    inheritance: 'complex',
    description: 'DRD2/ANKK1 gene variant associated with dopamine receptor function'
  },
  {
    rsId: 'rs429358',
    chromosome: '19',
    position: 4,
    reference: 'C',
    variant: 'T',
    disease: 'Alzheimer\'s Disease',
    riskLevel: 'high',
    inheritance: 'complex',
    description: 'APOE ε4 variant associated with increased Alzheimer\'s risk'
  }
];

// Disease inheritance patterns
export interface DiseaseInheritance {
  disease: string;
  inheritance: 'autosomal dominant' | 'autosomal recessive' | 'X-linked' | 'complex';
  riskFactors: string[];
  symptoms: string[];
  prevention: string[];
}

export const DISEASE_INHERITANCE: Record<string, DiseaseInheritance> = {
  'Cardiovascular Disease': {
    disease: 'Cardiovascular Disease',
    inheritance: 'complex',
    riskFactors: [
      'Family history',
      'High blood pressure',
      'High cholesterol',
      'Smoking',
      'Obesity'
    ],
    symptoms: [
      'Chest pain',
      'Shortness of breath',
      'Irregular heartbeat',
      'Fatigue'
    ],
    prevention: [
      'Regular exercise',
      'Healthy diet',
      'Smoking cessation',
      'Blood pressure control'
    ]
  },
  'Alzheimer\'s Disease': {
    disease: 'Alzheimer\'s Disease',
    inheritance: 'complex',
    riskFactors: [
      'Family history',
      'Age',
      'APOE ε4 gene variant',
      'Head injuries',
      'Cardiovascular disease'
    ],
    symptoms: [
      'Memory loss',
      'Confusion',
      'Behavioral changes',
      'Difficulty with daily tasks'
    ],
    prevention: [
      'Mental stimulation',
      'Physical exercise',
      'Social engagement',
      'Healthy diet'
    ]
  }
};

// Function to analyze SNPs in a sequence
export function analyzeSNPs(sequence: string, position: number): DiseaseSNP[] {
  return DISEASE_SNPS.filter(snp => {
    // Check if the sequence is long enough to contain this SNP
    if (sequence.length < snp.position) {
      return false;
    }

    // Get the nucleotide at the SNP position
    const nucleotide = sequence[snp.position - 1]; // Convert to 0-based index

    // Check if this position matches either the reference or variant
    return nucleotide === snp.reference || nucleotide === snp.variant;
  });
}

// Function to calculate disease risk based on SNPs and family history
export function calculateDiseaseRisk(
  snps: DiseaseSNP[],
  familyHistory: { relation: string; conditions: string[] }[],
  age: number,
  lifestyleFactors: string[]
): { disease: string; risk: number; factors: string[] }[] {
  const risks: { disease: string; risk: number; factors: string[] }[] = [];
  const diseases = new Set(snps.map(snp => snp.disease));

  diseases.forEach(disease => {
    let risk = 0;
    const factors: string[] = [];

    // Calculate risk from SNPs
    const diseaseSNPs = snps.filter(snp => snp.disease === disease);
    diseaseSNPs.forEach(snp => {
      switch (snp.riskLevel) {
        case 'high':
          risk += 0.4;
          factors.push(`High-risk SNP: ${snp.rsId}`);
          break;
        case 'medium':
          risk += 0.2;
          factors.push(`Medium-risk SNP: ${snp.rsId}`);
          break;
        case 'low':
          risk += 0.1;
          factors.push(`Low-risk SNP: ${snp.rsId}`);
          break;
      }
    });

    // Add family history risk
    const familyMembersWithDisease = familyHistory.filter(member => 
      member.conditions.includes(disease)
    );

    if (familyMembersWithDisease.length > 0) {
      // Calculate risk based on number of affected family members
      const familyRisk = Math.min(0.5, 0.1 * familyMembersWithDisease.length);
      risk += familyRisk;
      
      // Add family history details to factors
      familyMembersWithDisease.forEach(member => {
        factors.push(`Family history: ${member.relation} affected`);
      });
    }

    // Add age-related risk
    if (age > 50) {
      risk += 0.2;
      factors.push('Age > 50');
    }

    // Add lifestyle factors
    const inheritance = DISEASE_INHERITANCE[disease];
    if (inheritance) {
      inheritance.riskFactors.forEach(factor => {
        if (lifestyleFactors.includes(factor)) {
          risk += 0.1;
          factors.push(`Lifestyle factor: ${factor}`);
        }
      });
    }

    // Normalize risk to 0-1 range
    risk = Math.min(1, risk);

    risks.push({
      disease,
      risk,
      factors
    });
  });

  return risks;
}

// Function to generate family inheritance report
export function generateInheritanceReport(
  familyHistory: { relation: string; conditions: string[] }[]
): string[] {
  const report: string[] = [];
  
  if (familyHistory.length === 0) {
    report.push("No family history data available.");
    return report;
  }

  // Group conditions by family member
  const conditionsByMember = familyHistory.reduce((acc, member) => {
    member.conditions.forEach(condition => {
      if (!acc[condition]) {
        acc[condition] = [];
      }
      acc[condition].push(member.relation);
    });
    return acc;
  }, {} as Record<string, string[]>);

  // Generate report for each condition
  Object.entries(conditionsByMember).forEach(([condition, members]) => {
    report.push(`${condition}:`);
    report.push(`  Affected family members: ${members.join(', ')}`);
    
    // Add inheritance pattern information
    const inheritance = DISEASE_INHERITANCE[condition];
    if (inheritance) {
      report.push(`  Inheritance pattern: ${inheritance.inheritance}`);
      report.push(`  Risk factors: ${inheritance.riskFactors.join(', ')}`);
    }
    report.push(''); // Add blank line for readability
  });

  return report;
} 