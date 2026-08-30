import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, X, Plus, Trash2, Check, ArrowRight, Gift, 
  ShoppingBag, RefreshCw, PenTool, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomPackBuilder = () => {
  const { 
    t,
    isRTL,
    language,
    products, 
    customPack, 
    setCustomPack, 
    addCustomPackToCart, 
    isPackBuilderOpen, 
    setIsPackBuilderOpen
  } = useStore();

  const [activeTabSlot, setActiveTabSlot] = useState('collier'); // 'collier' | 'bracelet' | 'bague' | 'montre'
  const [showCardCustomizer, setShowCardCustomizer] = useState(false);

  if (!isPackBuilderOpen) return null;

  // Filter products by active slot category
  const getProductsForCategory = (cat) => {
    return products.filter(p => p.category === cat && p.inStock !== false);
  };

  const currentCategoryProducts = getProductsForCategory(
    activeTabSlot === 'collier' ? 'colliers' :
    activeTabSlot === 'bracelet' ? 'bracelets' :
    activeTabSlot === 'bague' ? 'bagues' : 'montres'
  );

  // Slots definition
  const slots = [
    { key: 'collier', label: t('slotCollier'), category: 'colliers', icon: '💎' },
    { key: 'bracelet', label: t('slotBracelet'), category: 'bracelets', icon: '✨' },
    { key: 'bague', label: t('slotBague'), category: 'bagues', icon: '💍' },
    { key: 'montre', label: t('slotMontre'), category: 'montres', icon: '⌚' },
  ];

  // Selected items list
  const selectedItems = [
    customPack.collier,
    customPack.bracelet,
    customPack.bague,
    customPack.montre
  ].filter(Boolean);

  const selectedCount = selectedItems.length;
  // Exact sum of selected items - NO automatic discount
  const finalPackPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const handleSelectItem = (item) => {
    setCustomPack(prev => ({
      ...prev,
      [activeTabSlot]: item
    }));

    // Auto-advance to next empty slot
    const slotKeys = ['collier', 'bracelet', 'bague', 'montre'];
    const currentIndex = slotKeys.indexOf(activeTabSlot);
    const nextSlot = slotKeys.find((key, idx) => idx > currentIndex && !customPack[key]);
    if (nextSlot) {
      setActiveTabSlot(nextSlot);
    }
  };

  const handleRemoveSlot = (slotKey) => {
    setCustomPack(prev => ({
      ...prev,
      [slotKey]: null
    }));
  };

  const handleResetPack = () => {
    setCustomPack({
      collier: null,
      bracelet: null,
      bague: null,
      montre: null,
      boxColor: 'Rose Poudré Velours',
      ribbonColor: 'Doré Champagne',
      giftMessage: '',
      giftRecipient: '',
      boxStyle: 'Écrin Coffret Joaillerie'
    });
  };

  const handleAddToCart = () => {
    if (selectedCount === 0) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F4A6B8', '#E26886', '#D4AF37', '#FFFFFF']
      });
    } catch (e) {}

    addCustomPackToCart(customPack);
    setIsPackBuilderOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-enter">
      
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-[#F8B4C5]/50 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#1E1618] via-[#3B1F28] to-[#1E1618] text-white flex items-center justify-between border-b border-[#F8B4C5]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E26886] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-[#FFF5F7]">
                  {t('packBuilderTitle')}
                </h2>
                <span className="bg-[#E26886] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {t('customPackBadge')}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FDE8EE]/80 font-sans">
                {t('packBuilderDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetPack}
              className="hidden sm:flex items-center gap-1 text-xs text-[#F8B4C5] hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تفريغ' : 'Vider'}</span>
            </button>
            <button
              onClick={() => setIsPackBuilderOpen(false)}
              className="p-1.5 sm:p-2 rounded-full text-[#FDE8EE] hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Main Interactive Studio Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FFF8FA] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT: The Luxury Box Visualizer */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            
            {/* The Ecrin Box Visual Stage */}
            <div className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-[#FDE8EE] via-[#FBD2DC]/60 to-[#F8B4C5]/40 border-2 border-[#F4A6B8]/60 shadow-xl shadow-[#E26886]/10 flex flex-col">
              
              {/* Box Brand Tag */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#F4A6B8]/40">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E1618] p-0.5 overflow-hidden">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-display text-xs font-bold tracking-widest text-[#1E1618]">
                    S&amp;S ACCESSORIES
                  </span>
                </div>
                
                <div className="text-[11px] font-semibold text-[#872B44] bg-white/80 px-2.5 py-1 rounded-full border border-[#F4A6B8]/40">
                  {selectedCount}/4 {language === 'ar' ? 'قطع' : 'Bijoux'}
                </div>
              </div>

              {/* 4-Compartments Grid inside Box */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-4 flex-1 min-h-[250px] sm:min-h-[280px]">
                {slots.map((s) => {
                  const item = customPack[s.key];
                  const isCurrentActive = activeTabSlot === s.key;

                  return (
                    <div
                      key={s.key}
                      onClick={() => setActiveTabSlot(s.key)}
                      className={`relative rounded-2xl p-2.5 sm:p-3 border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
                        isCurrentActive
                          ? 'border-[#872B44] bg-white shadow-md ring-2 ring-[#E26886]/30'
                          : item
                          ? 'border-[#F4A6B8] bg-white/90 hover:border-[#872B44]'
                          : 'border-dashed border-[#F4A6B8]/70 bg-white/40 hover:bg-white/70 hover:border-[#E26886]'
                      }`}
                    >
                      {/* Active indicator badge */}
                      {isCurrentActive && (
                        <span className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} w-2 h-2 rounded-full bg-[#872B44] animate-ping`} />
                      )}

                      {item ? (
                        <div className="w-full flex flex-col items-center">
                          <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-xl overflow-hidden mb-1.5 shadow-xs border border-[#F8B4C5]/50">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSlot(s.key);
                              }}
                              className="absolute top-0.5 right-0.5 p-1 bg-white/90 rounded-full text-red-500 hover:text-red-700 shadow-xs hover:scale-110 transition-transform"
                              title="Retirer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-xs font-serif font-bold text-[#1E1618] line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-[11px] font-bold text-[#872B44] font-sans">
                            {item.price} DH
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-3 sm:py-4 space-y-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFF0F4] flex items-center justify-center text-base sm:text-lg mb-1 group-hover:scale-110 transition-transform">
                            {s.icon}
                          </div>
                          <div className="text-xs font-semibold text-[#1E1618]">
                            {s.label}
                          </div>
                          <div className="text-[10px] text-[#872B44] font-medium flex items-center gap-1">
                            <Plus className="w-3 h-3" />
                            <span>{t('slotAdd')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Gift Card Personalization Accordion */}
              <div className="pt-3 border-t border-[#F4A6B8]/40">
                <button
                  onClick={() => setShowCardCustomizer(!showCardCustomizer)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#872B44] hover:text-[#5C1A2C] transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>{t('personalizedCard')}</span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] bg-white/80 px-2 py-0.5 rounded-full border border-[#F4A6B8]/40">
                    {customPack.giftMessage ? '✓' : '+'}
                  </span>
                </button>

                {showCardCustomizer && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-white/90 border border-[#F8B4C5]/60 space-y-2 animate-enter">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#872B44] block">
                        {t('recipientLabel')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('recipientPlaceholder')}
                        value={customPack.giftRecipient || ''}
                        onChange={(e) => setCustomPack(prev => ({ ...prev, giftRecipient: e.target.value }))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#F8B4C5]/50 focus:outline-none focus:ring-1 focus:ring-[#E26886] bg-[#FFF8FA]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#872B44] block">
                        {t('cardMessageLabel')}
                      </label>
                      <textarea
                        rows={2}
                        placeholder={t('cardMessagePlaceholder')}
                        value={customPack.giftMessage || ''}
                        onChange={(e) => setCustomPack(prev => ({ ...prev, giftMessage: e.target.value }))}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-[#F8B4C5]/50 focus:outline-none focus:ring-1 focus:ring-[#E26886] bg-[#FFF8FA]"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Price & Summary Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs text-[#544449]">
                <span>{t('selectedItemsCount')}</span>
                <span className="font-semibold">{selectedCount}</span>
              </div>

              <div className="pt-2 border-t border-[#F8B4C5]/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#544449]">{t('packTotal')}</div>
                  <div className="text-[11px] text-[#872B44] font-medium">{t('boxAndCardIncluded')}</div>
                </div>
                <div className="text-right">
                  <div className="font-serif text-2xl font-bold text-[#1E1618]">
                    {finalPackPrice} <span className="text-sm font-sans font-semibold text-[#872B44]">DH</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={selectedCount === 0}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all ${
                  selectedCount > 0
                    ? 'bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedCount === 0 ? t('selectAtLeastOne') : t('addPackToCart')}
                </span>
              </button>
            </div>

          </div>

          {/* RIGHT: Product Selection Drawer by Category */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Category Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {slots.map((s) => {
                const isActive = activeTabSlot === s.key;
                const isFilled = !!customPack[s.key];

                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveTabSlot(s.key)}
                    className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 ${
                      isActive
                        ? 'bg-[#872B44] text-white shadow-md'
                        : isFilled
                        ? 'bg-[#FDE8EE] text-[#872B44] border border-[#F4A6B8]'
                        : 'bg-white text-[#544449] border border-[#F8B4C5]/40 hover:bg-[#FFF5F7]'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                    {isFilled && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                  </button>
                );
              })}
            </div>

            {/* Category Info Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#F8B4C5]/30">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E1618]">
                {slots.find(s => s.key === activeTabSlot)?.label}
              </h3>
              <div className="text-xs text-[#872B44] font-medium">
                {currentCategoryProducts.length} {t('modelsAvailable')}
              </div>
            </div>

            {/* Product Cards Grid to pick from */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 overflow-y-auto max-h-[440px] pr-1">
              {currentCategoryProducts.map((prod) => {
                const isSelected = customPack[activeTabSlot]?.id === prod.id;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectItem(prod)}
                    className={`rounded-2xl p-3 bg-white border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-[#872B44] shadow-md ring-2 ring-[#E26886]/30 bg-[#FFF8FA]'
                        : 'border-[#F8B4C5]/40 hover:border-[#E26886] hover:shadow-xs'
                    }`}
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-square mb-2.5 bg-gray-50">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {prod.badge && (
                        <span className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-[#872B44]/90 text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                          {prod.badge}
                        </span>
                      )}

                      {isSelected && (
                        <div className="absolute inset-0 bg-[#872B44]/30 backdrop-blur-xs flex items-center justify-center">
                          <div className="bg-white text-[#872B44] px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            <span>{language === 'ar' ? 'تم الاختيار' : 'Sélectionné'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-sm text-[#1E1618] line-clamp-1 group-hover:text-[#872B44] transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-[#785C63] line-clamp-2 leading-snug">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-[#F8B4C5]/20 flex items-center justify-between">
                      <div>
                        {prod.originalPrice && (
                          <span className={`text-[11px] text-[#9B7C84] line-through ${isRTL ? 'ml-1.5' : 'mr-1.5'}`}>
                            {prod.originalPrice} DH
                          </span>
                        )}
                        <span className="font-serif font-bold text-sm sm:text-base text-[#872B44]">
                          {prod.price} <span className="text-xs font-sans font-semibold">DH</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#872B44] text-white'
                            : 'bg-[#FFF0F4] text-[#872B44] group-hover:bg-[#872B44] group-hover:text-white'
                        }`}
                      >
                        {isSelected ? (language === 'ar' ? 'مختار' : 'Choisi') : (language === 'ar' ? 'اختيار' : 'Sélectionner')}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
