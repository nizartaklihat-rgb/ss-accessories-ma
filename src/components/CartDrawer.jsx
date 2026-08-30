import React from 'react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES } from '../data/moroccanCities';
import { 
  X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Sparkles, Gift, Truck, ShieldCheck 
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    t,
    isRTL,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    selectedCity,
    setSelectedCity,
    getDeliveryFeeForCity,
    setIsCheckoutOpen,
    setIsPackBuilderOpen
  } = useStore();

  if (!isCartOpen) return null;

  const currentDeliveryFee = getDeliveryFeeForCity(selectedCity);
  const finalTotal = cartSubtotal > 0 ? cartSubtotal + currentDeliveryFee : 0;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-enter">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} max-w-full flex ${isRTL ? 'pr-6' : 'pl-6'}`}>
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#F8B4C5]/40 flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1E1618] via-[#351C24] to-[#1E1618] text-white flex items-center justify-between border-b border-[#F8B4C5]/20">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#F4A6B8]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FFF5F7]">
                {t('myCart')} ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/15 transition-colors text-[#FDE8EE]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#FFF9FB]">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF0F4] text-[#E26886] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1E1618]">{t('cartEmpty')}</h3>
                <p className="text-xs text-[#785C63] max-w-xs mx-auto">
                  {t('cartEmptyDesc')}
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsPackBuilderOpen(true);
                    }}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#872B44] to-[#E26886] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t('bannerCustomBtn')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl bg-white border transition-all ${
                      item.isCustomPack
                        ? 'border-[#872B44]/40 bg-gradient-to-b from-white to-[#FFF5F7] shadow-xs'
                        : 'border-[#F8B4C5]/40 shadow-2xs'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Item Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FDF2F5] shrink-0 border border-[#F8B4C5]/50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Pricing */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1E1618] line-clamp-1">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* If Custom Pack: Show breakdown of pieces */}
                          {item.isCustomPack && item.packDetails && (
                            <div className="mt-1 p-1.5 rounded-lg bg-[#FDE8EE]/60 border border-[#F8B4C5]/40 text-[10px] sm:text-[11px] text-[#544449] space-y-0.5">
                              <div className="font-bold text-[#872B44] flex items-center gap-1 text-[10px]">
                                <Gift className="w-3 h-3" />
                                <span>{t('contentsIncluded')}</span>
                              </div>
                              {item.packDetails.collier && (
                                <div className="truncate">• {item.packDetails.collier.name}</div>
                              )}
                              {item.packDetails.bracelet && (
                                <div className="truncate">• {item.packDetails.bracelet.name}</div>
                              )}
                              {item.packDetails.bague && (
                                <div className="truncate">• {item.packDetails.bague.name}</div>
                              )}
                              {item.packDetails.montre && (
                                <div className="truncate">• {item.packDetails.montre.name}</div>
                              )}
                              {item.packDetails.giftMessage && (
                                <div className="italic text-[#872B44] text-[10px] pt-0.5">
                                  ✉ "{item.packDetails.giftMessage}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F8B4C5]/20">
                          <div className="flex items-center border border-[#F8B4C5]/50 rounded-full bg-[#FFF8FA] px-1">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#872B44] hover:bg-[#FDE8EE] rounded-full text-xs font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 sm:w-6 text-center text-xs font-bold text-[#1E1618]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#872B44] hover:bg-[#FDE8EE] rounded-full text-xs font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-serif font-bold text-xs sm:text-sm text-[#872B44]">
                              {item.price * item.quantity} <span className="text-[10px] sm:text-xs font-sans font-semibold">DH</span>
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-white border-t border-[#F8B4C5]/40 space-y-3 shadow-lg">
              
              {/* City Delivery Estimator */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFF8FA] border border-[#F8B4C5]/40 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E1618] flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#872B44]" />
                    <span>{t('deliveryCity')}</span>
                  </span>
                  <span className="font-bold text-[#872B44]">{currentDeliveryFee} DH</span>
                </div>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs bg-white border border-[#F8B4C5]/60 rounded-xl px-2.5 py-1.5 text-[#1E1618] focus:outline-none focus:ring-1 focus:ring-[#E26886]"
                >
                  {MOROCCAN_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name} — {city.fee} DH ({city.delay})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-[#544449]">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-[#1E1618]">{cartSubtotal} DH</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('deliveryFee')} ({selectedCity}) :</span>
                  <span className="font-semibold text-[#1E1618]">{currentDeliveryFee} DH</span>
                </div>
                <div className="pt-1.5 border-t border-[#F8B4C5]/30 flex justify-between items-baseline">
                  <span className="font-bold text-xs sm:text-sm text-[#1E1618]">{t('totalToPay')}</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#872B44]">
                    {finalTotal} <span className="text-xs font-sans font-bold">DH</span>
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#872B44]/20 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>{t('proceedCheckout')}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <div className="text-center text-[10px] sm:text-[11px] text-[#785C63] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>{t('cashOnDeliveryNotice')}</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
