import { v4 as uuidv4 } from 'uuid';
import { ComprehensiveFeedback, Tour, Client, Feedback } from './api/types';
import { comprehensiveFeedbackService } from './comprehensiveFeedbackService';
import localforage from 'localforage';

// Sample data pools
const tourNames = [
  'Tarangire Safari Adventure',
  'Zanzibar Beach Retreat', 
  'Serengeti Wildlife Experience',
  'Ngorongoro Crater Expedition',
  'Kilimanjaro Base Camp Trek',
  'Lake Manyara Discovery',
  'Ruaha National Park Safari',
  'Stone Town Cultural Tour'
];

const guideNames = ['Blessing', 'Zawadi', 'Mwalimu', 'Furaha', 'Upendo', 'Baraka', 'Neema', 'Tumaini'];
const driverNames = ['Godfrey', 'Khamisi', 'Juma', 'Mwangi', 'Bahati', 'Salim', 'Rajabu', 'Omari'];

const firstNames = [
  'John', 'Jane', 'Robert', 'Mary', 'Michael', 'Linda', 'William', 'Patricia',
  'David', 'Jennifer', 'Richard', 'Elizabeth', 'Joseph', 'Susan', 'Thomas', 'Jessica',
  'Christopher', 'Sarah', 'Daniel', 'Karen', 'Matthew', 'Nancy', 'Anthony', 'Lisa',
  'Mark', 'Betty', 'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee'
];

const nationalities = [
  'American', 'British', 'German', 'French', 'Canadian', 'Australian', 
  'Dutch', 'Italian', 'Spanish', 'Swedish', 'Norwegian', 'Swiss'
];

const tourSections = [
  'cape_town_vic_falls', 'cape_town_windhoek', 'cape_town_swakopmund_vic_falls', 
  'windhoek_vic_falls', ''
] as const;

const tourHighlights = [
  'Amazing wildlife sightings in Serengeti',
  'Breathtaking views from Ngorongoro Crater',
  'Cultural exchange with Maasai community',
  'Spectacular sunset at Lake Manyara',
  'Close encounters with elephants',
  'Big Five spotted on game drive',
  'Beautiful beaches of Zanzibar',
  'Historic Stone Town exploration'
];

const improvementSuggestions = [
  'More time at each location',
  'Better road conditions needed',
  'Earlier start times for game drives',
  'More vegetarian meal options',
  'Additional cultural activities',
  'Improved vehicle comfort',
  'Better wifi connectivity',
  'More detailed briefings'
];

// Generate random rating (weighted towards better ratings)
const generateRating = (): number => {
  const weights = [0.4, 0.3, 0.2, 0.07, 0.02, 0.005, 0.005]; // Higher chance for better ratings
  const cumulative = weights.reduce((acc, weight, index) => {
    acc.push((acc[acc.length - 1] || 0) + weight);
    return acc;
  }, [] as number[]);
  
  const random = Math.random();
  const ratingIndex = cumulative.findIndex(cum => random <= cum);
  return ratingIndex + 1;
};

// Generate random boolean with bias towards positive
const generateBoolean = (positiveBias: number = 0.8): boolean => {
  return Math.random() < positiveBias;
};

// Generate random date within last 6 months
const generateDate = (): string => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (Date.now() - sixMonthsAgo.getTime());
  return new Date(randomTime).toISOString();
};

// Generate initials from full name
const generateInitials = (fullName: string): string => {
  return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
};

