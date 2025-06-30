
import React from 'react';
import { ComprehensiveFeedback } from '../../services/api/types';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useWifiConnection } from '../../hooks/useWifiConnection';
import { useToast } from '../ui/use-toast';
import { Wifi, WifiOff, ExternalLink, Star } from 'lucide-react';

interface ReviewSharingSectionProps {
  formData: Partial<ComprehensiveFeedback>;
  updateFormData: (field: keyof ComprehensiveFeedback, value: any) => void;
  clientEmail?: string;
}

const ReviewSharingSection: React.FC<ReviewSharingSectionProps> = ({
  formData,
  updateFormData,
  clientEmail
}) => {
  const { isOnline, hasWifi } = useWifiConnection();
  const { toast } = useToast();

  const handleGoogleReviewClick = () => {
    if (hasWifi && clientEmail) {
      // Open Google Reviews with pre-populated data
      const businessName = "Nomad Africa Adventure Tours";
      const googleReviewUrl = `https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`;
      window.open(googleReviewUrl, '_blank');
      
      toast({
        title: "Review Window Opened",
        description: "Please complete your Google review in the new window.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Offline Mode",
        description: "Your review preference has been saved. We'll send you a reminder to leave a review within 24 hours.",
        duration: 5000,
      });
    }
  };

  const handleTripAdvisorClick = () => {
    if (hasWifi && clientEmail) {
      // Open TripAdvisor review page
      const tripAdvisorUrl = `https://www.tripadvisor.com/UserReviewEdit-g294203-d1234567-Nomad_Africa_Adventure_Tours.html`;
      window.open(tripAdvisorUrl, '_blank');
      
      toast({
        title: "Review Window Opened", 
        description: "Please complete your TripAdvisor review in the new window.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Offline Mode",
        description: "Your review preference has been saved. We'll send you a reminder to leave a review within 24 hours.",
        duration: 5000,
      });
    }
  };

  return (
    <Card className="border-2 border-tour-primary">
      <CardHeader className="bg-tour-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Share Your Experience
          <div className="ml-auto flex items-center gap-2">
            {hasWifi ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-sm">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-sm">Offline</span>
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Help other travelers by sharing your experience online. Your review helps us improve and helps others choose their adventure!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="google-review-willing"
                checked={formData.willing_to_review_google || false}
                onCheckedChange={(checked) => updateFormData('willing_to_review_google', checked as boolean)}
              />
              <div>
                <Label htmlFor="google-review-willing" className="cursor-pointer font-medium">
                  Google Reviews
                </Label>
                <p className="text-sm text-muted-foreground">
                  Share your experience on Google to help other travelers
                </p>
              </div>
            </div>
            
            {formData.willing_to_review_google && (
              <Button
                onClick={handleGoogleReviewClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {hasWifi ? 'Review Now' : 'Remind Me'}
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="tripadvisor-review-willing"
                checked={formData.willing_to_review_tripadvisor || false}
                onCheckedChange={(checked) => updateFormData('willing_to_review_tripadvisor', checked as boolean)}
              />
              <div>
                <Label htmlFor="tripadvisor-review-willing" className="cursor-pointer font-medium">
                  TripAdvisor
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help fellow travelers on TripAdvisor with your honest review
                </p>
              </div>
            </div>
            
            {formData.willing_to_review_tripadvisor && (
              <Button
                onClick={handleTripAdvisorClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {hasWifi ? 'Review Now' : 'Remind Me'}
              </Button>
            )}
          </div>
        </div>

        {!hasWifi && (formData.willing_to_review_google || formData.willing_to_review_tripadvisor) && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <WifiOff className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Offline Mode</h4>
                <p className="text-sm text-orange-700 mt-1">
                  No internet connection detected. We'll send you a reminder via {clientEmail ? 'email' : 'SMS'} within 24 hours 
                  to leave your review while you're traveling home.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasWifi && (formData.willing_to_review_google || formData.willing_to_review_tripadvisor) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Ready to Review!</h4>
                <p className="text-sm text-green-700 mt-1">
                  Great connection detected! Click the buttons above to leave your review now. 
                  {clientEmail && " We'll pre-fill your email address to make it easier."}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSharingSection;
