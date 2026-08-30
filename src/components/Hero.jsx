import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Truck, Gift, ArrowRight, Crown, Star } from 'lucide-react';

export const Hero = () => {
  const { 
    t, 
    isRTL, 
    products, 
    settings, 
    setIsPackBuilderOpen, 
    setSelectedProductDetail,
    setActiveCategoryFilter 
  } = useStore();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamically resolve the Featured Special Edition Product configured in Admin Portal
  const featuredProduct = (settings?.featuredSpecialProductId && products.find(p => p.id === settings.featuredSpecialProductId))
    || products.find(p => p.category === 'packs')
    || (products.length > 0 ? products[0] : null);

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16 lg:pt-12 lg:pb-24">
      {/* Decorative Organic Rose Gradients & Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-gradient-to-b from-[#FDE8EE]/70 via-[#FBD2DC]/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#F8B4C5]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-64 sm:w-80 h-64 sm:h-80 bg-[#E5C387]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white/90 via-[#FFF5F7]/95 to-[#FDE8EE]/80 border border-[#F8B4C5]/40 shadow-xl shadow-[#E26886]/5 p-5 sm:p-10 lg:p-16 overflow-hidden">
          
          {/* Subtle Watermark Pattern */}
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} bottom-0 opacity-[0.03] pointer-events-none select-none`}>
            <Crown className="w-80 sm:w-96 h-80 sm:h-96 text-[#872B44]" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              
              {/* Brand Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0F4] border border-[#F4A6B8]/50 text-[#872B44] text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t('heroBadge')}</span>
              </div>

              {/* Main Headline with the elegant Shimmer Text Effect */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1E1618] leading-[1.15] tracking-tight">
                {t('heroTitleLine1')} <br />
                <span className="shimmer-text font-serif italic font-normal">
                  {t('heroTitleLine2')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg text-[#5A454B] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                {t('heroDesc')}
              </p>

              {/* Call-To-Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                
                {/* 1. Custom Pack Builder CTA */}
                <button
                  onClick={() => setIsPackBuilderOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#C74868] text-white font-semibold text-sm sm:text-base tracking-wide shadow-lg shadow-[#872B44]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDE8EE] group-hover:rotate-12 transition-transform" />
                  <span>{t('heroCtaCustom')}</span>
                  <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold">
                    {t('customPackBadge')}
                  </span>
                </button>

                {/* 2. Browse Collection CTA */}
                <button
                  onClick={scrollToCatalog}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white text-[#872B44] hover:bg-[#FFF5F7] border border-[#F8B4C5]/60 font-semibold text-sm sm:text-base tracking-wide shadow-xs hover:shadow-md hover:border-[#E26886] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('heroCtaCatalog')}</span>
                  <ArrowRight className={`w-4 h-4 text-[#872B44] ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-5 border-t border-[#F8B4C5]/30 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FDE8EE] flex items-center justify-center text-[#872B44] shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-[#1E1618]">{t('heroTrustDelivery')}</div>
                    <div className="text-[#785C63] text-[11px]">{t('heroTrustDeliverySub')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FDE8EE] flex items-center justify-center text-[#872B44] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-[#1E1618]">{t('heroTrustCod')}</div>
                    <div className="text-[#785C63] text-[11px]">{t('heroTrustCodSub')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-[#FDE8EE] flex items-center justify-center text-[#872B44] shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-[#1E1618]">{t('heroTrustGift')}</div>
                    <div className="text-[#785C63] text-[11px]">{t('heroTrustGiftSub')}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Visual Showcase Frame — DYNAMIC SPECIAL EDITION */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#E26886]/20 via-[#F8B4C5]/30 to-[#E5C387]/20 rounded-3xl blur-2xl transform rotate-2" />
                
                {/* Main Showcase Box */}
                {featuredProduct ? (
                  <div 
                    onClick={() => setSelectedProductDetail(featuredProduct)}
                    className="relative rounded-3xl overflow-hidden border-2 border-white/80 shadow-2xl bg-[#1E1618] cursor-pointer group"
                  >
                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      className="w-full h-[320px] sm:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Subtle Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1618]/90 via-[#1E1618]/25 to-transparent" />

                    {/* Top Floating Logo Stamp */}
                    <div className={`absolute top-3.5 ${isRTL ? 'right-3.5' : 'left-3.5'} flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20`}>
                      <img src="/logo.jpg" alt="Logo" className="w-4.5 h-4.5 rounded-full" />
                      <span className="text-[10px] font-display tracking-widest text-[#FFF5F7] font-semibold">
                        S&amp;S ACCESSORIES
                      </span>
                    </div>

                    {/* Top "Édition Spéciale" Badge */}
                    <div className={`absolute top-3.5 ${isRTL ? 'left-3.5' : 'right-3.5'} bg-gradient-to-r from-[#872B44] to-[#E26886] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-white/20`}>
                      <Star className="w-3 h-3 text-[#E5C387] fill-[#E5C387]" />
                      <span>{featuredProduct.badge || t('heroFeaturedBadge')}</span>
                    </div>

                    {/* Bottom Info inside Image */}
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#F8B4C5]/40 shadow-lg">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-base sm:text-lg text-[#1E1618] truncate">
                            {featuredProduct.name}
                          </div>
                          <div className="text-[11px] text-[#544449] line-clamp-1">
                            {featuredProduct.description || featuredProduct.material || t('heroFeaturedSub')}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {featuredProduct.originalPrice && featuredProduct.originalPrice > featuredProduct.price && (
                            <div className="text-[11px] text-[#9B7C84] line-through">
                              {featuredProduct.originalPrice} DH
                            </div>
                          )}
                          <div className="text-base sm:text-lg font-bold text-[#872B44] font-serif">
                            {featuredProduct.price} DH
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductDetail(featuredProduct);
                        }}
                        className="mt-2.5 w-full py-2 rounded-xl bg-[#FFF0F4] hover:bg-[#FDE8EE] text-[#872B44] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#F4A6B8]/40 cursor-pointer"
                      >
                        <span>{t('heroFeaturedBtn')}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Loading / Placeholder Showcase Frame with Logo */
                  <div className="relative rounded-3xl overflow-hidden border-2 border-white/80 shadow-2xl bg-gradient-to-br from-[#251A1E] to-[#140E10] h-[320px] sm:h-[420px] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full border-2 border-[#F4A6B8]/50 p-1 shadow-lg bg-black/40">
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-serif font-bold text-lg text-white">S&amp;S ACCESSORIES</div>
                      <p className="text-xs text-[#FDE8EE]/70">Haute Joaillerie &bull; Casablanca</p>
                    </div>
                  </div>
                )}

                {/* Floating Micro Badge */}
                <div className={`absolute -bottom-3 ${isRTL ? '-right-3' : '-left-3'} bg-white p-2.5 sm:p-3 rounded-2xl shadow-lg border border-[#F8B4C5]/40 flex items-center gap-2.5 animate-float-slow`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#E26886] to-[#F8B4C5] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    ✦
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1618]">{t('customPackBtn')}</div>
                    <div className="text-[10px] text-[#A2324F] font-medium">{t('customPackBadge')}</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
