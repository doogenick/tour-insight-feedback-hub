
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { CrewMember } from '../../services/api/types';
import crewService from '../../services/api/crewService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Users, UserPlus } from 'lucide-react';

const CrewManagement: React.FC = () => {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCrewData, setNewCrewData] = useState({
    full_name: '',
    role: 'guide' as 'guide' | 'driver' | 'assistant',
    email: '',
    phone: '',
    passport_number: '',
    visa_status: '',
    emergency_contact: '',
    active: true
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadCrew();
  }, []);

  const loadCrew = async () => {
    setIsLoading(true);
    try {
      const crewData = await crewService.getAllCrew();
      setCrew(crewData);
    } catch (error) {
      console.error('Error loading crew:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load crew members.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newCrew = await crewService.addCrewMember(newCrewData);
      setCrew([...crew, newCrew]);
      
      toast({
        title: "Crew Member Added",
        description: `${newCrew.full_name} has been added to the crew.`,
      });

      setIsDialogOpen(false);
      setNewCrewData({
        full_name: '',
        role: 'guide',
        email: '',
        phone: '',
        passport_number: '',
        visa_status: '',
        emergency_contact: '',
        active: true
      });
    } catch (error) {
      console.error('Error adding crew member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add crew member.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'guide':
        return 'bg-blue-100 text-blue-800';
      case 'driver':
        return 'bg-green-100 text-green-800';
      case 'assistant':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Users className="h-5 w-5" />
            Crew Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your tour crew members and their details.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add Crew Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddCrew}>
              <DialogHeader>
                <DialogTitle>Add New Crew Member</DialogTitle>
                <DialogDescription>
                  Enter the details for the new crew member.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crew_name">Full Name</Label>
                    <Input
                      id="crew_name"
                      value={newCrewData.full_name}
                      onChange={(e) => setNewCrewData({...newCrewData, full_name: e.target.value})}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crew_role">Role</Label>
                    <Select value={newCrewData.role} onValueChange={(value: 'guide' | 'driver' | 'assistant') => setNewCrewData({...newCrewData, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guide">Tour Guide</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crew_email">Email</Label>
                    <Input
                      id="crew_email"
                      type="email"
                      value={newCrewData.email}
                      onChange={(e) => setNewCrewData({...newCrewData, email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crew_phone">Phone</Label>
                    <Input
                      id="crew_phone"
                      value={newCrewData.phone}
                      onChange={(e) => setNewCrewData({...newCrewData, phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crew_passport">Passport Number</Label>
                  <Input
                    id="crew_passport"
                    value={newCrewData.passport_number}
                    onChange={(e) => setNewCrewData({...newCrewData, passport_number: e.target.value})}
                    placeholder="Passport number"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Crew Member'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {crew.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No crew members found. Add your first crew member to get started.
            </CardContent>
          </Card>
        ) : (
          crew.map(member => (
            <Card key={member.crew_id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{member.full_name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.phone && (
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    {member.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactive
                      </Badge>
                    )}
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

export default CrewManagement;
