/**
 * ThrillVerse Strict Centerline Pedestrian Road Graph & Dijkstra Navigation Engine
 *
 * EXACT ROAD MAP ALIGNMENT:
 * 1. Crystal Lake Shoreline bounds: x = 370..650, y = 265..370. NO ROAD CROSSES CRYSTAL LAKE.
 * 2. West Lake Bypass Promenade curves outside the lake at x = 330..360.
 * 3. East Lake Bypass Promenade curves outside the lake at x = 640..670.
 * 4. Alibaba aur Chalis Chorr to Dino Splashdown travels VIA Dare 2 Drop and the North Mountain Promenade Road (y=535..550, north of Castle and Lake).
 * 5. Castle Bridge crossings carry natural theme-park crowd congestion weights, encouraging cross-park pedestrian traffic to prefer scenic North Mountain Promenade & Thriller ridge roads.
 *
 * Coordinate system: L.CRS.Simple over 1024 x 682 pixel space [y, x]
 * y: 0 (bottom) to 682 (top)
 * x: 0 (left) to 1024 (right)
 */

export interface PathwayNode {
  id: string;
  name: string;
  coords: [number, number]; // [y, x]
  type: 'road' | 'poi';
  category?: 'ride' | 'facility' | 'restaurant' | 'entrance' | 'waypoint';
  zone?: 'thriller' | 'water' | 'family' | 'kids' | 'entrance' | 'center';
}

export interface PathwayEdge {
  from: string;
  to: string;
  weight: number; // walking distance in meters along road geometry
  roadName?: string;
}

