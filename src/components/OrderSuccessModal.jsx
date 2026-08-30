import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, MessageCircle, X, Sparkles } from 'lucide-react';

export const OrderSuccessModal = () => {
  const { t, lastPlacedOrder, setLastPlacedOrder, settings } = useStore();

  if (!lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const handleOpenWhatsAppAgain = () => {
    let waMessage = `✨ *RAPPEL COMMANDE S&S ACCESSORIES* #${order.id} ✨\n`;
    waMessage += `👤 Client : ${order.customerName}\n`;
    waMessage += `📱 Téléphone : ${order.customerPhone}\n`;
    waMessage += `📍 Ville : ${order.city}\n`;
    waMessage += `💰 Total : ${order.total} DH (Paiement à la livraison)\n`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-enter">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#F8B4C5]/50 overflow-hidden text-center p-5 sm:p-8 space-y-5 sm:space-y-6">
        
        {/* Close */}
        <button
          onClick={() => setLastPlacedOrder(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#E26886] to-[#F8B4C5] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#E26886]/30">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#872B44] bg-[#FFF0F4] px-3 py-1 rounded-full border border-[#F4A6B8]/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('orderSuccessTag')}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#1E1618]">
            {t('orderSuccessTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#785C63]">
            {t('orderSuccessRef')} <span className="font-mono font-bold text-[#872B44]">#{order.id}</span>
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F8B4C5]/40 text-left text-xs space-y-2.5">
          <div className="flex justify-between pb-2 border-b border-[#F8B4C5]/20">
            <span className="text-[#785C63]">{t('recipient')}</span>
            <span className="font-bold text-[#1E1618]">{order.customerName}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-[#F8B4C5]/20">
            <span className="text-[#785C63]">{t('cityAndDelivery')}</span>
            <span className="font-bold text-[#1E1618]">{order.city} ({order.deliveryFee} DH)</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-[#F8B4C5]/20">
            <span className="text-[#785C63]">{t('paymentMode')}</span>
            <span className="font-semibold text-green-700">{t('cashAtDelivery')}</span>
          </div>

          <div className="flex justify-between pt-1 items-baseline">
            <span className="font-bold text-sm text-[#1E1618]">{t('totalToPayDeliveryGuy')}</span>
            <span className="font-serif text-xl font-bold text-[#872B44]">{order.total} DH</span>
          </div>
        </div>

        <p className="text-xs text-[#544449] leading-relaxed">
          {t('orderSentNotice')}
        </p>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleOpenWhatsAppAgain}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('openWhatsAppBtn')}</span>
          </button>

          <button
            onClick={() => setLastPlacedOrder(null)}
            className="w-full py-3 rounded-2xl bg-white border border-[#F8B4C5]/60 text-[#872B44] hover:bg-[#FFF0F4] text-xs font-semibold transition-colors"
          >
            {t('continueShoppingBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
