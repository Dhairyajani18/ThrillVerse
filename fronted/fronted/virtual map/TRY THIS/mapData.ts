import { RideCategory, ThrillLevel } from '../../types';

export type LocationType = 'ride' | 'restaurant' | 'facility' | 'event' | 'zone';

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  category?: RideCategory | string;
  thrillLevel?: ThrillLevel;
  heightReq?: number;
  duration?: string;
  status: 'open' | 'closed' | 'maintenance';
  waitTime?: number;
  x: number; // 0-100% (kept for legacy layout / relative positioning)
  y: number; // 0-100%
  lat: number; // REAL latitude
  lng: number; // REAL longitude
  description: string;
  image: string;
  zoneId: string;
  hasVirtualQueue?: boolean;
}

/**
 * The park layout is mapped onto a REAL location so we can render real
 * OpenStreetMap tiles and route along real roads with OSRM.
 * Here we use Orlando's theme-park district. Move PARK_BOUNDS to relocate
 * the whole park anywhere on Earth while preserving the relative layout.
 */
export const PARK_BOUNDS = {
  latMin: 28.415,
  latMax: 28.445,
  lngMin: -81.485,
  lngMax: -81.455,
};

/** Center of the park (used to initialise the map view). */
export const PARK_CENTER: [number, number] = [
  (PARK_BOUNDS.latMin + PARK_BOUNDS.latMax) / 2,
  (PARK_BOUNDS.lngMin + PARK_BOUNDS.lngMax) / 2,
];

/** Convert a legacy x/y percentage (0-100) into real [lat, lng]. */
export function toLatLng(x: number, y: number): [number, number] {
  const lat =
    PARK_BOUNDS.latMax - (y / 100) * (PARK_BOUNDS.latMax - PARK_BOUNDS.latMin);
  const lng =
    PARK_BOUNDS.lngMin + (x / 100) * (PARK_BOUNDS.lngMax - PARK_BOUNDS.lngMin);
  return [lat, lng];
}

export const MAP_ZONES = [
  { id: 'entrance', name: 'Main Entrance & Plaza', color: 'bg-slate-200' },
  { id: 'thriller', name: 'Thriller Zone', color: 'bg-red-100' },
  { id: 'water', name: 'Water Zone', color: 'bg-blue-100' },
  { id: 'family', name: 'Family Zone', color: 'bg-green-100' },
  { id: 'kids', name: 'Kids Zone', color: 'bg-yellow-100' },
  { id: 'center', name: 'Castle Plaza', color: 'bg-purple-100' },
];

// lat/lng are filled in automatically from x/y just below the array.
type RawLocation = Omit<MapLocation, 'lat' | 'lng'>;