// ---------------- 1. ROAD CENTERLINE NAVIGATION NODES ----------------
export const ROAD_CENTERLINE_NODES: Record<string, PathwayNode> = {
  // ---- ENTRANCE & MAIN BOULEVARD ROAD CENTERLINES ----
  'node-parking-tram': { id: 'node-parking-tram', name: 'Visitor Parking Tram Station', coords: [30, 500], type: 'road', zone: 'entrance' },
  'node-parking-gate-road': { id: 'node-parking-gate-road', name: 'Parking Avenue Centerline', coords: [80, 500], type: 'road', zone: 'entrance' },
  'node-main-gate-plaza': { id: 'node-main-gate-plaza', name: 'Main Gate Archway Plaza', coords: [145, 500], type: 'road', zone: 'entrance' },
  'node-ticket-road-junc': { id: 'node-ticket-road-junc', name: 'Ticket Plaza Road Centerline', coords: [145, 290], type: 'road', zone: 'entrance' },
  'node-lockers-road-junc': { id: 'node-lockers-road-junc', name: 'Lockers Alley Road Centerline', coords: [145, 710], type: 'road', zone: 'entrance' },
  'node-boulevard-south': { id: 'node-boulevard-south', name: 'Main Boulevard South Centerline', coords: [180, 500], type: 'road', zone: 'entrance' },
  'node-boulevard-mid': { id: 'node-boulevard-mid', name: 'Main Boulevard Mid Centerline', coords: [215, 500], type: 'road', zone: 'entrance' },
  'node-boulevard-north-split': { id: 'node-boulevard-north-split', name: 'South Lake Promenade Junction', coords: [245, 500], type: 'road', zone: 'center' },

  // ---- CRYSTAL LAKE BYPASS PROMENADE ROADS (Curving strictly OUTSIDE Crystal Lake: y=265..370, x=370..650) ----
  'node-lake-sw-1': { id: 'node-lake-sw-1', name: 'West Lake Curved Road (South Entry)', coords: [250, 450], type: 'road', zone: 'center' },
  'node-lake-sw-2': { id: 'node-lake-sw-2', name: 'West Lake Curved Road (South Curve)', coords: [265, 390], type: 'road', zone: 'center' },
  'node-lake-w-mid': { id: 'node-lake-w-mid', name: 'West Lake Promenade Center (Family Gate)', coords: [305, 330], type: 'road', zone: 'center' },
  'node-lake-nw-1': { id: 'node-lake-nw-1', name: 'West Lake Curved Road (North Curve)', coords: [350, 335], type: 'road', zone: 'center' },
  'node-lake-nw-2': { id: 'node-lake-nw-2', name: 'West Lake Promenade (North Exit)', coords: [395, 350], type: 'road', zone: 'center' },

  'node-lake-se-1': { id: 'node-lake-se-1', name: 'East Lake Curved Road (South Entry)', coords: [250, 550], type: 'road', zone: 'center' },
  'node-lake-se-2': { id: 'node-lake-se-2', name: 'East Lake Curved Road (South Curve)', coords: [265, 610], type: 'road', zone: 'center' },
  'node-lake-e-mid': { id: 'node-lake-e-mid', name: 'East Lake Promenade Center (Kids Gate)', coords: [305, 670], type: 'road', zone: 'center' },
  'node-lake-ne-1': { id: 'node-lake-ne-1', name: 'East Lake Curved Road (North Curve)', coords: [350, 665], type: 'road', zone: 'center' },
  'node-lake-ne-2': { id: 'node-lake-ne-2', name: 'East Lake Promenade (North Exit)', coords: [395, 650], type: 'road', zone: 'center' },

  // ---- CASTLE BRIDGES & PLAZA (North of Lake) ----
  'node-castle-bridge-w': { id: 'node-castle-bridge-w', name: 'West Castle Stone Bridge Road', coords: [405, 410], type: 'road', zone: 'center' },
  'node-castle-bridge-e': { id: 'node-castle-bridge-e', name: 'East Castle Stone Bridge Road', coords: [405, 590], type: 'road', zone: 'center' },
  'node-castle-plaza-front': { id: 'node-castle-plaza-front', name: 'ThrillVerse Castle Front Courtyard', coords: [425, 500], type: 'road', zone: 'center' },
  'node-castle-north-gate': { id: 'node-castle-north-gate', name: 'North Castle Gateway Road', coords: [475, 500], type: 'road', zone: 'center' },

  // ---- NORTH MOUNTAIN HIGHWAY (Connecting Thriller / Dare 2 Drop to Water / Dino Splashdown North of Castle) ----
  'node-north-mountain-west': { id: 'node-north-mountain-west', name: 'North Mountain Promenade (West)', coords: [535, 430], type: 'road', zone: 'thriller' },
  'node-north-mountain-center': { id: 'node-north-mountain-center', name: 'North Castle Ridge Pass', coords: [540, 500], type: 'road', zone: 'center' },
  'node-north-mountain-east': { id: 'node-north-mountain-east', name: 'North Mountain Promenade (East)', coords: [535, 580], type: 'road', zone: 'water' },

  // ---- THRILLER ZONE ROAD NETWORK (Upper Left) ----
  'node-thriller-entry-road': { id: 'node-thriller-entry-road', name: 'Thriller Zone Gateway Road', coords: [405, 335], type: 'road', zone: 'thriller' },
  'node-thriller-curve-1': { id: 'node-thriller-curve-1', name: 'Thriller Way Curve', coords: [425, 300], type: 'road', zone: 'thriller' },
  'node-thriller-hub': { id: 'node-thriller-hub', name: 'Thriller Central Plaza Centerline', coords: [450, 260], type: 'road', zone: 'thriller' },

  'node-spacex-road': { id: 'node-spacex-road', name: 'SpaceX Road Centerline', coords: [455, 240], type: 'road', zone: 'thriller' },
  'node-scream-road-1': { id: 'node-scream-road-1', name: 'Scream Machine Avenue Mid', coords: [455, 175], type: 'road', zone: 'thriller' },
  'node-scream-road-2': { id: 'node-scream-road-2', name: 'Scream Machine Entrance Road', coords: [465, 105], type: 'road', zone: 'thriller' },
  'node-thriller-washroom-road': { id: 'node-thriller-washroom-road', name: 'Thriller Washroom Path', coords: [455, 50], type: 'road', zone: 'thriller' },

  'node-nitro-approach-1': { id: 'node-nitro-approach-1', name: 'Nitro Mountain Ascent Road 1', coords: [495, 235], type: 'road', zone: 'thriller' },
  'node-nitro-approach-2': { id: 'node-nitro-approach-2', name: 'Nitro Mountain Ascent Road 2', coords: [530, 210], type: 'road', zone: 'thriller' },
  'node-nitro-entrance-road': { id: 'node-nitro-entrance-road', name: 'Nitro Station Entrance Road', coords: [560, 195], type: 'road', zone: 'thriller' },

  'node-drop-road-1': { id: 'node-drop-road-1', name: 'Dare 2 Drop Approach Road', coords: [495, 305], type: 'road', zone: 'thriller' },
  'node-drop-entrance-road': { id: 'node-drop-entrance-road', name: 'Dare 2 Drop Tower Entrance Road', coords: [515, 345], type: 'road', zone: 'thriller' },

  'node-merch-road-1': { id: 'node-merch-road-1', name: 'Thriller Merch Approach Road', coords: [500, 365], type: 'road', zone: 'thriller' },
  'node-merch-road-2': { id: 'node-merch-road-2', name: 'Thriller Merch Ridge Path', coords: [550, 400], type: 'road', zone: 'thriller' },
  'node-merch-entrance-road': { id: 'node-merch-entrance-road', name: 'Merch Store Entrance Road', coords: [620, 415], type: 'road', zone: 'thriller' },

  // ---- WATER ZONE ROAD NETWORK (Upper Right) ----
  'node-water-entry-road': { id: 'node-water-entry-road', name: 'Water Zone Gateway Road', coords: [405, 665], type: 'road', zone: 'water' },
  'node-water-curve-1': { id: 'node-water-curve-1', name: 'Water Way Curve', coords: [425, 700], type: 'road', zone: 'water' },
  'node-water-hub': { id: 'node-water-hub', name: 'Water Central Plaza Centerline', coords: [450, 740], type: 'road', zone: 'water' },

  'node-dino-road-1': { id: 'node-dino-road-1', name: 'Dino Safari Promenade 1', coords: [495, 715], type: 'road', zone: 'water' },
  'node-dino-road-2': { id: 'node-dino-road-2', name: 'Dino Safari Promenade 2', coords: [535, 675], type: 'road', zone: 'water' },
  'node-dino-entrance-road': { id: 'node-dino-entrance-road', name: 'Dino Splashdown Station Entrance Road', coords: [565, 660], type: 'road', zone: 'water' },

  'node-water-washroom-road': { id: 'node-water-washroom-road', name: 'Water Zone Washroom Road', coords: [625, 830], type: 'road', zone: 'water' },

  'node-ahoy-road-1': { id: 'node-ahoy-road-1', name: 'Pirate Ship Deck Road 1', coords: [460, 800], type: 'road', zone: 'water' },
  'node-ahoy-entrance-road': { id: 'node-ahoy-entrance-road', name: 'Splash Ahoy Entrance Road', coords: [475, 830], type: 'road', zone: 'water' },
  'node-water-food-road': { id: 'node-water-food-road', name: 'Water Zone Food Court Road', coords: [565, 905], type: 'road', zone: 'water' },
  'node-water-aid-road': { id: 'node-water-aid-road', name: 'Water Zone First Aid Road', coords: [515, 945], type: 'road', zone: 'water' },

  // ---- FAMILY ZONE ROAD NETWORK (Lower Left) ----
  'node-family-entry-road': { id: 'node-family-entry-road', name: 'Family Zone Gateway Road', coords: [290, 310], type: 'road', zone: 'family' },
  'node-family-hub': { id: 'node-family-hub', name: 'Family Square Centerline', coords: [250, 260], type: 'road', zone: 'family' },

  'node-alibaba-road': { id: 'node-alibaba-road', name: 'Alibaba Dark Ride Entry Road', coords: [335, 245], type: 'road', zone: 'family' },
  'node-bhangarh-road': { id: 'node-bhangarh-road', name: 'Bhangarh Haunted Fort Entry Road', coords: [285, 275], type: 'road', zone: 'family' },

  'node-goldrush-road-1': { id: 'node-goldrush-road-1', name: 'Gold Rush Railway Road 1', coords: [320, 210], type: 'road', zone: 'family' },
  'node-goldrush-road-2': { id: 'node-goldrush-road-2', name: 'Gold Rush Railway Road 2', coords: [350, 160], type: 'road', zone: 'family' },
  'node-goldrush-entrance-road': { id: 'node-goldrush-entrance-road', name: 'Gold Rush Station Entrance Road', coords: [360, 110], type: 'road', zone: 'family' },

  'node-family-south-hub': { id: 'node-family-south-hub', name: 'Family South Square', coords: [220, 230], type: 'road', zone: 'family' },
  'node-chai-road': { id: 'node-chai-road', name: 'Chai Spin Chaos Entry Road', coords: [225, 175], type: 'road', zone: 'family' },
  'node-carousel-road': { id: 'node-carousel-road', name: 'Magic Carousel Platform Road', coords: [195, 300], type: 'road', zone: 'family' },
  'node-wrath-road': { id: 'node-wrath-road', name: 'Wrath of Gods Theater Road', coords: [175, 185], type: 'road', zone: 'family' },
  'node-family-diner-road': { id: 'node-family-diner-road', name: 'Family Diner Entrance Road', coords: [275, 65], type: 'road', zone: 'family' },
  'node-family-washroom-road': { id: 'node-family-washroom-road', name: 'Family Washroom Entry Road', coords: [185, 45], type: 'road', zone: 'family' },

  // ---- KIDS ZONE ROAD NETWORK (Lower Right) ----
  'node-kids-entry-road': { id: 'node-kids-entry-road', name: 'Kids Kingdom Gateway Road', coords: [290, 670], type: 'road', zone: 'kids' },
  'node-kids-hub': { id: 'node-kids-hub', name: 'Kids Kingdom Square Centerline', coords: [250, 720], type: 'road', zone: 'kids' },

  'node-chhota-road-1': { id: 'node-chhota-road-1', name: 'Chhota Bheem Pathway Road', coords: [315, 755], type: 'road', zone: 'kids' },
  'node-chhota-entrance-road': { id: 'node-chhota-entrance-road', name: 'Chhota Bheem Ride Entrance Road', coords: [335, 785], type: 'road', zone: 'kids' },
  'node-kids-washroom-road': { id: 'node-kids-washroom-road', name: 'Kids Washroom Entry Road', coords: [360, 920], type: 'road', zone: 'kids' },

  'node-kids-south-hub': { id: 'node-kids-south-hub', name: 'Kids South Deck Centerline', coords: [220, 760], type: 'road', zone: 'kids' },
  'node-minifall-road': { id: 'node-minifall-road', name: 'Mini Fall Entrance Road', coords: [250, 755], type: 'road', zone: 'kids' },
  'node-cinema-road': { id: 'node-cinema-road', name: 'Cinema 360 Dome Entrance Road', coords: [205, 665], type: 'road', zone: 'kids' },
  'node-kids-food-road': { id: 'node-kids-food-road', name: 'Kids Snack Bar Entrance Road', coords: [295, 935], type: 'road', zone: 'kids' },
  'node-kids-photo-road': { id: 'node-kids-photo-road', name: 'Character Photo Spot Road', coords: [245, 950], type: 'road', zone: 'kids' },
  'node-kids-aid-road': { id: 'node-kids-aid-road', name: 'Pediatric First Aid Road', coords: [190, 940], type: 'road', zone: 'kids' },
};

