import React, { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { ParkLocation } from './mapData';
import thrillverseMapImg from '@/assets/thrillverse_map.jpg';

interface LeafletParkMapProps {
  locations: ParkLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  routeCoordinates: [number, number][] | null;
  routeFromId?: string | null;
  routeToId?: string | null;
}

// 1024 x 682 image bounds in L.CRS.Simple space
const MAP_WIDTH = 1024;
const MAP_HEIGHT = 682;
const BOUNDS: L.LatLngBoundsExpression = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

/** Re-centers map view programmatically when location or route selection changes */
function MapViewSetter({ selectedCoords, routeCoords }: { selectedCoords?: [number, number] | null; routeCoords?: [number, number][] | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 0.8, { duration: 0.6 });
    }
  }, [selectedCoords, map]);

  useEffect(() => {
    if (routeCoords && routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 0.8 });
    }
  }, [routeCoords, map]);

  return null;
}

// Helper to create custom HTML DivIcons for Leaflet
function createLocationIcon(loc: ParkLocation, isSelected: boolean): L.DivIcon {
  let badgeColor = 'bg-slate-800 text-white';
  let borderRing = isSelected
    ? 'ring-4 ring-blue-500 scale-125 z-50 shadow-2xl animate-pulse'
    : 'ring-2 ring-white/90 shadow-lg';

  if (loc.type === 'ride') {
    if (loc.thrillLevel === 'Extreme') badgeColor = 'bg-gradient-to-r from-red-600 to-rose-600 text-white';
    else if (loc.thrillLevel === 'Adventure') badgeColor = 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
    else if (loc.thrillLevel === 'Family') badgeColor = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
    else badgeColor = 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black';
  } else if (loc.type === 'restaurant') {
    badgeColor = 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
  } else if (loc.type === 'entrance') {
    badgeColor = 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white';
  }

  const waitTimePill = (loc.type === 'ride' && loc.waitTime !== undefined) ? `
    <span class="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-slate-950 text-amber-300 border border-slate-700 shadow-md">
      ${loc.waitTime}m
    </span>
  ` : '';

  const html = `
    <div class="relative group cursor-pointer transition-transform duration-200 hover:scale-115 flex items-center justify-center">
      <div class="w-8 h-8 rounded-full ${badgeColor} ${borderRing} flex items-center justify-center text-sm shadow-md transition-all">
        ${loc.emoji || '📍'}
      </div>
      ${waitTimePill}
      <div class="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700">
        ${loc.name}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

export default function LeafletParkMap({
  locations,
  selectedLocationId,
  onSelectLocation,
  routeCoordinates,
  routeFromId,
  routeToId,
}: LeafletParkMapProps) {
  const selectedLoc = locations.find(l => l.id === selectedLocationId);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950 font-sans">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={BOUNDS}
        maxBounds={[[-100, -100], [MAP_HEIGHT + 100, MAP_WIDTH + 100]]}
        minZoom={-0.5}
        maxZoom={3}
        zoom={0}
        center={[MAP_HEIGHT / 2, MAP_WIDTH / 2]}
        zoomControl={true}
        className="w-full h-full z-0"
        style={{ background: '#0f172a' }}
      >
        <MapViewSetter
          selectedCoords={selectedLoc?.coords}
          routeCoords={routeCoordinates}
        />

        {/* Base Park Map Image Overlay */}
        <ImageOverlay
          url={thrillverseMapImg}
          bounds={BOUNDS}
          opacity={0.95}
        />

        {/* Animated Polyline for Dijkstra Pathway Route */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <>
            {/* Glow Line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: '#2563eb',
                weight: 10,
                opacity: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Inner Animated Dash Line */}
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: '#60a5fa',
                weight: 5,
                dashArray: '10, 15',
                className: 'leaflet-animated-route-line',
                lineCap: 'round',
              }}
            />
          </>
        )}

        {/* Markers for all park locations */}
        {locations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          const isStart = routeFromId === loc.id;
          const isEnd = routeToId === loc.id;

          return (
            <Marker
              key={loc.id}
              position={loc.coords}
              icon={createLocationIcon(loc, isSelected || isStart || isEnd)}
              eventHandlers={{
                click: () => {
                  // Direct user request: "when i click on icon details is shown left side only"
                  onSelectLocation(loc.id);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
