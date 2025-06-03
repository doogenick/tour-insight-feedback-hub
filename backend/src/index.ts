import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with a database in production)
let tours: any[] = [];
let feedback: any[] = [];

// Analytics Endpoints
app.get('/api/analytics/feedback', (req, res) => {
  const { tourId, startDate, endDate, minRating } = req.query;
  let filteredFeedback = [...feedback];
  
  if (tourId) filteredFeedback = filteredFeedback.filter(f => f.tour_id === tourId);
  
  if (startDate) {
    const start = new Date(startDate as string);
    filteredFeedback = filteredFeedback.filter(f => f.submitted_at && new Date(f.submitted_at) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);
    filteredFeedback = filteredFeedback.filter(f => f.submitted_at && new Date(f.submitted_at) <= end);
  }
  
  if (minRating) {
    const min = parseInt(minRating as string);
    filteredFeedback = filteredFeedback.filter(f => f.rating_overall >= min);
  }
  
  res.json(filteredFeedback);
});

app.get('/api/analytics/summary', (req, res) => {
  const { tourId, startDate, endDate } = req.query;
  let filteredFeedback = [...feedback];
  
  if (tourId) filteredFeedback = filteredFeedback.filter(f => f.tour_id === tourId);
  
  if (startDate) {
    const start = new Date(startDate as string);
    filteredFeedback = filteredFeedback.filter(f => f.submitted_at && new Date(f.submitted_at) >= start);
  }
  
  if (endDate) {
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);
    filteredFeedback = filteredFeedback.filter(f => f.submitted_at && new Date(f.submitted_at) <= end);
  }
  
  if (filteredFeedback.length === 0) {
    return res.json({
      totalFeedback: 0,
      averageRatings: {},
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      sentimentAnalysis: { positive: 0, neutral: 0, negative: 0 },
      commonThemes: []
    });
  }
  
  // Calculate average ratings
  const ratingCategories = ['overall', 'guide', 'driver', 'food', 'equipment'] as const;
  const averageRatings: Record<string, number> = {};
  
  ratingCategories.forEach(category => {
    const key = `rating_${category}` as const;
    const validFeedbacks = filteredFeedback.filter(f => typeof f[key] === 'number');
    if (validFeedbacks.length > 0) {
      const sum = validFeedbacks.reduce((acc, f) => acc + f[key], 0);
      averageRatings[category] = parseFloat((sum / validFeedbacks.length).toFixed(2));
    }
  });
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  filteredFeedback.forEach(f => {
    const rating = Math.round(f.rating_overall);
    if (rating >= 1 && rating <= 5) {
      ratingDistribution[rating as keyof typeof ratingDistribution]++;
    }
  });
  
  // Sentiment analysis
  const sentimentAnalysis = {
    positive: filteredFeedback.filter(f => f.rating_overall >= 4).length,
    neutral: filteredFeedback.filter(f => f.rating_overall === 3).length,
    negative: filteredFeedback.filter(f => f.rating_overall < 3).length
  };
  
  // Extract common themes (simplified)
  const commonThemes = extractCommonThemes(filteredFeedback);
  
  res.json({
    totalFeedback: filteredFeedback.length,
    averageRatings,
    ratingDistribution,
    sentimentAnalysis,
    commonThemes,
    timePeriod: {
      start: filteredFeedback.reduce((min, f) => 
        f.submitted_at && new Date(f.submitted_at) < new Date(min) ? f.submitted_at : min, 
        filteredFeedback[0]?.submitted_at || new Date().toISOString()
      ),
      end: filteredFeedback.reduce((max, f) => 
        f.submitted_at && new Date(f.submitted_at) > new Date(max) ? f.submitted_at : max, 
        filteredFeedback[0]?.submitted_at || new Date().toISOString()
      )
    }
  });
});

// Helper function to extract common themes
function extractCommonThemes(feedback: any[]): string[] {
  const comments = feedback
    .filter(f => f.comments && f.comments.trim().length > 0)
    .map(f => f.comments.toLowerCase());
  
  if (comments.length === 0) return [];
  
  const wordFreq: Record<string, number> = {};
  const commonWords = new Set([
    'the', 'and', 'was', 'were', 'this', 'that', 'with', 'for', 'have', 'has', 'had',
    'they', 'this', 'that', 'from', 'what', 'your', 'will', 'would', 'there', 'their'
  ]);
  
  comments.forEach(comment => {
    const words = comment
      .replace(/[^\w\s]/g, '')
      .split(/\s+/);
      
    words.forEach(word => {
      if (word.length > 3 && !commonWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// Add some sample data for testing
function initializeSampleData() {
  const tourIds = ['tour1', 'tour2', 'tour3'];
  const clientIds = ['client1', 'client2', 'client3', 'client4', 'client5'];
  const guideNames = ['John Doe', 'Jane Smith', 'Mike Johnson'];
  const driverNames = ['Robert Brown', 'Emily Davis', 'David Wilson'];
  
  for (let i = 0; i < 50; i++) {
    const tourId = tourIds[Math.floor(Math.random() * tourIds.length)];
    const rating = Math.floor(Math.random() * 5) + 1; // 1-5
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - daysAgo);
    
    feedback.push({
      id: `feedback-${i}`,
      tour_id: tourId,
      client_id: clientIds[Math.floor(Math.random() * clientIds.length)],
      guide_name: guideNames[Math.floor(Math.random() * guideNames.length)],
      driver_name: driverNames[Math.floor(Math.random() * driverNames.length)],
      rating_overall: rating,
      rating_guide: Math.max(1, Math.min(5, rating + Math.floor(Math.random() * 2) - 1)),
      rating_driver: Math.max(1, Math.min(5, rating + Math.floor(Math.random() * 2) - 1)),
      rating_food: Math.max(1, Math.min(5, rating + Math.floor(Math.random() * 2) - 1)),
      rating_equipment: Math.max(1, Math.min(5, rating + Math.floor(Math.random() * 2) - 1)),
      comments: generateRandomComment(rating),
      submitted_at: submittedAt.toISOString()
    });
  }
  
  console.log('Initialized with', feedback.length, 'sample feedback entries');
}

function generateRandomComment(rating: number): string {
  const positiveComments = [
    'Great experience, would definitely recommend!',
    'Amazing tour guide, very knowledgeable and friendly.',
    'The views were breathtaking, worth every penny!',
    'Excellent service from start to finish.',
    'One of the best tours I\'ve ever been on.'
  ];
  
  const neutralComments = [
    'It was okay, nothing special.',
    'The tour was fine but could be improved.',
    'Average experience overall.',
    'Met expectations, but not exceeded.',
    'Decent tour, but a bit overpriced.'
  ];
  
  const negativeComments = [
    'Disappointing experience, would not recommend.',
    'The guide was late and seemed disinterested.',
    'Not worth the money, very basic tour.',
    'Poor organization and communication.',
    'Expected much more for the price.'
  ];
  
  const comments = rating >= 4 ? positiveComments :
                   rating === 3 ? neutralComments :
                   negativeComments;
  
  return comments[Math.floor(Math.random() * comments.length)];
}

// Initialize sample data
initializeSampleData();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
