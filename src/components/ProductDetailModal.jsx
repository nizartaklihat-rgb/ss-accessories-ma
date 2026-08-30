import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, Sparkles, ShoppingBag, Truck, ShieldCheck, 
  Star, Check, Gift 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProductDetailModal = () => {
  const { 
    t,
    isRTL,
    selectedProductDetail, 
    setSelectedProductDetail, 
    addToCart,
    setIsPackBuilderOpen,
    setCustomPack,
    selectedCity,
    getDeliveryFeeForCity
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isPack = product.category === 'packs';
  const deliveryFee = getDeliveryFeeForCity(selectedCity);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F4A6B8', '#E26886', '#D4AF37']
      });
    } catch (e) {}
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProductDetail(null);
    }, 1200);
  };

  const handleIntegrateToCustomPack = () => {
    const slotMap = {
      'colliers': 'collier',
      'bracelets': 'bracelet',
      'bagues': 'bague',
      'montres': 'montre'
    };
    const slotKey = slotMap[product.category];
    if (slotKey) {
      setCustomPack(prev => ({
        ...prev,
        [slotKey]: product
      }));
    }
    setSelectedProductDetail(null);
    setIsPackBuilderOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-enter">
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#F8B4C5]/40 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className={`absolute top-3 sm:top-4 ${isRTL ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1618] shadow-md hover:scale-105 transition-all`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Stage */}
        <div className="md:w-1/2 relative bg-[#FDF2F5] min-h-[260px] sm:min-h-[300px] md:min-h-full flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-[#872B44] text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="md:w-1/2 p-5 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-4 sm:space-y-6">
          
          <div className="space-y-3.5 sm:space-y-4">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-[#A2324F]">
                {t(product.category) || product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] bg-[#FFF0F4] px-2.5 py-1 rounded-full border border-[#F8B4C5]/40">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-[#1E1618]">{product.rating || '5.0'} / 5</span>
                <span className="text-[10px] text-[#785C63]">({t('reviews')})</span>
              </div>
            </div>

            {/* Product Name */}
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#1E1618] leading-tight">
              {product.name}
            </h2>

            {/* Pricing in DH */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#872B44]">
                {product.price} <span className="text-base font-sans font-bold">DH</span>
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#9B7C84] line-through font-medium">
                  {product.originalPrice} DH
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#544449] leading-relaxed">
              {product.description}
            </p>

            {/* Material & Specs */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8FA] border border-[#F8B4C5]/40 space-y-2 text-xs">
              {product.material && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#872B44] shrink-0">{t('material')}</span>
                  <span className="text-[#3E2D32]">{product.material}</span>
                </div>
              )}
              {product.length && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#872B44] shrink-0">{t('dimensions')}</span>
                  <span className="text-[#3E2D32]">{product.length}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#785C63] pt-1 border-t border-[#F8B4C5]/20 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>{t('qualityBadge')}</span>
              </div>
            </div>

            {/* If Pack: Show included contents */}
            {product.itemsIncluded && (
              <div className="p-3.5 rounded-2xl bg-[#FDE8EE]/70 border border-[#F4A6B8] space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#872B44] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{t('contentsIncluded')}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-[#1E1618]">
                  {product.itemsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className="text-[#E26886]">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Note */}
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-[#F8B4C5]/30">
              <div className="flex items-center gap-2 text-[#544449]">
                <Truck className="w-4 h-4 text-[#872B44]" />
                <span>{t('deliveryFeeLabel')} ({selectedCity}) :</span>
              </div>
              <span className="font-bold text-[#872B44]">{deliveryFee} DH</span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-3 border-t border-[#F8B4C5]/30">
            
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#F8B4C5]/60 rounded-full bg-[#FFF8FA] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#872B44] hover:bg-[#FDE8EE] transition-colors font-bold"
                >
                  -
                </button>
                <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-[#1E1618]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#872B44] hover:bg-[#FDE8EE] transition-colors font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white hover:shadow-lg active:scale-[0.99]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('added')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCartWithPrice')} ({product.price * quantity} DH)</span>
                  </>
                )}
              </button>
            </div>

            {/* If individual product: Offer "Intégrer dans mon Coffret Sur Mesure" */}
            {!isPack && (
              <button
                onClick={handleIntegrateToCustomPack}
                className="w-full py-2.5 rounded-full bg-[#FFF0F4] hover:bg-[#FDE8EE] text-[#872B44] border border-[#F4A6B8]/50 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E26886]" />
                <span>{t('integrateCustomPack')}</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
