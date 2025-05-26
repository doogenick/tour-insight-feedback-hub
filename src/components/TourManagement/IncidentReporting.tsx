
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { AlertTriangle, Clock, MapPin, FileText } from 'lucide-react';
import { Incident, Tour, CrewMember } from '../../services/api/types';
import incidentService from '../../services/api/incidentService';
import crewService from '../../services/api/crewService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface IncidentReportingProps {
  tours: Tour[];
}

const IncidentReporting: React.FC<IncidentReportingProps> = ({ tours }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    tour_id: '',
    reported_by_crew_id: '',
    incident_type: 'other' as Incident['incident_type'],
    date: '',
    time: '',
    location: '',
    description: '',
    severity: 'medium' as Incident['severity'],
    status: 'open' as Incident['status']
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadIncidents();
    loadCrew();
  }, []);

  const loadIncidents = async () => {
    try {
      const incidentData = await incidentService.getAllIncidents();
      setIncidents(incidentData);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  const loadCrew = async () => {
    try {
      const crewData = await crewService.getAllCrew();
      setCrew(crewData.filter(member => member.active));
    } catch (error) {
      console.error('Error loading crew:', error);
    }
  };

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const incident = await incidentService.createIncident(newIncident);
      setIncidents([incident, ...incidents]);
      
      toast({
        title: "Incident Reported",
        description: `Incident ${incident.incident_id} has been logged successfully.`,
      });

      setIsDialogOpen(false);
      setNewIncident({
        tour_id: '',
        reported_by_crew_id: '',
        incident_type: 'other',
        date: '',
        time: '',
        location: '',
        description: '',
        severity: 'medium',
        status: 'open'
      });
    } catch (error) {
      console.error('Error reporting incident:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to report incident. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'investigating':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return `${new Date(date).toLocaleDateString()} at ${time}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Incident Reporting
          </h3>
          <p className="text-sm text-muted-foreground">
            Log and track tour incidents for insurance and safety purposes.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmitIncident}>
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
                <DialogDescription>
                  Please provide detailed information about the incident for proper documentation.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tour_select">Tour</Label>
                    <Select value={newIncident.tour_id} onValueChange={(value) => setNewIncident({...newIncident, tour_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tour" />
                      </SelectTrigger>
                      <SelectContent>
                        {tours.map(tour => (
                          <SelectItem key={tour.tour_id} value={tour.tour_id}>
                            {tour.tour_name} ({tour.tour_id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reporter">Reported By</Label>
                    <Select value={newIncident.reported_by_crew_id} onValueChange={(value) => setNewIncident({...newIncident, reported_by_crew_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crew member" />
                      </SelectTrigger>
                      <SelectContent>
                        {crew.map(member => (
                          <SelectItem key={member.crew_id} value={member.crew_id}>
                            {member.full_name} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident_type">Incident Type</Label>
                    <Select value={newIncident.incident_type} onValueChange={(value: Incident['incident_type']) => setNewIncident({...newIncident, incident_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="vehicle">Vehicle Issue</SelectItem>
                        <SelectItem value="weather">Weather Related</SelectItem>
                        <SelectItem value="theft">Theft/Security</SelectItem>
                        <SelectItem value="accident">Accident</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={newIncident.severity} onValueChange={(value: Incident['severity']) => setNewIncident({...newIncident, severity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incident_date">Date</Label>
                    <Input
                      id="incident_date"
                      type="date"
                      value={newIncident.date}
                      onChange={(e) => setNewIncident({...newIncident, date: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="incident_time">Time</Label>
                    <Input
                      id="incident_time"
                      type="time"
                      value={newIncident.time}
                      onChange={(e) => setNewIncident({...newIncident, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                    placeholder="Describe the location where incident occurred"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newIncident.description}
                    onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                    placeholder="Provide detailed description of what happened..."
                    rows={4}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Reporting...' : 'Report Incident'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {incidents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No incidents reported yet.
            </CardContent>
          </Card>
        ) : (
          incidents.map(incident => (
            <Card key={incident.incident_id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{incident.incident_id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tours.find(t => t.tour_id === incident.tour_id)?.tour_name || incident.tour_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDateTime(incident.date, incident.time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {incident.location}
                    </span>
                  </div>
                  
                  <p className="text-sm">{incident.description}</p>
                  
                  <div className="text-xs text-muted-foreground">
                    Type: {incident.incident_type.charAt(0).toUpperCase() + incident.incident_type.slice(1)} • 
                    Reported by: {crew.find(c => c.crew_id === incident.reported_by_crew_id)?.full_name || 'Unknown'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentReporting;
