import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Star, ExternalLink } from 'lucide-react';

interface ReviewConsentProps {
  willingToReviewGoogle: boolean;
  willingToReviewTripadvisor: boolean;
  onGoogleChange: (checked: boolean) => void;
  onTripadvisorChange: (checked: boolean) => void;
}

const ReviewConsent: React.FC<ReviewConsentProps> = ({
  willingToReviewGoogle,
  willingToReviewTripadvisor,
  onGoogleChange,
  onTripadvisorChange
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          Help Us Grow - Leave a Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your feedback helps other travelers discover our amazing tours! If you enjoyed your experience, 
          we'd be incredibly grateful if you could take a moment to leave a review on one of these platforms.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="google-review"
              checked={willingToReviewGoogle}
              onCheckedChange={onGoogleChange}
            />
            <Label htmlFor="google-review" className="text-sm font-medium">
              I'd like to receive an email reminder to leave a Google Review
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tripadvisor-review"
              checked={willingToReviewTripadvisor}
              onCheckedChange={onTripadvisorChange}
            />
            <Label htmlFor="tripadvisor-review" className="text-sm font-medium">
              I'd like to receive an email reminder to leave a TripAdvisor Review
            </Label>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>What happens next?</strong> If you check either box, we'll send you a friendly email 
            with direct links to leave your review. It takes just 2 minutes and helps us tremendously!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewConsent;
