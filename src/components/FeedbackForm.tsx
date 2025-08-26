
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const FeedbackForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Feedback collection is now handled through the admin panel.
        </p>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
