import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WorldMap from '@/components/WorldMap';
import PinDialog from '@/components/PinDialog';
import PinDetailsDialog from '@/components/PinDetailsDialog';
import { useGetAllPins } from '@/hooks/useQueries';
import type { Pin } from '@/backend';

export interface PinWithId {
  id: bigint;
  pin: Pin;
}

function MapPage() {
  const { data: pins = [], isLoading } = useGetAllPins();
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinWithId | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
  };

  const handlePinClick = (pinWithId: PinWithId) => {
    setSelectedPin(pinWithId);
  };

  const handleDialogClose = () => {
    setSelectedPosition(null);
  };

  const handleDetailsClose = () => {
    setSelectedPin(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <WorldMap
          pins={pins}
          onMapClick={handleMapClick}
          onPinClick={handlePinClick}
          isLoading={isLoading}
        />
      </main>
      <Footer />

      {selectedPosition && (
        <PinDialog
          position={selectedPosition}
          onClose={handleDialogClose}
        />
      )}

      {selectedPin && (
        <PinDetailsDialog
          pin={selectedPin}
          onClose={handleDetailsClose}
        />
      )}
    </div>
  );
}

export default MapPage;
