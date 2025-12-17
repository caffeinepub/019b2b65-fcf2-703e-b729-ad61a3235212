import { MapPin, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { PinWithId } from '@/pages/MapPage';

interface PinDetailsDialogProps {
  pin: PinWithId;
  onClose: () => void;
}

function PinDetailsDialog({ pin, onClose }: PinDetailsDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Pin Details
          </DialogTitle>
          <DialogDescription>
            View the details and memo for this location.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono">
                ID: {pin.id.toString()}
              </Badge>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Coordinates
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium">Latitude</p>
                  <p className="font-mono text-muted-foreground">
                    {pin.pin.latitude.toFixed(6)}°
                  </p>
                </div>
                <div>
                  <p className="font-medium">Longitude</p>
                  <p className="font-mono text-muted-foreground">
                    {pin.pin.longitude.toFixed(6)}°
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              Memo
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {pin.pin.memo}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PinDetailsDialog;
