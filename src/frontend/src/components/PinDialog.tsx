import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreatePin } from '@/hooks/useQueries';
import { toast } from 'sonner';

interface PinDialogProps {
  position: { lat: number; lng: number };
  onClose: () => void;
}

function PinDialog({ position, onClose }: PinDialogProps) {
  const [memo, setMemo] = useState('');
  const createPin = useCreatePin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memo.trim()) {
      toast.error('Please enter a memo');
      return;
    }

    try {
      await createPin.mutateAsync({
        latitude: position.lat,
        longitude: position.lng,
        memo: memo.trim(),
      });
      
      toast.success('Pin created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create pin');
      console.error('Error creating pin:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Add New Pin
          </DialogTitle>
          <DialogDescription>
            Create a memory at this location. Add a note about what makes this place special.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Location</Label>
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p>
                  <span className="font-medium">Latitude:</span> {position.lat.toFixed(6)}°
                </p>
                <p>
                  <span className="font-medium">Longitude:</span> {position.lng.toFixed(6)}°
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo</Label>
              <Textarea
                id="memo"
                placeholder="What's special about this place? Share your thoughts, memories, or plans..."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={5}
                className="resize-none"
                disabled={createPin.isPending}
              />
              <p className="text-xs text-muted-foreground">
                {memo.length} characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createPin.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPin.isPending || !memo.trim()}>
              {createPin.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Pin'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PinDialog;
