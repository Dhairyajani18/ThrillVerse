import { MAP_LOCATIONS } from './mapData';

/**
 * Real road routing via the public OSRM API.
 *
 * getRoute() takes two location ids and returns the exact route along real
 * roads (polyline coordinates), the real distance/duration, and turn-by-turn
 * directions. This replaces the old grid-based Dijkstra pathfinder.
 *
 * Public demo server only supports the "driving" profile. Swap OSRM_BASE for a
 * self-hosted instance to use walking/cycling profiles.
 */

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

export interface RouteStep {
  instruction: string; // human-readable turn-by-turn instruction
  distance: number; // metres for this step
  name: string; // road/path name (may be empty)
  location: [number, number]; // [lat, lng] where the maneuver happens
}

export interface RouteResult {
  from: string;
  to: string;
  coordinates: [number, number][]; // [lat, lng] polyline of the whole route
  distance: number; // total metres
  duration: number; // total seconds
  steps: RouteStep[];
}

const byId = (id: string) => MAP_LOCATIONS.find((l) => l.id === id) || null;

const MANEUVER_LABEL: Record<string, string> = {
  turn: 'Turn',
  'new name': 'Continue',
  depart: 'Head out',
  arrive: 'Arrive',
  merge: 'Merge',
  'on ramp': 'Take the ramp',
  'off ramp': 'Take the exit',
  fork: 'Keep',
  'end of road': 'At the end of the road, turn',
  roundabout: 'Enter the roundabout',
  'roundabout turn': 'At the roundabout, turn',
  continue: 'Continue',
  'exit roundabout': 'Exit the roundabout',
};

function describe(step: any): string {
  const m = step.maneuver || {};
  const type: string = m.type || 'continue';
  const modifier: string = m.modifier ? ` ${m.modifier}` : '';
  const road: string = step.name ? ` onto ${step.name}` : '';

  if (type === 'depart') return `Head out${step.name ? ` on ${step.name}` : ''}`;
  if (type === 'arrive') return 'Arrive at your destination';

  const base = MANEUVER_LABEL[type] || 'Continue';
  // "new name"/"continue" read better without an "onto" if there is no name
  return `${base}${modifier}${road}`.trim();
}

/**
 * Fetch the exact route between two park locations along real roads.
 * Returns null if either id is unknown or the routing service fails.
 */
export async function getRoute(
  startId: string,
  endId: string,
): Promise<RouteResult | null> {
  const a = byId(startId);
  const b = byId(endId);
  if (!a || !b) return null;

  const url =
    `${OSRM_BASE}/${a.lng},${a.lat};${b.lng},${b.lat}` +
    `?overview=full&geometries=geojson&steps=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;

    const route = data.routes[0];
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]], // [lng,lat] -> [lat,lng]
    );

    const steps: RouteStep[] = (route.legs?.[0]?.steps || []).map((s: any) => ({
      instruction: describe(s),
      distance: s.distance,
      name: s.name || '',
      location: [s.maneuver.location[1], s.maneuver.location[0]] as [number, number],
    }));

    return {
      from: startId,
      to: endId,
      coordinates,
      distance: route.distance,
      duration: route.duration,
      steps,
    };
  } catch {
    return null;
  }
}

/** Format metres as "820 m" or "1.24 km". */
export function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
}

/** Format seconds as "7 min" / "<1 min". */
export function formatDuration(s: number): string {
  const min = Math.round(s / 60);
  return min < 1 ? '<1 min' : `${min} min`;
}

/**
 * Legacy synchronous helper kept for backward compatibility.
 * Returns the straight two-node id list; real routing now lives in getRoute().
 */
export function findPath(startId: string, endId: string): string[] | null {
  if (!byId(startId) || !byId(endId)) return null;
  return [startId, endId];
}
