import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Database, Trash2, Users } from 'lucide-react';
import { dummyDataGenerator } from '../../services/dummyDataGenerator';

const DummyDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [counts, setCounts] = useState({
    tours: 8,
    comprehensiveFeedback: 50
  });
  
  const { toast } = useToast();

  const generateAllData = async () => {
    setIsGenerating(true);
    try {
      // Generate tours and clients first
      const { clients } = await dummyDataGenerator.generateToursAndClients(counts.tours);
      
      // Generate comprehensive feedback
      await dummyDataGenerator.generateComprehensiveFeedback(counts.comprehensiveFeedback);
      
      toast({
        title: "Dummy Data Generated Successfully!",
        description: `Created ${counts.tours} tours, ${clients.length} clients, and ${counts.comprehensiveFeedback} comprehensive feedback entries.`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Error generating dummy data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate dummy data. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }
    
    setIsGenerating(true);
    try {
      await dummyDataGenerator.clearAllData();
      
      toast({
        title: "All Data Cleared",
        description: "All dummy data has been removed from the system.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear data. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dummy Data Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tours-count">Number of Tours</Label>
            <Input
              id="tours-count"
              type="number"
              min="1"
              max="20"
              value={counts.tours}
              onChange={(e) => setCounts({...counts, tours: parseInt(e.target.value) || 8})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comprehensive-count">Comprehensive Feedback</Label>
            <Input
              id="comprehensive-count"
              type="number"
              min="10"
              max="200"
              value={counts.comprehensiveFeedback}
              onChange={(e) => setCounts({...counts, comprehensiveFeedback: parseInt(e.target.value) || 50})}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={generateAllData} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate All Dummy Data'}
          </Button>
          
          <Button 
            onClick={clearAllData} 
            disabled={isGenerating}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">What gets generated:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Tours with realistic names, dates, and crew assignments</li>
            <li>• Clients with names, emails, and review preferences</li>
            <li>• Comprehensive feedback with all rating categories</li>
            <li>• Realistic data distribution (weighted towards positive ratings)</li>
            <li>• Client initials for Excel export format</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DummyDataGenerator;
