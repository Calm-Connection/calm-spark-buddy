import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface ReportConcernModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportConcernModal({ open, onOpenChange }: ReportConcernModalProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: 'Please describe the issue',
        description: 'Tell us what happened so we can help',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Simulate submission (can be replaced with actual backend call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Thanks for letting us know!',
      description: 'Your feedback helps us make Calm Connection even better.',
    });
    
    setDescription('');
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report a Concern</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Describe the problem</Label>
            <Textarea
              id="description"
              placeholder="Tell us what went wrong or what could be better..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This is for reporting bugs or app issues. For wellbeing support, please speak with a trusted adult or contact a helpline.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Send Report'}
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
