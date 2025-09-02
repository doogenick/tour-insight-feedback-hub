import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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
  const [crewCount, setCrewCount] = useState<number>(2);
  const [vehicleType, setVehicleType] = useState<string>('truck');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTour } = useSupabaseTours();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!tourCode.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a tour code."
      });
      return;
    }

    // Validate crew requirements based on vehicle type
    if (vehicleType !== 'none' && crewCount === 0) {
      toast({
        variant: "destructive",
        title: "Invalid Configuration",
        description: "Tours with vehicles require at least 1 crew member."
      });
      return;
    }

    if (crewCount > 0 && !guideName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide guide/leader name when crew count > 0."
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
        truck_name: vehicleType === 'none' ? null : truckName.trim(),
        tour_leader: crewCount > 0 ? guideName.trim() : null,
        tour_type: 'camping',
        vehicle_name: vehicleType === 'none' ? null : truckName.trim(),
        crew_count: crewCount,
        vehicle_type: vehicleType,
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
        guide_name: crewCount > 0 ? guideName.trim() : 'No Guide',
        driver_name: crewCount > 1 ? driverName.trim() : 'No Driver',
        truck_name: savedTour.truck_name || 'No Vehicle',
        tour_leader: savedTour.tour_leader || 'External',
        status: savedTour.status as 'planned' | 'active' | 'completed' | 'cancelled'
      };

      onCreate(manualTour);
      setOpen(false);
      
      // Reset form
      setTourCode('');
      setGuideName('');
      setDriverName('');
      setTruckName('');
      setCrewCount(2);
      setVehicleType('truck');
      
      toast({
        title: "Tour Created",
        description: `Manual tour "${tourCode}" has been saved to the database.`
      });
    } catch (error) {
      console.error('Error creating manual tour:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save tour to database. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
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
            <Label htmlFor="crewCount" className="text-right">Crew count</Label>
            <Select value={crewCount.toString()} onValueChange={(value) => setCrewCount(parseInt(value))}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - External suppliers only</SelectItem>
                <SelectItem value="1">1 - Guide/Leader only</SelectItem>
                <SelectItem value="2">2 - Guide + Driver</SelectItem>
                <SelectItem value="3">3 - Guide + Driver + Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicleType" className="text-right">Vehicle type</Label>
            <Select value={vehicleType} onValueChange={setVehicleType}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Company Truck</SelectItem>
                <SelectItem value="rental">Rental (Self-drive/Private guided)</SelectItem>
                <SelectItem value="subcontracted">Subcontracted Vehicle</SelectItem>
                <SelectItem value="none">No Vehicle (Local transfers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {crewCount > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guideName" className="text-right">Guide/Leader name *</Label>
              <Input 
                id="guideName" 
                value={guideName} 
                onChange={(e) => setGuideName(e.target.value)} 
                className="col-span-3"
                placeholder="Guide/Leader name"
              />
            </div>
          )}

          {crewCount > 1 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverName" className="text-right">Driver name</Label>
              <Input 
                id="driverName" 
                value={driverName} 
                onChange={(e) => setDriverName(e.target.value)} 
                className="col-span-3"
                placeholder="Driver name"
              />
            </div>
          )}

          {vehicleType !== 'none' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truckName" className="text-right">Vehicle name</Label>
              <Input 
                id="truckName" 
                value={truckName} 
                onChange={(e) => setTruckName(e.target.value)} 
                className="col-span-3"
                placeholder="e.g., Truck Alpha, Rental Car"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!tourCode.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create and continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTourEntryDialog;
