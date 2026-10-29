import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { RoomList } from './components/RoomList';
import { HotelCanvas } from './components/three/HotelCanvas';
import { ThreeViewportDock } from './components/three/ThreeViewportDock';
import { BookingModal } from './components/BookingModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { ResortAmenitiesModal } from './components/ResortAmenitiesModal';
import { HOTEL_ROOMS, RESORT_DESTINATIONS } from './data/hotelData';
import {
  HotelRoom,
  BookingDetails,
  CameraPreset,
  TimeOfDay,
  MaterialTheme,
  HotspotItem,
} from './types/hotel';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Compass,
  BedDouble,
  Heart,
  ChevronRight,
  Maximize2,
  Calendar,
} from 'lucide-react';

const INITIAL_BOOKING: BookingDetails = {
  bookingId: 'AUR-892104',
  roomId: 'deluxe-ocean-suite',
  roomTitle: 'The Azure Ocean Suite',
  roomType: 'ocean_suite',
  checkIn: '2026-11-12',
  checkOut: '2026-11-16',
  nights: 4,
  adults: 2,
  children: 0,
  roomsCount: 1,
  guestName: 'Eleanor Sterling',
  guestEmail: 'eleanor.sterling@aura-concierge.com',
  guestPhone: '+1 (555) 382-9011',
  country: 'United Kingdom',
  specialRequests: 'High floor, early arrival around 13:00, anniversary celebration',
  bedPreference: 'king',
  floorPreference: 'high',
  selectedAddOns: ['gourmet-breakfast', 'airport-limo'],
  basePrice: 2320,
  addOnsPrice: 320,
  resortFee: 264,
  tax: 132,
  discount: 396,
  totalPrice: 2640,
  currency: 'USD',
  status: 'confirmed',
  createdAt: new Date().toISOString(),
  digitalPin: '5492',
};

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'explore' | '3d_tour' | 'amenities'>('explore');
  const [selectedDestination, setSelectedDestination] = useState<string>('amalfi');
  const [currency, setCurrency] = useState<string>('USD');

  // Search parameters
  const [checkIn, setCheckIn] = useState<string>('2026-11-15');
  const [checkOut, setCheckOut] = useState<string>('2026-11-19');
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2200);

  // 3D Three.js State
  const [activeModelType, setActiveModelType] = useState<'resort' | 'ocean_suite' | 'pool_villa' | 'penthouse'>('ocean_suite');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('daylight');
  const [materialTheme, setMaterialTheme] = useState<MaterialTheme>('santorini');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotItem | null>(null);

  // Modals & Bookings
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<HotelRoom | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);
  const [showMyBookings, setShowMyBookings] = useState<boolean>(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState<boolean>(false);

  // Saved bookings in LocalStorage
  const [bookings, setBookings] = useState<BookingDetails[]>(() => {
    try {
      const saved = localStorage.getItem('aura_sanctuary_bookings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return [INITIAL_BOOKING];
  });

  useEffect(() => {
    try {
      localStorage.setItem('aura_sanctuary_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [bookings]);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(0, checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Filtered rooms
  const filteredRooms = HOTEL_ROOMS.filter((r) => {
    if (selectedCategory !== 'all' && r.type !== selectedCategory) return false;
    if (r.pricePerNight > maxPrice) return false;
    return true;
  });

  // Handle Book Confirmed
  const handleConfirmBooking = (newBooking: BookingDetails) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedRoomForBooking(null);
    setConfirmedBooking(newBooking);
  };

  // Cancel reservation
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  // Switch to 3D for a specific room
  const handleSelectRoomFor3D = (room: HotelRoom) => {
    setActiveModelType(room.threeModelType);
    setCameraPreset('overview');
    setActiveTab('3d_tour');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick book trigger
  const handleOpenQuickBook = () => {
    const room = HOTEL_ROOMS.find((r) => r.threeModelType === activeModelType) || HOTEL_ROOMS[0];
    setSelectedRoomForBooking(room);
  };

  const currentDestinationObj = RESORT_DESTINATIONS.find((d) => d.id === selectedDestination) || RESORT_DESTINATIONS[0];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-800 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedDestination={selectedDestination}
        onSelectDestination={setSelectedDestination}
        bookingCount={bookings.filter((b) => b.status === 'confirmed').length}
        onOpenMyBookings={() => setShowMyBookings(true)}
        onOpenQuickBook={handleOpenQuickBook}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* TAB 1: 3D TOUR FULL-SCREEN VIEWPORT */}
        {activeTab === '3d_tour' ? (
          <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#FAF8F5]">
            {/* Interactive Three.js Scene */}
            <HotelCanvas
              activeModelType={activeModelType}
              cameraPreset={cameraPreset}
              timeOfDay={timeOfDay}
              materialTheme={materialTheme}
              showHotspots={showHotspots}
              onSelectHotspot={setActiveHotspot}
              activeHotspotId={activeHotspot?.id}
            />

            {/* Bottom Collapsible Control Dock (as specified in Three.js skill) */}
            <ThreeViewportDock
              activeModelType={activeModelType}
              onSelectModelType={setActiveModelType}
              cameraPreset={cameraPreset}
              onSelectCameraPreset={setCameraPreset}
              timeOfDay={timeOfDay}
              onSelectTimeOfDay={setTimeOfDay}
              materialTheme={materialTheme}
              onSelectMaterialTheme={setMaterialTheme}
              showHotspots={showHotspots}
              onToggleHotspots={() => setShowHotspots((prev) => !prev)}
            />

            {/* Quick Floating Booking Action (Top Right Pill) */}
            <div className="absolute top-16 right-4 z-20">
              <button
                onClick={handleOpenQuickBook}
                className="bg-stone-900/95 hover:bg-stone-900 text-[#FAF8F5] border border-stone-700/60 shadow-lg px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <BedDouble className="w-4 h-4 text-amber-300" />
                <span>Reserve This Space</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2 & 3: EXPLORE & SUITES WITH INTEGRATED 3D HERO VIEWPORT */
          <div>
            {/* Editorial Hero Banner */}
            <section className="relative overflow-hidden pt-8 pb-14 bg-gradient-to-b from-[#F5F2EC] via-[#FAF9F5] to-[#FAF9F5] border-b border-stone-200/60">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Editorial Copy */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-300/60 text-amber-950 px-3 py-1 rounded-full text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>{currentDestinationObj.climate}</span>
                    </div>

                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-stone-950 leading-[1.12]">
                      Where Architecture Meets the Horizon
                    </h1>

                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                      Immerse yourself in our coastal sanctuary with real-time 3D spatial room customization. Explore floorplans, ocean horizons, and bespoke appointments before reserving your stay.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('3d_tour')}
                        className="bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Layers className="w-4 h-4 text-amber-300" />
                        <span>Open 3D Spatial Tour</span>
                      </button>

                      <button
                        onClick={() => setShowAmenitiesModal(true)}
                        className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        Resort Privileges
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-4 border-t border-stone-200/70 flex items-center gap-6 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-700" />
                        <span>Forbes 5-Star 2026</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Zero Cancellation Fee</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Embedded Interactive 3D Canvas Showcase */}
                  <div className="lg:col-span-7">
                    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-stone-200 shadow-xl bg-[#FAF8F5]">
                      <HotelCanvas
                        activeModelType={activeModelType}
                        cameraPreset={cameraPreset}
                        timeOfDay={timeOfDay}
                        materialTheme={materialTheme}
                        showHotspots={showHotspots}
                        onSelectHotspot={setActiveHotspot}
                        activeHotspotId={activeHotspot?.id}
                      />

                      {/* Floating bottom badge inside hero preview */}
                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-stone-200 shadow-xs">
                        <span className="text-xs font-semibold text-stone-800">
                          Interactive 3D Preview
                        </span>
                        <span className="text-stone-300">|</span>
                        <button
                          onClick={() => setActiveTab('3d_tour')}
                          className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Fullscreen Studio</span>
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Model Switcher tabs inside hero */}
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-full border border-stone-200 shadow-xs">
                        {(['ocean_suite', 'pool_villa', 'penthouse'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setActiveModelType(m)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
                              activeModelType === m
                                ? 'bg-amber-900 text-white shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            {m === 'ocean_suite' ? 'Ocean Suite' : m === 'pool_villa' ? 'Pool Villa' : 'Penthouse'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sticky Search & Availability Engine */}
            <SearchBar
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              checkOut={checkOut}
              setCheckOut={setCheckOut}
              adults={adults}
              setAdults={setAdults}
              childrenCount={childrenCount}
              setChildrenCount={setChildrenCount}
              roomsCount={roomsCount}
              setRoomsCount={setRoomsCount}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onSearch={() => {
                const el = document.getElementById('suites-inventory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Suites & Inventory Grid */}
            <div id="suites-inventory">
              <RoomList
                rooms={filteredRooms}
                nights={nights}
                currency={currency}
                onSelectFor3D={handleSelectRoomFor3D}
                onBookRoom={(r) => setSelectedRoomForBooking(r)}
                activeModelType={activeModelType}
              />
            </div>

            {/* Resort Experiences Highlights Section */}
            <section className="bg-[#F6F3EC] py-16 border-t border-stone-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800">
                    Bespoke Privileges
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
                    Unrivaled Hospitality Artistry
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-2">
                    Every detail of your stay is curated by personal sanctuarians, certified sommeliers, and holistic wellness masters.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Private Chauffeur Service',
                      desc: 'Mercedes Maybach roundtrip airport airport transfer with personal luggage handler and private tarmac greeting.',
                      badge: 'Complimentary on 3+ Nights',
                    },
                    {
                      title: 'Rapolano Thermal Spa',
                      desc: 'Heated mineral subterranean grottos, singing bowl sound therapy, and custom botanical body elixirs.',
                      badge: 'Daily Access',
                    },
                    {
                      title: 'Michelin Star Gastronomy',
                      desc: 'Seasonal seven-course tasting menus overlooking the Aegean sunset, paired with reserve cellar vintages.',
                      badge: 'Priority Reservations',
                    },
                  ].map((exp, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 inline-block mb-3">
                        {exp.badge}
                      </span>
                      <h4 className="font-serif text-xl font-semibold text-stone-900">
                        {exp.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
            <div>
              <div className="font-serif text-xl font-light tracking-[0.2em] text-[#FAF8F5] mb-2">
                AURA SANCTUARY
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                A sanctuary of quiet luxury, Mediterranean stone, and horizon views. Relais & Châteaux member.
              </p>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#FAF8F5] mb-3">
                Destinations
              </div>
              <ul className="space-y-1.5 text-stone-400">
                {RESORT_DESTINATIONS.map((d) => (
                  <li key={d.id}>
                    <button
                      onClick={() => {
                        setSelectedDestination(d.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {d.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#FAF8F5] mb-3">
                3D Spatial Technology
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Powered by Three.js WebGL & physical PBR rendering with zero external 404 dependencies. Real-time procedural textures and architectural raycasting.
              </p>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#FAF8F5] mb-3">
                Concierge & Reservations
              </div>
              <p className="text-stone-400 text-xs">
                Email: reservations@aura-sanctuary.luxury<br />
                Direct Desk: +39 089 871 290<br />
                24/7 Dedicated Butler Dispatch
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
            <span>© 2026 AURA Sanctuary Hotels & Residences. All rights reserved.</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <span className="hover:text-stone-300 cursor-pointer">Privacy Charter</span>
              <span>•</span>
              <span className="hover:text-stone-300 cursor-pointer">Terms of Stay</span>
              <span>•</span>
              <span className="hover:text-stone-300 cursor-pointer">Sustainability Blueprint</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          checkIn={checkIn}
          checkOut={checkOut}
          adults={adults}
          childrenCount={childrenCount}
          roomsCount={roomsCount}
          currency={currency}
          onClose={() => setSelectedRoomForBooking(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {confirmedBooking && (
        <ConfirmationModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onViewAllBookings={() => {
            setConfirmedBooking(null);
            setShowMyBookings(true);
          }}
        />
      )}

      {showMyBookings && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setShowMyBookings(false)}
          onCancelBooking={handleCancelBooking}
          onInspectRoom3D={(roomType) => {
            setActiveModelType(roomType as any);
            setActiveTab('3d_tour');
            setShowMyBookings(false);
          }}
          onBookNewStay={() => {
            setShowMyBookings(false);
            setActiveTab('explore');
          }}
        />
      )}

      {showAmenitiesModal && (
        <ResortAmenitiesModal
          onClose={() => setShowAmenitiesModal(false)}
          onBookNow={() => {
            setShowAmenitiesModal(false);
            handleOpenQuickBook();
          }}
        />
      )}
    </div>
  );
}