const RAW_LOCATIONS: RawLocation[] = [
  // ---------------- ZONES & LANDMARKS ----------------
  {
    id: 'l-entrance', name: 'Main Entrance', type: 'facility', zoneId: 'entrance',
    x: 50, y: 95, status: 'open',
    description: 'Welcome to ThrillVerse! Your adventure starts here.',
    image: 'https://images.unsplash.com/photo-1574007557342-9988d5eebf5b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'l-ticket', name: 'Ticket Plaza', type: 'facility', zoneId: 'entrance',
    x: 50, y: 90, status: 'open',
    description: 'Purchase tickets and fast passes.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'l-boulevard', name: 'Main Boulevard', type: 'zone', zoneId: 'entrance',
    x: 50, y: 75, status: 'open',
    description: 'The bustling street leading to the heart of the park.',
    image: 'https://images.unsplash.com/photo-1505993597083-3bd19fa85e54?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'l-castle', name: 'Castle Plaza', type: 'zone', zoneId: 'center',
    x: 50, y: 50, status: 'open',
    description: 'The majestic centerpiece of ThrillVerse.',
    image: 'https://images.unsplash.com/photo-1533575510629-9e8d19760086?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- THRILLER ZONE (Top Left) ----------------
  {
    id: 'r-thunder', name: 'Thunder Loop', type: 'ride', category: 'Extreme', thrillLevel: 'Extreme', heightReq: 140, duration: '2 mins', status: 'open', waitTime: 45, zoneId: 'thriller', hasVirtualQueue: true,
    x: 20, y: 25, description: 'Experience zero gravity on this triple-loop coaster.',
    image: 'https://images.unsplash.com/photo-1551523891-66782ff77926?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-sky', name: 'Sky Screamer', type: 'ride', category: 'Extreme', thrillLevel: 'Extreme', heightReq: 130, duration: '3 mins', status: 'open', waitTime: 30, zoneId: 'thriller', hasVirtualQueue: true,
    x: 15, y: 40, description: 'Soar above the park on this giant swing ride.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-vortex', name: 'Vortex Drop', type: 'ride', category: 'Extreme', thrillLevel: 'Extreme', heightReq: 120, duration: '1 min', status: 'open', waitTime: 15, zoneId: 'thriller',
    x: 30, y: 20, description: 'A sudden 200ft vertical drop.',
    image: 'https://images.unsplash.com/photo-1506441010375-7b56191c7ae9?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-cyclone', name: 'Cyclone Rush', type: 'ride', category: 'Adventure', thrillLevel: 'Adventure', heightReq: 110, duration: '4 mins', status: 'open', waitTime: 25, zoneId: 'thriller', hasVirtualQueue: true,
    x: 25, y: 35, description: 'Twisting wooden coaster through dense forests.',
    image: 'https://images.unsplash.com/photo-1508682855173-195b6cbe1f72?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-gravity', name: 'Gravity Spin', type: 'ride', category: 'Extreme', thrillLevel: 'Extreme', heightReq: 140, duration: '2 mins', status: 'maintenance', waitTime: 0, zoneId: 'thriller',
    x: 10, y: 30, description: 'High-speed centrifugal experience.',
    image: 'https://images.unsplash.com/photo-1594966779361-bba6eb063c8a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-fire', name: 'Fire Storm', type: 'ride', category: 'Extreme', thrillLevel: 'Extreme', heightReq: 130, duration: '2.5 mins', status: 'open', waitTime: 60, zoneId: 'thriller', hasVirtualQueue: true,
    x: 35, y: 30, description: 'Launched coaster with explosive acceleration.',
    image: 'https://images.unsplash.com/photo-1533575510629-9e8d19760086?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- WATER ZONE (Top Right) ----------------
  {
    id: 'r-splash', name: 'Splash River', type: 'ride', category: 'Water', thrillLevel: 'Family', heightReq: 90, duration: '8 mins', status: 'open', waitTime: 20, zoneId: 'water',
    x: 75, y: 25, description: 'A relaxing and occasionally bumpy log flume.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-aqua', name: 'Aqua Twister', type: 'ride', category: 'Water', thrillLevel: 'Adventure', heightReq: 110, duration: '5 mins', status: 'open', waitTime: 35, zoneId: 'water', hasVirtualQueue: true,
    x: 85, y: 35, description: 'Spinning raft ride down a white water river.',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-wave', name: 'Wave Racer', type: 'ride', category: 'Water', thrillLevel: 'Family', heightReq: 100, duration: '3 mins', status: 'open', waitTime: 10, zoneId: 'water',
    x: 70, y: 40, description: 'Skim across the water on high-speed jetskis.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-tsunami', name: 'Tsunami Falls', type: 'ride', category: 'Water', thrillLevel: 'Extreme', heightReq: 120, duration: '2 mins', status: 'closed', waitTime: 0, zoneId: 'water',
    x: 80, y: 15, description: 'The steepest water drop in the world.',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- FAMILY ZONE (Bottom Left) ----------------
  {
    id: 'r-express', name: 'Adventure Express', type: 'ride', category: 'Family', thrillLevel: 'Family', heightReq: 100, duration: '6 mins', status: 'open', waitTime: 15, zoneId: 'family',
    x: 25, y: 65, description: 'Scenic train ride through mysterious caves.',
    image: 'https://images.unsplash.com/photo-1522081691280-410e527025fb?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-carousel', name: 'Magic Carousel', type: 'ride', category: 'Family', thrillLevel: 'Kids', heightReq: 0, duration: '4 mins', status: 'open', waitTime: 5, zoneId: 'family',
    x: 35, y: 70, description: 'Classic beautifully carved horses.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-safari', name: 'Jungle Safari', type: 'ride', category: 'Family', thrillLevel: 'Adventure', heightReq: 90, duration: '10 mins', status: 'open', waitTime: 25, zoneId: 'family',
    x: 15, y: 60, description: 'Jeep tour with animatronic wildlife.',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-wheel', name: 'Sky Wheel', type: 'ride', category: 'Family', thrillLevel: 'Family', heightReq: 0, duration: '15 mins', status: 'open', waitTime: 40, zoneId: 'family', hasVirtualQueue: true,
    x: 20, y: 80, description: 'Giant observation wheel with AC cabins.',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- KIDS ZONE (Bottom Right) ----------------
  {
    id: 'r-dragon', name: 'Mini Dragon', type: 'ride', category: 'Kids', thrillLevel: 'Kids', heightReq: 80, duration: '2 mins', status: 'open', waitTime: 10, zoneId: 'kids',
    x: 75, y: 70, description: 'Gentle coaster for the little ones.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-train', name: 'Happy Train', type: 'ride', category: 'Kids', thrillLevel: 'Kids', heightReq: 0, duration: '5 mins', status: 'open', waitTime: 5, zoneId: 'kids',
    x: 85, y: 65, description: 'A fun train that circles the Kids Zone.',
    image: 'https://images.unsplash.com/photo-1522081691280-410e527025fb?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'r-pirate', name: 'Pirate Ship', type: 'ride', category: 'Kids', thrillLevel: 'Family', heightReq: 90, duration: '3 mins', status: 'open', waitTime: 15, zoneId: 'kids',
    x: 70, y: 80, description: 'Swinging ship that goes just high enough.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- FACILITIES & RESTAURANTS ----------------
  {
    id: 'f-food', name: 'Food Court', type: 'restaurant', category: 'Multi-cuisine', zoneId: 'center',
    x: 60, y: 45, status: 'open', description: 'Burgers, pizza, salads, and more.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-coffee', name: 'Coffee Shop', type: 'restaurant', category: 'Cafe', zoneId: 'entrance',
    x: 45, y: 80, status: 'open', description: 'Fresh coffee and pastries.', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-icecream', name: 'Ice Cream Corner', type: 'restaurant', category: 'Dessert', zoneId: 'kids',
    x: 65, y: 65, status: 'open', description: 'Sweet treats for everyone.', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-store', name: 'Merchandise Store', type: 'facility', zoneId: 'entrance',
    x: 55, y: 80, status: 'open', description: 'Souvenirs, apparel, and toys.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-aid', name: 'First Aid Center', type: 'facility', zoneId: 'center',
    x: 40, y: 45, status: 'open', description: 'Medical assistance and nursing rooms.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-washroom1', name: 'Washrooms - Center', type: 'facility', zoneId: 'center',
    x: 40, y: 55, status: 'open', description: 'Restrooms and baby changing.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-washroom2', name: 'Washrooms - Entrance', type: 'facility', zoneId: 'entrance',
    x: 60, y: 85, status: 'open', description: 'Restrooms.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-lockers', name: 'Lockers', type: 'facility', zoneId: 'entrance',
    x: 40, y: 85, status: 'open', description: 'Secure storage for belongings.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-info', name: 'Information Center', type: 'facility', zoneId: 'entrance',
    x: 50, y: 85, status: 'open', description: 'Guest services and lost & found.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-parking', name: 'Parking', type: 'facility', zoneId: 'entrance',
    x: 50, y: 105, status: 'open', description: 'Main visitor parking lot.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'f-exit', name: 'Exit Gate', type: 'facility', zoneId: 'entrance',
    x: 55, y: 95, status: 'open', description: 'Thank you for visiting.', image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=400',
  },

  // ---------------- EVENTS ----------------
  {
    id: 'e-plaza', name: 'Event Plaza', type: 'event', zoneId: 'center',
    x: 50, y: 40, status: 'open', description: 'Main stage for daily live shows.', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'e-parade', name: 'Stars of ThrillVerse Parade', type: 'event', zoneId: 'entrance',
    x: 50, y: 65, status: 'open', description: 'The grand parade moving down the Boulevard.', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
  },
];

// Attach real lat/lng derived from the x/y layout.
export const MAP_LOCATIONS: MapLocation[] = RAW_LOCATIONS.map((l) => {
  const [lat, lng] = toLatLng(l.x, l.y);
  return { ...l, lat, lng };
});

// Legacy internal walking network (kept as an offline fallback for pathfinder).
export const MAP_PATHS = [
  ['l-entrance', 'l-ticket'],
  ['l-ticket', 'l-boulevard'],
  ['l-ticket', 'f-info'],
  ['l-ticket', 'f-lockers'],
  ['l-ticket', 'f-washroom2'],
  ['l-boulevard', 'f-coffee'],
  ['l-boulevard', 'f-store'],
  ['l-boulevard', 'l-castle'],
  ['l-boulevard', 'e-parade'],
  ['l-castle', 'e-plaza'],
  ['l-castle', 'f-food'],
  ['l-castle', 'f-aid'],
  ['l-castle', 'f-washroom1'],
  ['l-castle', 'r-vortex'],
  ['l-castle', 'r-fire'],
  ['l-castle', 'r-splash'],
  ['l-castle', 'r-express'],
  ['l-castle', 'r-dragon'],
  ['r-vortex', 'r-thunder'],
  ['r-thunder', 'r-sky'],
  ['r-thunder', 'r-cyclone'],
  ['r-cyclone', 'r-gravity'],
  ['r-splash', 'r-aqua'],
  ['r-aqua', 'r-wave'],
  ['r-wave', 'r-tsunami'],
  ['r-express', 'r-carousel'],
  ['r-carousel', 'r-safari'],
  ['r-safari', 'r-wheel'],
  ['r-dragon', 'r-train'],
  ['r-train', 'r-pirate'],
  ['r-dragon', 'f-icecream'],
];
