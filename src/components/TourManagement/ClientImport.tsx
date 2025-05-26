
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { Upload, Users, FileText } from 'lucide-react';
import { Client } from '../../services/api/types';
import { tourService } from '../../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ClientImportProps {
  tourId: string;
  onClientsImported: (clients: Client[]) => void;
}

const ClientImport: React.FC<ClientImportProps> = ({ tourId, onClientsImported }) => {
  const [manualClients, setManualClients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const { toast } = useToast();

  const handleManualImport = async () => {
    if (!manualClients.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter client information.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const lines = manualClients.trim().split('\n');
      const clients = lines.map(line => {
        const parts = line.split(',').map(part => part.trim());
        return {
          full_name: parts[0] || '',
          email: parts[1] || undefined
        };
      }).filter(client => client.full_name);

      const importedClients = await tourService.addClientsToTour(tourId, clients);
      
      toast({
        title: "Clients Imported",
        description: `Successfully imported ${importedClients.length} clients.`,
      });

      onClientsImported(importedClients);
      setManualClients('');
    } catch (error) {
      console.error('Error importing clients:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to import clients. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await file.text();
      setFileContent(text);
      
      // Parse CSV content
      const lines = text.split('\n').filter(line => line.trim());
      const clients = lines.slice(1).map(line => { // Skip header row
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
        return {
          full_name: parts[0] || '',
          email: parts[1] || undefined
        };
      }).filter(client => client.full_name);

      if (clients.length > 0) {
        const importedClients = await tourService.addClientsToTour(tourId, clients);
        
        toast({
          title: "File Imported",
          description: `Successfully imported ${importedClients.length} clients from ${file.name}.`,
        });

        onClientsImported(importedClients);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process file. Please check the format and try again.",
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Import Clients
        </CardTitle>
        <CardDescription>
          Add clients to this tour manually or by importing from a file.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clients">Client List</Label>
              <Textarea
                id="clients"
                placeholder="Enter one client per line:&#10;John Doe, john@example.com&#10;Jane Smith, jane@example.com&#10;&#10;Email is optional - just name is fine too:&#10;Bob Johnson"
                value={manualClients}
                onChange={(e) => setManualClients(e.target.value)}
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                Enter one client per line. Format: Name, Email (email is optional)
              </p>
            </div>
            
            <Button 
              onClick={handleManualImport} 
              disabled={isLoading || !manualClients.trim()}
              className="w-full"
            >
              {isLoading ? 'Importing...' : 'Import Clients'}
            </Button>
          </TabsContent>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload CSV File</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a CSV file with client information
                </p>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Expected format: Name, Email (with headers in first row)
              </p>
            </div>
            
            {fileContent && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Preview
                </h4>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {fileContent.slice(0, 300)}{fileContent.length > 300 ? '...' : ''}
                </pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientImport;
