import { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { PinWithId } from '@/pages/MapPage';

interface WorldMapProps {
  pins: [bigint, { latitude: number; longitude: number; memo: string }][];
  onMapClick: (lat: number, lng: number) => void;
  onPinClick: (pin: PinWithId) => void;
  isLoading: boolean;
}

function WorldMap({ pins, onMapClick, onPinClick, isLoading }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 1000, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // Convert lat/lng to SVG coordinates (Equirectangular projection)
  const latLngToXY = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  // Convert SVG coordinates to lat/lng
  const xyToLatLng = (x: number, y: number) => {
    const lng = (x / 1000) * 360 - 180;
    const lat = 90 - (y / 500) * 180;
    return { lat, lng };
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return;

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;

    const { lat, lng } = xyToLatLng(x, y);
    onMapClick(lat, lng);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) * (viewBox.width / (containerRef.current?.clientWidth || 1));
    const dy = (e.clientY - dragStart.y) * (viewBox.height / (containerRef.current?.clientHeight || 1));

    setViewBox((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(1000 - prev.width, prev.x - dx)),
      y: Math.max(0, Math.min(500 - prev.height, prev.y - dy)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setTimeout(() => setIsDragging(false), 10);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.5, Math.min(4, scale * delta));
    
    const newWidth = 1000 / newScale;
    const newHeight = 500 / newScale;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;
    
    const newX = mouseX - (mouseX - viewBox.x) * (newWidth / viewBox.width);
    const newY = mouseY - (mouseY - viewBox.y) * (newHeight / viewBox.height);
    
    setScale(newScale);
    setViewBox({
      x: Math.max(0, Math.min(1000 - newWidth, newX)),
      y: Math.max(0, Math.min(500 - newHeight, newY)),
      width: newWidth,
      height: newHeight,
    });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="relative h-[calc(100vh-180px)] w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="h-full w-full"
          onClick={handleSvgClick}
          onWheel={handleWheel}
        >
          {/* Ocean */}
          <rect x="0" y="0" width="1000" height="500" fill="oklch(0.7 0.05 230)" />

          {/* Simplified world map continents */}
          {/* North America */}
          <path
            d="M 150 80 L 120 100 L 100 140 L 110 180 L 140 200 L 180 190 L 220 160 L 240 120 L 230 90 L 200 70 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* South America */}
          <path
            d="M 220 240 L 200 260 L 190 300 L 200 340 L 220 380 L 240 390 L 260 370 L 270 330 L 260 280 L 240 250 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* Europe */}
          <path
            d="M 480 80 L 460 90 L 450 110 L 460 130 L 490 140 L 520 130 L 540 110 L 530 85 L 510 75 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* Africa */}
          <path
            d="M 480 160 L 460 180 L 450 220 L 460 280 L 490 320 L 520 340 L 550 330 L 570 290 L 560 240 L 540 200 L 520 170 L 500 160 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* Asia */}
          <path
            d="M 560 60 L 540 80 L 550 120 L 580 140 L 640 130 L 700 120 L 750 100 L 780 80 L 770 60 L 720 50 L 660 55 L 600 50 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* Australia */}
          <path
            d="M 740 320 L 720 330 L 710 350 L 720 370 L 750 380 L 790 375 L 820 360 L 830 340 L 820 320 L 780 310 Z"
            fill="oklch(0.75 0.08 140)"
            stroke="oklch(0.6 0.08 140)"
            strokeWidth="0.5"
          />

          {/* Antarctica */}
          <path
            d="M 100 450 L 200 460 L 400 470 L 600 465 L 800 455 L 900 450 L 900 500 L 0 500 L 0 450 Z"
            fill="oklch(0.95 0.02 200)"
            stroke="oklch(0.85 0.02 200)"
            strokeWidth="0.5"
          />

          {/* Grid lines */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`lat-${i}`}
              x1="0"
              y1={(i + 1) * 50}
              x2="1000"
              y2={(i + 1) * 50}
              stroke="oklch(0.5 0.02 230 / 0.2)"
              strokeWidth="0.3"
              strokeDasharray="2,2"
            />
          ))}
          {Array.from({ length: 19 }).map((_, i) => (
            <line
              key={`lng-${i}`}
              x1={(i + 1) * 50}
              y1="0"
              x2={(i + 1) * 50}
              y2="500"
              stroke="oklch(0.5 0.02 230 / 0.2)"
              strokeWidth="0.3"
              strokeDasharray="2,2"
            />
          ))}

          {/* Pins */}
          {pins.map(([id, pin]) => {
            const { x, y } = latLngToXY(pin.latitude, pin.longitude);
            return (
              <g
                key={id.toString()}
                onClick={(e) => {
                  e.stopPropagation();
                  onPinClick({ id, pin });
                }}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <image
                  href="/assets/generated/map-pin-icon-transparent.dim_32x32.png"
                  x={x - 8}
                  y={y - 16}
                  width="16"
                  height="16"
                  className="drop-shadow-lg"
                />
                <circle
                  cx={x}
                  cy={y - 8}
                  r="3"
                  fill="oklch(0.55 0.22 25)"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls info */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-card/90 px-4 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur-sm">
        <p className="font-medium">Controls:</p>
        <p>• Click to add pin</p>
        <p>• Drag to pan</p>
        <p>• Scroll to zoom</p>
      </div>

      {/* Pin count */}
      <div className="absolute right-4 top-4 rounded-lg bg-card/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-sm">
        <span className="text-muted-foreground">Pins: </span>
        <span className="text-primary">{pins.length}</span>
      </div>
    </div>
  );
}

export default WorldMap;
