import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useOfflineFeedback } from '../../hooks/useOfflineFeedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Users, UserCheck, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

const ClientSelfSelection: React.FC = () => {
  const { clients, selectedClient, setSelectedClient, selectedTour } = useAppContext();
  const { drafts, getDraft } = useOfflineFeedback();
  const isMobile = useIsMobile();
  const [clientsWithDrafts, setClientsWithDrafts] = useState<string[]>([]);

  // Check which clients have drafts
  useEffect(() => {
    const checkDrafts = async () => {
      const clientsWithDraftsList: string[] = [];
      
      for (const client of clients) {
        const draft = await getDraft(client.client_id);
        if (draft) {
          clientsWithDraftsList.push(client.client_id);
        }
      }
      
      setClientsWithDrafts(clientsWithDraftsList);
    };

    if (clients.length > 0) {
      checkDrafts();
    }
  }, [clients, getDraft, drafts]);

  if (!selectedTour) {
    return null;
  }

  if (clients.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-muted-foreground">No Clients Found</CardTitle>
          <CardDescription>
            No clients are registered for this tour yet. Please add clients to proceed.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const completedClients = clients.filter(client => 
    drafts.some(draft => 
      draft.clientId === client.client_id && 
      draft.formData.submitted_at
    )
  );

  return (
    <div className="space-y-4">
      {/* Tour Summary */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <Users className="h-5 w-5" />
            {selectedTour.tour_name}
          </CardTitle>
          <CardDescription>
            Guide: {selectedTour.guide_name} | Driver: {selectedTour.driver_name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {completedClients.length} of {clients.length} completed</span>
            <Badge variant="secondary">
              {Math.round((completedClients.length / clients.length) * 100)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Client Self-Selection */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <UserCheck className="h-5 w-5" />
            Client Self-Selection
          </CardTitle>
          <CardDescription>
            Please find your name below and tap to begin your feedback
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-4' : 'p-6'}>
          <div className={`space-y-3 ${isMobile ? 'max-h-96 overflow-y-auto' : ''}`}>
            {clients.map((client) => {
              const hasDraft = clientsWithDrafts.includes(client.client_id);
              const isCompleted = completedClients.some(c => c.client_id === client.client_id);
              
              return (
                <div
                  key={client.client_id}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                    ${selectedClient?.client_id === client.client_id 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : hasDraft
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-border hover:border-primary/50'
                    }
                  `}
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {client.full_name}
                      </h3>
                      <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {client.email}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-600">
                          Completed
                        </Badge>
                      )}
                      {hasDraft && !isCompleted && (
                        <Badge variant="secondary" className="bg-yellow-600 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          Draft Saved
                        </Badge>
                      )}
                      {!hasDraft && !isCompleted && (
                        <Badge variant="outline">
                          Not Started
                        </Badge>
                      )}
                    </div>
                  </div>

                  {selectedClient?.client_id === client.client_id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {hasDraft && !isCompleted && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                          <RotateCcw className="h-4 w-4" />
                          <AlertDescription className={isMobile ? 'text-xs' : 'text-sm'}>
                            You have a saved draft. You can continue where you left off.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {isCompleted && (
                        <Alert className="bg-green-50 border-green-200">
                          <UserCheck className="h-4 w-4" />
                          <AlertDescription className={isMobile ? 'text-xs' : 'text-sm'}>
                            Your feedback has been submitted successfully. Thank you!
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      <Button 
                        className="w-full"
                        size={isMobile ? "sm" : "default"}
                        disabled={isCompleted}
                      >
                        {isCompleted 
                          ? 'Feedback Completed' 
                          : hasDraft 
                            ? 'Continue Feedback' 
                            : 'Start Feedback'
                        }
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Completion Summary */}
      {completedClients.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <UserCheck className="h-5 w-5" />
              <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                {completedClients.length} client{completedClients.length !== 1 ? 's' : ''} completed feedback
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientSelfSelection;