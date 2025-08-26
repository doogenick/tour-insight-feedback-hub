import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { useSupabaseCrew } from '@/hooks/useSupabaseCrew';

interface CrewManagementProps {}

const CrewManagement: React.FC<CrewManagementProps> = () => {
  const { crew, isLoading, fetchCrew, addCrewMember, updateCrewMember, deleteCrewMember } = useSupabaseCrew();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrew, setEditingCrew] = useState<any | null>(null);
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
    fetchCrew();
  }, [fetchCrew]);

  const handleSave = async () => {
    if (!formData.full_name || !formData.role) return;

    try {
      if (editingCrew) {
        await updateCrewMember(editingCrew.id, formData);
      } else {
        await addCrewMember(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving crew member:', error);
    }
  };

  const handleEdit = (crewMember: any) => {
    setEditingCrew(crewMember);
    setFormData({
      full_name: crewMember.full_name,
      role: crewMember.role,
      email: crewMember.email || '',
      phone: crewMember.phone || '',
      passport_number: crewMember.passport_number || '',
      visa_status: crewMember.visa_status || '',
      emergency_contact: crewMember.emergency_contact || '',
      active: crewMember.active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (crewId: string) => {
    try {
      await deleteCrewMember(crewId);
    } catch (error) {
      console.error('Error deleting crew member:', error);
    }
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
        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading crew members...
            </CardContent>
          </Card>
        ) : crew.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No crew members found. Add your first crew member to get started.
            </CardContent>
          </Card>
        ) : (
          crew.map(crewMember => (
            <Card key={crewMember.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{crewMember.full_name}</h4>
                      <Badge variant={crewMember.role === 'guide' ? 'default' : crewMember.role === 'driver' ? 'secondary' : 'outline'}>
                        {crewMember.role.charAt(0).toUpperCase() + crewMember.role.slice(1)}
                      </Badge>
                      {!crewMember.active && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {crewMember.email && <p>📧 {crewMember.email}</p>}
                      {crewMember.phone && <p>📱 {crewMember.phone}</p>}
                      {crewMember.passport_number && <p>🛂 {crewMember.passport_number}</p>}
                      {crewMember.emergency_contact && <p>🚨 {crewMember.emergency_contact}</p>}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(crewMember)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(crewMember.id)}>
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