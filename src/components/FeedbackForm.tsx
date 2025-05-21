
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import RatingInput from './RatingInput';
import { Feedback } from '../services/api';
import { Clipboard, ExternalLink } from 'lucide-react';
import { useToast } from './ui/use-toast';

const FeedbackForm: React.FC = () => {
  const { 
    selectedTour,
    selectedClient,
    isSubmitting, 
    submitFeedback,
    setSelectedClient
  } = useAppContext();
  
  const { toast } = useToast();
  
  // Form state
  const [guideName, setGuideName] = useState<string>(selectedTour?.guide_name || '');
  const [driverName, setDriverName] = useState<string>(selectedTour?.driver_name || '');
  const [ratingOverall, setRatingOverall] = useState<number>(3.50);
  const [ratingGuide, setRatingGuide] = useState<number>(3.50);
  const [ratingDriver, setRatingDriver] = useState<number>(3.50);
  const [ratingFood, setRatingFood] = useState<number>(3.50);
  const [ratingEquipment, setRatingEquipment] = useState<number>(3.50);
  const [comments, setComments] = useState<string>('');
  const [email, setEmail] = useState<string>(selectedClient?.email || '');
  const [willingGoogle, setWillingGoogle] = useState<boolean>(false);
  const [willingTripadvisor, setWillingTripadvisor] = useState<boolean>(false);
  
  // Form submission state
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<Feedback | null>(null);

  // Update the form when the selected tour or client changes
  useEffect(() => {
    if (selectedTour) {
      setGuideName(selectedTour.guide_name);
      setDriverName(selectedTour.driver_name);
    }
    
    if (selectedClient && selectedClient.email) {
      setEmail(selectedClient.email);
    }
  }, [selectedTour, selectedClient]);
  
  // Copy feedback to clipboard
  const copyFeedback = () => {
    if (comments) {
      navigator.clipboard.writeText(comments);
      toast({
        title: "Copied!",
        description: "Feedback copied to clipboard",
        duration: 3000,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTour || !selectedClient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tour and client must be selected first",
      });
      return;
    }
    
    // Validate ratings are within 1.00-7.00 range
    if (ratingOverall < 1.00 || ratingOverall > 7.00 ||
        ratingGuide < 1.00 || ratingGuide > 7.00 ||
        ratingDriver < 1.00 || ratingDriver > 7.00) {
      toast({
        variant: "destructive",
        title: "Invalid Rating",
        description: "All required ratings must be between 1.00 and 7.00",
      });
      return;
    }
    
    if ((ratingFood !== 0 && (ratingFood < 1.00 || ratingFood > 7.00)) || 
        (ratingEquipment !== 0 && (ratingEquipment < 1.00 || ratingEquipment > 7.00))) {
      toast({
        variant: "destructive",
        title: "Invalid Rating",
        description: "All ratings must be between 1.00 and 7.00",
      });
      return;
    }
    
    try {
      // Prepare feedback data
      const feedbackData: Omit<Feedback, 'id' | 'status' | 'submitted_at'> = {
        tour_id: selectedTour.tour_id,
        client_id: selectedClient.client_id,
        guide_name: guideName,
        driver_name: driverName,
        rating_overall: ratingOverall,
        rating_guide: ratingGuide,
        rating_driver: ratingDriver,
        rating_food: ratingFood !== 0 ? ratingFood : undefined,
        rating_equipment: ratingEquipment !== 0 ? ratingEquipment : undefined,
        comments: comments.trim() || undefined
      };
      
      // Submit feedback
      const result = await submitFeedback(feedbackData);
      
      if (result.success && result.data) {
        setSubmittedFeedback(result.data);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  // Reset form for a new submission
  const handleReset = () => {
    setSelectedClient(null);
    setGuideName(selectedTour?.guide_name || '');
    setDriverName(selectedTour?.driver_name || '');
    setRatingOverall(3.50);
    setRatingGuide(3.50);
    setRatingDriver(3.50);
    setRatingFood(3.50);
    setRatingEquipment(3.50);
    setComments('');
    setEmail('');
    setWillingGoogle(false);
    setWillingTripadvisor(false);
    setSubmitted(false);
    setSubmittedFeedback(null);
  };
  
  return (
    <Card className="w-full animate-fade-in">
      {!submitted ? (
        <>
          <CardHeader className="text-center bg-tour-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Tour Feedback</CardTitle>
            <CardDescription className="text-white/80">
              Please rate your experience on a scale of 1.00 to 7.00
              <br />
              <span className="font-medium">(1.00 = Perfect, 7.00 = Very Poor)</span>
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Client Information Display */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-medium mb-2">Selected Client:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name:</p>
                    <p className="font-medium">{selectedClient?.full_name || 'No client selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tour:</p>
                    <p className="font-medium">{selectedTour?.tour_name || 'No tour selected'}</p>
                  </div>
                </div>
              </div>
              
              {/* Guide and Driver Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guide-name">Guide Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="guide-name"
                    value={guideName}
                    onChange={(e) => setGuideName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driver-name">Driver Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="driver-name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Ratings */}
              <div className="space-y-6">
                <RatingInput
                  label="Overall Rating"
                  value={ratingOverall}
                  onChange={setRatingOverall}
                  required
                />
                
                <RatingInput
                  label="Guide Rating"
                  value={ratingGuide}
                  onChange={setRatingGuide}
                  required
                />
                
                <RatingInput
                  label="Driver Rating"
                  value={ratingDriver}
                  onChange={setRatingDriver}
                  required
                />
                
                <RatingInput
                  label="Food Quality"
                  value={ratingFood}
                  onChange={setRatingFood}
                />
                
                <RatingInput
                  label="Equipment Quality"
                  value={ratingEquipment}
                  onChange={setRatingEquipment}
                />
              </div>
              
              {/* Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please share any additional feedback about your experience..."
                  rows={4}
                />
              </div>
              
              {/* Email and Review Preferences */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Would you be willing to share your experience?</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="google-review"
                      checked={willingGoogle}
                      onCheckedChange={(checked) => setWillingGoogle(checked as boolean)}
                    />
                    <Label htmlFor="google-review" className="cursor-pointer">
                      I'm willing to leave a Google review
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tripadvisor-review"
                      checked={willingTripadvisor}
                      onCheckedChange={(checked) => setWillingTripadvisor(checked as boolean)}
                    />
                    <Label htmlFor="tripadvisor-review" className="cursor-pointer">
                      I'm willing to leave a TripAdvisor review
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center gap-4">
              <Button 
                type="submit" 
                className="bg-tour-primary hover:bg-tour-secondary"
                disabled={isSubmitting || !selectedClient}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </CardFooter>
          </form>
        </>
      ) : (
        <>
          <CardHeader className="text-center bg-tour-success text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
            <CardDescription className="text-white/80">
              Your feedback has been received and is greatly appreciated.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg">
                We appreciate your time and valuable feedback.
              </p>
              
              {(willingGoogle || willingTripadvisor) && (
                <div className="space-y-6 my-8">
                  <p className="text-lg font-medium text-tour-primary">
                    Would you mind sharing your experience on:
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    {willingGoogle && (
                      <Button 
                        className="bg-tour-primary hover:bg-tour-secondary flex gap-2 py-6 px-8" 
                        asChild
                      >
                        <a href="https://g.page/YOUR_BUSINESS_NAME/review?rc" target="_blank" rel="noopener noreferrer">
                          <span>Share on Google</span>
                          <ExternalLink size={16} />
                        </a>
                      </Button>
                    )}
                    
                    {willingTripadvisor && (
                      <Button 
                        className="bg-tour-primary hover:bg-tour-secondary flex gap-2 py-6 px-8" 
                        asChild
                      >
                        <a href="https://www.tripadvisor.com/UserReview-gYOUR_CITY_ID-dYOUR_BUSINESS_ID-YOUR_BUSINESS_NAME.html" target="_blank" rel="noopener noreferrer">
                          <span>Share on TripAdvisor</span>
                          <ExternalLink size={16} />
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {comments && (
                    <Button 
                      variant="outline" 
                      className="flex gap-2" 
                      onClick={copyFeedback}
                    >
                      <Clipboard size={16} />
                      <span>Copy Your Feedback</span>
                    </Button>
                  )}
                </div>
              )}
              
              <Button 
                className="mt-8 bg-tour-primary hover:bg-tour-secondary" 
                onClick={handleReset}
              >
                Submit Another Response
              </Button>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default FeedbackForm;
