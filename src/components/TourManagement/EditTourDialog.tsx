import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Edit, AlertCircle } from 'lucide-react';

interface EditTourDialogProps {
  tourId: string;
  tourName: string;
  onEdit: (tourId: string) => void;
  children: React.ReactNode;
}

const EditTourDialog: React.FC<EditTourDialogProps> = ({ 
  tourId, 
  tourName, 
  onEdit, 
  children 
}) => {
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit(tourId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Edit Tour
          </DialogTitle>
          <DialogDescription>
            You are about to edit the tour "{tourName}". This will open the tour editing form.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTourDialog;
