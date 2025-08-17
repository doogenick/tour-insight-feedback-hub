
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';

interface PersonalDetailsProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Personal Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_name" className="after:content-['*'] after:ml-1 after:text-destructive">Full Name</Label>
          <Input
            id="client_name"
            value={formData.client_name || ''}
            onChange={(e) => updateFormData('client_name', e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client_email" className="after:content-['*'] after:ml-1 after:text-destructive">Email Address</Label>
          <Input
            id="client_email"
            type="email"
            value={formData.client_email || ''}
            onChange={(e) => updateFormData('client_email', e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cellphone">Cellphone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
          <Input
            id="cellphone"
            type="tel"
            value={formData.cellphone || ''}
            onChange={(e) => updateFormData('cellphone', e.target.value)}
            placeholder="e.g. +27821234567"
            inputMode="tel"
            pattern="^(\+?\d{6,})?$"
            autoComplete="tel"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality || ''}
            onChange={(e) => updateFormData('nationality', e.target.value)}
            placeholder="Your nationality"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="120"
            value={formData.age || ''}
            onChange={(e) => updateFormData('age', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="Your age"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="font-bold">Gender (Optional)</Label>
        <RadioGroup 
          value={formData.gender || ''} 
          onValueChange={(value) => updateFormData('gender', value)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="gender_male" />
            <Label htmlFor="gender_male" className="cursor-pointer">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="gender_female" />
            <Label htmlFor="gender_female" className="cursor-pointer">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="gender_other" />
            <Label htmlFor="gender_other" className="cursor-pointer">Other</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <Label className="font-bold">Marketing Preferences</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter-signup"
              checked={formData.newsletter_signup || false}
              onCheckedChange={(checked) => updateFormData('newsletter_signup', checked as boolean)}
            />
            <Label htmlFor="newsletter-signup" className="cursor-pointer">
              Sign me up for the monthly newsletter
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
