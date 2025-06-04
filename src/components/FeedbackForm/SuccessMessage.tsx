
import React from 'react';
import { CheckCircle, Copy, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export interface SuccessMessageProps {
  feedbackId?: string;
  tourName?: string;
  willingGoogle?: boolean;
  willingTripadvisor?: boolean;
  comments?: string;
  onCopyFeedback?: () => void;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  feedbackId,
  tourName,
  willingGoogle = false,
  willingTripadvisor = false,
  comments = '',
  onCopyFeedback,
  onReset
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto bg-green-50 border-green-200">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-800">Thank You!</h2>
            <p className="text-green-700">
              Your feedback has been submitted successfully{tourName ? ` for ${tourName}` : ''}.
            </p>
            {feedbackId && (
              <p className="text-sm text-green-600">
                Reference ID: {feedbackId}
              </p>
            )}
          </div>

          {(willingGoogle || willingTripadvisor) && (
            <div className="w-full p-4 bg-green-100 rounded-lg">
              <h3 className="font-medium text-green-800 mb-3">
                Help others discover great experiences!
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {willingGoogle && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-200"
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Review on Google
                  </Button>
                )}
                {willingTripadvisor && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-200"
                    onClick={() => window.open('https://tripadvisor.com', '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Review on TripAdvisor
                  </Button>
                )}
              </div>
            </div>
          )}

          {comments && onCopyFeedback && (
            <div className="w-full p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium text-gray-800 mb-2">Your Feedback:</h4>
              <p className="text-sm text-gray-600 mb-3 italic">"{comments}"</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyFeedback}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Feedback
              </Button>
            </div>
          )}

          <Button 
            onClick={onReset}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <RotateCcw className="h-4 w-4" />
            Submit Another Response
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessMessage;
