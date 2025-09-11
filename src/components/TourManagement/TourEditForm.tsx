import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Tour } from '../../services/api/types';
import { useSupabaseTours } from '../../hooks/useSupabaseTours';
import { useSupabaseCrew } from '../../hooks/useSupabaseCrew';

interface TourEditFormProps {
  tour: Tour;
  onTourUpdated: (updatedTour: Tour) => void;
  onCancel: () => void;
}

const TourEditForm: React.FC<TourEditFormProps> = ({ tour, onTourUpdated, onCancel }) => {
  const { updateTour } = useSupabaseTours();
  const { crew } = useSupabaseCrew();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tour_name: tour.tour_name || '',
    tour_code: tour.tour_code || '',
    date_start: tour.date_start || '',
    date_end: tour.date_end || '',
    passenger_count: tour.passenger_count || 0,
    guide_id: tour.guide_id || '',
    driver_id: tour.driver_id || '',
    truck_name: tour.truck_name || '',
    tour_leader: tour.tour_leader || '',
    tour_type: tour.tour_type || 'camping',
    vehicle_name: tour.vehicle_name || '',
    status: tour.status || 'planned'
  });

  const [startDate, setStartDate] = useState<Date | undefined>(
    tour.date_start ? new Date(tour.date_start) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    tour.date_end ? new Date(tour.date_end) : undefined
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'date_start' | 'date_end', date: Date | undefined) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      handleInputChange(field, dateString);
      if (field === 'date_start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedTour = await updateTour(tour.tour_id, formData);
      onTourUpdated(updatedTour);
    } catch (error) {
      console.error('Error updating tour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const guides = crew.filter(member => member.role === 'guide');
  const drivers = crew.filter(member => member.role === 'driver');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Tour</CardTitle>
            <CardDescription>
              Update tour information and crew assignments
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tour_name">Tour Name</Label>
              <Input
                id="tour_name"
                value={formData.tour_name}
                onChange={(e) => handleInputChange('tour_name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tour_code">Tour Code</Label>
              <Input
                id="tour_code"
                value={formData.tour_code}
                onChange={(e) => handleInputChange('tour_code', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Select start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => handleDateChange('date_start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Select end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => handleDateChange('date_end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passenger_count">Passenger Count</Label>
              <Input
                id="passenger_count"
                type="number"
                min="0"
                value={formData.passenger_count}
                onChange={(e) => handleInputChange('passenger_count', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="truck_name">Truck Name</Label>
              <Input
                id="truck_name"
                value={formData.truck_name}
                onChange={(e) => handleInputChange('truck_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guide_id">Guide</Label>
              <Select value={formData.guide_id} onValueChange={(value) => handleInputChange('guide_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guide" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No guide assigned</SelectItem>
                  {guides.map((guide) => (
                    <SelectItem key={guide.id} value={guide.id}>
                      {guide.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_id">Driver</Label>
              <Select value={formData.driver_id} onValueChange={(value) => handleInputChange('driver_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No driver assigned</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tour_leader">Tour Leader</Label>
              <Input
                id="tour_leader"
                value={formData.tour_leader}
                onChange={(e) => handleInputChange('tour_leader', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Tour'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TourEditForm;
