import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { useOfflineFeedback } from '../../hooks/useOfflineFeedback';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { Tour } from '../../types/Tour';
import { Users, Check, Plus, Upload } from 'lucide-react';

interface MultiClientFeedbackCollectorProps {
  tour: Tour;
  onComplete: () => void;
}

interface ClientFeedbackData {
  client_name: string;
  email: string;
  contact_number: string;
  overall_rating: number;
  accommodation_rating: number;
  food_rating: number;
  guiding_rating: number;
  driving_rating: number;
  additional_comments: string;
  met_expectations: boolean;
  would_recommend: boolean;
  willing_to_review_google: boolean;
  willing_to_review_tripadvisor: boolean;
}

const MultiClientFeedbackCollector: React.FC<MultiClientFeedbackCollectorProps> = ({
  tour,
  onComplete
}) => {
  const { toast } = useToast();
  const { createTourBackup } = useOfflineFeedback();
  
  const [currentClientData, setCurrentClientData] = useState<ClientFeedbackData>({
    client_name: '',
    email: '',
    contact_number: '',
    overall_rating: 5,
    accommodation_rating: 5,
    food_rating: 5,
    guiding_rating: 5,
    driving_rating: 5,
    additional_comments: '',
    met_expectations: true,
    would_recommend: true,
    willing_to_review_google: false,
    willing_to_review_tripadvisor: false
  });

  const [completedFeedbacks, setCompletedFeedbacks] = useState<ComprehensiveFeedback[]>([]);
  const [currentClientIndex, setCurrentClientIndex] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof ClientFeedbackData, value: any) => {
    setCurrentClientData(prev => ({ ...prev, [field]: value }));
  };

  const isCurrentFormValid = () => {
    return currentClientData.client_name.trim() && 
           currentClientData.email.trim() && 
           currentClientData.contact_number.trim();
  };

  const addCurrentClient = () => {
    if (!isCurrentFormValid()) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please fill in name, email, and contact number."
      });
      return;
    }

    const feedback: ComprehensiveFeedback = {
      id: `manual-${Date.now()}-${currentClientIndex}`,
      tour_id: tour.tour_id,
      client_id: `client-${Date.now()}-${currentClientIndex}`,
      client_email: currentClientData.email,
      cellphone: currentClientData.contact_number,
      tour_section_completed: 'full',
      ...currentClientData,
      // Fill required rating fields with defaults
      information_rating: 5,
      quality_equipment_rating: 5,
      truck_comfort_rating: 5,
      food_quantity_rating: currentClientData.food_rating || 5,
      food_quality_rating: currentClientData.food_rating || 5,
      organisation_rating: 5,
      guide_individual_rating: currentClientData.guiding_rating || 5,
      driver_individual_rating: currentClientData.driving_rating || 5,
      pace_rating: 5,
      route_rating: 5,
      activity_level_rating: 5,
      price_rating: 5,
      value_rating: 5,
      overview_rating: currentClientData.overall_rating || 5,
      guide_professionalism: currentClientData.guiding_rating || 5,
      guide_organisation: currentClientData.guiding_rating || 5,
      guide_people_skills: currentClientData.guiding_rating || 5,
      guide_enthusiasm: currentClientData.guiding_rating || 5,
      guide_information: currentClientData.guiding_rating || 5,
      driver_professionalism: currentClientData.driving_rating || 5,
      driver_organisation: currentClientData.driving_rating || 5,
      driver_people_skills: currentClientData.driving_rating || 5,
      driver_enthusiasm: currentClientData.driving_rating || 5,
      driver_information: currentClientData.driving_rating || 5,
      tour_leader_knowledge: currentClientData.guiding_rating || 5,
      safety_rating: 5,
      // Satisfaction metrics
      value_for_money: true,
      truck_satisfaction: true,
      repeat_travel: null,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    setCompletedFeedbacks(prev => [...prev, feedback]);
    
    // Reset form for next client
    setCurrentClientData({
      client_name: '',
      email: '',
      contact_number: '',
      overall_rating: 5,
      accommodation_rating: 5,
      food_rating: 5,
      guiding_rating: 5,
      driving_rating: 5,
      additional_comments: '',
      met_expectations: true,
      would_recommend: true,
      willing_to_review_google: false,
      willing_to_review_tripadvisor: false
    });
    
    setCurrentClientIndex(prev => prev + 1);

    toast({
      title: "Feedback Added",
      description: `Client ${currentClientIndex} feedback saved. Ready for next client.`,
      duration: 3000
    });
  };

  const submitAllFeedback = async () => {
    if (completedFeedbacks.length === 0) {
      toast({
        variant: "destructive",
        title: "No Feedback",
        description: "Please collect at least one client feedback before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createTourBackup(
        tour.tour_id,
        tour.tour_name,
        tour.guide_name,
        tour.driver_name,
        completedFeedbacks
      );

      toast({
        title: "Success!",
        description: `Collected feedback from ${completedFeedbacks.length} clients. Data saved locally and will sync when online.`,
        duration: 5000
      });

      onComplete();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save feedback. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingInput = ({ label, value, onChange }: { label: string, value: number, onChange: (value: number) => void }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              rating <= value 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tour Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {tour.tour_name}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Guide: {tour.guide_name} | Driver: {tour.driver_name}</p>
            <p>Completed: {completedFeedbacks.length} clients</p>
          </div>
        </CardHeader>
      </Card>

      {/* Current Client Form */}
      <Card>
        <CardHeader>
          <CardTitle>Client {currentClientIndex} Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Details */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="client_name">Full Name *</Label>
              <Input
                id="client_name"
                value={currentClientData.client_name}
                onChange={(e) => updateField('client_name', e.target.value)}
                placeholder="Enter client's full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={currentClientData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter client's email"
              />
            </div>
            <div>
              <Label htmlFor="contact_number">Contact Number *</Label>
              <Input
                id="contact_number"
                value={currentClientData.contact_number}
                onChange={(e) => updateField('contact_number', e.target.value)}
                placeholder="Enter client's contact number"
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RatingInput
              label="Overall Experience"
              value={currentClientData.overall_rating}
              onChange={(value) => updateField('overall_rating', value)}
            />
            <RatingInput
              label="Accommodation"
              value={currentClientData.accommodation_rating}
              onChange={(value) => updateField('accommodation_rating', value)}
            />
            <RatingInput
              label="Food & Dining"
              value={currentClientData.food_rating}
              onChange={(value) => updateField('food_rating', value)}
            />
            <RatingInput
              label="Tour Guiding"
              value={currentClientData.guiding_rating}
              onChange={(value) => updateField('guiding_rating', value)}
            />
            <RatingInput
              label="Driving"
              value={currentClientData.driving_rating}
              onChange={(value) => updateField('driving_rating', value)}
            />
          </div>

          {/* Comments */}
          <div>
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              value={currentClientData.additional_comments}
              onChange={(e) => updateField('additional_comments', e.target.value)}
              placeholder="Any additional feedback..."
              rows={3}
            />
          </div>

          {/* Quick Checkboxes */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentClientData.met_expectations}
                onChange={(e) => updateField('met_expectations', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Met expectations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentClientData.would_recommend}
                onChange={(e) => updateField('would_recommend', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Would recommend</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentClientData.willing_to_review_google}
                onChange={(e) => updateField('willing_to_review_google', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Google Review</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentClientData.willing_to_review_tripadvisor}
                onChange={(e) => updateField('willing_to_review_tripadvisor', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">TripAdvisor Review</span>
            </label>
          </div>

          <Button 
            onClick={addCurrentClient}
            disabled={!isCurrentFormValid()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client {currentClientIndex} Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Completed Clients Summary */}
      {completedFeedbacks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Feedback ({completedFeedbacks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedFeedbacks.map((feedback, index) => (
                <div key={feedback.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{feedback.client_name}</span>
                  <Badge variant="secondary">
                    <Check className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit All */}
      {completedFeedbacks.length > 0 && (
        <div className="flex gap-3">
          <Button 
            onClick={submitAllFeedback}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : `Submit All Feedback (${completedFeedbacks.length})`}
          </Button>
          <Button variant="outline" onClick={onComplete}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiClientFeedbackCollector;