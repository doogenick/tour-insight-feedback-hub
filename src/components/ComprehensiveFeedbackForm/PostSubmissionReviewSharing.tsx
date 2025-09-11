import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useWifiConnection } from '../../hooks/useWifiConnection';
import { useToast } from '../ui/use-toast';
import { BarChart3, ExternalLink, Mail, MessageSquare, Wifi, WifiOff, CheckCircle, Clock } from 'lucide-react';

interface PostSubmissionReviewSharingProps {
  clientName: string;
  clientEmail?: string;
  tourName: string;
  onReviewShared: (platform: 'google' | 'tripadvisor') => void;
  onSkip: () => void;
}

const PostSubmissionReviewSharing: React.FC<PostSubmissionReviewSharingProps> = ({
  clientName,
  clientEmail,
  tourName,
  onReviewShared,
  onSkip
}) => {
  const { hasWifi } = useWifiConnection();
  const { toast } = useToast();

  const handleGoogleReviewClick = () => {
    const businessName = "Nomad Africa Adventure Tours";
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`;
    window.open(googleReviewUrl, '_blank');
    
    toast({
      title: "Review Window Opened",
      description: "Thank you! Please complete your Google review in the new window.",
      duration: 5000,
    });
    
    onReviewShared('google');
  };

  const handleTripAdvisorClick = () => {
    const tripAdvisorUrl = `https://www.tripadvisor.com/UserReviewEdit-g294203-d1234567-Nomad_Africa_Adventure_Tours.html`;
    window.open(tripAdvisorUrl, '_blank');
    
    toast({
      title: "Review Window Opened", 
      description: "Thank you! Please complete your TripAdvisor review in the new window.",
      duration: 5000,
    });
    
    onReviewShared('tripadvisor');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader className="text-center bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Feedback Submitted
          </Badge>
        </div>
        <CardTitle className="text-xl text-gray-800">
          Thank you, {clientName}!
        </CardTitle>
        <p className="text-muted-foreground">
          Your feedback for <strong>{tourName}</strong> has been successfully submitted.
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Help Other Travelers</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Share your experience online to help others discover amazing adventures like yours!
          </p>
        </div>

        {hasWifi ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-medium">Great connection - perfect for sharing!</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 hover:border-red-300 transition-colors cursor-pointer" onClick={handleGoogleReviewClick}>
                <CardContent className="p-4 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold">Google Reviews</h4>
                    <p className="text-sm text-muted-foreground">
                      Help travelers find us on Google Maps and Search
                    </p>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleGoogleReviewClick}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Review on Google
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-300 transition-colors cursor-pointer" onClick={handleTripAdvisorClick}>
                <CardContent className="p-4 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">TripAdvisor</h4>
                    <p className="text-sm text-muted-foreground">
                      Share with the TripAdvisor travel community
                    </p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleTripAdvisorClick}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Review on TripAdvisor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={onSkip} className="px-8">
                I'll Review Later
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <WifiOff className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">No Internet Connection</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    No worries! We'll send you reminders to share your review when you're back online.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex gap-2 mt-0.5">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Review Reminder Service</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {clientEmail ? (
                      <>We'll send an email to <strong>{clientEmail}</strong> and an SMS reminder with direct links to make reviewing super easy on your mobile device.</>
                    ) : (
                      <>We'll send you an email and SMS reminder with direct links to make reviewing quick and easy on your mobile device.</>
                    )}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">
                      First reminder within 24 hours
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button onClick={onSkip} className="px-8">
                Continue
              </Button>
            </div>
          </div>
        )}

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Your honest feedback helps us improve and helps other travelers choose their perfect adventure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostSubmissionReviewSharing;