import React from 'react';
import { HotelRoom } from '../types/hotel';
import {
  Maximize,
  Users,
  Bed,
  Eye,
  Star,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RoomListProps {
  rooms: HotelRoom[];
  nights: number;
  currency: string;
  onSelectFor3D: (room: HotelRoom) => void;
  onBookRoom: (room: HotelRoom) => void;
  activeModelType: string;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  nights,
  currency,
  onSelectFor3D,
  onBookRoom,
  activeModelType,
}) => {
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200/80">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-800">
            Private Residences & Suites
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 mt-1">
            Sanctuary Accommodations
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Curated architectural spaces blending natural Mediterranean stone, certified sustainably sourced teak, and bespoke Italian craftsmanship.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3 text-xs text-stone-600 bg-stone-100/70 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Best Rate Guarantee • Free cancellation up to 48 hrs prior</span>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {rooms.map((room) => {
          const isCurrentlyActiveIn3D = activeModelType === room.threeModelType;
          const totalPrice = room.pricePerNight * nights;

          return (
            <div
              key={room.id}
              className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${
                isCurrentlyActiveIn3D
                  ? 'border-amber-500/80 ring-2 ring-amber-500/20'
                  : 'border-stone-200/90 hover:border-stone-300'
              }`}
            >
              {/* Card Upper: Preview & Badges */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {room.badge && (
                      <span className="bg-amber-100/80 text-amber-950 font-semibold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                        {room.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-400 font-medium">{room.view}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-full text-xs font-semibold text-stone-800">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{room.rating}</span>
                    <span className="text-[10px] text-stone-400 font-normal">({room.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {room.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {room.subtitle}
                </p>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-stone-100 text-stone-700">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Maximize className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-medium">{room.sizeSqM} m²</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Users className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-medium">Up to {room.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Bed className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="font-medium truncate">{room.bedType.split(' ')[1] || 'King'}</span>
                  </div>
                </div>

                {/* Architectural Features */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Signature Amenities
                  </div>
                  {room.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Pricing & Actions */}
              <div className="bg-[#FAF8F5] p-6 pt-4 border-t border-stone-100">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                        {currencySymbol}{room.pricePerNight}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">/ night</span>
                      {room.originalPrice && (
                        <span className="text-xs text-stone-400 line-through ml-1.5">
                          {currencySymbol}{room.originalPrice}
                        </span>
                      )}
                    </div>
                    {nights > 1 && (
                      <div className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {currencySymbol}{totalPrice} for {nights} nights (taxes incl.)
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    Instant Confirm
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Inspect in 3D Button */}
                  <button
                    onClick={() => onSelectFor3D(room)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      isCurrentlyActiveIn3D
                        ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 shadow-2xs'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isCurrentlyActiveIn3D ? 'Viewing in 3D' : 'Inspect 3D'}</span>
                  </button>

                  {/* Reserve Button */}
                  <button
                    onClick={() => onBookRoom(room)}
                    className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
