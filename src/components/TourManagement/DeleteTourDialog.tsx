import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '../ui/use-toast';

interface DeleteTourDialogProps {
  tourId: string;
  tourName: string;
  onDelete: (tourId: string) => Promise<void>;
  children: React.ReactNode;
}

const DeleteTourDialog: React.FC<DeleteTourDialogProps> = ({ 
  tourId, 
  tourName, 
  onDelete, 
  children 
}) => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (password !== 'admin') {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Please enter the correct password to delete this tour.",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(tourId);
      setOpen(false);
      setPassword('');
    } catch (error) {
      console.error('Error deleting tour:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Tour
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the tour "{tourName}" and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Enter password to confirm deletion</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 'admin' to confirm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleDelete();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={!password.trim() || isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Tour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTourDialog;
