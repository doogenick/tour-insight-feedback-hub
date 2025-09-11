import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackDetailProps {
  feedback: any;
  onClose: () => void;
}

const AdminFeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback, onClose }) => {
  const renderRating = (rating: number, label: string) => {
    if (!rating || rating <= 0) return null;
    
    // Color coding: 1=best (green), 7=worst (red)
    const getRatingColor = (val: number): string => {
      if (val <= 1.5) return 'bg-green-100 text-green-800 border-green-200'; // Perfect
      if (val <= 2.5) return 'bg-green-50 text-green-700 border-green-300'; // Excellent
      if (val <= 3.5) return 'bg-yellow-50 text-yellow-700 border-yellow-300'; // Good
      if (val <= 4.5) return 'bg-yellow-100 text-yellow-800 border-yellow-400'; // Fair
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
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold border ${getRatingColor(rating)}`}>
            {rating}/7 - {getRatingLabel(rating)}
          </span>
        </div>
      </div>
    );
  };

  const renderBoolean = (value: boolean | null, label: string) => {
    if (value === null || value === undefined) return null;
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          {value ? (
            <ThumbsUp className="h-4 w-4 text-green-600" />
          ) : (
            <ThumbsDown className="h-4 w-4 text-red-600" />
          )}
          <span className="text-sm">{value ? 'Yes' : 'No'}</span>
        </div>
      </div>
    );
  };

  const renderComment = (comment: string | null, label: string) => {
    if (!comment) return null;
    return (
      <div className="py-2">
        <span className="text-sm font-medium block mb-1">{label}</span>
        <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">{comment}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>
                Client: {feedback.client_name} | Tour: {feedback.tour_id}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Client Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Name:</strong> {feedback.client_name}</div>
              <div><strong>Email:</strong> {feedback.client_email || 'Not provided'}</div>
              <div><strong>Phone:</strong> {feedback.client_phone || feedback.cellphone || 'Not provided'}</div>
              <div><strong>Nationality:</strong> {feedback.client_nationality || feedback.nationality || 'Not provided'}</div>
              <div><strong>Age:</strong> {feedback.age || 'Not provided'}</div>
              <div><strong>Gender:</strong> {feedback.gender || 'Not provided'}</div>
            </div>
          </div>

          <Separator />

          {/* Main Ratings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Overall Ratings</h3>
            <div className="space-y-1">
              {renderRating(feedback.overall_rating, 'Overall Rating')}
              {renderRating(feedback.overview_rating, 'Overview Rating')}
              {renderRating(feedback.accommodation_rating, 'Accommodation')}
              {renderRating(feedback.information_rating, 'Information Quality')}
              {renderRating(feedback.quality_equipment_rating, 'Equipment Quality')}
              {renderRating(feedback.truck_comfort_rating, 'Vehicle Comfort')}
              {renderRating(feedback.food_quantity_rating, 'Food Quantity')}
              {renderRating(feedback.food_quality_rating, 'Food Quality')}
              {renderRating(feedback.value_rating, 'Value for Money')}
              {renderRating(feedback.pace_rating, 'Tour Pace')}
              {renderRating(feedback.route_rating, 'Route Quality')}
              {renderRating(feedback.activity_level_rating, 'Activity Level')}
              {renderRating(feedback.safety_rating, 'Safety')}
            </div>
          </div>

          <Separator />

          {/* Staff Ratings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Staff Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Guide Performance</h4>
                <div className="space-y-1">
                  {renderRating(feedback.guide_rating || feedback.guiding_rating, 'Overall Guiding')}
                  {renderRating(feedback.guide_individual_rating, 'Individual Performance')}
                  {renderRating(feedback.guide_professionalism, 'Professionalism')}
                  {renderRating(feedback.guide_organisation, 'Organisation')}
                  {renderRating(feedback.guide_people_skills, 'People Skills')}
                  {renderRating(feedback.guide_enthusiasm, 'Enthusiasm')}
                  {renderRating(feedback.guide_information, 'Information Knowledge')}
                  {renderRating(feedback.tour_leader_knowledge, 'Tour Leader Knowledge')}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Driver Performance</h4>
                <div className="space-y-1">
                  {renderRating(feedback.driver_rating || feedback.driving_rating, 'Overall Driving')}
                  {renderRating(feedback.driver_individual_rating, 'Individual Performance')}
                  {renderRating(feedback.driver_professionalism, 'Professionalism')}
                  {renderRating(feedback.driver_organisation, 'Organisation')}
                  {renderRating(feedback.driver_people_skills, 'People Skills')}
                  {renderRating(feedback.driver_enthusiasm, 'Enthusiasm')}
                  {renderRating(feedback.driver_information, 'Information Knowledge')}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Satisfaction Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Satisfaction Questions</h3>
            <div className="space-y-1">
              {renderBoolean(feedback.met_expectations || feedback.tour_expectations_met, 'Expectations Met')}
              {renderBoolean(feedback.value_for_money, 'Good Value for Money')}
              {renderBoolean(feedback.truck_satisfaction, 'Vehicle Satisfaction')}
              {renderBoolean(feedback.would_recommend, 'Would Recommend')}
              {renderBoolean(feedback.repeat_travel || feedback.likely_to_return, 'Likely to Return')}
              {renderBoolean(feedback.newsletter_signup, 'Newsletter Signup')}
              {renderBoolean(feedback.willing_to_review_google, 'Willing to Review on Google')}
              {renderBoolean(feedback.willing_to_review_tripadvisor, 'Willing to Review on TripAdvisor')}
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Comments & Feedback</h3>
            <div className="space-y-3">
              {renderComment(feedback.tour_highlight || feedback.highlights, 'Tour Highlights')}
              {renderComment(feedback.improvement_suggestions || feedback.improvements, 'Improvement Suggestions')}
              {renderComment(feedback.additional_comments, 'Additional Comments')}
              {renderComment(feedback.expectations_comment, 'Expectations Comment')}
              {renderComment(feedback.value_for_money_comment, 'Value for Money Comment')}
              {renderComment(feedback.truck_satisfaction_comment, 'Vehicle Satisfaction Comment')}
              {renderComment(feedback.tour_leader_knowledge_comment, 'Tour Leader Knowledge Comment')}
              {renderComment(feedback.safety_comment, 'Safety Comment')}
              {renderComment(feedback.would_recommend_comment, 'Recommendation Comment')}
              {renderComment(feedback.repeat_travel_comment, 'Repeat Travel Comment')}
            </div>
          </div>

          {/* Marketing Information */}
          {(feedback.heard_about_source || feedback.heard_about_other) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Marketing Information</h3>
                <div className="text-sm">
                  <div><strong>How they heard about us:</strong> {feedback.heard_about_source || 'Other'}</div>
                  {feedback.heard_about_other && (
                    <div><strong>Other source:</strong> {feedback.heard_about_other}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Submission Info */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">Submission Information</h3>
            <div className="text-sm space-y-1">
              <div><strong>Status:</strong> <Badge variant="secondary">{feedback.status || 'Submitted'}</Badge></div>
              <div><strong>Submitted:</strong> {new Date(feedback.submitted_at).toLocaleString()}</div>
              <div><strong>Tour Section Completed:</strong> {feedback.tour_section_completed || 'Full tour'}</div>
              {feedback.client_signature_date && (
                <div><strong>Signature Date:</strong> {feedback.client_signature_date}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeedbackDetail;