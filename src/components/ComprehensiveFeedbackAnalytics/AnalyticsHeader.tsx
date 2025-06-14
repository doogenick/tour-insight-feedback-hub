
import React from 'react';
import { Button } from '../ui/button';
import { Download, RefreshCw, Database } from 'lucide-react';

interface AnalyticsHeaderProps {
  onExportJSON: () => void;
  onExportCSV: () => void;
  onRefresh: () => void;
  onGenerateDemo: () => void;
  isGeneratingDemo: boolean;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  onExportJSON, 
  onExportCSV, 
  onRefresh, 
  onGenerateDemo, 
  isGeneratingDemo 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Comprehensive Feedback Analytics</h1>
      <div className="flex gap-2">
        <Button onClick={onExportJSON} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button onClick={onExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button
          onClick={onGenerateDemo}
          disabled={isGeneratingDemo}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          {isGeneratingDemo ? "Generating..." : "Generate Demo Data"}
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
