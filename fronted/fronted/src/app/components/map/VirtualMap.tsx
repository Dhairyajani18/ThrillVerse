import React, { useState, useMemo } from 'react';
import {
  Search,
  Navigation,
  ArrowRightLeft,
  MapPin,
  Compass,
  CheckCircle2,
  UserCheck,
  Sparkles,
  RotateCcw,
  Zap,
  Map as MapIcon,
  X,
  Footprints,
  Info
} from 'lucide-react';
import { PARK_LOCATIONS, PARK_ZONES, ParkLocation } from './mapData';
import { calculateDijkstraRoute, NavigationRoute } from './parkGraph';
import LeafletParkMap from './LeafletParkMap';
import { motion, AnimatePresence } from 'motion/react';

export default function VirtualMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>('r-nitro');

  // Navigation Route State
  const [routeFromId, setRouteFromId] = useState<string>('l-entrance');
  const [routeToId, setRouteToId] = useState<string>('');
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);

  // Mobile View State
  const [mobileTab, setMobileTab] = useState<'map' | 'details' | 'directions'>('map');
  const [showMobileDetailsDrawer, setShowMobileDetailsDrawer] = useState(false);

  // Virtual Queue Modal & Toast State
  const [queueModalRide, setQueueModalRide] = useState<ParkLocation | null>(null);
  const [queueSuccessToast, setQueueSuccessToast] = useState<string | null>(null);
  const [partySize, setPartySize] = useState<number>(2);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return PARK_LOCATIONS.filter(loc => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesDesc = loc.description.toLowerCase().includes(q);
        const matchesZone = loc.zoneName.toLowerCase().includes(q);
        const matchesCategory = loc.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesZone && !matchesCategory) return false;
      }

      if (selectedZoneId !== 'all' && loc.zoneId !== selectedZoneId) return false;

      if (selectedTypeFilter !== 'all') {
        if (selectedTypeFilter === 'ride' && loc.type !== 'ride') return false;
        if (selectedTypeFilter === 'restaurant' && loc.type !== 'restaurant') return false;
        if (selectedTypeFilter === 'facility' && loc.type !== 'facility' && loc.type !== 'entrance') return false;
      }

      return true;
    });
  }, [searchQuery, selectedZoneId, selectedTypeFilter]);

  const selectedLoc = useMemo(() => {
    return PARK_LOCATIONS.find(l => l.id === selectedLocationId) || null;
  }, [selectedLocationId]);

  // Handle marker selection on click (User explicitly asked: "when i click on icon details is shown left side only")
  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    setShowMobileDetailsDrawer(true);
  };

  // Dijkstra Route Calculation
  const handleCalculateRoute = (fromId = routeFromId, toId = routeToId) => {
    if (!fromId || !toId) return;
    const route = calculateDijkstraRoute(fromId, toId);
    if (route) {
      setActiveRoute(route);
      setMobileTab('directions');
    }
  };

  const handleSwapRoute = () => {
    const temp = routeFromId;
    setRouteFromId(routeToId);
    setRouteToId(temp);
    if (routeToId && temp) {
      handleCalculateRoute(routeToId, temp);
    }
  };

  const handleClearRoute = () => {
    setActiveRoute(null);
    setRouteToId('');
  };

  const handleNavigateToLocation = (locId: string) => {
    setRouteToId(locId);
    handleCalculateRoute(routeFromId, locId);
  };

  const handleConfirmVirtualQueue = () => {
    if (queueModalRide) {
      setQueueSuccessToast(`Virtual Queue pass issued for ${queueModalRide.name}! (${partySize} Guests)`);
      setQueueModalRide(null);
      setTimeout(() => setQueueSuccessToast(null), 5000);
    }
  };

  return (
    <div className="bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[680px] font-sans text-slate-100 relative" id="virtual-park-map">

      {/* Top Header & Search Area */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur flex flex-col md:flex-row gap-3 justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">ThrillVerse Park GPS</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Paved Roads Only
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden sm:block">Click any marker to view details on the left panel & route along paved paths</p>
          </div>
        </div>

        {/* Search Input & Zone Filters */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rides, washrooms, restaurants, lockers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-slate-500 hover:text-white text-xs">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {PARK_ZONES.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${selectedZoneId === zone.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Body: Left Details & Navigation Panel + Sticky Interactive Map */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">

        {/* Left Side Details & Dijkstra Directions Sidebar (Desktop & Tablet) */}
        <div className={`w-full md:w-88 lg:w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-2xl shrink-0 ${mobileTab === 'map' ? 'hidden md:flex' : 'flex'
          }`}>

          {/* Directions / Route Controls */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Road Dijkstra Router
              </h3>
              {activeRoute && (
                <button
                  onClick={handleClearRoute}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 uppercase tracking-wider"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="space-y-2">
              {/* From Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] shrink-0 font-black">
                  A
                </div>
                <select
                  value={routeFromId}
                  onChange={(e) => {
                    setRouteFromId(e.target.value);
                    if (routeToId) handleCalculateRoute(e.target.value, routeToId);
                  }}
                  className="w-full text-xs font-semibold bg-transparent text-slate-200 outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select Starting Location...</option>
                  {PARK_LOCATIONS.map(l => (
                    <option key={`from-${l.id}`} value={l.id} className="bg-slate-900">
                      {l.emoji} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center text-[10px] shrink-0 font-black">
                  B
                </div>
                <select
                  value={routeToId}
                  onChange={(e) => {
                    setRouteToId(e.target.value);
                    if (routeFromId) handleCalculateRoute(routeFromId, e.target.value);
                  }}
                  className="w-full text-xs font-semibold bg-transparent text-slate-200 outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select Destination...</option>
                  {PARK_LOCATIONS.map(l => (
                    <option key={`to-${l.id}`} value={l.id} className="bg-slate-900">
                      {l.emoji} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-2.5">
              <button
                onClick={() => handleCalculateRoute(routeFromId, routeToId)}
                disabled={!routeFromId || !routeToId}
                className="col-span-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Calculate Path
              </button>
              <button
                onClick={handleSwapRoute}
                title="Swap From & Destination"
                className="col-span-1 p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 flex items-center justify-center transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Details / Navigation Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
            {activeRoute ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/60 p-3.5 rounded-2xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider block">Walk Distance</span>
                    <span className="text-lg font-black text-white">{activeRoute.totalDistanceMeters} meters</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider block">Walking Time</span>
                    <span className="text-lg font-black text-emerald-400">~{activeRoute.estimatedWalkTimeMinutes} mins</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5 text-blue-400" />
                    Paved Path Instructions ({activeRoute.steps.length} steps)
                  </h4>
                  <div className="space-y-2 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                    {activeRoute.steps.map((step, idx) => (
                      <div key={`step-${idx}`} className="relative flex items-start gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 z-10">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-200 leading-snug">{step.instruction}</p>
                          {step.distanceMeters > 0 && (
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">Walk {step.distanceMeters}m along paved path</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : selectedLoc ? (
              <AnimatePresence mode="wait">
                <motion.div key={selectedLoc.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3.5">

                  {/* Header Image */}
                  <div className="relative h-44 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
                    <img src={selectedLoc.image} alt={selectedLoc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-blue-600 text-white shadow-md">
                      {selectedLoc.zoneName}
                    </span>
                    <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${selectedLoc.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      } shadow-md`}>
                      {selectedLoc.status.toUpperCase()}
                    </span>
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <span>{selectedLoc.emoji}</span>
                        <span>{selectedLoc.name}</span>
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{selectedLoc.description}</p>

                  {/* Metrics Grid */}
                  {selectedLoc.type === 'ride' && (
                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Thrill Level</span>
                        <span className="font-extrabold text-amber-400">{selectedLoc.thrillLevel || 'Family'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Wait Time</span>
                        <span className="font-extrabold text-emerald-400">{selectedLoc.waitTime !== undefined ? `${selectedLoc.waitTime} mins` : 'No Wait'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Height Req.</span>
                        <span className="font-bold text-slate-300">{selectedLoc.heightReq ? `${selectedLoc.heightReq} cm` : 'No restriction'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-500 block">Park Zone</span>
                        <span className="font-bold text-slate-300">{selectedLoc.zoneName || 'Main Zone'}</span>
                      </div>
                    </div>
                  )}

                  {/* Virtual Queue Status */}
                  {selectedLoc.hasVirtualQueue && (
                    <div className="bg-blue-950/60 border border-blue-800/60 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                        <span className="text-[11px] font-bold text-blue-200">Virtual Queue: {selectedLoc.virtualQueueStatus}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    {selectedLoc.hasVirtualQueue && (
                      <button
                        onClick={() => setQueueModalRide(selectedLoc)}
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" /> Join Virtual Queue
                      </button>
                    )}
                    <button
                      onClick={() => handleNavigateToLocation(selectedLoc.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Navigate Here (Dijkstra)
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500 space-y-2">
                <MapPin className="w-8 h-8 text-slate-700 animate-bounce" />
                <p className="text-xs font-medium">Click any icon on the map to display full details here on the left panel.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sticky Interactive Leaflet Map */}
        <div className={`flex-1 relative bg-slate-950 ${mobileTab === 'map' ? 'block' : 'hidden md:block'
          }`}>
          <LeafletParkMap
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectLocation}
            routeCoordinates={activeRoute?.coordinates || null}
            routeFromId={routeFromId}
            routeToId={routeToId}
          />
        </div>
      </div>

      {/* Mobile Responsive Navigation Bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-900 p-2 justify-around z-30 shrink-0">
        <button
          onClick={() => setMobileTab('map')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${mobileTab === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
        >
          <MapIcon className="w-4 h-4" /> Map View
        </button>
        <button
          onClick={() => setMobileTab('details')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${mobileTab === 'details' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
        >
          <Info className="w-4 h-4" /> Selected Details
        </button>
        <button
          onClick={() => setMobileTab('directions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${mobileTab === 'directions' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
        >
          <Navigation className="w-4 h-4" /> Directions
        </button>
      </div>

      {/* Toast Notification */}
      {queueSuccessToast && (
        <div className="absolute top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-fade-in font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{queueSuccessToast}</span>
        </div>
      )}

      {/* Virtual Queue Modal */}
      {queueModalRide && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 font-sans text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black flex items-center gap-2 text-white">
                <span>{queueModalRide.emoji}</span>
                <span>Virtual Queue Ticket</span>
              </h3>
              <button onClick={() => setQueueModalRide(null)} className="text-slate-500 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Reserve your spot in the virtual line for <strong className="text-blue-400">{queueModalRide.name}</strong> to skip the standby queue!
              </p>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Standby Wait:</span>
                  <span className="font-bold text-amber-400">{queueModalRide.waitTime} mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Virtual Queue Window:</span>
                  <span className="font-bold text-emerald-400">{queueModalRide.virtualQueueStatus}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Party Size (Guests):</label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5 Guests</option>
                  <option value={6}>6 Guests</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setQueueModalRide(null)}
                className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVirtualQueue}
                className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs shadow-lg shadow-blue-600/30 uppercase tracking-wider"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
