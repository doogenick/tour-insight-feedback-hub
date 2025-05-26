import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, RefreshCw, Upload, Database, ChevronDown, Check, ArrowUp, Filter } from 'lucide-react';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AnalyticsDashboard from './AnalyticsDashboard';
import TourManagementDashboard from './TourManagement/TourManagementDashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
  const [loginName, setLoginName] = useState('');
  const [loginRole, setLoginRole] = useState<'admin' | 'guide' | 'driver' | 'client'>('admin');
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate demo data if none exists and fetch feedback
  useEffect(() => {
    if (!demoDataGenerated && tours.length === 0) {
      generateDemoData();
    }
    
    fetchFeedback();
  }, [demoDataGenerated, generateDemoData, tours.length, fetchFeedback]);
  
  // Handle CSV export
  const handleExportCsv = async () => {
    setExportLoading(true);
    try {
      const blob = await exportFeedback();
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tour_feedback.csv';
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
  
  // Handle login form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName) {
      loginUser(loginName, loginRole);
      setIsOpen(false);
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
          {/* User Login/Logout Section */}
          <div className="flex justify-end mb-6">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {currentUser.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>User Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="text-muted-foreground">
                      Role: {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutUser}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Log In</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleLogin}>
                    <DialogHeader>
                      <DialogTitle>Log In</DialogTitle>
                      <DialogDescription>
                        Enter your name and select your role to view feedback data.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          value={loginName} 
                          onChange={(e) => setLoginName(e.target.value)} 
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            type="button"
                            variant={loginRole === 'admin' ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setLoginRole('admin')}
                          >
                            {loginRole === 'admin' && <Check className="h-4 w-4 mr-2" />}
                            Admin
                          </Button>
                          
                          <Button 
                            type="button"
                            variant={loginRole === 'guide' ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setLoginRole('guide')}
                          >
                            {loginRole === 'guide' && <Check className="h-4 w-4 mr-2" />}
                            Guide
                          </Button>
                          
                          <Button 
                            type="button"
                            variant={loginRole === 'driver' ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setLoginRole('driver')}
                          >
                            {loginRole === 'driver' && <Check className="h-4 w-4 mr-2" />}
                            Driver
                          </Button>
                          
                          <Button 
                            type="button"
                            variant={loginRole === 'client' ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setLoginRole('client')}
                          >
                            {loginRole === 'client' && <Check className="h-4 w-4 mr-2" />}
                            Client
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Log In</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
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
                  <Download size={20} />
                  <span>Export Feedback Data</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Download all feedback data as a CSV file for further analysis or reporting.
                </p>
                <Button 
                  onClick={handleExportCsv}
                  disabled={exportLoading}
                  className="bg-tour-primary hover:bg-tour-secondary"
                >
                  {exportLoading ? 'Preparing Download...' : 'Export All Feedback to CSV'}
                </Button>
              </div>
              
              <Separator />
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <Database size={20} />
                  <span>Database Management</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  These functions are for demonstration purposes. In a production environment, 
                  these would be protected by authentication.
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
            Tour Feedback System • Data is securely processed and stored
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPage;
