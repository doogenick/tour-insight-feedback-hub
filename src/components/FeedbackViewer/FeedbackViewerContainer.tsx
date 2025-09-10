import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Users, Eye } from 'lucide-react';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import TourFeedbackOverview from './TourFeedbackOverview';
import ClientFeedbackDetail from './ClientFeedbackDetail';

interface FeedbackViewerContainerProps {
  feedback: ComprehensiveFeedback[];
}

type ViewState = 'overview' | 'tour-list' | 'client-detail';

const FeedbackViewerContainer: React.FC<FeedbackViewerContainerProps> = ({ feedback }) => {
  const [currentView, setCurrentView] = useState<ViewState>('overview');
  const [selectedTourId, setSelectedTourId] = useState<string>('');
  const [selectedTourName, setSelectedTourName] = useState<string>('');
  const [selectedTourFeedback, setSelectedTourFeedback] = useState<ComprehensiveFeedback[]>([]);
  const [selectedClientFeedback, setSelectedClientFeedback] = useState<ComprehensiveFeedback | null>(null);

  const handleViewTourFeedback = (tourId: string, tourName: string) => {
    const tourFeedback = feedback.filter(f => f.tour_id === tourId);
    setSelectedTourId(tourId);
    setSelectedTourName(tourName);
    setSelectedTourFeedback(tourFeedback);
    setCurrentView('tour-list');
  };

  const handleViewClientFeedback = (clientFeedback: ComprehensiveFeedback) => {
    setSelectedClientFeedback(clientFeedback);
    setCurrentView('client-detail');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedTourId('');
    setSelectedTourName('');
    setSelectedTourFeedback([]);
    setSelectedClientFeedback(null);
  };

  const handleBackToTourList = () => {
    setCurrentView('tour-list');
    setSelectedClientFeedback(null);
  };

  const renderBreadcrumb = () => {
    switch (currentView) {
      case 'overview':
        return <h1 className="text-2xl font-bold">Feedback Viewer</h1>;
      case 'tour-list':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{selectedTourName}</h1>
          </div>
        );
      case 'client-detail':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Overview
            </Button>
            <span className="text-muted-foreground">/</span>
            <Button variant="ghost" size="sm" onClick={handleBackToTourList}>
              {selectedTourName}
            </Button>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold">{selectedClientFeedback?.client_name || 'Client Feedback'}</h1>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentView === 'overview') {
    return (
      <div className="space-y-6">
        {renderBreadcrumb()}
        <TourFeedbackOverview 
          feedback={feedback} 
          onViewTourFeedback={handleViewTourFeedback}
        />
      </div>
    );
  }

  if (currentView === 'tour-list') {
    return (
      <div className="space-y-6">
        {renderBreadcrumb()}
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Feedback for {selectedTourName}
              </CardTitle>
              <Badge variant="secondary">
                {selectedTourFeedback.length} {selectedTourFeedback.length === 1 ? 'Client' : 'Clients'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedTourFeedback.map((clientFeedback, index) => (
                <div key={clientFeedback.id || index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {clientFeedback.client_name || `Client ${index + 1}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{clientFeedback.client_email || 'No email provided'}</span>
                      <span>{clientFeedback.overview_rating}/7</span>
                      <span>
                        {clientFeedback.submitted_at 
                          ? new Date(clientFeedback.submitted_at).toLocaleDateString()
                          : 'No date'
                        }
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewClientFeedback(clientFeedback)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'client-detail' && selectedClientFeedback) {
    return (
      <div className="space-y-6">
        {renderBreadcrumb()}
        <ClientFeedbackDetail feedback={selectedClientFeedback} />
      </div>
    );
  }

  return null;
};

export default FeedbackViewerContainer;