
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface StaffNamesSectionProps {
  guideName: string;
  driverName: string;
  onGuideNameChange: (name: string) => void;
  onDriverNameChange: (name: string) => void;
}

const StaffNamesSection: React.FC<StaffNamesSectionProps> = ({
  guideName,
  driverName,
  onGuideNameChange,
  onDriverNameChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="guide-name">Guide Name <span className="text-red-500">*</span></Label>
        <Input
          id="guide-name"
          value={guideName}
          onChange={(e) => onGuideNameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="driver-name">Driver Name <span className="text-red-500">*</span></Label>
        <Input
          id="driver-name"
          value={driverName}
          onChange={(e) => onDriverNameChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default StaffNamesSection;
