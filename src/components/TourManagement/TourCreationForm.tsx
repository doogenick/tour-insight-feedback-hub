import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, CalendarDays, X, Plus, Users, MapPin } from 'lucide-react';
import { Tour, Hotel, Property } from '../../services/api/types';
import { useToast } from '../ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface TourCreationFormProps {
  onTourCreated: (tour: Tour) => void;
  onCancel: () => void;
  editTour?: Tour;
}

const TourCreationForm: React.FC<TourCreationFormProps> = ({ 
  onTourCreated, 
  onCancel, 
  editTour 
}) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Partial<Tour>>({
    tour_name: editTour?.tour_name || '',
    tour_code: editTour?.tour_code || '',
    date_start: editTour?.date_start || '',
    date_end: editTour?.date_end || '',
    passenger_count: editTour?.passenger_count || 0,
    guide_name: editTour?.guide_name || '',
    driver_name: editTour?.driver_name || '',
    truck_name: editTour?.truck_name || '',
    vehicle_name: editTour?.vehicle_name || '',
    tour_leader: editTour?.tour_leader || '',
    tour_type: editTour?.tour_type || 'camping',
    status: editTour?.status || 'planned',
    hotels: editTour?.hotels || [],
    properties: editTour?.properties || []
  });

  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    name: '',
    location: '',
    check_in_date: '',
    check_out_date: '',
    room_type: '',
    supplier: ''
  });

  const [newProperty, setNewProperty] = useState<Partial<Property>>({
    name: '',
    location: '',
    type: 'camp',
    supplier: '',
    capacity: 0,
    amenities: []
  });

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const handleInputChange = (field: keyof Tour, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHotel = () => {
    if (newHotel.name && newHotel.location) {
      const hotel: Hotel = {
        id: uuidv4(),
        name: newHotel.name!,
        location: newHotel.location!,
        check_in_date: newHotel.check_in_date || '',
        check_out_date: newHotel.check_out_date || '',
        room_type: newHotel.room_type,
        supplier: newHotel.supplier
      };
      
      setFormData(prev => ({
        ...prev,
        hotels: [...(prev.hotels || []), hotel]
      }));
      
      setNewHotel({ name: '', location: '', check_in_date: '', check_out_date: '', room_type: '', supplier: '' });
      setShowHotelForm(false);
    }
  };

  const addProperty = () => {
    if (newProperty.name && newProperty.location && newProperty.supplier) {
      const property: Property = {
        id: uuidv4(),
        name: newProperty.name!,
        location: newProperty.location!,
        type: newProperty.type as 'camp' | 'lodge' | 'hotel' | 'guesthouse',
        supplier: newProperty.supplier!,
        capacity: newProperty.capacity || 0,
        amenities: newProperty.amenities || []
      };
      
      setFormData(prev => ({
        ...prev,
        properties: [...(prev.properties || []), property]
      }));
      
      setNewProperty({ name: '', location: '', type: 'camp', supplier: '', capacity: 0, amenities: [] });
      setShowPropertyForm(false);
    }
  };

  const removeHotel = (hotelId: string) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels?.filter(h => h.id !== hotelId) || []
    }));
  };

  const removeProperty = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties?.filter(p => p.id !== propertyId) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tour_name || !formData.date_start || !formData.date_end) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const tour: Tour = {
      tour_id: editTour?.tour_id || `TUR${Date.now()}`,
      tour_name: formData.tour_name!,
      tour_code: formData.tour_code || formData.tour_name!.substring(0, 3).toUpperCase() + new Date().getFullYear().toString().slice(-2),
      date_start: formData.date_start!,
      date_end: formData.date_end!,
      passenger_count: formData.passenger_count || 0,
      guide_name: formData.guide_name || '',
      driver_name: formData.driver_name || '',
      truck_name: formData.truck_name,
      vehicle_name: formData.vehicle_name,
      tour_leader: formData.tour_leader,
      tour_type: formData.tour_type || 'camping',
      status: formData.status || 'planned',
      hotels: formData.hotels || [],
      properties: formData.properties || [],
      created_at: editTour?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onTourCreated(tour);
    
    toast({
      title: editTour ? "Tour Updated" : "Tour Created",
      description: `Tour ${tour.tour_code} has been ${editTour ? 'updated' : 'created'} successfully`
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {editTour ? 'Edit Tour' : 'Create New Tour'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Tour Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tour_name">Tour Name *</Label>
              <Input
                id="tour_name"
                value={formData.tour_name}
                onChange={(e) => handleInputChange('tour_name', e.target.value)}
                placeholder="e.g., Cape Town to Victoria Falls"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="tour_code">Tour Code</Label>
              <Input
                id="tour_code"
                value={formData.tour_code}
                onChange={(e) => handleInputChange('tour_code', e.target.value)}
                placeholder="e.g., TAD140525"
              />
            </div>
            
            <div>
              <Label htmlFor="date_start">Start Date *</Label>
              <Input
                id="date_start"
                type="date"
                value={formData.date_start}
                onChange={(e) => handleInputChange('date_start', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="date_end">End Date *</Label>
              <Input
                id="date_end"
                type="date"
                value={formData.date_end}
                onChange={(e) => handleInputChange('date_end', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="passenger_count">Passenger Count</Label>
              <Input
                id="passenger_count"
                type="number"
                value={formData.passenger_count}
                onChange={(e) => handleInputChange('passenger_count', parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0"
              />
            </div>
            
            <div>
              <Label htmlFor="tour_type">Tour Type</Label>
              <Select value={formData.tour_type} onValueChange={(value) => handleInputChange('tour_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tour type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="camping">Camping</SelectItem>
                  <SelectItem value="camping_accommodated">Camping & Accommodated</SelectItem>
                  <SelectItem value="accommodated">Accommodated Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Crew Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5" />
              Crew Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="guide_name">Guide Name</Label>
                <Input
                  id="guide_name"
                  value={formData.guide_name}
                  onChange={(e) => handleInputChange('guide_name', e.target.value)}
                  placeholder="Guide name"
                />
              </div>
              
              <div>
                <Label htmlFor="driver_name">Driver Name</Label>
                <Input
                  id="driver_name"
                  value={formData.driver_name}
                  onChange={(e) => handleInputChange('driver_name', e.target.value)}
                  placeholder="Driver name"
                />
              </div>
              
              <div>
                <Label htmlFor="tour_leader">Tour Leader</Label>
                <Input
                  id="tour_leader"
                  value={formData.tour_leader}
                  onChange={(e) => handleInputChange('tour_leader', e.target.value)}
                  placeholder="Tour leader"
                />
              </div>
              
              <div>
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
          </div>

          {/* Vehicle Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="truck_name">Truck Name</Label>
              <Input
                id="truck_name"
                value={formData.truck_name}
                onChange={(e) => handleInputChange('truck_name', e.target.value)}
                placeholder="e.g., Truck Alpha"
              />
            </div>
            
            <div>
              <Label htmlFor="vehicle_name">Vehicle Name</Label>
              <Input
                id="vehicle_name"
                value={formData.vehicle_name}
                onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                placeholder="Additional vehicle"
              />
            </div>
          </div>

          {/* Hotels Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Hotels</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHotelForm(!showHotelForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hotel
              </Button>
            </div>
            
            {showHotelForm && (
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Hotel name"
                      value={newHotel.name}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Location"
                      value={newHotel.location}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Input
                      placeholder="Supplier"
                      value={newHotel.supplier}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, supplier: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="Check-in date"
                      value={newHotel.check_in_date}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, check_in_date: e.target.value }))}
                    />
                    <Input
                      type="date"
                      placeholder="Check-out date"
                      value={newHotel.check_out_date}
                      onChange={(e) => setNewHotel(prev => ({ ...prev, check_out_date: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={addHotel} size="sm">Add</Button>
                      <Button type="button" variant="outline" onClick={() => setShowHotelForm(false)} size="sm">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {formData.hotels && formData.hotels.length > 0 && (
              <div className="space-y-2">
                {formData.hotels.map(hotel => (
                  <div key={hotel.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{hotel.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">- {hotel.location}</span>
                      {hotel.supplier && <Badge variant="outline" className="ml-2">{hotel.supplier}</Badge>}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHotel(hotel.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Properties</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPropertyForm(!showPropertyForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
            
            {showPropertyForm && (
              <Card>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Property name"
                      value={newProperty.name}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Location"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <Select value={newProperty.type} onValueChange={(value) => setNewProperty(prev => ({ ...prev, type: value as any }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camp">Camp</SelectItem>
                        <SelectItem value="lodge">Lodge</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="guesthouse">Guesthouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Supplier"
                      value={newProperty.supplier}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, supplier: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Capacity"
                      value={newProperty.capacity}
                      onChange={(e) => setNewProperty(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={addProperty} size="sm">Add</Button>
                      <Button type="button" variant="outline" onClick={() => setShowPropertyForm(false)} size="sm">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {formData.properties && formData.properties.length > 0 && (
              <div className="space-y-2">
                {formData.properties.map(property => (
                  <div key={property.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{property.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">- {property.location}</span>
                      <Badge variant="outline" className="ml-2">{property.type}</Badge>
                      <Badge variant="outline" className="ml-2">{property.supplier}</Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProperty(property.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {editTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TourCreationForm;