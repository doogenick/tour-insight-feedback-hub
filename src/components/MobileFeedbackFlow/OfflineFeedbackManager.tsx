import React, { useEffect, useState } from 'react';
import { useOfflineFeedback } from '../../hooks/useOfflineFeedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Save, 
  Download, 
  Trash2, 
  Wifi, 
  WifiOff, 
  Clock, 
  Database,
  FileText,
  Shield,
  Archive
} from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useAppContext } from '../../contexts/AppContext';
import { comprehensiveFeedbackService } from '../../services/comprehensiveFeedbackService';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';

const OfflineFeedbackManager: React.FC = () => {
  const { 
    drafts, 
    backups, 
    storageStats, 
    isLoading, 
    isOnline,
    exportTourBackup,
    exportAllDrafts,
    deleteDraft,
    deleteTourBackup,
    cleanupOldData,
    createTourBackup
  } = useOfflineFeedback();
  
  const { selectedTour, clients } = useAppContext();
  const isMobile = useIsMobile();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [submissions, setSubmissions] = useState<ComprehensiveFeedback[]>([]);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const all = await comprehensiveFeedbackService.getAllFeedback();
        setSubmissions(all);
      } catch (e) {
        console.error('Failed to load submissions', e);
      }
    };
    loadSubmissions();
  }, []);

  const handleCreateTourBackup = async () => {
    if (!selectedTour) return;
    
    setIsCreatingBackup(true);
    try {
      // Include all saved feedback for this tour in the backup
      const completedFeedback = await comprehensiveFeedbackService.getFeedbackByTour(selectedTour.tour_id);
      
      await createTourBackup(
        selectedTour.tour_id,
        selectedTour.tour_name,
        selectedTour.guide_name,
        selectedTour.driver_name,
        completedFeedback
      );
    } catch (error) {
      console.error('Error creating tour backup:', error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <Database className="h-5 w-5" />
          Offline Data Manager
          {isOnline ? (
            <Badge variant="default" className="bg-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Manage drafts, backups, and offline data storage
        </CardDescription>
      </CardHeader>

      <CardContent className={isMobile ? 'p-4' : 'p-6'}>
        {/* Storage Stats */}
        {storageStats && (
          <Alert className="mb-4">
            <Database className="h-4 w-4" />
            <AlertDescription>
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-2 text-sm`}>
                <div>Drafts: {storageStats.draftsCount}</div>
                <div>Backups: {storageStats.backupsCount}</div>
                <div>Tour Backups: {storageStats.tourBackupsCount}</div>
                <div>Storage: {formatFileSize(storageStats.totalSizeEstimate)}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="drafts" className="w-full">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-4'}`}>
            <TabsTrigger value="drafts" className={isMobile ? 'text-xs' : ''}>
              Drafts ({drafts.length})
            </TabsTrigger>
            <TabsTrigger value="submissions" className={isMobile ? 'text-xs' : ''}>
              Saved ({submissions.length})
            </TabsTrigger>
            <TabsTrigger value="backups" className={isMobile ? 'text-xs' : ''}>
              Backups ({backups.length})
            </TabsTrigger>
            {!isMobile && (
              <TabsTrigger value="settings">
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Saved Drafts</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAllDrafts}
                  disabled={drafts.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {isMobile ? 'Export' : 'Export All'}
                </Button>
              </div>
            </div>

            {drafts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No drafts saved</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {draft.clientName}
                      </h4>
                      <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        Page {draft.currentPage} • {formatDate(draft.lastSaved)}
                      </p>
                      {draft.isAutoSaved && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Auto-saved
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDraft(draft.clientId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Saved Feedback</h3>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No feedback saved yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((fb) => (
                  <div
                    key={fb.id}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                          {fb.client_name || 'Unknown client'}
                        </h4>
                        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Tour: {fb.tour_id} • {fb.submitted_at ? formatDate(fb.submitted_at) : 'Pending'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {fb.status || 'Saved'}
                      </Badge>
                    </div>
                    {fb.tour_highlight && (
                      <p className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>{fb.tour_highlight}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Tour Backups</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateTourBackup}
                disabled={!selectedTour || isCreatingBackup}
              >
                <Archive className="h-4 w-4 mr-1" />
                {isCreatingBackup ? 'Creating...' : (isMobile ? 'Backup' : 'Create Backup')}
              </Button>
            </div>

            {backups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No backups created</p>
              </div>
            ) : (
              <div className="space-y-3">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {backup.tourName}
                      </h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportTourBackup(backup.id, backup.tourName)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTourBackup(backup.id, backup.tourName)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <p>Guide: {backup.guideName} | Driver: {backup.driverName}</p>
                      <p>{backup.completedClients} of {backup.totalClients} clients</p>
                      <p>Created: {formatDate(backup.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          {!isMobile && (
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Data Management</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clean up old drafts and backups to free up storage space
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => cleanupOldData(30)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clean Up Data (30+ days old)
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Export Options</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Export all data for backup or transfer to another device
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={exportAllDrafts}
                      disabled={drafts.length === 0}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Drafts
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OfflineFeedbackManager;