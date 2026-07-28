import React, { useState, useMemo } from 'react';
import { Search, Map as MapIcon, Crosshair, Navigation, ArrowRightLeft, MapPin, Loader2 } from 'lucide-react';
import { MAP_LOCATIONS } from './mapData';
import { getRoute, RouteResult, formatDistance, formatDuration } from './pathfinder';
import MapCanvas from './MapCanvas';
import { motion, AnimatePresence } from 'framer-motion';

import { Ride } from '../../types';

export default function VirtualMap({ rides = [] }: { rides?: Ride[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Navigation State
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routing, setRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const filters = ['All', 'Thriller', 'Water', 'Family', 'Kids', 'Restaurants', 'Facilities', 'Events'];

  const filteredLocations = useMemo(() => {
    let result = MAP_LOCATIONS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category?.toString().toLowerCase().includes(q)
      );
    }

    if (selectedFilter !== 'All') {
      const f = selectedFilter.toLowerCase();
      result = result.filter(l => {
        if (f === 'restaurants') return l.type === 'restaurant';
        if (f === 'facilities') return l.type === 'facility';
        if (f === 'events') return l.type === 'event';
        return l.zoneId === f;
      });
    }

    return result;
  }, [searchQuery, selectedFilter]);

  const selectedLoc = useMemo(() =>
    MAP_LOCATIONS.find(l => l.id === selectedLocationId) || null
  , [selectedLocationId]);

  const handleFindRoute = async () => {
    if (!routeFrom || !routeTo) return;
    setRouting(true);
    setRouteError(null);
    const result = await getRoute(routeFrom, routeTo);
    if (result) {
      setRoute(result);
    } else {
      setRoute(null);
      setRouteError('Could not reach the routing service. Please try again.');
    }
    setRouting(false);
  };

  const handleSwapRoute = () => {
    setRouteFrom(routeTo);
    setRouteTo(routeFrom);
    setRoute(null);
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteFrom('');
    setRouteTo('');
    setRouteError(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[800px]" id="virtual-park-map">

      {/* Header & Search Area */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center z-10 relative shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 leading-tight">Virtual Park Map</h2>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ThrillVerse Navigator · Live Map</p>
          </div>
        </div>

        <div className="flex-1 max-w-2xl w-full">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rides, restaurants, facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg whitespace-nowrap transition-colors ${
                  selectedFilter === filter ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-80 bg-white border-r border-slate-100 flex flex-col z-20 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" />
                Directions
              </h3>
              {(route || routeFrom || routeTo) && (
                <button onClick={clearRoute} className="text-[10px] font-bold text-red-500 uppercase tracking-wider hover:underline">
                  Clear
                </button>
              )}
            </div>

            <div className="relative flex flex-col gap-2">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-slate-300 z-0"></div>

              <div className="relative z-10 flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <select value={routeFrom} onChange={e => setRouteFrom(e.target.value)} className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none">
                  <option value="">Choose starting point...</option>
                  {MAP_LOCATIONS.map(l => <option key={`from-${l.id}`} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <div className="relative z-10 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
                <select value={routeTo} onChange={e => setRouteTo(e.target.value)} className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none">
                  <option value="">Choose destination...</option>
                  {MAP_LOCATIONS.map(l => <option key={`to-${l.id}`} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <button onClick={handleSwapRoute} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors z-20">
                <ArrowRightLeft className="w-3 h-3 text-slate-500 rotate-90" />
              </button>
            </div>

            <button
              onClick={handleFindRoute}
              disabled={!routeFrom || !routeTo || routing}
              className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {routing ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /> Finding route…</>) : 'Get Directions'}
            </button>
            {routeError && <p className="text-[10px] text-red-500 font-semibold mt-2">{routeError}</p>}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {route ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-800 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Est. Time</span>
                    <span className="font-black text-lg">{formatDuration(route.duration)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider block opacity-70">Distance</span>
                    <span className="font-black text-lg">{formatDistance(route.distance)}</span>
                  </div>
                </div>

                <div className="space-y-1 relative">
                  {route.steps.map((step, idx) => (
                    <div key={`step-${idx}`} className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-blue-100 border-2 border-blue-500 shrink-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-blue-700">{idx + 1}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{step.instruction}</p>
                        {step.distance > 0 && (
                          <p className="text-[10px] text-slate-500">{formatDistance(step.distance)}{step.name ? ` · ${step.name}` : ''}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedLoc ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <img
                    src={selectedLoc.type === 'ride' && rides?.find(r => r.name.toLowerCase().includes(selectedLoc.name.toLowerCase()) || selectedLoc.name.toLowerCase().includes(r.name.toLowerCase()))?.image || selectedLoc.image}
                    alt={selectedLoc.name}
                    className="w-full h-32 object-cover rounded-xl shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold uppercase tracking-wider rounded text-slate-600 mb-2 inline-block">
                      {selectedLoc.category || selectedLoc.type}
                    </span>
                    <h3 className="font-black text-lg text-slate-800 leading-tight">{selectedLoc.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{selectedLoc.description}</p>
                  </div>

                  {selectedLoc.type === 'ride' && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Status</span>
                        <span className={`text-xs font-bold ${selectedLoc.status === 'open' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {selectedLoc.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Wait Time</span>
                        <span className="text-xs font-bold text-slate-800">{selectedLoc.waitTime} mins</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Thrill Level</span>
                        <span className="text-xs font-bold text-slate-800">{selectedLoc.thrillLevel}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Min Height</span>
                        <span className="text-xs font-bold text-slate-800">{selectedLoc.heightReq}cm</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    {selectedLoc.type === 'ride' && selectedLoc.status === 'open' && selectedLoc.hasVirtualQueue && (
                      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors">
                        Join Virtual Queue
                      </button>
                    )}
                    <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors">
                      View Details
                    </button>
                    <button onClick={() => { setRouteTo(selectedLoc.id); setRoute(null); }} className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors">
                      Navigate Here
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-48 opacity-50">
                <MapPin className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-500">Select a location on the map, or choose a start and destination to get exact directions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Canvas Area */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          <MapCanvas
            locations={filteredLocations}
            selectedLocation={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
            routeCoordinates={route?.coordinates || null}
            routeFromId={route?.from || null}
            routeToId={route?.to || null}
            rides={rides}
          />

          {/* Legend */}
          <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-100 z-[400] text-[9px] font-bold text-slate-600 space-y-1.5 uppercase tracking-wider pointer-events-none">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Open Rides</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> Closed Rides</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Dining</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-700"></span> Facilities</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Events</div>
          </div>
        </div>
      </div>
    </div>
  );
}