// ---------------- 2. POINTS OF INTEREST (POIs: Rides & Facilities Entrance Attachments) ----------------
export const POI_NODES: Record<string, PathwayNode> = {
  // Thriller Zone Rides
  'r-nitro': { id: 'r-nitro', name: '1 Nitro', coords: [580, 200], type: 'poi', category: 'ride', zone: 'thriller' },
  'r-scream': { id: 'r-scream', name: '2 Scream Machine', coords: [510, 105], type: 'poi', category: 'ride', zone: 'thriller' },
  'r-spacex': { id: 'r-spacex', name: '3 SpaceX', coords: [480, 240], type: 'poi', category: 'ride', zone: 'thriller' },
  'r-drop': { id: 'r-drop', name: '4 Dare 2 Drop', coords: [545, 345], type: 'poi', category: 'ride', zone: 'thriller' },

  // Water Zone Rides
  'r-dino': { id: 'r-dino', name: '5 Dino Splashdown', coords: [585, 660], type: 'poi', category: 'ride', zone: 'water' },
  'r-ahoy': { id: 'r-ahoy', name: '6 Splash Ahoy!', coords: [490, 830], type: 'poi', category: 'ride', zone: 'water' },

  // Family Zone Rides
  'r-gold': { id: 'r-gold', name: '7 Gold Rush Express', coords: [360, 110], type: 'poi', category: 'ride', zone: 'family' },
  'r-alibaba': { id: 'r-alibaba', name: '8 Alibaba aur Chalis Chorr', coords: [345, 245], type: 'poi', category: 'ride', zone: 'family' },
  'r-bhangarh': { id: 'r-bhangarh', name: '9 Bhangarh: The Curse', coords: [295, 280], type: 'poi', category: 'ride', zone: 'family' },
  'r-chai': { id: 'r-chai', name: '10 Chai Spin Chaos', coords: [230, 165], type: 'poi', category: 'ride', zone: 'family' },
  'r-wrath': { id: 'r-wrath', name: '11 Wrath of the Gods', coords: [170, 185], type: 'poi', category: 'ride', zone: 'family' },
  'r-carousel': { id: 'r-carousel', name: '12 Magic Carousel', coords: [195, 310], type: 'poi', category: 'ride', zone: 'family' },

  // Kids Zone Rides
  'r-chhota': { id: 'r-chhota', name: '13 Chhota Bheem – The Ride', coords: [335, 785], type: 'poi', category: 'ride', zone: 'kids' },
  'r-minifall': { id: 'r-minifall', name: '14 Mini Fall', coords: [255, 755], type: 'poi', category: 'ride', zone: 'kids' },
  'r-cinema': { id: 'r-cinema', name: '16 Cinema 360 – Prince of Dark Waters', coords: [205, 665], type: 'poi', category: 'ride', zone: 'kids' },

  // Center Landmarks
  'l-castle': { id: 'l-castle', name: 'ThrillVerse Castle', coords: [440, 512], type: 'poi', category: 'facility', zone: 'center' },
  'l-lake': { id: 'l-lake', name: 'Crystal Lake Lookout', coords: [260, 512], type: 'poi', category: 'facility', zone: 'center' },
  'l-entrance': { id: 'l-entrance', name: 'Main Entrance Gate', coords: [120, 512], type: 'poi', category: 'entrance', zone: 'entrance' },

  // Entrance Plaza Facilities
  'f-ticket': { id: 'f-ticket', name: 'Ticket Counter', coords: [75, 275], type: 'poi', category: 'facility', zone: 'entrance' },
  'f-services': { id: 'f-services', name: 'Guest Services', coords: [75, 355], type: 'poi', category: 'facility', zone: 'entrance' },
  'f-lockers': { id: 'f-lockers', name: 'Lockers', coords: [75, 615], type: 'poi', category: 'facility', zone: 'entrance' },
  'f-souvenir': { id: 'f-souvenir', name: 'Souvenir Shop', coords: [75, 700], type: 'poi', category: 'facility', zone: 'entrance' },
  'f-parking': { id: 'f-parking', name: 'Visitor Parking', coords: [30, 512], type: 'poi', category: 'facility', zone: 'entrance' },

  // Zone Facilities
  'f-thriller-merch': { id: 'f-thriller-merch', name: 'Thriller Merch Shop', coords: [630, 415], type: 'poi', category: 'facility', zone: 'thriller' },
  'f-photo-thriller': { id: 'f-photo-thriller', name: 'Photo Spot - Thriller Zone', coords: [520, 320], type: 'poi', category: 'facility', zone: 'thriller' },
  'f-washroom-thriller': { id: 'f-washroom-thriller', name: 'Washrooms - Thriller Zone', coords: [470, 45], type: 'poi', category: 'facility', zone: 'thriller' },

  'f-washroom-water': { id: 'f-washroom-water', name: 'Washrooms - Water Zone', coords: [635, 840], type: 'poi', category: 'facility', zone: 'water' },
  'f-food-water': { id: 'f-food-water', name: 'Food Court - Water Zone', coords: [590, 915], type: 'poi', category: 'restaurant', zone: 'water' },
  'f-aid-water': { id: 'f-aid-water', name: 'First Aid - Water Zone', coords: [530, 955], type: 'poi', category: 'facility', zone: 'water' },
  'f-shop-water': { id: 'f-shop-water', name: 'Shop - Water Zone', coords: [460, 705], type: 'poi', category: 'facility', zone: 'water' },

  'f-restaurant-family': { id: 'f-restaurant-family', name: 'Restaurant - Family Zone', coords: [280, 55], type: 'poi', category: 'restaurant', zone: 'family' },
  'f-washroom-family': { id: 'f-washroom-family', name: 'Washrooms - Family Zone', coords: [190, 40], type: 'poi', category: 'facility', zone: 'family' },
  'f-shop-family': { id: 'f-shop-family', name: 'Shop - Family Zone', coords: [180, 70], type: 'poi', category: 'facility', zone: 'family' },

  'f-washroom-kids': { id: 'f-washroom-kids', name: 'Washrooms - Kids Zone', coords: [365, 930], type: 'poi', category: 'facility', zone: 'kids' },
  'f-food-kids': { id: 'f-food-kids', name: 'Food Court - Kids Zone', coords: [305, 945], type: 'poi', category: 'restaurant', zone: 'kids' },
  'f-photo-kids': { id: 'f-photo-kids', name: 'Photo Spot - Kids Zone', coords: [245, 960], type: 'poi', category: 'facility', zone: 'kids' },
  'f-aid-kids': { id: 'f-aid-kids', name: 'First Aid - Kids Zone', coords: [190, 950], type: 'poi', category: 'facility', zone: 'kids' },
  'f-shop-kids': { id: 'f-shop-kids', name: 'Shop - Kids Zone', coords: [140, 930], type: 'poi', category: 'facility', zone: 'kids' },
};

