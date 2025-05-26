
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';

interface EmailPreferencesSectionProps {
  email: string;
  willingGoogle: boolean;
  willingTripadvisor: boolean;
  onEmailChange: (email: string) => void;
  onWillingGoogleChange: (willing: boolean) => void;
  onWillingTripadvisorChange: (willing: boolean) => void;
}

const EmailPreferencesSection: React.FC<EmailPreferencesSectionProps> = ({
  email,
  willingGoogle,
  willingTripadvisor,
  onEmailChange,
  onWillingGoogleChange,
  onWillingTripadvisorChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email (optional)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="your@email.com"
        />
      </div>
      
      <div className="space-y-3">
        <Label>Would you be willing to share your experience?</Label>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="google-review"
            checked={willingGoogle}
            onCheckedChange={(checked) => onWillingGoogleChange(checked as boolean)}
          />
          <Label htmlFor="google-review" className="cursor-pointer">
            I'm willing to leave a Google review
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tripadvisor-review"
            checked={willingTripadvisor}
            onCheckedChange={(checked) => onWillingTripadvisorChange(checked as boolean)}
          />
          <Label htmlFor="tripadvisor-review" className="cursor-pointer">
            I'm willing to leave a TripAdvisor review
          </Label>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesSection;
