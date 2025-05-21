
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Check, ExternalLink } from 'lucide-react';

interface ReviewRedirectPanelProps {
  clientName: string;
  clientEmail?: string;
  onClose: () => void;
  platforms: {
    google: boolean;
    tripadvisor: boolean;
  };
}

const ReviewRedirectPanel: React.FC<ReviewRedirectPanelProps> = ({
  clientName,
  clientEmail,
  onClose,
  platforms
}) => {
  const [email, setEmail] = useState(clientEmail || '');
  const [reviewSubmitted, setReviewSubmitted] = useState({
    google: false,
    tripadvisor: false
  });
  
  // These would be your actual review URLs in a real application
  const reviewUrls = {
    google: 'https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID',
    tripadvisor: 'https://www.tripadvisor.com/UserReview-YOUR_TRIPADVISOR_ID'
  };
  
  const handleReviewRedirect = (platform: 'google' | 'tripadvisor') => {
    // Open the review platform in a new tab
    window.open(reviewUrls[platform], '_blank');
    // Mark as submitted
    setReviewSubmitted({
      ...reviewSubmitted,
      [platform]: true
    });
  };
  
  const handleSendReminderEmail = () => {
    // In a real application, this would send an email reminder
    // For demo purposes, we'll just show a success alert
    alert(`A review reminder email has been sent to ${email}`);
    onClose();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-muted/30">
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          Thank you for your feedback! Help others discover our tours by sharing a review.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="review-now">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="review-now">Review Now</TabsTrigger>
            <TabsTrigger value="remind-me">Remind Me Later</TabsTrigger>
          </TabsList>
          
          <TabsContent value="review-now" className="space-y-6">
            <div className="space-y-4">
              <p className="text-center">
                Select a platform to share your review:
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {platforms.google && (
                  <Button
                    onClick={() => handleReviewRedirect('google')}
                    variant={reviewSubmitted.google ? "outline" : "default"}
                    className="h-auto py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6 mr-2" />
                      <span>Share on Google</span>
                    </div>
                    {reviewSubmitted.google ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                {platforms.tripadvisor && (
                  <Button
                    onClick={() => handleReviewRedirect('tripadvisor')}
                    variant={reviewSubmitted.tripadvisor ? "outline" : "default"}
                    className="h-auto py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" alt="TripAdvisor" className="h-6 mr-2" />
                      <span>Share on TripAdvisor</span>
                    </div>
                    {reviewSubmitted.tripadvisor ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-center text-muted-foreground pt-4">
                Your review helps us improve and helps others discover our tours!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="remind-me" className="space-y-6">
            <div className="space-y-4">
              <p>
                We'll send you a reminder email with links to review platforms.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="email">Your Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleSendReminderEmail}
                  disabled={!email}
                  className="w-full"
                >
                  Send Me a Reminder
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end bg-muted/30 p-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewRedirectPanel;
