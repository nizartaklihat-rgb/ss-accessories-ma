import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Truck, ShieldCheck, Gift, MapPin, ArrowUp, Crown 
} from 'lucide-react';

export const Footer = () => {
  const { 
    t,
    setIsPackBuilderOpen, 
    setActiveCategoryFilter 
  } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId) => {
    setActiveCategoryFilter(catId);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1316] text-[#FDE8EE] border-t border-[#F8B4C5]/20 pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* Top 3 Trust Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-8 sm:pb-12 border-b border-[#F8B4C5]/15">
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#E26886]/20 text-[#F4A6B8] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-white">{t('footerDeliveryTitle')}</div>
              <div className="text-[11px] sm:text-xs text-[#FDE8EE]/70">{t('footerDeliverySub')}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#E26886]/20 text-[#F4A6B8] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-white">{t('footerCodTitle')}</div>
              <div className="text-[11px] sm:text-xs text-[#FDE8EE]/70">{t('footerCodSub')}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#E26886]/20 text-[#F4A6B8] flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-white">{t('footerGiftTitle')}</div>
              <div className="text-[11px] sm:text-xs text-[#FDE8EE]/70">{t('footerGiftSub')}</div>
            </div>
          </div>

        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-black p-0.5 border border-[#F4A6B8]/40 overflow-hidden">
                <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wider text-white block">
                  S&amp;S ACCESSORIES
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#F4A6B8] font-medium">
                  {t('brandSubtitle')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FDE8EE]/75 leading-relaxed max-w-sm">
              {t('footerAbout')}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#E5C387]">
              <Crown className="w-4 h-4" />
              <span>{t('footerQuality')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-serif font-bold text-sm tracking-wider uppercase text-white">
              {t('catalogTitle')}
            </div>
            <ul className="space-y-2 text-xs text-[#FDE8EE]/80">
              <li>
                <button
                  onClick={() => handleCategoryClick('packs')}
                  className="hover:text-[#F4A6B8] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#E26886]">✦</span>
                  <span>{t('packs')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('colliers')}
                  className="hover:text-[#F4A6B8] transition-colors"
                >
                  {t('colliers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('bracelets')}
                  className="hover:text-[#F4A6B8] transition-colors"
                >
                  {t('bracelets')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('montres')}
                  className="hover:text-[#F4A6B8] transition-colors"
                >
                  {t('montres')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('bagues')}
                  className="hover:text-[#F4A6B8] transition-colors"
                >
                  {t('bagues')}
                </button>
              </li>
            </ul>
          </div>

          {/* Custom Pack Studio Shortcut */}
          <div className="lg:col-span-4 space-y-4">
            <div className="font-serif font-bold text-sm tracking-wider uppercase text-white">
              {t('footerPacksTitle')}
            </div>

            <p className="text-xs text-[#FDE8EE]/75">
              {t('footerPacksDesc')}
            </p>

            <button
              onClick={() => setIsPackBuilderOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E26886] to-[#872B44] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span>{t('footerOpenStudio')}</span>
            </button>

            <div className="pt-1 text-[11px] text-[#FDE8EE]/60 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#F4A6B8]" />
              <span>{t('footerLocation')}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright (ZERO admin link here) */}
        <div className="pt-8 border-t border-[#F8B4C5]/15 flex items-center justify-between gap-4 text-xs text-[#FDE8EE]/60">
          <div>
            &copy; {new Date().getFullYear()} <strong>S&amp;S ACCESSORIES</strong> &bull; {t('footerRights')}
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#FDE8EE] transition-colors"
            title="Haut de page"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