export const dummyDataGenerator = {
  // Generate comprehensive feedback
  generateComprehensiveFeedback: async (count: number = 50): Promise<ComprehensiveFeedback[]> => {
    const feedbackList: ComprehensiveFeedback[] = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const guideName = guideNames[Math.floor(Math.random() * guideNames.length)];
      const driverName = driverNames[Math.floor(Math.random() * driverNames.length)];
      
      const feedback: Omit<ComprehensiveFeedback, 'id' | 'status' | 'submitted_at'> = {
        tour_id: `TUR${Math.floor(Math.random() * 900000) + 100000}`,
        client_id: uuidv4(),
        client_name: fullName,
        client_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        client_initials: generateInitials(fullName),
        nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
        tour_section_completed: tourSections[Math.floor(Math.random() * tourSections.length)],
        
        // Main ratings
        accommodation_rating: generateRating(),
        information_rating: generateRating(),
        quality_equipment_rating: generateRating(),
        truck_comfort_rating: generateRating(),
        food_quantity_rating: generateRating(),
        food_quality_rating: generateRating(),
        driving_rating: generateRating(),
        guiding_rating: generateRating(),
        organisation_rating: generateRating(),
        overview_rating: generateRating(),
        
        // Individual crew ratings
        guide_individual_rating: generateRating(),
        driver_individual_rating: generateRating(),
        
        // Detailed crew ratings
        guide_professionalism: generateRating(),
        guide_organisation: generateRating(),
        guide_people_skills: generateRating(),
        guide_enthusiasm: generateRating(),
        guide_information: generateRating(),
        
        driver_professionalism: generateRating(),
        driver_organisation: generateRating(),
        driver_people_skills: generateRating(),
        driver_enthusiasm: generateRating(),
        driver_information: generateRating(),
        
        // Additional required fields for comprehensive feedback
        pace_rating: generateRating(),
        route_rating: generateRating(),
        activity_level_rating: generateRating(),
        price_rating: generateRating(),
        value_rating: generateRating(),
        tour_leader_knowledge: generateRating(),
        safety_rating: generateRating(),
        
        // Boolean questions
        met_expectations: generateBoolean(0.85),
        value_for_money: generateBoolean(0.75),
        would_recommend: generateBoolean(0.9),
        truck_satisfaction: generateBoolean(0.8),
        repeat_travel: generateBoolean(0.6),
        
        // Contact preferences
        willing_to_review_google: generateBoolean(0.6),
        willing_to_review_tripadvisor: generateBoolean(0.5),
        newsletter_signup: generateBoolean(0.4),
        
        // How they heard about us
        heard_about_source: ['word_of_mouth', 'internet', 'travel_agent', 'brochure', 'repeat_client', 'other', ''][Math.floor(Math.random() * 7)] as any,
        
        // Text feedback
        tour_highlight: Math.random() > 0.3 ? tourHighlights[Math.floor(Math.random() * tourHighlights.length)] : undefined,
        improvement_suggestions: Math.random() > 0.5 ? improvementSuggestions[Math.floor(Math.random() * improvementSuggestions.length)] : undefined,
        additional_comments: Math.random() > 0.4 ? `Great experience with ${guideName} and ${driverName}. The tour exceeded our expectations!` : undefined
      };
      
      // Store the feedback
      const savedFeedback = await comprehensiveFeedbackService.submitFeedback(feedback);
      feedbackList.push(savedFeedback);
    }
    
    return feedbackList;
  },

  // Generate tours and clients
  generateToursAndClients: async (tourCount: number = 8): Promise<{ tours: Tour[], clients: Client[] }> => {
    const tours: Tour[] = [];
    const clients: Client[] = [];
    
    for (let i = 0; i < tourCount; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90) - 30); // ±30 days from now
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 3); // 3-17 day tours
      
      const tour: Tour = {
        tour_id: `TUR${Math.floor(Math.random() * 900000) + 100000}`,
        tour_name: tourNames[Math.floor(Math.random() * tourNames.length)],
        date_start: startDate.toISOString().split('T')[0],
        date_end: endDate.toISOString().split('T')[0],
        passenger_count: Math.floor(Math.random() * 16) + 4, // 4-20 passengers
        guide_name: guideNames[Math.floor(Math.random() * guideNames.length)],
        driver_name: driverNames[Math.floor(Math.random() * driverNames.length)]
      };
      
      tours.push(tour);
      
      // Generate clients for this tour
      const clientCount = Math.floor(Math.random() * 12) + 6; // 6-18 clients per tour
      for (let j = 0; j < clientCount; j++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        const client: Client = {
          client_id: uuidv4(),
          tour_id: tour.tour_id,
          full_name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          willing_to_review_google: generateBoolean(0.6),
          willing_to_review_tripadvisor: generateBoolean(0.5),
          created_at: new Date().toISOString()
        };
        
        clients.push(client);
        
        // Store client in localforage
        await localforage.setItem(`client_${client.client_id}`, client);
      }
      
      // Store tour in localforage
      await localforage.setItem(`tour_${tour.tour_id}`, tour);
    }
    
    return { tours, clients };
  },

  // Generate legacy feedback
  generateLegacyFeedback: async (clientCount: number = 30): Promise<Feedback[]> => {
    const feedback: Feedback[] = [];
    const tours = await dummyDataGenerator.getAllStoredTours();
    
    for (let i = 0; i < clientCount; i++) {
      const tour = tours[Math.floor(Math.random() * tours.length)];
      if (!tour) continue;
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const feedbackItem: Feedback = {
        id: uuidv4(),
        tour_id: tour.tour_id,
        client_id: uuidv4(),
        guide_name: tour.guide_name,
        driver_name: tour.driver_name,
        rating_overall: generateRating(),
        rating_guide: generateRating(),
        rating_driver: generateRating(),
        rating_food: Math.random() > 0.2 ? generateRating() : undefined,
        rating_equipment: Math.random() > 0.2 ? generateRating() : undefined,
        comments: Math.random() > 0.4 ? `Great tour with ${tour.guide_name}! Highly recommend.` : undefined,
        submitted_at: generateDate(),
        status: 'Synced'
      };
      
      feedback.push(feedbackItem);
      
      // Store in localforage
      await localforage.setItem(`feedback_${feedbackItem.id}`, feedbackItem);
    }
    
    return feedback;
  },

  // Helper to get all stored tours
  getAllStoredTours: async (): Promise<Tour[]> => {
    const tours: Tour[] = [];
    const keys = await localforage.keys();
    
    for (const key of keys) {
      if (key.startsWith('tour_')) {
        const tour = await localforage.getItem<Tour>(key);
        if (tour) tours.push(tour);
      }
    }
    
    return tours;
  },

  // Clear all dummy data
  clearAllData: async (): Promise<void> => {
    await localforage.clear();
    await comprehensiveFeedbackService.clearAllFeedback();
  }
};
