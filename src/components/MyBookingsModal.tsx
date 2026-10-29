import React from 'react';
import { BookingDetails } from '../types/hotel';
import {
  CalendarCheck,
  Calendar,
  Users,
  MapPin,
  KeyRound,
  Trash2,
  X,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface MyBookingsModalProps {
  bookings: BookingDetails[];
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
  onInspectRoom3D: (roomType: string) => void;
  onBookNewStay: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onCancelBooking,
  onInspectRoom3D,
  onBookNewStay,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-light text-stone-900">
                My Sanctuary Stays
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {bookings.length} {bookings.length === 1 ? 'Reservation' : 'Reservations'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Review active reservations, digital keys, and hospitality preferences.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <CalendarCheck className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="font-serif text-lg text-stone-800 font-semibold">
                No active reservations found
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Ready for an unforgettable coastal getaway? Browse our luxury residences and book your bespoke retreat.
              </p>
              <button
                onClick={onBookNewStay}
                className="mt-5 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-sm"
              >
                Explore Suites & Villas
              </button>
            </div>
          ) : (
            bookings.map((b) => {
              const currencySymbol = b.currency === 'EUR' ? '€' : b.currency === 'GBP' ? '£' : '$';
              const isCancelled = b.status === 'cancelled';

              return (
                <div
                  key={b.bookingId}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                    isCancelled ? 'opacity-60 border-stone-200 bg-stone-50' : 'border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {b.bookingId}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCancelled ? 'Cancelled' : 'Confirmed Stay'}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-semibold text-stone-900 mt-1.5">
                        {b.roomTitle}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {b.guestName} • {b.adults + b.children} Guests ({b.roomsCount} Suite)
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-serif text-xl font-bold text-stone-900 block">
                        {currencySymbol}{b.totalPrice}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {b.nights} Nights ({currencySymbol}{Math.round(b.totalPrice / b.nights)}/night)
                      </span>
                    </div>
                  </div>

                  {/* Dates & Digital Key */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs text-stone-700">
                    <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold uppercase">Dates</span>
                        <span className="font-medium text-stone-900">{b.checkIn} → {b.checkOut}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold uppercase">Digital Key</span>
                        <span className="font-mono font-bold text-amber-900">PIN: {b.digitalPin}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <Users className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold uppercase">Bed Type</span>
                        <span className="font-medium capitalize text-stone-900">{b.bedPreference} Bed</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        onInspectRoom3D(b.roomType);
                        onClose();
                      }}
                      className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer underline underline-offset-2"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>View Suite in 3D</span>
                    </button>

                    {!isCancelled && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you wish to cancel this reservation? A full refund will be processed to your original payment method.')) {
                            onCancelBooking(b.bookingId);
                          }
                        }}
                        className="text-xs font-medium text-stone-500 hover:text-rose-700 flex items-center gap-1.5 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Reservation</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-4 border-t border-stone-200/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onBookNewStay}
            className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider cursor-pointer"
          >
            Reserve Another Suite
          </button>
        </div>
      </div>
    </div>
  );
};
