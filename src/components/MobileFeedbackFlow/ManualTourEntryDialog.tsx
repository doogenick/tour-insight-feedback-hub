import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { v4 as uuidv4 } from 'uuid';
import { Tour } from '../../types/Tour';

interface ManualTourEntryDialogProps {
  onCreate: (tour: Tour) => void;
}

const ManualTourEntryDialog: React.FC<ManualTourEntryDialogProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [tourCode, setTourCode] = useState('');
  const [guideName, setGuideName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [truckName, setTruckName] = useState('');

  const handleCreate = () => {
    if (!tourCode || !guideName || !driverName) return;

    const today = new Date().toISOString().slice(0, 10);
    const manualTour: Tour = {
      tour_id: `manual-${uuidv4()}`,
      tour_name: `Manual: ${tourCode}`,
      tour_code: tourCode,
      date_start: today,
      date_end: today,
      passenger_count: 0,
      guide_name: guideName,
      driver_name: driverName,
      truck_name: truckName,
      tour_leader: guideName,
      status: 'active'
    };

    onCreate(manualTour);
    setOpen(false);
    setTourCode('');
    setGuideName('');
    setDriverName('');
    setTruckName('');
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
            <Label htmlFor="tourCode" className="text-right">Tour code</Label>
            <Input id="tourCode" value={tourCode} onChange={(e) => setTourCode(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guideName" className="text-right">Tour leader name</Label>
            <Input id="guideName" value={guideName} onChange={(e) => setGuideName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="driverName" className="text-right">Tour driver name</Label>
            <Input id="driverName" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="truckName" className="text-right">Truck name</Label>
            <Input id="truckName" value={truckName} onChange={(e) => setTruckName(e.target.value)} className="col-span-3" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!tourCode || !guideName || !driverName}>
            Create and continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualTourEntryDialog;
