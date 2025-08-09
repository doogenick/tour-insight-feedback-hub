import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useIsMobile } from '../hooks/use-mobile';
import { 
  MapPin, 
  Users, 
  ClipboardList, 
  Database,
  ChevronLeft,
  Settings
} from 'lucide-react';

// Mobile-specific components
import GuideSelectionPanel from '../components/MobileFeedbackFlow/GuideSelectionPanel';
import ClientSelfSelection from '../components/MobileFeedbackFlow/ClientSelfSelection';
import EnhancedComprehensiveFeedbackForm from '../components/ComprehensiveFeedbackForm/EnhancedComprehensiveFeedbackForm';
import OfflineFeedbackManager from '../components/MobileFeedbackFlow/OfflineFeedbackManager';

type MobileStep = 'guide-selection' | 'client-selection' | 'feedback-form' | 'offline-manager';

const MobileFeedbackPage: React.FC = () => {
  const { 
    selectedTour, 
    selectedClient, 
    clients = [], 
    fetchClients,
    setSelectedClient,
    setSelectedTour
  } = useAppContext();
  
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = React.useState<MobileStep>('guide-selection');
  const [showOfflineManager, setShowOfflineManager] = React.useState(false);

  // Determine current step based on selections
  useEffect(() => {
    if (showOfflineManager) {
      setCurrentStep('offline-manager');
    } else if (selectedClient) {
      setCurrentStep('feedback-form');
    } else if (selectedTour) {
      setCurrentStep('client-selection');
    } else {
      setCurrentStep('guide-selection');
    }
  }, [selectedTour, selectedClient, showOfflineManager]);

  // Fetch clients when tour is selected
  useEffect(() => {
    if (selectedTour && clients.length === 0) {
      fetchClients(selectedTour.tour_id);
    }
  }, [selectedTour, clients.length, fetchClients]);

  const goBack = () => {
    if (currentStep === 'offline-manager') {
      setShowOfflineManager(false);
    } else if (currentStep === 'feedback-form') {
      setSelectedClient(null);
    } else if (currentStep === 'client-selection') {
      setSelectedTour(null);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'guide-selection':
        return 'Tour Selection';
      case 'client-selection':
        return 'Client Selection';
      case 'feedback-form':
        return 'Feedback Form';
      case 'offline-manager':
        return 'Data Manager';
      default:
        return 'Tour Feedback';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'guide-selection':
        return <MapPin className="h-5 w-5" />;
      case 'client-selection':
        return <Users className="h-5 w-5" />;
      case 'feedback-form':
        return <ClipboardList className="h-5 w-5" />;
      case 'offline-manager':
        return <Database className="h-5 w-5" />;
      default:
        return <ClipboardList className="h-5 w-5" />;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'px-2 py-4' : 'px-4 py-8'}`}>
      {/* Mobile Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {currentStep !== 'guide-selection' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {getStepTitle()}
            </h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOfflineManager(!showOfflineManager)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`flex items-center gap-1 ${currentStep === 'guide-selection' ? 'text-primary font-medium' : ''}`}>
            <MapPin className="h-3 w-3" />
            Tour
          </div>
          
          {selectedTour && (
            <>
              <span>→</span>
              <div className={`flex items-center gap-1 ${currentStep === 'client-selection' ? 'text-primary font-medium' : ''}`}>
                <Users className="h-3 w-3" />
                Client
              </div>
            </>
          )}
          
          {selectedClient && (
            <>
              <span>→</span>
              <div className={`flex items-center gap-1 ${currentStep === 'feedback-form' ? 'text-primary font-medium' : ''}`}>
                <ClipboardList className="h-3 w-3" />
                Feedback
              </div>
            </>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 'guide-selection' && <GuideSelectionPanel />}
        
        {currentStep === 'client-selection' && <ClientSelfSelection />}
        
        {currentStep === 'feedback-form' && <EnhancedComprehensiveFeedbackForm />}
        
        {currentStep === 'offline-manager' && <OfflineFeedbackManager />}
      </div>

      {/* Help Section */}
      {currentStep === 'guide-selection' && (
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className={`text-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Welcome to Tour Feedback
            </CardTitle>
            <CardDescription className="text-center">
              This mobile-optimized feedback system works offline and automatically saves your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription>
                <strong>Getting Started:</strong>
                <br />
                1. Select your tour as the guide
                <br />
                2. Let clients choose themselves from the list
                <br />
                3. Help them complete their detailed feedback
                <br />
                4. All data is saved locally and syncs when online
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileFeedbackPage;