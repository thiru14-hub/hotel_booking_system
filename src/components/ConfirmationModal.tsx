import React from 'react';
import { BookingDetails } from '../types/hotel';
import {
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  QrCode,
  KeyRound,
  Download,
  Share2,
  Sparkles,
  BedDouble,
  ShieldCheck,
  Printer,
  X,
} from 'lucide-react';

interface ConfirmationModalProps {
  booking: BookingDetails;
  onClose: () => void;
  onViewAllBookings: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  booking,
  onClose,
  onViewAllBookings,
}) => {
  const currencySymbol = booking.currency === 'EUR' ? '€' : booking.currency === 'GBP' ? '£' : '$';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-2xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Brand Banner */}
        <div className="bg-stone-950 text-[#FAF8F5] p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-amber-600/30 border border-amber-500/50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7 text-amber-400" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 block mb-1">
            Reservation Confirmed
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-light">
            Welcome to AURA Sanctuary
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Your private suite has been secured. A confirmation dossier has been sent to{' '}
            <span className="text-stone-200 font-medium">{booking.guestEmail}</span>.
          </p>
        </div>

        {/* Voucher Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Reservation Card / Boarding Pass */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            {/* Upper info */}
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold block">
                  Booking Reference
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-amber-900 tracking-wider">
                  {booking.bookingId}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-medium self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guaranteed & Paid</span>
              </div>
            </div>

            {/* Room & Stay Details */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  Suite & Residence
                </span>
                <span className="font-serif text-base font-semibold text-stone-900 block mt-0.5">
                  {booking.roomTitle}
                </span>
                <span className="text-stone-500 capitalize">
                  {booking.bedPreference} Bed • {booking.floorPreference} Floor Wing
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  Primary Guest
                </span>
                <span className="text-sm font-semibold text-stone-900 block mt-0.5">
                  {booking.guestName}
                </span>
                <span className="text-stone-500">
                  {booking.adults + booking.children} Guests • {booking.guestPhone}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  Check-In
                </span>
                <span className="text-sm font-semibold text-stone-900 block mt-0.5">
                  {booking.checkIn}
                </span>
                <span className="text-stone-500">From 15:00 onwards</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
                  Check-Out
                </span>
                <span className="text-sm font-semibold text-stone-900 block mt-0.5">
                  {booking.checkOut}
                </span>
                <span className="text-stone-500">Until 12:00 noon ({booking.nights} Nights)</span>
              </div>
            </div>

            {/* Digital Key pass preview */}
            <div className="bg-[#FAF8F5] p-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white rounded-xl border border-stone-200 flex items-center justify-center shadow-2xs">
                  <KeyRound className="w-6 h-6 text-amber-800" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>Contactless Mobile Room Key</span>
                    <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full uppercase font-bold">
                      Active
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Door PIN: <strong className="font-mono text-stone-900 text-xs">{booking.digitalPin}</strong> • Tap to unlock via NFC
                  </div>
                </div>
              </div>

              {/* QR Code graphic */}
              <div className="bg-white p-2 rounded-xl border border-stone-200 shrink-0 text-center">
                <QrCode className="w-12 h-12 text-stone-800 mx-auto" />
                <span className="text-[9px] text-stone-400 font-mono block mt-0.5">SCAN AT ARRIVAL</span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
            <div className="flex justify-between">
              <span>Total Stay Charges ({booking.nights} nights)</span>
              <span>{currencySymbol}{booking.basePrice}</span>
            </div>
            {booking.addOnsPrice > 0 && (
              <div className="flex justify-between">
                <span>Selected Privileges & Add-Ons</span>
                <span>+{currencySymbol}{booking.addOnsPrice}</span>
              </div>
            )}
            {booking.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Privilege Discount</span>
                <span>-{currencySymbol}{booking.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Resort Wellness Fee & Tourism Taxes</span>
              <span>+{currencySymbol}{booking.resortFee + booking.tax}</span>
            </div>
            <div className="pt-2 border-t border-stone-100 flex justify-between text-sm font-bold text-stone-900">
              <span>Grand Total Settled</span>
              <span className="font-serif text-lg text-amber-900">{currencySymbol}{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-4 sm:p-5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="text-stone-700 hover:text-stone-900 border border-stone-200 bg-stone-50 hover:bg-stone-100 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Itinerary</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewAllBookings}
              className="text-stone-700 hover:text-stone-900 px-3 py-2 text-xs font-semibold cursor-pointer"
            >
              View My Stays
            </button>
            <button
              onClick={onClose}
              className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-xl text-xs font-semibold tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
