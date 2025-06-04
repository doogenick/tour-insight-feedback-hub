
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, RefreshCw, Upload, Database, ChevronDown, Check, FileSpreadsheet, FileText } from 'lucide-react';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AnalyticsDashboard from './AnalyticsDashboard';
import TourManagementDashboard from './TourManagement/TourManagementDashboard';
import { excelExportService } from '../services/excelExportService';
import { useToast } from './ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const AdminPage: React.FC = () => {
  const { 
    syncPendingFeedback, 
    exportFeedback, 
    isLoading, 
    syncStatus,
    generateDemoData,
    demoDataGenerated,
    tours,
    fetchFeedback,
    currentUser,
    loginUser,
    logoutUser
  } = useAppContext();
  
  const [exportLoading, setExportLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const { toast } = useToast();
  
  // Generate demo data if none exists and fetch feedback
  useEffect(() => {
    if (!demoDataGenerated && tours.length === 0) {
      generateDemoData();
    }
    
    fetchFeedback();
  }, [demoDataGenerated, generateDemoData, tours.length, fetchFeedback]);
  
  // Handle Excel export
  const handleExportExcel = async () => {
    setExportLoading(true);
    try {
      const blob = await excelExportService.exportToExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tour_feedback_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Feedback data exported successfully. Ready for Excel import.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export feedback data.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Handle summary report generation
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const summary = await excelExportService.generateSummaryReport();
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback_summary_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Summary Generated",
        description: "Feedback summary report downloaded successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: "destructive",
        title: "Summary Error",
        description: "Failed to generate summary report.",
      });
    } finally {
      setSummaryLoading(false);
    }
  };
  
  // Handle legacy CSV export
  const handleExportCsv = async () => {
    setExportLoading(true);
    try {
      const blob = await exportFeedback();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tour_feedback_legacy.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExportLoading(false);
    }
  };
  
  return (
    <div className="container max-w-6xl p-4 mx-auto">
      <Card className="w-full animate-fade-in">
        <CardHeader className="text-center bg-tour-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
          <CardDescription className="text-white/80">
            Manage tour feedback data, tours, crew, and operations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* User Info Section */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{currentUser?.name}</span>
              <span>•</span>
              <span className="capitalize">{currentUser?.role}</span>
              <span>•</span>
              <span className="text-green-600">Mobile Demo Mode</span>
            </div>
          </div>
          
          <Tabs defaultValue="tour-management">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="tour-management">Tour Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
              <TabsTrigger value="sync">Data Synchronization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tour-management">
              <TourManagementDashboard />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="export" className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <FileSpreadsheet size={20} />
                  <span>Excel-Ready Export</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Export all feedback data in a format optimized for Excel import. This includes ratings, comments, 
                  and client information organized for easy analysis.
                </p>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleExportExcel}
                    disabled={exportLoading}
                    className="bg-tour-primary hover:bg-tour-secondary flex items-center gap-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    {exportLoading ? 'Preparing Export...' : 'Export for Excel'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleGenerateSummary}
                    disabled={summaryLoading}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {summaryLoading ? 'Generating...' : 'Generate Summary Report'}
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Download size={20} />
                  <span>Legacy Export Options</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Alternative export formats for compatibility with existing systems.
                </p>
                <Button 
                  variant="outline"
                  onClick={handleExportCsv}
                  disabled={exportLoading}
                >
                  {exportLoading ? 'Preparing Download...' : 'Export Legacy CSV'}
                </Button>
              </div>
              
              <Separator />
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Database size={20} />
                  <span>Database Management</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Demo data management functions for testing and development.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline"
                    onClick={generateDemoData}
                    disabled={isLoading}
                  >
                    Generate Demo Data
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sync" className="space-y-6">
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <RefreshCw size={20} />
                  <span>Sync Pending Feedback</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Manually trigger synchronization of any pending feedback data stored locally.
                </p>
                <Button 
                  onClick={() => syncPendingFeedback()}
                  disabled={isLoading}
                  className="bg-tour-primary hover:bg-tour-secondary flex gap-2"
                >
                  <Upload size={16} />
                  <span>Synchronize Pending Feedback</span>
                </Button>
                
                {syncStatus && (
                  <div className="mt-4 p-4 bg-background rounded border">
                    <h4 className="font-medium mb-2">Last Sync Results</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Successfully Synced:</p>
                        <p className="text-xl font-medium text-tour-success">{syncStatus.synced}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Failed to Sync:</p>
                        <p className="text-xl font-medium text-destructive">{syncStatus.failed}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Connection Status</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-3 w-3 rounded-full ${navigator.onLine ? 'bg-tour-success' : 'bg-destructive'}`}></div>
                  <p>{navigator.onLine ? 'Online' : 'Offline'}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {navigator.onLine 
                    ? 'Your device is connected to the internet. Feedback data will be synchronized automatically.'
                    : 'Your device is offline. Feedback data will be stored locally and synchronized when you regain connection.'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          <p className="w-full">
            Tour Feedback System • Data is securely processed and stored locally
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
