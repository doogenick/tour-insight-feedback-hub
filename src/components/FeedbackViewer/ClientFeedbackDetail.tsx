import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ComprehensiveFeedback } from '../../types/ComprehensiveFeedback';
import { User, Mail, Phone, Globe, BarChart3, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ClientFeedbackDetailProps {
  feedback: ComprehensiveFeedback;
}

const ClientFeedbackDetail: React.FC<ClientFeedbackDetailProps> = ({ feedback }) => {
  const renderRating = (value: number, label: string) => {
    if (!value || value <= 0) return null;
    
    // Color coding: 1=best (green), 7=worst (red) - Updated to remove yellow/range
    const getRatingColor = (val: number): string => {
      if (val <= 1.5) return 'bg-green-100 text-green-800 border-green-200'; // Perfect
      if (val <= 2.5) return 'bg-green-50 text-green-700 border-green-300'; // Excellent
      if (val <= 3.5) return 'bg-blue-50 text-blue-700 border-blue-300'; // Good
      if (val <= 4.5) return 'bg-slate-50 text-slate-700 border-slate-300'; // Fair
      if (val <= 5.5) return 'bg-orange-50 text-orange-700 border-orange-300'; // Poor
      if (val <= 6.5) return 'bg-red-50 text-red-700 border-red-300'; // Very Poor
      return 'bg-red-100 text-red-800 border-red-400'; // Worst
    };
    
    const getRatingLabel = (val: number): string => {
      if (val <= 1.5) return 'Perfect';
      if (val <= 2.5) return 'Excellent';
      if (val <= 3.5) return 'Good';
      if (val <= 4.5) return 'Fair';
      if (val <= 5.5) return 'Poor';
      if (val <= 6.5) return 'Very Poor';
      return 'Worst';
    };
    
    return (
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`${getRatingColor(value)} font-semibold`}
          >
            {value}/7 - {getRatingLabel(value)}
          </Badge>
        </div>
      </div>
    );
  };

  const renderBooleanResponse = (value: boolean | null, label: string) => (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {value === true ? (
          <>
            <ThumbsUp className="h-4 w-4 text-green-600" />
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
          </>
        ) : value === false ? (
          <>
            <ThumbsDown className="h-4 w-4 text-red-600" />
            <Badge variant="destructive">No</Badge>
          </>
        ) : (
          <Badge variant="outline">Not answered</Badge>
        )}
      </div>
    </div>
  );

  const renderComment = (comment: string | undefined, label: string) => {
    if (!comment?.trim()) return null;
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {label}
        </label>
        <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
          <p className="text-sm leading-relaxed">{comment}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{feedback.client_name || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{feedback.client_email || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{feedback.cellphone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{feedback.nationality || 'Not provided'}</p>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Tour Code</p>
              <Badge variant="default" className="mt-1 bg-blue-100 text-blue-800">
                {feedback.tour_id || 'Unknown'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tour Section Completed</p>
              <Badge variant="outline" className="mt-1">{feedback.tour_section_completed}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Experience Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderRating(feedback.accommodation_rating, 'Accommodation')}
          {renderRating(feedback.information_rating, 'Information Provided')}
          {renderRating(feedback.quality_equipment_rating, 'Equipment Quality')}
          {renderRating(feedback.truck_comfort_rating, 'Truck Comfort')}
          {renderRating(feedback.food_quantity_rating, 'Food Quantity')}
          {renderRating(feedback.food_quality_rating, 'Food Quality')}
          {renderRating(feedback.driving_rating, 'Driving')}
          {renderRating(feedback.guiding_rating, 'Guiding')}
          {renderRating(feedback.organisation_rating, 'Organisation')}
          {renderRating(feedback.pace_rating, 'Tour Pace')}
          {renderRating(feedback.route_rating, 'Route')}
          {renderRating(feedback.activity_level_rating, 'Activity Level')}
          {renderRating(feedback.price_rating, 'Price')}
          {renderRating(feedback.value_rating, 'Value')}
          {renderRating(feedback.overview_rating, 'Overall Experience')}
          {renderRating(feedback.safety_rating, 'Safety')}
        </CardContent>
      </Card>

      {/* Crew Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Guide Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderRating(feedback.guide_individual_rating, 'Overall Guide Rating')}
            {renderRating(feedback.guide_professionalism, 'Professionalism')}
            {renderRating(feedback.guide_organisation, 'Organisation')}
            {renderRating(feedback.guide_people_skills, 'People Skills')}
            {renderRating(feedback.guide_enthusiasm, 'Enthusiasm')}
            {renderRating(feedback.guide_information, 'Information & Knowledge')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {renderRating(feedback.driver_individual_rating, 'Overall Driver Rating')}
            {renderRating(feedback.driver_professionalism, 'Professionalism')}
            {renderRating(feedback.driver_organisation, 'Organisation')}
            {renderRating(feedback.driver_people_skills, 'People Skills')}
            {renderRating(feedback.driver_enthusiasm, 'Enthusiasm')}
            {renderRating(feedback.driver_information, 'Information & Knowledge')}
          </CardContent>
        </Card>
      </div>

      {/* Tour Leader Knowledge */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Leadership</CardTitle>
        </CardHeader>
        <CardContent>
          {renderRating(feedback.tour_leader_knowledge, 'Tour Leader Knowledge')}
        </CardContent>
      </Card>

      {/* Satisfaction Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Satisfaction & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderBooleanResponse(feedback.met_expectations, 'Met Expectations')}
          {renderBooleanResponse(feedback.value_for_money, 'Value for Money')}
          {renderBooleanResponse(feedback.truck_satisfaction, 'Truck Satisfaction')}
          {renderBooleanResponse(feedback.would_recommend, 'Would Recommend')}
          {renderBooleanResponse(feedback.repeat_travel, 'Would Travel Again')}
          {renderBooleanResponse(feedback.willing_to_review_google, 'Willing to Review on Google')}
          {renderBooleanResponse(feedback.willing_to_review_tripadvisor, 'Willing to Review on TripAdvisor')}
        </CardContent>
      </Card>

      {/* Comments & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Written Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderComment(feedback.tour_highlight, 'Tour Highlight')}
          {renderComment(feedback.improvement_suggestions, 'Suggestions for Improvement')}
          {renderComment(feedback.additional_comments, 'Additional Comments')}
          {renderComment(feedback.expectations_comment, 'Expectations Comment')}
          {renderComment(feedback.value_for_money_comment, 'Value for Money Comment')}
          {renderComment(feedback.truck_satisfaction_comment, 'Truck Satisfaction Comment')}
          {renderComment(feedback.tour_leader_knowledge_comment, 'Tour Leader Knowledge Comment')}
          {renderComment(feedback.safety_comment, 'Safety Comment')}
          {renderComment(feedback.would_recommend_comment, 'Recommendation Comment')}
          {renderComment(feedback.repeat_travel_comment, 'Repeat Travel Comment')}
          {renderComment(feedback.heard_about_other, 'How They Heard About Us')}
          
          {(!feedback.tour_highlight && !feedback.improvement_suggestions && 
            !feedback.additional_comments && !feedback.expectations_comment &&
            !feedback.value_for_money_comment && !feedback.truck_satisfaction_comment &&
            !feedback.tour_leader_knowledge_comment && !feedback.safety_comment &&
            !feedback.would_recommend_comment && !feedback.repeat_travel_comment &&
            !feedback.heard_about_other) && (
            <p className="text-muted-foreground italic text-center py-4">
              No written feedback provided
            </p>
          )}
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{feedback.age || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{feedback.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Newsletter Signup</p>
              <Badge variant={feedback.newsletter_signup ? "default" : "outline"}>
                {feedback.newsletter_signup ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Details */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Submitted At</p>
              <p className="font-medium">
                {feedback.submitted_at 
                  ? new Date(feedback.submitted_at).toLocaleString()
                  : 'Not available'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline">{feedback.status || 'Completed'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFeedbackDetail;