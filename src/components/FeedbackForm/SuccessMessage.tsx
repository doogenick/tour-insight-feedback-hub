
import React from 'react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Clipboard, ExternalLink } from 'lucide-react';

interface SuccessMessageProps {
  willingGoogle: boolean;
  willingTripadvisor: boolean;
  comments: string;
  onCopyFeedback: () => void;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  willingGoogle,
  willingTripadvisor,
  comments,
  onCopyFeedback,
  onReset
}) => {
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
              
              <div className="flex flex-wrap justify-center gap-4">
                {willingGoogle && (
                  <Button 
                    className="bg-tour-primary hover:bg-tour-secondary flex gap-2 py-6 px-8" 
                    asChild
                  >
                    <a href="https://g.page/YOUR_BUSINESS_NAME/review?rc" target="_blank" rel="noopener noreferrer">
                      <span>Share on Google</span>
                      <ExternalLink size={16} />
                    </a>
                  </Button>
                )}
                
                {willingTripadvisor && (
                  <Button 
                    className="bg-tour-primary hover:bg-tour-secondary flex gap-2 py-6 px-8" 
                    asChild
                  >
                    <a href="https://www.tripadvisor.com/UserReview-gYOUR_CITY_ID-dYOUR_BUSINESS_ID-YOUR_BUSINESS_NAME.html" target="_blank" rel="noopener noreferrer">
                      <span>Share on TripAdvisor</span>
                      <ExternalLink size={16} />
                    </a>
                  </Button>
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
