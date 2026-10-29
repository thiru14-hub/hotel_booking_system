import React from 'react';
import {
  Compass,
  CalendarCheck,
  Sparkles,
  MapPin,
  ChevronDown,
  Layers,
  BedDouble,
  PhoneCall
} from 'lucide-react';
import { RESORT_DESTINATIONS } from '../data/hotelData';

interface NavbarProps {
  activeTab: 'explore' | '3d_tour' | 'amenities';
  onSelectTab: (tab: 'explore' | '3d_tour' | 'amenities') => void;
  selectedDestination: string;
  onSelectDestination: (id: string) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  onOpenQuickBook: () => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  selectedDestination,
  onSelectDestination,
  bookingCount,
  onOpenMyBookings,
  onOpenQuickBook,
  currency,
  onChangeCurrency,
}) => {
  const currentDest = RESORT_DESTINATIONS.find((d) => d.id === selectedDestination) || RESORT_DESTINATIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      {/* Top micro-announcement bar */}
      <div className="bg-[#1C1917] text-[#EDE8DF] text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>Complimentary Sunset Champagne Cruise & Private Chauffeur for Stays of 3+ Nights</span>
        <span className="hidden md:inline text-amber-400/80">• Code: ESCAPE100</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('explore')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-light tracking-[0.2em] text-stone-900 group-hover:text-amber-900 transition-colors">
                  AURA
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-800 font-semibold border-l border-stone-300 pl-2">
                  Sanctuary
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium">
                Luxury Coastal Resorts & Residences
              </p>
            </button>

            {/* Destination Selector Pill */}
            <div className="hidden lg:flex items-center relative">
              <div className="flex items-center gap-1.5 bg-stone-100/90 border border-stone-200/80 px-3 py-1.5 rounded-full text-xs text-stone-700 hover:bg-stone-200/70 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <select
                  value={selectedDestination}
                  onChange={(e) => onSelectDestination(e.target.value)}
                  className="bg-transparent border-none text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer pr-1"
                >
                  {RESORT_DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('explore')}
              className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-lg cursor-pointer ${
                activeTab === 'explore'
                  ? 'text-amber-950 bg-stone-200/60'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
              }`}
            >
              Suites & Villas
            </button>

            <button
              onClick={() => onSelectTab('3d_tour')}
              className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === '3d_tour'
                  ? 'text-amber-950 bg-amber-100/70'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>3D Spatial Tour</span>
            </button>

            <button
              onClick={() => onSelectTab('amenities')}
              className={`px-3.5 py-2 text-xs font-semibold tracking-wider uppercase transition-colors rounded-lg cursor-pointer ${
                activeTab === 'amenities'
                  ? 'text-amber-950 bg-stone-200/60'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/60'
              }`}
            >
              Experiences & Spa
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Currency selector */}
            <div className="hidden sm:flex items-center border border-stone-200/80 rounded-lg px-2 py-1 bg-white/70">
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value)}
                className="bg-transparent text-xs font-semibold text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* My Reservations Button */}
            <button
              onClick={onOpenMyBookings}
              className="relative p-2.5 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200/70 bg-white/70 cursor-pointer"
              title="My Reservations"
            >
              <CalendarCheck className="w-4 h-4 text-stone-800" />
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Book Now Primary Button */}
            <button
              onClick={onOpenQuickBook}
              className="bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <BedDouble className="w-3.5 h-3.5 text-amber-300" />
              <span>Reserve Stay</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
