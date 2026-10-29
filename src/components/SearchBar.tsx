import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Search,
  Filter,
  Check,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { RoomType } from '../types/hotel';

interface SearchBarProps {
  checkIn: string;
  setCheckIn: (date: string) => void;
  checkOut: string;
  setCheckOut: (date: string) => void;
  adults: number;
  setAdults: (num: number) => void;
  childrenCount: number;
  setChildrenCount: (num: number) => void;
  roomsCount: number;
  setRoomsCount: (num: number) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  roomsCount,
  setRoomsCount,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  onSearch,
}) => {
  const [showGuestMenu, setShowGuestMenu] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(0, checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const categories = [
    { id: 'all', label: 'All Residences' },
    { id: 'ocean_suite', label: 'Ocean Suites' },
    { id: 'pool_villa', label: 'Private Pool Villas' },
    { id: 'penthouse', label: 'Penthouses' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-30">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/90 p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
          {/* Check-In Date */}
          <div className="bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 rounded-xl p-3 transition-colors">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Check-In Date
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Check-Out Date */}
          <div className="bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 rounded-xl p-3 transition-colors relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Check-Out Date
              </label>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-sm">
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Guests & Rooms Dropdown */}
          <div className="relative">
            <div
              onClick={() => setShowGuestMenu((prev) => !prev)}
              className="bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 rounded-xl p-3 transition-colors cursor-pointer"
            >
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Guests & Rooms
              </label>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                    {adults + childrenCount} Guests, {roomsCount} {roomsCount === 1 ? 'Suite' : 'Suites'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400" />
              </div>
            </div>

            {/* Guest Popover Menu */}
            {showGuestMenu && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Adults</div>
                      <div className="text-[10px] text-stone-500">Ages 13 and above</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 disabled:opacity-30 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-stone-900">{adults}</span>
                      <button
                        onClick={() => setAdults(Math.min(8, adults + 1))}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Children</div>
                      <div className="text-[10px] text-stone-500">Ages 0 - 12 years</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        disabled={childrenCount <= 0}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 disabled:opacity-30 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-stone-900">{childrenCount}</span>
                      <button
                        onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Suites</div>
                      <div className="text-[10px] text-stone-500">Private accommodation</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                        disabled={roomsCount <= 1}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 disabled:opacity-30 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-stone-900">{roomsCount}</span>
                      <button
                        onClick={() => setRoomsCount(Math.min(4, roomsCount + 1))}
                        className="w-7 h-7 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuestMenu(false)}
                  className="mt-4 w-full bg-stone-900 text-white text-xs font-medium py-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Apply Selection
                </button>
              </div>
            )}
          </div>

          {/* Search CTA & Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearch}
              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Search className="w-4 h-4 text-amber-200" />
              <span>Check Rates</span>
            </button>

            <button
              onClick={() => setShowFilterDrawer((prev) => !prev)}
              className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                showFilterDrawer
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80'
              }`}
              title="Filter by Price & Preferences"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Drawer: Category Tabs & Max Budget Slider */}
        {showFilterDrawer && (
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
            {/* Category selection */}
            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-2">
                Residence Tier
              </span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-900 text-white border-amber-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">
                  Maximum Nightly Rate
                </span>
                <span className="text-xs font-bold text-amber-800">
                  Up to ${maxPrice} / night
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>$400</span>
                <span>$1,400</span>
                <span>$2,500+</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
