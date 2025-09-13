
import { useState, useEffect } from 'react';
import { ComprehensiveFeedback } from '../types/ComprehensiveFeedback';
import { Client } from '../services/api/types';

export const useComprehensiveFeedbackForm = (selectedClient: Client | null) => {
  const [formData, setFormData] = useState<Partial<ComprehensiveFeedback>>({
    tour_section_completed: '',
    accommodation_rating: 3,
    information_rating: 3,
    quality_equipment_rating: 3,
    truck_comfort_rating: 3,
    food_quantity_rating: 3,
    food_quality_rating: 3,
    driving_rating: 3,
    guiding_rating: 3,
    organisation_rating: 3,
    guide_individual_rating: 3,
    driver_individual_rating: 3,
    pace_rating: 3,
    route_rating: 3,
    activity_level_rating: 3,
    price_rating: 3,
    value_rating: 3,
    overview_rating: 3,
    overall_rating: 3, // Add overall_rating field
    guide_professionalism: 3,
    guide_organisation: 3,
    guide_people_skills: 3,
    guide_enthusiasm: 3,
    guide_information: 3,
    driver_professionalism: 3,
    driver_organisation: 3,
    driver_people_skills: 3,
    driver_enthusiasm: 3,
    driver_information: 3,
    met_expectations: null,
    value_for_money: null,
    truck_satisfaction: null,
    tour_leader_knowledge: 3,
    safety_rating: 3,
    would_recommend: null,
    heard_about_source: '',
    repeat_travel: null,
    willing_to_review_google: false,
    willing_to_review_tripadvisor: false
  });

  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (selectedClient?.email) {
      setFormData(prev => ({ 
        ...prev, 
        email: selectedClient.email,
        client_email: selectedClient.email 
      }));
    }
  }, [selectedClient]);

  const updateFormData = (field: keyof ComprehensiveFeedback, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      tour_section_completed: '',
      accommodation_rating: 3,
      information_rating: 3,
      quality_equipment_rating: 3,
      truck_comfort_rating: 3,
      food_quantity_rating: 3,
      food_quality_rating: 3,
      driving_rating: 3,
      guiding_rating: 3,
      organisation_rating: 3,
      guide_individual_rating: 3,
      driver_individual_rating: 3,
      pace_rating: 3,
      route_rating: 3,
      activity_level_rating: 3,
      price_rating: 3,
      value_rating: 3,
      overview_rating: 3,
      overall_rating: 3, // Add overall_rating field
      guide_professionalism: 3,
      guide_organisation: 3,
      guide_people_skills: 3,
      guide_enthusiasm: 3,
      guide_information: 3,
      driver_professionalism: 3,
      driver_organisation: 3,
      driver_people_skills: 3,
      driver_enthusiasm: 3,
      driver_information: 3,
      met_expectations: null,
      value_for_money: null,
      truck_satisfaction: null,
      tour_leader_knowledge: 3,
      safety_rating: 3,
      would_recommend: null,
      heard_about_source: '',
      repeat_travel: null
    });
    setCurrentPage(1);
  };

  return {
    formData,
    currentPage,
    setCurrentPage,
    updateFormData,
    resetForm
  };
};