// All Nodes Combined
export const GRAPH_NODES: Record<string, PathwayNode> = {
  ...ROAD_CENTERLINE_NODES,
  ...POI_NODES,
};

// Helper: Distance calculation
function calcDist(a: [number, number], b: [number, number]): number {
  const dy = a[0] - b[0];
  const dx = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------------- 3. VISIBLE ROAD GEOMETRY EDGES (Connecting Road Nodes along Paved Centerlines) ----------------
const ROAD_GEOMETRY_EDGES: Array<[string, string, string]> = [
  // 1. Main Entrance & Boulevard Centerline
  ['node-parking-tram', 'node-parking-gate-road', 'Parking Tram Driveway'],
  ['node-parking-gate-road', 'node-main-gate-plaza', 'Main Gate Avenue'],
  ['node-main-gate-plaza', 'node-ticket-road-junc', 'Ticket Plaza Walkway'],
  ['node-main-gate-plaza', 'node-lockers-road-junc', 'Lockers Plaza Walkway'],
  ['node-main-gate-plaza', 'node-boulevard-south', 'Main Boulevard South'],
  ['node-boulevard-south', 'node-boulevard-mid', 'Main Boulevard Central'],
  ['node-boulevard-mid', 'node-boulevard-north-split', 'Lake Promenade Approach'],

  // 2. CRYSTAL LAKE BYPASS PROMENADES (Strictly surrounding Crystal Lake: NO CROSSINGS!)
  // West Lake Bypass Promenade (Curves left around Crystal Lake outside shoreline at x=330..360)
  ['node-boulevard-north-split', 'node-lake-sw-1', 'West Lake Curved Road (Entry)'],
  ['node-lake-sw-1', 'node-lake-sw-2', 'West Lake Curved Promenade'],
  ['node-lake-sw-2', 'node-lake-w-mid', 'West Lake Promenade Center'],
  ['node-lake-w-mid', 'node-lake-nw-1', 'West Lake Promenade (North Curve)'],
  ['node-lake-nw-1', 'node-lake-nw-2', 'West Lake Promenade (North Exit)'],

  // East Lake Bypass Promenade (Curves right around Crystal Lake outside shoreline at x=640..670)
  ['node-boulevard-north-split', 'node-lake-se-1', 'East Lake Curved Road (Entry)'],
  ['node-lake-se-1', 'node-lake-se-2', 'East Lake Curved Promenade'],
  ['node-lake-se-2', 'node-lake-e-mid', 'East Lake Promenade Center'],
  ['node-lake-e-mid', 'node-lake-ne-1', 'East Lake Promenade (North Curve)'],
  ['node-lake-ne-1', 'node-lake-ne-2', 'East Lake Promenade (North Exit)'],

  // 3. Castle Bridges & Courtyard Plaza (North of Lake - decorated with pedestrian bridge crowd weight)
  ['node-lake-nw-2', 'node-castle-bridge-w', 'West Castle Stone Bridge Road'],
  ['node-lake-ne-2', 'node-castle-bridge-e', 'East Castle Stone Bridge Road'],
  ['node-castle-bridge-w', 'node-castle-plaza-front', 'Castle West Courtyard Access'],
  ['node-castle-bridge-e', 'node-castle-plaza-front', 'Castle East Courtyard Access'],
  ['node-castle-plaza-front', 'node-castle-north-gate', 'North Castle Gateway Road'],

  // 4. NORTH MOUNTAIN HIGHWAY (Paved Road connecting Dare 2 Drop & Thriller to Water / Dino Splashdown North of Castle)
  ['node-drop-entrance-road', 'node-merch-road-1', 'Dare 2 Drop Merch Link Road'],
  ['node-merch-road-1', 'node-merch-road-2', 'Thriller Merch Ridge Road'],
  ['node-merch-road-2', 'node-north-mountain-west', 'North Mountain Road (Thriller Side)'],
  ['node-north-mountain-west', 'node-north-mountain-center', 'North Castle Ridge Pass'],
  ['node-north-mountain-center', 'node-north-mountain-east', 'North Mountain Road (Water Side)'],
  ['node-north-mountain-east', 'node-dino-road-1', 'North Mountain to Dino Promenade Link Road'],

  // 5. Zone Gateways from Lake Promenade Curves
  ['node-lake-w-mid', 'node-family-entry-road', 'Family Zone Archway Link Road'],
  ['node-lake-nw-1', 'node-thriller-entry-road', 'West Promenade to Thriller Link Road'],
  ['node-lake-nw-2', 'node-thriller-entry-road', 'Thriller Zone Archway Road'],
  ['node-lake-e-mid', 'node-kids-entry-road', 'Kids Zone Archway Link Road'],
  ['node-lake-ne-2', 'node-water-entry-road', 'Water Zone Archway Road'],

  // 6. Thriller Zone Paved Road Centerlines
  ['node-thriller-entry-road', 'node-thriller-curve-1', 'Thriller Way Curve'],
  ['node-thriller-curve-1', 'node-thriller-hub', 'Thriller Central Plaza Centerline'],
  ['node-thriller-hub', 'node-spacex-road', 'SpaceX Launch Road'],
  ['node-thriller-hub', 'node-scream-road-1', 'Scream Machine Avenue 1'],
  ['node-scream-road-1', 'node-scream-road-2', 'Scream Machine Avenue 2'],
  ['node-scream-road-2', 'node-thriller-washroom-road', 'Thriller Washroom Pathway'],
  ['node-thriller-hub', 'node-nitro-approach-1', 'Nitro Mountain Road 1'],
  ['node-nitro-approach-1', 'node-nitro-approach-2', 'Nitro Mountain Road 2'],
  ['node-nitro-approach-2', 'node-nitro-entrance-road', 'Nitro Station Queue Road'],
  ['node-thriller-hub', 'node-drop-road-1', 'Dare 2 Drop Approach Road'],
  ['node-drop-road-1', 'node-drop-entrance-road', 'Dare 2 Drop Entrance Road'],

  // 7. Water Zone Paved Road Centerlines
  ['node-water-entry-road', 'node-water-curve-1', 'Water Way Curve'],
  ['node-water-curve-1', 'node-water-hub', 'Water Central Plaza Centerline'],
  ['node-water-hub', 'node-dino-road-1', 'Dino Safari Promenade 1'],
  ['node-dino-road-1', 'node-dino-road-2', 'Dino Safari Promenade 2'],
  ['node-dino-road-2', 'node-dino-entrance-road', 'Dino Splashdown Station Entrance Road'],
  ['node-dino-road-2', 'node-water-washroom-road', 'Water Zone Washroom Road'],
  ['node-water-hub', 'node-ahoy-road-1', 'Pirate Ship Deck Road 1'],
  ['node-ahoy-road-1', 'node-ahoy-entrance-road', 'Splash Ahoy Entrance Road'],
  ['node-ahoy-road-1', 'node-water-food-road', 'Water Food Court Road'],
  ['node-water-food-road', 'node-water-aid-road', 'Water First Aid Station Road'],

  // 8. Family Zone Paved Road Centerlines
  ['node-family-entry-road', 'node-family-hub', 'Family Square Main Road'],
  ['node-family-hub', 'node-alibaba-road', 'Alibaba Dark Ride Entry Road'],
  ['node-family-hub', 'node-bhangarh-road', 'Bhangarh Haunted Fort Road'],
  ['node-family-hub', 'node-goldrush-road-1', 'Gold Rush Railway Road 1'],
  ['node-goldrush-road-1', 'node-goldrush-road-2', 'Gold Rush Railway Road 2'],
  ['node-goldrush-road-2', 'node-goldrush-entrance-road', 'Gold Rush Station Entrance Road'],
  ['node-family-hub', 'node-family-south-hub', 'Family South Promenade'],
  ['node-family-south-hub', 'node-chai-road', 'Chai Spin Chaos Entry Road'],
  ['node-family-south-hub', 'node-carousel-road', 'Magic Carousel Platform Road'],
  ['node-family-south-hub', 'node-wrath-road', 'Wrath of Gods Theater Road'],
  ['node-family-south-hub', 'node-family-diner-road', 'Family Diner Entrance Road'],
  ['node-family-diner-road', 'node-family-washroom-road', 'Family Washroom Entry Road'],

  // 9. Kids Zone Paved Road Centerlines
  ['node-kids-entry-road', 'node-kids-hub', 'Kids Kingdom Main Road'],
  ['node-kids-hub', 'node-chhota-road-1', 'Chhota Bheem Pathway Road 1'],
  ['node-chhota-road-1', 'node-chhota-entrance-road', 'Chhota Bheem Ride Entrance Road'],
  ['node-chhota-road-1', 'node-kids-washroom-road', 'Kids Washroom Entry Road'],
  ['node-kids-hub', 'node-kids-south-hub', 'Kids South Deck Centerline'],
  ['node-kids-south-hub', 'node-minifall-road', 'Mini Fall Entrance Road'],
  ['node-kids-south-hub', 'node-cinema-road', 'Cinema 360 Dome Entrance Road'],
  ['node-kids-south-hub', 'node-kids-food-road', 'Kids Snack Bar Entrance Road'],
  ['node-kids-food-road', 'node-kids-photo-road', 'Character Photo Spot Road'],
  ['node-kids-food-road', 'node-kids-aid-road', 'Pediatric First Aid Road'],
];

// 4. POI ENTRANCE SNAP ATTACHMENTS (Every ride and facility attaches ONLY to its entrance road node!)
const POI_ENTRANCE_ATTACHMENTS: Array<[string, string, string]> = [
  // Thriller Zone POIs
  ['r-nitro', 'node-nitro-entrance-road', 'Nitro Queue Walk-in'],
  ['r-scream', 'node-scream-road-2', 'Scream Machine Walk-in'],
  ['r-spacex', 'node-spacex-road', 'SpaceX Launch Walk-in'],
  ['r-drop', 'node-drop-entrance-road', 'Dare 2 Drop Walk-in'],
  ['f-thriller-merch', 'node-merch-entrance-road', 'Merch Store Walk-in'],
  ['f-photo-thriller', 'node-thriller-entry-road', 'Photo Spot Walk-in'],
  ['f-washroom-thriller', 'node-thriller-washroom-road', 'Washroom Walk-in'],

  // Water Zone POIs
  ['r-dino', 'node-dino-entrance-road', 'Dino Splashdown Boarding Walk-in'],
  ['r-ahoy', 'node-ahoy-entrance-road', 'Splash Ahoy Dock Walk-in'],
  ['f-washroom-water', 'node-water-washroom-road', 'Washroom Walk-in'],
  ['f-food-water', 'node-water-food-road', 'Food Court Walk-in'],
  ['f-aid-water', 'node-water-aid-road', 'First Aid Walk-in'],
  ['f-shop-water', 'node-water-entry-road', 'Water Shop Walk-in'],

  // Family Zone POIs
  ['r-gold', 'node-goldrush-entrance-road', 'Gold Rush Station Walk-in'],
  ['r-alibaba', 'node-alibaba-road', 'Alibaba Dark Ride Walk-in'],
  ['r-bhangarh', 'node-bhangarh-road', 'Bhangarh Fort Walk-in'],
  ['r-chai', 'node-chai-road', 'Chai Spin Chaos Walk-in'],
  ['r-wrath', 'node-wrath-road', 'Wrath of Gods Walk-in'],
  ['r-carousel', 'node-carousel-road', 'Magic Carousel Walk-in'],
  ['f-restaurant-family', 'node-family-diner-road', 'Family Diner Walk-in'],
  ['f-washroom-family', 'node-family-washroom-road', 'Family Washroom Walk-in'],
  ['f-shop-family', 'node-family-hub', 'Bazaar Shop Walk-in'],

  // Kids Zone POIs
  ['r-chhota', 'node-chhota-entrance-road', 'Chhota Bheem Ride Walk-in'],
  ['r-minifall', 'node-minifall-road', 'Mini Fall Walk-in'],
  ['r-cinema', 'node-cinema-road', 'Cinema 360 Dome Walk-in'],
  ['f-washroom-kids', 'node-kids-washroom-road', 'Kids Washroom Walk-in'],
  ['f-food-kids', 'node-kids-food-road', 'Kids Snack Bar Walk-in'],
  ['f-photo-kids', 'node-kids-photo-road', 'Photo Spot Walk-in'],
  ['f-aid-kids', 'node-kids-aid-road', 'First Aid Walk-in'],
  ['f-shop-kids', 'node-kids-south-hub', 'Toy Shop Walk-in'],

  // Entrance & Center POIs
  ['l-castle', 'node-castle-plaza-front', 'Castle Courtyard Walk-in'],
  ['l-lake', 'node-boulevard-north-split', 'Lake Lookout Walk-in'],
  ['l-entrance', 'node-main-gate-plaza', 'Main Gate Turnstile Walk-in'],
  ['f-ticket', 'node-ticket-road-junc', 'Ticket Booth Walk-in'],
  ['f-services', 'node-ticket-road-junc', 'Guest Services Walk-in'],
  ['f-lockers', 'node-lockers-road-junc', 'Locker Bay Walk-in'],
  ['f-souvenir', 'node-lockers-road-junc', 'Souvenir Emporium Walk-in'],
  ['f-parking', 'node-parking-tram', 'Parking Tram Platform Walk-in'],
];

// Build Bidirectional Graph Edges
export const GRAPH_EDGES: PathwayEdge[] = [];

function addEdge(u: string, v: string, roadName: string) {
  const nodeA = GRAPH_NODES[u];
  const nodeB = GRAPH_NODES[v];
  if (nodeA && nodeB) {
    let weight = calcDist(nodeA.coords, nodeB.coords);
    // Castle bridge pedestrian crowd weight penalty to prefer scenic North Mountain Promenade & Thriller Ridge Road
    if (u.includes('castle-bridge') || v.includes('castle-bridge')) {
      weight += 150;
    }
    GRAPH_EDGES.push({ from: u, to: v, weight, roadName });
    GRAPH_EDGES.push({ from: v, to: u, weight, roadName });
  }
}

ROAD_GEOMETRY_EDGES.forEach(([u, v, name]) => addEdge(u, v, name));
POI_ENTRANCE_ATTACHMENTS.forEach(([u, v, name]) => addEdge(u, v, name));

// Build Adjacency List for Dijkstra
const ADJ_LIST: Record<string, Array<{ to: string; weight: number; roadName?: string }>> = {};
Object.keys(GRAPH_NODES).forEach(id => { ADJ_LIST[id] = []; });
GRAPH_EDGES.forEach(edge => {
  ADJ_LIST[edge.from]?.push({ to: edge.to, weight: edge.weight, roadName: edge.roadName });
});

export interface RouteStepInstruction {
  instruction: string;
  distanceMeters: number;
  nodeId: string;
}

export interface NavigationRoute {
  pathNodeIds: string[];
  coordinates: [number, number][]; // [y, x] pairs for Leaflet Polyline snapping to road centerlines
  totalDistanceMeters: number;
  estimatedWalkTimeMinutes: number;
  steps: RouteStepInstruction[];
}

/**
 * Dijkstra's Shortest Path Algorithm
 * Calculates shortest walking path strictly along road centerline nodes.
 */
export function calculateDijkstraRoute(startId: string, targetId: string): NavigationRoute | null {
  if (!GRAPH_NODES[startId] || !GRAPH_NODES[targetId]) return null;
  if (startId === targetId) {
    const node = GRAPH_NODES[startId];
    return {
      pathNodeIds: [startId],
      coordinates: [node.coords],
      totalDistanceMeters: 0,
      estimatedWalkTimeMinutes: 0,
      steps: [{ instruction: `You are already at ${node.name}`, distanceMeters: 0, nodeId: startId }],
    };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, { node: string; roadName?: string } | null> = {};
  const unvisited = new Set<string>();

  Object.keys(GRAPH_NODES).forEach(id => {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach(id => {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        currentId = id;
      }
    });

    if (currentId === null || minDistance === Infinity) break;
    if (currentId === targetId) break;

    unvisited.delete(currentId);

    const neighbors = ADJ_LIST[currentId] || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;
      const alt = distances[currentId] + neighbor.weight;
      if (alt < distances[neighbor.to]) {
        distances[neighbor.to] = alt;
        previous[neighbor.to] = { node: currentId, roadName: neighbor.roadName };
      }
    }
  }

  const path: string[] = [];
  let curr: string | null = targetId;
  while (curr !== null) {
    path.unshift(curr);
    const prevObj = previous[curr];
    curr = prevObj ? prevObj.node : null;
  }

  if (path[0] !== startId) return null;

  const rawDist = distances[targetId];
  const totalMeters = Math.round(rawDist * 0.72);
  const walkMinutes = Math.max(1, Math.round(totalMeters / 72));

  const coordinates: [number, number][] = path.map(id => GRAPH_NODES[id].coords);

  const steps: RouteStepInstruction[] = [];
  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = GRAPH_NODES[nodeId];
    if (i === 0) {
      steps.push({
        instruction: `Start at ${node.name}`,
        distanceMeters: 0,
        nodeId,
      });
    } else {
      const prevNode = GRAPH_NODES[path[i - 1]];
      const dist = Math.round(calcDist(prevNode.coords, node.coords) * 0.72);

      let action = 'Walk along';
      if (node.type === 'poi') {
        action = node.category === 'ride' ? 'Arrive at ride' : 'Arrive at';
      }

      steps.push({
        instruction: `${action} ${node.name}`,
        distanceMeters: dist,
        nodeId,
      });
    }
  }

  return {
    pathNodeIds: path,
    coordinates,
    totalDistanceMeters: totalMeters,
    estimatedWalkTimeMinutes: walkMinutes,
    steps,
  };
}
