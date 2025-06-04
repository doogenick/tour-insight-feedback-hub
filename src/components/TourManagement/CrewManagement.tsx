
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { CrewMember } from '../../services/api/types';

interface CrewManagementProps {}

const CrewManagement: React.FC<CrewManagementProps> = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrew, setEditingCrew] = useState<CrewMember | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    role: 'guide' as 'guide' | 'driver' | 'assistant',
    email: '',
    phone: '',
    passport_number: '',
    visa_status: '',
    emergency_contact: '',
    active: true
  });

  useEffect(() => {
    loadCrewMembers();
  }, []);

  const loadCrewMembers = () => {
    // Load from localStorage or use demo data
    const savedCrew = localStorage.getItem('crew_members');
    if (savedCrew) {
      setCrewMembers(JSON.parse(savedCrew));
    } else {
      // Demo crew data
      const demoCrew: CrewMember[] = [
        {
          crew_id: 'crew_1',
          full_name: 'Sarah Johnson',
          role: 'guide',
          email: 'sarah@tourcompany.com',
          phone: '+27 123 456 789',
          passport_number: 'SA123456',
          visa_status: 'Valid',
          emergency_contact: 'John Johnson +27 987 654 321',
          active: true,
          created_at: new Date().toISOString()
        },
        {
          crew_id: 'crew_2',
          full_name: 'Mike Wilson',
          role: 'driver',
          email: 'mike@tourcompany.com',
          phone: '+27 234 567 890',
          passport_number: 'SA654321',
          visa_status: 'Valid',
          emergency_contact: 'Mary Wilson +27 876 543 210',
          active: true,
          created_at: new Date().toISOString()
        },
        {
          crew_id: 'crew_3',
          full_name: 'David Brown',
          role: 'guide',
          email: 'david@tourcompany.com',
          phone: '+27 345 678 901',
          passport_number: 'SA789012',
          visa_status: 'Valid',
          emergency_contact: 'Lisa Brown +27 765 432 109',
          active: true,
          created_at: new Date().toISOString()
        }
      ];
      setCrewMembers(demoCrew);
      localStorage.setItem('crew_members', JSON.stringify(demoCrew));
    }
  };

  const handleSave = () => {
    if (!formData.full_name || !formData.role) return;

    const newCrew: CrewMember = {
      crew_id: editingCrew ? editingCrew.crew_id : `crew_${Date.now()}`,
      ...formData,
      created_at: editingCrew ? editingCrew.created_at : new Date().toISOString()
    };

    let updatedCrew;
    if (editingCrew) {
      updatedCrew = crewMembers.map(crew => 
        crew.crew_id === editingCrew.crew_id ? newCrew : crew
      );
    } else {
      updatedCrew = [...crewMembers, newCrew];
    }

    setCrewMembers(updatedCrew);
    localStorage.setItem('crew_members', JSON.stringify(updatedCrew));
    
    resetForm();
  };

  const handleEdit = (crew: CrewMember) => {
    setEditingCrew(crew);
    setFormData({
      full_name: crew.full_name,
      role: crew.role,
      email: crew.email || '',
      phone: crew.phone || '',
      passport_number: crew.passport_number || '',
      visa_status: crew.visa_status || '',
      emergency_contact: crew.emergency_contact || '',
      active: crew.active
    });
    setShowAddForm(true);
  };

  const handleDelete = (crewId: string) => {
    const updatedCrew = crewMembers.filter(crew => crew.crew_id !== crewId);
    setCrewMembers(updatedCrew);
    localStorage.setItem('crew_members', JSON.stringify(updatedCrew));
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      role: 'guide',
      email: '',
      phone: '',
      passport_number: '',
      visa_status: '',
      emergency_contact: '',
      active: true
    });
    setEditingCrew(null);
    setShowAddForm(false);
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
            Manage your tour crew members and their details
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Crew Member
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCrew ? 'Edit' : 'Add'} Crew Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: 'guide' | 'driver' | 'assistant') => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+27 123 456 789"
                />
              </div>
              <div>
                <Label htmlFor="passport">Passport Number</Label>
                <Input
                  id="passport"
                  value={formData.passport_number}
                  onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                  placeholder="SA123456"
                />
              </div>
              <div>
                <Label htmlFor="visa">Visa Status</Label>
                <Input
                  id="visa"
                  value={formData.visa_status}
                  onChange={(e) => setFormData({...formData, visa_status: e.target.value})}
                  placeholder="Valid / Expired / Pending"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                placeholder="Contact Name +27 987 654 321"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave}>
                {editingCrew ? 'Update' : 'Add'} Crew Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {crewMembers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No crew members found. Add your first crew member to get started.
            </CardContent>
          </Card>
        ) : (
          crewMembers.map(crew => (
            <Card key={crew.crew_id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{crew.full_name}</h4>
                      <Badge variant={crew.role === 'guide' ? 'default' : crew.role === 'driver' ? 'secondary' : 'outline'}>
                        {crew.role.charAt(0).toUpperCase() + crew.role.slice(1)}
                      </Badge>
                      {!crew.active && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {crew.email && <p>📧 {crew.email}</p>}
                      {crew.phone && <p>📱 {crew.phone}</p>}
                      {crew.passport_number && <p>🛂 {crew.passport_number}</p>}
                      {crew.emergency_contact && <p>🚨 {crew.emergency_contact}</p>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(crew)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(crew.crew_id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
