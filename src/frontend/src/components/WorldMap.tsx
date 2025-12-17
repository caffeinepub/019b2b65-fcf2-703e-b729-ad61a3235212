import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { PinWithId } from '@/pages/MapPage';

interface WorldMapProps {
  pins: [bigint, { latitude: number; longitude: number; memo: string }][];
  onMapClick: (lat: number, lng: number) => void;
  onPinClick: (pin: PinWithId) => void;
  isLoading: boolean;
}

// Declare Leaflet types for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

function WorldMap({ pins, onMapClick, onPinClick, isLoading }: WorldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const leafletLoadedRef = useRef(false);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (leafletLoadedRef.current) return;

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Add Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;
    
    script.onload = () => {
      leafletLoadedRef.current = true;
      initializeMap();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.L || mapRef.current) return;

    // Initialize map
    const map = window.L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
    });

    // Add OpenStreetMap tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Handle map clicks
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    });

    mapRef.current = map;
  };

  // Update markers when pins change
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icon
    const customIcon = window.L.icon({
      iconUrl: '/assets/generated/map-pin-icon-transparent.dim_32x32.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add new markers
    pins.forEach(([id, pin]) => {
      const marker = window.L.marker([pin.latitude, pin.longitude], {
        icon: customIcon,
      }).addTo(mapRef.current);

      marker.on('click', (e: any) => {
        window.L.DomEvent.stopPropagation(e);
        onPinClick({ id, pin });
      });

      markersRef.current.push(marker);
    });
  }, [pins, onMapClick, onPinClick]);

  return (
    <div className="relative h-[calc(100vh-180px)] w-full">
      {isLoading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{ background: '#aad3df' }}
      />

      {/* Controls info */}
      <div className="absolute bottom-4 left-4 z-[500] rounded-lg bg-card/90 px-4 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur-sm">
        <p className="font-medium">Controls:</p>
        <p>• Click to add pin</p>
        <p>• Drag to pan</p>
        <p>• Scroll to zoom</p>
        <p>• Click pin to view details</p>
      </div>

      {/* Pin count */}
      <div className="absolute right-4 top-4 z-[500] rounded-lg bg-card/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
        <span className="text-muted-foreground">Pins: </span>
        <span className="text-primary">{pins.length}</span>
      </div>
    </div>
  );
}

export default WorldMap;
