import React from 'react';
import { InspectionSectionInfo, SectionData } from '../types';
import InspectionItem from './InspectionItem';

interface WizardStepProps {
  section: InspectionSectionInfo;
  data: SectionData;
  onDataChange: (sectionId: string, itemId: string, field: string, value: string | File | null) => void;
}

const WizardStep: React.FC<WizardStepProps> = ({ section, data, onDataChange }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-2">{section.title}</h2>
      {section.items.map(item => (
        <InspectionItem
          key={item.id}
          sectionId={section.id}
          item={item}
          data={data[item.id]}
          onDataChange={onDataChange}
        />
      ))}
    </div>
  );
};

export default WizardStep;
