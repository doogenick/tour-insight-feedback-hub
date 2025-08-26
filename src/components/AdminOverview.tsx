import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Star, Users, Calendar, TrendingUp } from 'lucide-react';
import { useSupabaseTours } from '@/hooks/useSupabaseTours';
import { useSupabaseCrew } from '@/hooks/useSupabaseCrew';
import { useSupabaseFeedback } from '@/hooks/useSupabaseFeedback';

const AdminOverview = () => {
  const { tours, fetchTours } = useSupabaseTours();
  const { crew, fetchCrew } = useSupabaseCrew();
  const { getFeedbackStats } = useSupabaseFeedback();
  const [stats, setStats] = useState({
    totalTours: 0,
    totalCrew: 0,
    totalFeedback: 0,
    averageRating: 0,
    toursWithFeedback: 0
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTours(), fetchCrew()]);
      
      try {
        const feedbackStats = await getFeedbackStats();
        if (feedbackStats) {
          setStats(prev => ({
            ...prev,
            totalFeedback: feedbackStats.totalFeedback,
            averageRating: feedbackStats.averageRating,
            toursWithFeedback: feedbackStats.uniqueTours
          }));
        }
      } catch (error) {
        console.error('Error loading feedback stats:', error);
      }
    };

    loadData();
  }, [fetchTours, fetchCrew, getFeedbackStats]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalTours: tours.length,
      totalCrew: crew.length
    }));
  }, [tours, crew]);

  const activeTours = tours.filter(tour => tour.status === 'active' || tour.status === 'planned');
  const completedTours = tours.filter(tour => tour.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Track your tours, crew, and customer feedback performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTours}</div>
            <p className="text-xs text-muted-foreground">
              {activeTours.length} active, {completedTours.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrew}</div>
            <p className="text-xs text-muted-foreground">
              Active crew members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Feedback</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">
              From {stats.toursWithFeedback} tours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tours</CardTitle>
            <CardDescription>
              Latest tours in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tours.slice(0, 5).map((tour) => (
                <div key={tour.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {tour.tour_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Code: {tour.tour_code}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                      {tour.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {tours.length === 0 && (
                <p className="text-sm text-muted-foreground">No tours found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crew Overview</CardTitle>
            <CardDescription>
              Crew members by role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['guide', 'driver', 'assistant'].map((role) => {
                const count = crew.filter(member => member.role === role).length;
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none capitalize">
                        {role}s
                      </p>
                    </div>
                    <Badge variant="outline">
                      {count}
                    </Badge>
                  </div>
                );
              })}
              {crew.length === 0 && (
                <p className="text-sm text-muted-foreground">No crew members found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;