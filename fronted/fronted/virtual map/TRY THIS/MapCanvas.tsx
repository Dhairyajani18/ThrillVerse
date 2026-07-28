import React, { useEffect, useRef } from 'react';
import { MapLocation, PARK_CENTER } from './mapData';
import { Ride } from '../../types';

/**
 * Real map canvas built on Leaflet + OpenStreetMap tiles.
 *
 * Leaflet is loaded from a CDN at runtime, so no npm install is required.
 * (If you prefer, run `npm i leaflet @types/leaflet` and replace the loader
 * with `import L from 'leaflet'` + `import 'leaflet/dist/leaflet.css'`.)
 */

interface MapCanvasProps {
  locations: MapLocation[];
  selectedLocation: string | null;
  onLocationSelect: (id: string) => void;
  /** Real route polyline as [lat, lng] pairs (from OSRM), or null. */
  routeCoordinates: [number, number][] | null;
  routeFromId?: string | null;
  routeToId?: string | null;
  rides?: Ride[];
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

function loadLeaflet(): Promise<any> {
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    let script = document.querySelector(
      `script[src="${LEAFLET_JS}"]`,
    ) as HTMLScriptElement | null;
    if (script && w.L) return resolve(w.L);
    if (!script) {
      script = document.createElement('script');
      script.src = LEAFLET_JS;
      document.body.appendChild(script);
    }
    script.addEventListener('load', () => resolve((window as any).L));
    script.addEventListener('error', reject);
  });
}

function iconFor(loc: MapLocation): string {
  if (loc.type === 'ride') {
    const map: Record<string, string> = {
      'r-thunder': '🎢', 'r-sky': '🛸', 'r-vortex': '🗼', 'r-cyclone': '🌪️',
      'r-gravity': '🌀', 'r-fire': '🔥', 'r-splash': '🛶', 'r-aqua': '🌊',
      'r-wave': '🚤', 'r-tsunami': '🏄', 'r-express': '🚂', 'r-carousel': '🎠',
      'r-safari': '🚙', 'r-wheel': '🎡', 'r-dragon': '🐉', 'r-train': '🚋',
      'r-pirate': '🏴‍☠️',
    };
    return map[loc.id] || (loc.category === 'Water' ? '🌊' : '🎢');
  }
  switch (loc.type) {
    case 'restaurant':
      return loc.category === 'Dessert' ? '🍦' : loc.category === 'Cafe' ? '☕' : '🍔';
    case 'event': return '🎭';
    case 'facility': return '🚻';
    case 'zone': return '📍';
    default: return '📍';
  }
}

export default function MapCanvas({
  locations,
  selectedLocation,
  onLocationSelect,
  routeCoordinates,
  routeFromId,
  routeToId,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const onSelectRef = useRef(onLocationSelect);
  onSelectRef.current = onLocationSelect;

  // Initialise the map once.
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, { zoomControl: true }).setView(
        PARK_CENTER,
        15,
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      markerLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 0);
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Render / update location markers.
  useEffect(() => {
    const L = LRef.current;
    const layer = markerLayerRef.current;
    if (!L || !layer) return;
    layer.clearLayers();

    locations.forEach((loc) => {
      const selected = selectedLocation === loc.id;
      const ring = selected ? 'box-shadow:0 0 0 4px rgba(37,99,235,.45);' : '';
      const bg =
        loc.type === 'ride'
          ? loc.status === 'open' ? '#f97316' : '#94a3b8'
          : loc.type === 'restaurant' ? '#fbbf24'
          : loc.type === 'event' ? '#a855f7'
          : loc.type === 'zone' ? '#10b981'
          : '#334155';
      const html = `<div style="width:30px;height:30px;border-radius:50%;background:${bg};
        display:flex;align-items:center;justify-content:center;font-size:16px;
        border:2px solid #fff;${ring}">${iconFor(loc)}</div>`;
      const icon = L.divIcon({
        html,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(layer);
      marker.bindTooltip(loc.name, { direction: 'top' });
      marker.on('click', () => onSelectRef.current(loc.id));
    });
  }, [locations, selectedLocation]);

  // Draw / clear the real route polyline.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = routeLayerRef.current;
    if (!L || !map || !layer) return;
    layer.clearLayers();
    if (!routeCoordinates || routeCoordinates.length < 2) return;

    L.polyline(routeCoordinates, { color: '#93c5fd', weight: 9, opacity: 0.9 }).addTo(layer);
    L.polyline(routeCoordinates, { color: '#1d4ed8', weight: 4 }).addTo(layer);

    const from = locations.find((l) => l.id === routeFromId);
    const to = locations.find((l) => l.id === routeToId);
    if (from) {
      L.circleMarker([from.lat, from.lng], {
        radius: 8, color: '#fff', weight: 2, fillColor: '#10b981', fillOpacity: 1,
      }).addTo(layer).bindTooltip('Start', { permanent: true, direction: 'top' });
    }
    if (to) {
      L.circleMarker([to.lat, to.lng], {
        radius: 8, color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1,
      }).addTo(layer).bindTooltip('End', { permanent: true, direction: 'top' });
    }

    map.fitBounds(L.polyline(routeCoordinates).getBounds(), { padding: [50, 50] });
  }, [routeCoordinates, routeFromId, routeToId, locations]);

  // Recenter on the selected marker.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocation) return;
    const loc = locations.find((l) => l.id === selectedLocation);
    if (loc) map.panTo([loc.lat, loc.lng]);
  }, [selectedLocation, locations]);

  return <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 0 }} />;
}
