import React from 'react';
import { Button } from './ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import feedbackService from '../services/api/feedbackService';

interface ReviewShareButtonsProps {
  feedbackId: string;
  tourName: string;
  onShareSuccess?: (platform: 'google' | 'tripadvisor') => void;
  className?: string;
}

const ReviewShareButtons: React.FC<ReviewShareButtonsProps> = ({
  feedbackId,
  tourName,
  onShareSuccess,
  className = ''
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<{
    google: boolean;
    tripadvisor: boolean;
  }>({ google: false, tripadvisor: false });

  const handleShare = async (platform: 'google' | 'tripadvisor') => {
    setIsLoading(prev => ({ ...prev, [platform]: true }));
    
    try {
      // Open the review platform in a new tab
      const url = platform === 'google' 
        ? `https://search.google.com/local/writereview?placeid=YOUR_GOOGLE_PLACE_ID`
        : `https://www.tripadvisor.com/UserReview`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
      
      // Mark as shared in our system
      const result = await feedbackService.markReviewAsShared(feedbackId, platform);
      
      if (result.success) {
        toast({
          title: 'Thank you!',
          description: `Your review on ${platform === 'google' ? 'Google' : 'TripAdvisor'} is greatly appreciated!`,
        });
        
        if (onShareSuccess) {
          onShareSuccess(platform);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(`Error sharing on ${platform}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to mark review as shared on ${platform === 'google' ? 'Google' : 'TripAdvisor'}. Please try again.`,
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <Button
        variant="outline"
        onClick={() => handleShare('google')}
        disabled={isLoading.google}
        className="flex items-center gap-2"
      >
        {isLoading.google ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening...
          </>
        ) : (
          <>
            <img 
              src="/google-icon.svg" 
              alt="Google" 
              className="h-4 w-4" 
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0RBMjgyOUIiIGQ9Ik0yMi41NiAxMi4yNWMwLS43OC0uMDctMS41My0wLjItMi4yNUgxMnY0LjI2aDUuOTJjLS4yNiAxLjM3LTEuMDQgMi41My0yLjIxIDMuMzF2Mi43N2gzLjU4YzIuMDEtMS44NiAzLjE2LTQuNiAzLjE2LTguMDl6Ii8+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTEyIDIzYzIuOTcgMCA1LjQ2LS45OCA3LjI4LTIuN2wtMy41OC0yLjc3Yy0uOTguNjYtMi4yMyAxLjA2LTMuNyAxLjA2LTIuODYgMC01LjI5LTEuOTMtNi4xNi00LjUzSDIuMTh2Mi44NEM0IDIwLjUzIDcuNjIgMjMgMTIgMjN6Ii8+PHBhdGggZmlsbD0iI0ZCQkM0QyIgZD0iTTUuODQgMTRjLS4yNS0uNzQtMC4zOS0xLjUzLTAuMzktMi4zNHMwLjE0LTEuNi4zOS0yLjM0VjYuNDlIMi4xOEMxLjMgOC4wOS44MSAxMC4wMi44MSAxMi4xN2MwIDIuMTUuNDkgNC4wOCAxLjM3IDUuNjhsMy42Ny0yLjg1eiIvPjxwYXRoIGZpbGw9IiIzNDg1RUYiIGQ9Ik0xMiA1LjM4YzEuNjIgMCAzLjA2LjU2IDQuMjEgMS42NGwzLjE1LTMuMTVDMTcuNDUgMi4wOSAxNC45NyAxIDEyIDFBNC45NzYgNC45NzYgMCAwIDAgMi4xOCA2LjQ5bDMuNjYgMi44NGMuODctMi42IDMuMy00LjUzIDYuMTYtNC41M3oiLz48L3N2Zz4=';
              }}
            />
            Share on Google
            <ExternalLink className="h-3 w-3 opacity-50" />
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleShare('tripadvisor')}
        disabled={isLoading.tripadvisor}
        className="flex items-center gap-2"
      >
        {isLoading.tripadvisor ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Opening...
          </>
        ) : (
          <>
            <img 
              src="/tripadvisor-icon.svg" 
              alt="TripAdvisor" 
              className="h-4 w-4"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzM0QTc1MyIgZD0iTTEyIDBjNi42MjcgMCAxMiA1LjM3MyAxMiAxMnMtNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJTNS4zNzMgMCAxMiAwem0wIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAxLjI1YzQuODI4IDAgOC43NSA0LjM3IDguNzUgOS43NXYxLjI1aC0xNy41di0xLjI1YzAtNS4zOCAzLjkyMi05Ljc1IDguNzUtOS43NXptMCAxLjVjLTMuOTc5IDAtNy4yNSAzLjY3Ny03LjI1IDguMjV2Ljc1aDE0LjV2LS43NWMwLTQuNTczLTMuMjcxLTguMjUtNy4yNS04LjI1em0tMy43NSA4YzAgLjk2NS43ODUgMS43NSAxLjc1IDEuNzVzMS43NS0uNzg1IDEuNzUtMS43NS0uNzg1LTEuNzUtMS43NS0xLjc1LTEuNzUuNzg1LTEuNzUgMS43NXptNy41IDBjMCAuOTY1Ljc4NSAxLjc1IDEuNzUgMS43NXMxLjc1LS43ODUgMS43NS0xLjc1LS43ODUtMS43NS0xLjc1LTEuNzUtMS43NS43ODUtMS43NSAxLjc1eiIvPjwvc3ZnPg==';
              }}
            />
            Share on TripAdvisor
            <ExternalLink className="h-3 w-3 opacity-50" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ReviewShareButtons;
