import React, { useState } from 'react';
import { HotelRoom, BookingDetails, AddOnOption } from '../types/hotel';
import { ADD_ON_OPTIONS, PROMO_CODES } from '../data/hotelData';
import {
  X,
  Check,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Tag,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
  Utensils,
  Compass,
} from 'lucide-react';

interface BookingModalProps {
  room: HotelRoom;
  checkIn: string;
  checkOut: string;
  adults: number;
  childrenCount: number;
  roomsCount: number;
  currency: string;
  onClose: () => void;
  onConfirmBooking: (details: BookingDetails) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  checkIn,
  checkOut,
  adults,
  childrenCount,
  roomsCount,
  currency,
  onClose,
  onConfirmBooking,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Configuration options
  const [bedPreference, setBedPreference] = useState<'king' | 'twin'>('king');
  const [floorPreference, setFloorPreference] = useState<'high' | 'garden' | 'quiet'>('high');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['gourmet-breakfast']);

  // Guest Info
  const [guestName, setGuestName] = useState('Alexandra Vance');
  const [guestEmail, setGuestEmail] = useState('alexandra.vance@example.com');
  const [guestPhone, setGuestPhone] = useState('+1 (555) 234-8971');
  const [country, setCountry] = useState('United States');
  const [specialRequests, setSpecialRequests] = useState('Celebrating our 5th wedding anniversary. High quiet floor requested.');
  const [arrivalTime, setArrivalTime] = useState('15:00 - 16:00');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'hotel'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('883');
  const [promoCodeInput, setPromoCodeInput] = useState('AURA15');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('AURA15');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = Math.max(0, checkOutDate.getTime() - checkInDate.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Pricing calculations
  const basePrice = room.pricePerNight * nights * roomsCount;

  const addOnsPrice = selectedAddOns.reduce((total, id) => {
    const addon = ADD_ON_OPTIONS.find((a) => a.id === id);
    if (!addon) return total;
    return total + (addon.perNight ? addon.price * nights : addon.price);
  }, 0);

  const subtotal = basePrice + addOnsPrice;

  // Promo discount
  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const p = PROMO_CODES[appliedPromo];
    if (p.discountPercent) {
      discount = Math.round((subtotal * p.discountPercent) / 100);
    } else if (p.discountAmount) {
      discount = Math.min(p.discountAmount, subtotal);
    }
  }

  const resortFee = Math.round((subtotal - discount) * 0.1); // 10%
  const tax = Math.round((subtotal - discount) * 0.05); // 5%
  const grandTotal = Math.max(0, subtotal - discount + resortFee + tax);

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  // Toggle add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Apply promo
  const handleApplyPromo = () => {
    const trimmed = promoCodeInput.trim().toUpperCase();
    if (PROMO_CODES[trimmed]) {
      setAppliedPromo(trimmed);
      setPromoError(null);
    } else {
      setPromoError('Invalid promotional voucher code. Try AURA15 or ESCAPE100.');
    }
  };

  // Submit Reservation
  const handleCompleteReservation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking: BookingDetails = {
        bookingId: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        roomId: room.id,
        roomTitle: room.title,
        roomType: room.type,
        checkIn,
        checkOut,
        nights,
        adults,
        children: childrenCount,
        roomsCount,
        guestName,
        guestEmail,
        guestPhone,
        country,
        specialRequests,
        bedPreference,
        floorPreference,
        selectedAddOns,
        basePrice,
        addOnsPrice,
        resortFee,
        tax,
        discount,
        totalPrice: grandTotal,
        currency,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        digitalPin: `${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setIsSubmitting(false);
      onConfirmBooking(newBooking);
    }, 900);
  };

  // Render addon icon
  const renderIcon = (name: string) => {
    switch (name) {
      case 'Car':
        return <Car className="w-4 h-4 text-amber-800" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-amber-800" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-amber-800" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-amber-800" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-800" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-light text-stone-900">
                Reserve Your Sanctuary Stay
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Step {currentStep} of 3
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {room.title} • {nights} Nights ({checkIn} → {checkOut})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 bg-stone-100/80 border-b border-stone-200/80 text-xs font-semibold text-center py-2.5 px-4 text-stone-500">
          <div className={`flex items-center justify-center gap-2 ${currentStep >= 1 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${currentStep >= 1 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-600'}`}>
              1
            </span>
            <span>Suite & Extras</span>
          </div>
          <div className={`flex items-center justify-center gap-2 ${currentStep >= 2 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${currentStep >= 2 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-600'}`}>
              2
            </span>
            <span>Guest Profile</span>
          </div>
          <div className={`flex items-center justify-center gap-2 ${currentStep >= 3 ? 'text-amber-900 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${currentStep >= 3 ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-600'}`}>
              3
            </span>
            <span>Confirm & Guarantee</span>
          </div>
        </div>

        {/* Step Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Customizations & Addons */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Room Quick Recap */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-lg font-semibold text-stone-900">{room.title}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{room.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-stone-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      {checkIn} to {checkOut} ({nights} nights)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      {adults + childrenCount} Guests ({roomsCount} Suite)
                    </span>
                  </div>
                </div>

                <div className="text-right border-t sm:border-t-0 sm:border-l sm:pl-4 border-stone-100 pt-2 sm:pt-0">
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    {currencySymbol}{basePrice}
                  </span>
                  <span className="text-[11px] text-stone-500 block">Suite Subtotal</span>
                </div>
              </div>

              {/* Preferences: Bed Type & Floor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bed Preference */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Bed Configuration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBedPreference('king')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        bedPreference === 'king'
                          ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700/30'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>1 California King</div>
                      <span className="text-[10px] text-stone-400 font-normal">Plush Cloud Pillowtop</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBedPreference('twin')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        bedPreference === 'twin'
                          ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700/30'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>2 Queen Beds</div>
                      <span className="text-[10px] text-stone-400 font-normal">Individual Linens</span>
                    </button>
                  </div>
                </div>

                {/* Floor Preference */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Suite Floor Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'high', label: 'High Floor', sub: 'Panoramic' },
                      { id: 'garden', label: 'Ground Tier', sub: 'Direct Walk' },
                      { id: 'quiet', label: 'Secluded', sub: 'Quiet Wing' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setFloorPreference(pos.id as any)}
                        className={`p-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          floorPreference === pos.id
                            ? 'border-amber-700 bg-amber-50 text-amber-950 ring-1 ring-amber-700/30'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div>{pos.label}</div>
                        <span className="text-[9px] text-stone-400 font-normal">{pos.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bespoke Resort Add-Ons */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-serif text-base font-semibold text-stone-900">
                      Curated Concierge Add-Ons
                    </h5>
                    <p className="text-xs text-stone-500">
                      Elevate your stay with signature wellness, culinary and arrival privileges.
                    </p>
                  </div>
                  <span className="text-xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Optional Privileges
                  </span>
                </div>

                <div className="space-y-2.5">
                  {ADD_ON_OPTIONS.map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    const cost = addon.perNight ? addon.price * nights : addon.price;

                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500/20'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-amber-200/80' : 'bg-stone-100'}`}>
                            {renderIcon(addon.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-stone-900">
                                {addon.name}
                              </span>
                              {addon.perNight && (
                                <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded-sm">
                                  Per Night
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                              {addon.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-bold text-stone-900">
                            +{currencySymbol}{cost}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            {addon.perNight ? `${currencySymbol}${addon.price}/night` : 'Per stay'}
                          </div>
                          <div className={`mt-1 inline-flex items-center justify-center w-5 h-5 rounded-md border ${isSelected ? 'bg-amber-800 border-amber-800 text-white' : 'border-stone-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-semibold text-amber-950">Personalized Sanctuary Host:</span>{' '}
                  Your dedicated concierge will arrange in-suite check-in and custom pillow scents prior to your arrival.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Primary Guest Name *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="Full name as on passport"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Email Address (For Confirmation & Key) *
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Estimated Time of Arrival
                  </label>
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  >
                    <option value="12:00 - 14:00">Early Arrival (12:00 - 14:00)</option>
                    <option value="15:00 - 16:00">Standard Check-In (15:00 - 16:00)</option>
                    <option value="16:00 - 18:00">Late Afternoon (16:00 - 18:00)</option>
                    <option value="18:00 - 21:00">Evening Arrival (18:00 - 21:00)</option>
                    <option value="21:00+">Late Night Arrival (After 21:00)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Special Requests & Dietary Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Anniversary celebration, dietary preferences, feather-free pillows, airport flight code..."
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Guarantee */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-3">
                  Guaranteed Payment Option
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'card', label: 'Credit Card', sub: 'Instant SSL' },
                    { id: 'apple', label: 'Apple Pay', sub: 'Touch ID' },
                    { id: 'google', label: 'Google Pay', sub: '1-Click' },
                    { id: 'hotel', label: 'Pay at Resort', sub: 'On Check-In' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'border-amber-700 bg-amber-50/80 text-amber-950 ring-1 ring-amber-700/30'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{pm.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{pm.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Inputs Simulation */}
              {paymentMethod === 'card' && (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      256-Bit Encrypted Transaction
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCardNumber('4000 1234 5678 9010');
                        setCardExpiry('12/28');
                        setCardCvc('772');
                      }}
                      className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                    >
                      Auto-Fill Test Card
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700 pr-10"
                      />
                      <CreditCard className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Expiration Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">Security CVC</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        maxLength={4}
                        placeholder="•••"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Promo Code Box */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200">
                <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  Privilege Club or Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Try AURA15 or ESCAPE100"
                    className="flex-1 uppercase bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="text-xs text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Applied: {PROMO_CODES[appliedPromo]?.label}
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-rose-600 mt-1.5">{promoError}</div>
                )}
              </div>

              {/* Price Breakdown Summary */}
              <div className="bg-stone-100/90 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{room.title} ({nights} nights × {currencySymbol}{room.pricePerNight})</span>
                  <span className="font-semibold text-stone-900">{currencySymbol}{basePrice}</span>
                </div>

                {addOnsPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Curated Add-Ons ({selectedAddOns.length} selected)</span>
                    <span className="font-semibold text-stone-900">+{currencySymbol}{addOnsPrice}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Privilege Voucher Discount</span>
                    <span>-{currencySymbol}{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Sanctuary Resort Wellness Fee (10%)</span>
                  <span>+{currencySymbol}{resortFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Municipal Coastal Tourism Tax (5%)</span>
                  <span>+{currencySymbol}{tax}</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <div className="font-serif text-lg font-bold text-stone-900">Total Guaranteed Amount</div>
                    <div className="text-[10px] text-stone-500">Includes all taxes, service & resort amenities</div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-amber-900">
                    {currencySymbol}{grandTotal}
                  </div>
                </div>
              </div>

              {/* Free Cancellation Notice */}
              <div className="flex items-start gap-2.5 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Flexible Sanctuary Guarantee:</strong> You can cancel or reschedule without penalty up to 48 hours before your check-in date.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-white p-4 sm:p-5 border-t border-stone-200/80 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="text-stone-700 hover:text-stone-900 px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-stone-800 px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ChevronRight className="w-4 h-4 text-amber-300" />
            </button>
          ) : (
            <button
              onClick={handleCompleteReservation}
              disabled={isSubmitting}
              className="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white px-7 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Suite...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-200" />
                  <span>Confirm Reservation ({currencySymbol}{grandTotal})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
