import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clipboard } from 'lucide-react';
import ManualTourEntryDialog from '@/components/MobileFeedbackFlow/ManualTourEntryDialog';
import { useSupabaseTours } from '@/hooks/useSupabaseTours';
import { Tour } from '@/types/Tour';

const FeedbackStartPage: React.FC = () => {
  const navigate = useNavigate();
  const { tours, fetchTours } = useSupabaseTours();

  React.useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleTourCreated = (tour: Tour) => {
    navigate(`/tour/${tour.tour_id}/feedback`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Tour Feedback Collection</h1>
        <p className="text-muted-foreground text-center">Start collecting client feedback for your tour</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Tour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Create a new tour and start collecting feedback from clients.
            </p>
            <ManualTourEntryDialog onCreate={handleTourCreated} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="h-5 w-5" />
              Recent Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tours.length === 0 ? (
              <p className="text-muted-foreground">No recent tours found.</p>
            ) : (
              <div className="space-y-2">
                {tours.slice(0, 3).map((tour) => (
                  <Button
                    key={tour.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/tour/${tour.id}/feedback`)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{tour.tour_code}</div>
                      <div className="text-sm text-muted-foreground">{tour.tour_name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackStartPage;