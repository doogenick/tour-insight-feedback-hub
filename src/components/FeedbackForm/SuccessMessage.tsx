
import React, { useState } from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Clipboard } from 'lucide-react';
import ReviewShareButtons from '../ReviewShareButtons';

interface SuccessMessageProps {
  feedbackId: string;
  tourName: string;
  willingGoogle: boolean;
  willingTripadvisor: boolean;
  comments: string;
  onCopyFeedback: () => void;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  feedbackId,
  tourName,
  willingGoogle,
  willingTripadvisor,
  comments,
  onCopyFeedback,
  onReset
}) => {
  const [hasShared, setHasShared] = useState({
    google: false,
    tripadvisor: false
  });

  const handleShareSuccess = (platform: 'google' | 'tripadvisor') => {
    setHasShared(prev => ({
      ...prev,
      [platform]: true
    }));
  };
  return (
    <>
      <CardHeader className="text-center bg-tour-success text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
        <CardDescription className="text-white/80">
          Your feedback has been received and is greatly appreciated.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        <div className="text-center space-y-4">
          <p className="text-lg">
            We appreciate your time and valuable feedback.
          </p>
          
          {(willingGoogle || willingTripadvisor) && (
            <div className="space-y-6 my-8">
              <p className="text-lg font-medium text-tour-primary">
                Would you mind sharing your experience on:
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your feedback helps other travelers and supports our business. Thank you!
                </p>
                <div className="flex justify-center">
                  <ReviewShareButtons
                    feedbackId={feedbackId}
                    tourName={tourName}
                    onShareSuccess={handleShareSuccess}
                    className="flex-col sm:flex-row gap-4"
                  />
                </div>
                {(hasShared.google || hasShared.tripadvisor) && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Thank you for sharing your experience! Your review makes a big difference.
                  </p>
                )}
              </div>
              
              {comments && (
                <Button 
                  variant="outline" 
                  className="flex gap-2" 
                  onClick={onCopyFeedback}
                >
                  <Clipboard size={16} />
                  <span>Copy Your Feedback</span>
                </Button>
              )}
            </div>
          )}
          
          <Button 
            className="mt-8 bg-tour-primary hover:bg-tour-secondary" 
            onClick={onReset}
          >
            Submit Another Response
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default SuccessMessage;
