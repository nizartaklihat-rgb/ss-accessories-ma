import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/moroccanCities';
import { 
  X, ShieldCheck, Truck, ShoppingBag, 
  MapPin, Phone, User, MessageSquare, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const {
    t,
    isRTL,
    cart,
    cartSubtotal,
    selectedCity,
    setSelectedCity,
    getDeliveryFeeForCity,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: selectedCity || 'Casablanca',
    address: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const currentDeliveryFee = getDeliveryFeeForCity(formData.city);
  const grandTotal = cartSubtotal + currentDeliveryFee;

  const handleCityChange = (newCity) => {
    setFormData(prev => ({ ...prev, city: newCity }));
    setSelectedCity(newCity);
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = t('fullName');
    }
    if (!formData.phone.trim()) {
      errs.phone = t('phone');
    } else {
      const cleanPhone = formData.phone.replace(/\s+/g, '');
      if (!/^(06|07|\+2126|\+2127|2126|2127)[0-9]{8}$/.test(cleanPhone) && cleanPhone.length < 9) {
        errs.phone = t('phonePlaceholder');
      }
    }
    if (!formData.address.trim()) {
      errs.address = t('address');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F4A6B8', '#E26886', '#D4AF37', '#1E1618']
      });
    } catch (err) {}

    setTimeout(() => {
      placeOrder(formData);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-enter">
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8B4C5]/50 overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#1E1618] via-[#381E27] to-[#1E1618] text-white flex items-center justify-between border-b border-[#F8B4C5]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E26886] flex items-center justify-center text-white shadow-md">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FFF5F7]">
                {t('checkoutTitle')}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#FDE8EE]/80">
                {t('checkoutSub')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-[#FDE8EE] hover:bg-white/15 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FFF8FA] space-y-5 sm:space-y-6">
          
          {/* Order Summary Recap Pill */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#872B44]">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('orderedItems')} ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              </span>
              <span>{cartSubtotal} DH</span>
            </div>

            <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-[#544449] pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-0.5 border-b border-gray-100 last:border-0">
                  <span className="truncate pr-2">• {item.name} (x{item.quantity})</span>
                  <span className="font-medium shrink-0">{item.price * item.quantity} DH</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F8B4C5]/30 flex justify-between text-xs">
              <span className="text-[#544449]">{t('deliveryFee')} ({formData.city}) :</span>
              <span className="font-bold text-[#872B44]">{currentDeliveryFee} DH</span>
            </div>

            <div className="pt-1 flex justify-between items-baseline font-bold">
              <span className="text-xs sm:text-sm text-[#1E1618]">{t('totalToPay')}</span>
              <span className="font-serif text-xl sm:text-2xl text-[#872B44]">{grandTotal} DH</span>
            </div>
          </div>

          {/* Customer Input Fields */}
          <form onSubmit={handleSubmitOrder} className="space-y-3.5 sm:space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                {t('fullName')} <span className="text-[#872B44]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-3 rounded-xl bg-white border text-sm text-[#1E1618] focus:outline-none focus:ring-2 focus:ring-[#E26886] transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#F8B4C5]/60'
                  }`}
                />
                <User className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5 pointer-events-none`} />
              </div>
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                {t('phone')} <span className="text-[#872B44]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-3 rounded-xl bg-white border text-sm text-[#1E1618] focus:outline-none focus:ring-2 focus:ring-[#E26886] transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#F8B4C5]/60'
                  }`}
                />
                <Phone className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5 pointer-events-none`} />
              </div>
              <p className="text-[11px] text-[#785C63] mt-0.5">
                {t('phoneNotice')}
              </p>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            {/* City Selection with Delivery Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                {t('deliveryCityLabel')} <span className="text-[#872B44]">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 sm:py-3 rounded-xl bg-white border border-[#F8B4C5]/60 text-sm text-[#1E1618] focus:outline-none focus:ring-2 focus:ring-[#E26886] cursor-pointer`}
                >
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} — {city.fee} DH ({city.delay})
                    </option>
                  ))}
                </select>
                <MapPin className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3.5 pointer-events-none`} />
              </div>
            </div>

            {/* Detailed Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                {t('address')} <span className="text-[#872B44]">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder={t('addressPlaceholder')}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-xl bg-white border text-sm text-[#1E1618] focus:outline-none focus:ring-2 focus:ring-[#E26886] transition-all ${
                    errors.address ? 'border-red-500 bg-red-50/20' : 'border-[#F8B4C5]/60'
                  }`}
                />
                <MapPin className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3 pointer-events-none`} />
              </div>
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>

            {/* Optional Note / Message Cadeau */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                {t('orderNote')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('orderNotePlaceholder')}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl bg-white border border-[#F8B4C5]/60 text-sm text-[#1E1618] focus:outline-none focus:ring-2 focus:ring-[#E26886]`}
                />
                <MessageSquare className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-3 pointer-events-none`} />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white font-semibold text-sm sm:text-base tracking-wide shadow-xl shadow-[#872B44]/25 hover:shadow-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('submitting')}</span>
                ) : (
                  <>
                    <span>{t('confirmOrderBtn')} ({grandTotal} DH)</span>
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#785C63] pt-1">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>{t('cashOnDeliveryNotice')}</span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
