import React, { useState } from 'react';

interface FamilyMember {
  relation: string;
  conditions: string[];
}

interface FamilyHistoryInputProps {
  onFamilyHistoryChange: (familyHistory: FamilyMember[]) => void;
}

export const FamilyHistoryInput: React.FC<FamilyHistoryInputProps> = ({ onFamilyHistoryChange }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedRelation, setSelectedRelation] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const relations = [
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Grandfather (Paternal)',
    'Grandmother (Paternal)',
    'Grandfather (Maternal)',
    'Grandmother (Maternal)'
  ];

  // Only include diseases from our DISEASE_SNPS database
  const conditions = [
    'Cardiovascular Disease',
    'Alzheimer\'s Disease',
    'Parkinson\'s Disease',
    'Autism Spectrum Disorder'
  ];

  const handleAddMember = () => {
    if (selectedRelation && selectedCondition) {
      const newMember: FamilyMember = {
        relation: selectedRelation,
        conditions: [selectedCondition]
      };
      const updatedMembers = [...familyMembers, newMember];
      setFamilyMembers(updatedMembers);
      onFamilyHistoryChange(updatedMembers);
      setSelectedRelation('');
      setSelectedCondition('');
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
    onFamilyHistoryChange(updatedMembers);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Family History</h3>
      
      {/* Input Form */}
      <div className="flex gap-4">
        <select
          value={selectedRelation}
          onChange={(e) => setSelectedRelation(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select Family Member</option>
          {relations.map((relation) => (
            <option key={relation} value={relation}>
              {relation}
            </option>
          ))}
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select Condition</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddMember}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Family History List */}
      <div className="space-y-2">
        {familyMembers.map((member, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{member.relation}</span>
              <span className="mx-2">-</span>
              <span>{member.conditions.join(', ')}</span>
            </div>
            <button
              onClick={() => handleRemoveMember(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 