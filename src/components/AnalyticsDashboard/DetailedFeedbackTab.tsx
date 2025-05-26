
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users } from 'lucide-react';
import { Feedback } from '../../services/api';

interface DetailedFeedbackTabProps {
  feedback: Feedback[];
  isLoading: boolean;
}

const DetailedFeedbackTab: React.FC<DetailedFeedbackTabProps> = ({ 
  feedback, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Detailed Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback.length > 0 ? (
          <div className="space-y-6 pt-4">
            {feedback.map((item, index) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <div className="flex flex-wrap justify-between mb-2">
                  <div>
                    <h4 className="font-medium">
                      Feedback #{index + 1}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(item.submitted_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tour: {item.tour_id}</p>
                    <p className="text-sm text-muted-foreground">
                      Status: {item.status}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Overall</p>
                    <p className="font-medium">{item.rating_overall}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Guide</p>
                    <p className="font-medium">{item.rating_guide}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="font-medium">{item.rating_driver}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Food</p>
                    <p className="font-medium">{item.rating_food || 'N/A'}</p>
                  </div>
                </div>
                
                {item.comments && (
                  <div className="mt-3 bg-muted/30 p-3 rounded-md">
                    <p className="text-sm italic">"{item.comments}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>No feedback data available.</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isLoading ? 'Loading...' : 'Try selecting a different tour or generating demo data.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedFeedbackTab;
