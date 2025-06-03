
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface SignatureSectionProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  formData,
  updateFormData
}) => {
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Signatures</h3>
      
      <div className="bg-black text-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <Label className="text-white font-bold text-sm">Client Signature</Label>
            <div className="mt-2">
              <Input
                value={formData.client_signature || ''}
                onChange={(e) => updateFormData('client_signature', e.target.value)}
                placeholder="Type your name"
                className="bg-white text-black"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white font-bold text-sm">Date</Label>
            <div className="mt-2">
              <Input
                type="date"
                value={formData.client_signature_date || getCurrentDate()}
                onChange={(e) => updateFormData('client_signature_date', e.target.value)}
                className="bg-white text-black"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white font-bold text-sm">Crew Signature</Label>
            <div className="mt-2">
              <Input
                value={formData.crew_signature || ''}
                onChange={(e) => updateFormData('crew_signature', e.target.value)}
                placeholder="Crew member signature"
                className="bg-white text-black"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-white font-bold text-sm">Office Use Only</Label>
            <div className="mt-2 p-4 bg-gray-600 text-center text-sm">
              Internal Processing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;
