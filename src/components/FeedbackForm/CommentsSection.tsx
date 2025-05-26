
import React from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface CommentsSectionProps {
  comments: string;
  onCommentsChange: (comments: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onCommentsChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="comments">Additional Comments</Label>
      <Textarea
        id="comments"
        value={comments}
        onChange={(e) => onCommentsChange(e.target.value)}
        placeholder="Please share any additional feedback about your experience..."
        rows={4}
      />
    </div>
  );
};

export default CommentsSection;
