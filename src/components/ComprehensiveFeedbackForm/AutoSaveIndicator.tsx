import React from 'react';
import { Badge } from '../ui/badge';
import { Save, Cloud, CloudOff, Clock } from 'lucide-react';

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean;
  hasUnsavedChanges: boolean;
  isOnline: boolean;
  lastSaved?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  isAutoSaving,
  hasUnsavedChanges,
  isOnline,
  lastSaved
}) => {
  if (isAutoSaving) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <Save className="h-3 w-3 mr-1 animate-spin" />
        Saving...
      </Badge>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        <Clock className="h-3 w-3 mr-1" />
        Unsaved changes
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive">
        <CloudOff className="h-3 w-3 mr-1" />
        Offline mode
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-green-600">
      <Cloud className="h-3 w-3 mr-1" />
      All saved
    </Badge>
  );
};

export default AutoSaveIndicator;