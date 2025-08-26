import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from '../../types/Tour';
import { useSupabaseTours } from '../../hooks/useSupabaseTours';
import { useToast } from '../ui/use-toast';

interface ManualTourEntryDialogProps {
  onCreate: (tour: Tour) => void;
}

const ManualTourEntryDialog: React.FC<ManualTourEntryDialogProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [tourCode, setTourCode] = useState('');
  const [guideName, setGuideName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [truckName, setTruckName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTour } = useSupabaseTours();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!tourCode.trim() || !guideName.trim() || !driverName.trim() || !truckName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in tour code, guide name, driver name, and truck name."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      
      // Save to Supabase backend
      const savedTour = await createTour({
        tour_code: tourCode.trim(),
        tour_name: `Manual: ${tourCode.trim()}`,
        date_start: today,
        date_end: today,
        passenger_count: 0,
        guide_id: null, // Will be set later when crew is assigned  
        driver_id: null, // Will be set later when crew is assigned
        truck_name: truckName.trim(),
        tour_leader: guideName.trim(),
        tour_type: 'camping',
        vehicle_name: truckName.trim(),
        status: 'active'
      });

      // Create local Tour object for immediate use
      const manualTour: Tour = {
        tour_id: savedTour.id,
        tour_name: savedTour.tour_name,
        tour_code: savedTour.tour_code,
        date_start: savedTour.date_start!,
        date_end: savedTour.date_end!,
        passenger_count: savedTour.passenger_count || 0,
        guide_name: guideName.trim(),
        driver_name: driverName.trim(),
        truck_name: savedTour.truck_name,
        tour_leader: savedTour.tour_leader,
        status: savedTour.status as 'planned' | 'active' | 'completed' | 'cancelled'
      };

      onCreate(manualTour);
      setOpen(false);
      
      // Reset form
      setTourCode('');
      setGuideName('');
      setDriverName('');
      setTruckName('');
      
      toast({
        title: "Tour Created",
        description: `Manual tour "${tourCode}" has been saved to the database.`
      });
    } catch (error) {
      console.error('Error creating manual tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tour to database. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Manual feedback submission</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Tour Entry</DialogTitle>
          <DialogDescription>
            Use this when your tour isn’t listed. These details are saved locally and used for client feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tourCode" className="text-right">Tour code *</Label>
            <Input 
              id="tourCode" 
              value={tourCode} 
              onChange={(e) => setTourCode(e.target.value)} 
              className="col-span-3" 
              placeholder="e.g., TAD140525"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guideName" className="text-right">Tour leader name *</Label>
            <Input 
              id="guideName" 
              value={guideName} 
              onChange={(e) => setGuideName(e.target.value)} 
              className="col-span-3"
              placeholder="Guide/Leader name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="driverName" className="text-right">Tour driver name *</Label>
            <Input 
              id="driverName" 
              value={driverName} 
              onChange={(e) => setDriverName(e.target.value)} 
              className="col-span-3"
              placeholder="Driver name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="truckName" className="text-right">Truck name *</Label>
            <Input 
              id="truckName" 
              value={truckName} 
              onChange={(e) => setTruckName(e.target.value)} 
              className="col-span-3"
              placeholder="e.g., Truck Alpha"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!tourCode.trim() || !guideName.trim() || !driverName.trim() || !truckName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create and continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTourEntryDialog;
