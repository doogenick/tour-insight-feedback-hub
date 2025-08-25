
import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { AlertTriangle } from 'lucide-react';
import FilterControls from './FilterControls';
import SummaryCards from './SummaryCards';
import TabsNavigation from './TabsNavigation';

const AnalyticsDashboard: React.FC = () => {
  const { 
    feedback, 
    fetchFeedback, 
    isLoading, 
    tours,
    fetchTours,
    currentUser,
  } = useAppContext();
  
  const [selectedTourId, setSelectedTourId] = React.useState<string>('all');
  
  // Fetch feedback and tours on component mount
  useEffect(() => {
    if (feedback.length === 0) {
      if (selectedTourId === 'all') {
        fetchFeedback();
      } else {
        fetchFeedback(selectedTourId);
      }
    }
    
    if (tours.length === 0) {
      fetchTours();
    }
    
  }, [fetchFeedback, fetchTours, feedback.length, tours.length, selectedTourId]);
  
  // Handle tour filter change
  const handleTourChange = (tourId: string) => {
    setSelectedTourId(tourId);
    if (tourId === 'all') {
      fetchFeedback();
    } else {
      fetchFeedback(tourId);
    }
  };
  
  if (!currentUser) {
    return (
      <div className="py-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
        <h3 className="text-xl font-medium">Login Required</h3>
        <p className="mt-2 text-muted-foreground">
          Please log in to view analytics data and insights.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <FilterControls 
        selectedTourId={selectedTourId}
        tours={tours}
        onTourChange={handleTourChange}
      />
      
      <SummaryCards feedback={feedback} isLoading={isLoading} />
      
      <TabsNavigation feedback={feedback} isLoading={isLoading} />
    </div>
  );
};

export default AnalyticsDashboard;
