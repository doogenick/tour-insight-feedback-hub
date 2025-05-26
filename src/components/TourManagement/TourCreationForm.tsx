
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { Tour, CrewMember } from '../../services/api/types';
import crewService from '../../services/api/crewService';
import { tourService } from '../../services/api';

interface TourCreationFormProps {
  onTourCreated: (tour: Tour) => void;
  onCancel: () => void;
}

const TourCreationForm: React.FC<TourCreationFormProps> = ({ onTourCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    tour_name: '',
    date_start: '',
    date_end: '',
    passenger_count: 0,
    guide_id: '',
    driver_id: '',
    description: '',
    destination: ''
  });
  
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadCrew = async () => {
      try {
        const crewData = await crewService.getAllCrew();
        setCrew(crewData.filter(member => member.active));
      } catch (error) {
        console.error('Error loading crew:', error);
      }
    };
    
    loadCrew();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedGuide = crew.find(c => c.crew_id === formData.guide_id);
      const selectedDriver = crew.find(c => c.crew_id === formData.driver_id);

      const tourData = {
        tour_name: formData.tour_name,
        date_start: formData.date_start,
        date_end: formData.date_end,
        passenger_count: formData.passenger_count,
        guide_name: selectedGuide?.full_name || '',
        driver_name: selectedDriver?.full_name || ''
      };

      const newTour = await tourService.createTour(tourData);

      // Assign crew to tour
      if (formData.guide_id) {
        await crewService.assignCrewToTour(newTour.tour_id, formData.guide_id, 'guide');
      }
      if (formData.driver_id) {
        await crewService.assignCrewToTour(newTour.tour_id, formData.driver_id, 'driver');
      }

      toast({
        title: "Tour Created",
        description: `Tour "${newTour.tour_name}" has been created successfully.`,
      });

      onTourCreated(newTour);
    } catch (error) {
      console.error('Error creating tour:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tour. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const guides = crew.filter(member => member.role === 'guide');
  const drivers = crew.filter(member => member.role === 'driver');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Tour</CardTitle>
        <CardDescription>
          Add a new tour with crew assignments and basic details.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tour_name">Tour Name</Label>
              <Input
                id="tour_name"
                value={formData.tour_name}
                onChange={(e) => setFormData({...formData, tour_name: e.target.value})}
                placeholder="e.g., Tarangire Adventure"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passenger_count">Passenger Count</Label>
              <Input
                id="passenger_count"
                type="number"
                min="1"
                value={formData.passenger_count}
                onChange={(e) => setFormData({...formData, passenger_count: parseInt(e.target.value) || 0})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_start">Start Date</Label>
              <Input
                id="date_start"
                type="date"
                value={formData.date_start}
                onChange={(e) => setFormData({...formData, date_start: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date_end">End Date</Label>
              <Input
                id="date_end"
                type="date"
                value={formData.date_end}
                onChange={(e) => setFormData({...formData, date_end: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guide_id">Tour Guide</Label>
              <Select value={formData.guide_id} onValueChange={(value) => setFormData({...formData, guide_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a guide" />
                </SelectTrigger>
                <SelectContent>
                  {guides.map(guide => (
                    <SelectItem key={guide.crew_id} value={guide.crew_id}>
                      {guide.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="driver_id">Driver</Label>
              <Select value={formData.driver_id} onValueChange={(value) => setFormData({...formData, driver_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map(driver => (
                    <SelectItem key={driver.crew_id} value={driver.crew_id}>
                      {driver.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Tour'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TourCreationForm;
