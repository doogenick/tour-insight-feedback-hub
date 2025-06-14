
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { FeedbackAnalytics } from '../../../services/comprehensiveFeedbackService';

interface FeedbackTextTabProps {
  commonFeedback: FeedbackAnalytics['commonFeedback'];
}

const FeedbackTextCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 max-h-64 overflow-y-auto">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="p-2 bg-muted rounded text-sm">
            "{item}"
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No {title.toLowerCase().replace('suggestions', 'suggestions available')}</p>
      )}
    </CardContent>
  </Card>
);


const FeedbackTextTab: React.FC<FeedbackTextTabProps> = ({ commonFeedback }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <FeedbackTextCard title="Tour Highlights" items={commonFeedback.highlights} />
    <FeedbackTextCard title="Improvement Suggestions" items={commonFeedback.improvements} />
    <FeedbackTextCard title="Additional Comments" items={commonFeedback.additionalComments} />
  </div>
);

export default FeedbackTextTab;
