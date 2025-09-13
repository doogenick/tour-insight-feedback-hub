import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { feedbackSupabaseService } from '../services/supabaseServices';
import { useToast } from './ui/use-toast';

interface DuplicateEntry {
  id: string;
  submitted_at: string;
  overall_rating: number;
}

interface DuplicateGroup {
  key: string;
  tour: {
    tour_code: string;
    tour_name: string;
  };
  client_name: string;
  client_email: string;
  count: number;
  entries: DuplicateEntry[];
}

interface DuplicateAnalysis {
  total_feedback: number;
  unique_clients: number;
  duplicate_groups: number;
  duplicates: DuplicateGroup[];
}

const DuplicateFeedbackAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = useState<DuplicateAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const data = await feedbackSupabaseService.findDuplicateFeedback();
      setAnalysis(data);
    } catch (error) {
      console.error('Error loading duplicate analysis:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load duplicate analysis.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const handleDeleteDuplicate = async (duplicateId: string) => {
    setDeleting(duplicateId);
    try {
      await feedbackSupabaseService.deleteFeedback(duplicateId);
      toast({
        title: "Success",
        description: "Duplicate entry deleted successfully.",
      });
      // Refresh the analysis
      await loadAnalysis();
    } catch (error) {
      console.error('Error deleting duplicate:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete duplicate entry.",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAllDuplicates = async (group: DuplicateGroup) => {
    setDeleting(group.key);
    try {
      const result = await feedbackSupabaseService.deleteDuplicateFeedback(group, true);
      toast({
        title: "Success",
        description: `Deleted ${result.deleted} duplicate entries. Kept the most recent entry.`,
      });
      // Refresh the analysis
      await loadAnalysis();
    } catch (error) {
      console.error('Error deleting duplicates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete duplicate entries.",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAllDuplicatesBulk = async () => {
    if (!analysis || analysis.duplicates.length === 0) return;
    
    setDeleting('bulk');
    try {
      let totalDeleted = 0;
      for (const group of analysis.duplicates) {
        const result = await feedbackSupabaseService.deleteDuplicateFeedback(group, true);
        totalDeleted += result.deleted;
      }
      
      toast({
        title: "Success",
        description: `Deleted ${totalDeleted} duplicate entries across ${analysis.duplicates.length} groups.`,
      });
      // Refresh the analysis
      await loadAnalysis();
    } catch (error) {
      console.error('Error deleting all duplicates:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete all duplicate entries.",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing feedback for duplicates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Failed to load duplicate analysis.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.total_feedback}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.unique_clients}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analysis.duplicate_groups}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Duplicate Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analysis.duplicates.reduce((sum, group) => sum + group.count - 1, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate Groups */}
      {analysis.duplicate_groups > 0 ? (
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Found {analysis.duplicate_groups} groups of duplicate feedback entries. 
              Each client should only have one feedback entry per tour.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button
              variant="destructive"
              onClick={handleDeleteAllDuplicatesBulk}
              disabled={deleting === 'bulk'}
              className="w-full max-w-md"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting === 'bulk' ? 'Deleting All Duplicates...' : 'Delete All Duplicates (Keep Most Recent)'}
            </Button>
          </div>
        </div>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            No duplicate feedback entries found. All clients have only one entry per tour.
          </AlertDescription>
        </Alert>
      )}

      {/* Duplicate Details */}
      {analysis.duplicates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Duplicate Feedback Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.duplicates.map((group) => (
                <div key={group.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{group.client_name}</h3>
                      <p className="text-sm text-muted-foreground">{group.client_email}</p>
                      <p className="text-sm text-muted-foreground">
                        Tour: {group.tour.tour_code} - {group.tour.tour_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        {group.count} entries
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAllDuplicates(group)}
                        disabled={deleting === group.key}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {deleting === group.key ? 'Deleting...' : 'Delete All Duplicates'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {group.entries.map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">Entry {index + 1}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.submitted_at).toLocaleString()}
                          </span>
                          <Badge variant="outline">
                            Rating: {entry.overall_rating}/7
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDuplicate(entry.id)}
                          disabled={deleting === entry.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleting === entry.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadAnalysis} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>
    </div>
  );
};

export default DuplicateFeedbackAnalyzer;
