import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Search, Sparkles, Menu, X, Globe, Heart, Shield, Crown } from 'lucide-react';

export const Navbar = () => {
  const {
    language,
    setLanguage,
    t,
    isRTL,
    cartCount,
    setIsCartOpen,
    setIsPackBuilderOpen,
    activeCategoryFilter,
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'all', label: t('all') },
    { id: 'packs', label: t('packs'), isSpecial: true },
    { id: 'colliers', label: t('colliers') },
    { id: 'bracelets', label: t('bracelets') },
    { id: 'montres', label: t('montres') },
    { id: 'bagues', label: t('bagues') },
  ];

  const handleNavClick = (catId) => {
    setActiveCategoryFilter(catId);
    setIsMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1A1214] via-[#351A23] to-[#1A1214] text-[#FDE8EE] py-2 px-3 text-[10.5px] sm:text-xs font-medium tracking-wider text-center border-b border-[#F8B4C5]/20 relative z-40 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden md:flex items-center gap-1.5 text-[#E5C387] text-[11px] tracking-widest font-semibold uppercase">
            <Crown className="w-3 h-3" />
            <span>{t('topTagline')}</span>
          </div>
          
          <div className="mx-auto flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E26886] animate-ping shrink-0" />
            <span className="text-[#FFF5F7] truncate">
              {t('topAnnouncement')}
            </span>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-[11px] font-bold text-[#E5C387] hover:text-white px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all shrink-0 active:scale-95"
            aria-label="Changer de langue"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
          </button>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F8B4C5]/30 shadow-xs transition-all w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Left: Mobile Menu & Search Icon */}
            <div className="flex items-center lg:hidden gap-1 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-[#1E1618] hover:bg-[#FDE8EE]/50 transition-colors active:scale-95"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-[#872B44]" /> : <Menu className="w-5 h-5 text-[#872B44]" />}
              </button>
              
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full text-[#1E1618] hover:bg-[#FDE8EE]/50 transition-colors active:scale-95"
                aria-label="Recherche"
              >
                <Search className="w-5 h-5 text-[#872B44]" />
              </button>
            </div>

            {/* Brand Logo & Title (Centered on mobile, left on desktop) */}
            <div className="flex items-center justify-center lg:justify-start flex-1 lg:flex-initial">
              <a href="#" className="flex items-center gap-2 sm:gap-3 group">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black p-0.5 shadow-md ring-2 ring-[#F4A6B8]/40 group-hover:ring-[#E26886] transition-all overflow-hidden flex items-center justify-center">
                    <img
                      src="/logo.jpg"
                      alt="S&S ACCESSORIES Logo"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#E26886] text-white rounded-full flex items-center justify-center text-[7px] font-bold shadow-xs">
                    ✦
                  </span>
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-display text-base sm:text-2xl font-bold tracking-wider text-[#1E1618] group-hover:text-[#872B44] transition-colors leading-tight whitespace-nowrap">
                    S&amp;S ACCESSORIES
                  </span>
                  <span className="text-[8px] sm:text-[10px] tracking-widest uppercase text-[#A2324F] font-semibold font-sans whitespace-nowrap hidden xs:block">
                    {t('brandSubtitle')}
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeCategoryFilter === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative ${
                      isActive
                        ? 'bg-[#FDE8EE] text-[#872B44] font-semibold shadow-xs'
                        : 'text-[#4A3B3E] hover:text-[#872B44] hover:bg-[#FFF5F7]'
                    } ${link.isSpecial ? 'ring-1 ring-[#F4A6B8]/60 text-[#872B44]' : ''}`}
                  >
                    {link.isSpecial && (
                      <span className={`inline-block w-1.5 h-1.5 rounded-full bg-[#E26886] ${isRTL ? 'ml-1.5' : 'mr-1.5'} animate-pulse`} />
                    )}
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions (Desktop & Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              
              {/* Desktop Search Input */}
              <div className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-36 lg:w-44 ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 text-xs bg-[#FFF5F7] border border-[#F8B4C5]/40 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E26886]/50 focus:w-52 transition-all`}
                />
                <Search className={`w-3.5 h-3.5 text-[#A2324F] absolute ${isRTL ? 'right-2.5' : 'left-2.5'} pointer-events-none`} />
              </div>

              {/* "Crée Ton Pack" Button (Desktop) */}
              <button
                onClick={() => setIsPackBuilderOpen(true)}
                className="hidden sm:flex relative group overflow-hidden rounded-full bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:brightness-105 active:scale-95 transition-all items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FDE8EE]" />
                <span className="relative z-10">{t('customPackBtn')}</span>
                <span className="relative z-10 bg-white/20 text-[10px] uppercase px-1.5 py-0.5 rounded-full font-bold">
                  {t('customPackBadge')}
                </span>
              </button>

              {/* Cart Drawer Trigger Button (Engineered so badge never cuts off on iPhone) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 sm:p-2.5 rounded-full bg-[#FFF0F4] hover:bg-[#FDE8EE] border border-[#F8B4C5]/60 text-[#872B44] transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0 flex items-center justify-center mr-1"
                aria-label="Mon Panier"
              >
                <ShoppingBag className="w-5 h-5 text-[#872B44]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#872B44] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-enter">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Dropdown */}
          {isSearchOpen && (
            <div className="py-2.5 px-2 md:hidden border-t border-[#F8B4C5]/20 animate-enter">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-xs sm:text-sm bg-[#FFF5F7] border border-[#F8B4C5]/60 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E26886]`}
                  autoFocus
                />
                <Search className={`w-4 h-4 text-[#872B44] absolute ${isRTL ? 'right-3' : 'left-3'} top-2.5`} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-[#F8B4C5]/30 px-4 pt-2 pb-6 space-y-2 shadow-2xl animate-enter">
            <div className="flex items-center justify-between px-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A2324F]">
                {t('catalogTitle')}
              </span>
              <button
                onClick={toggleLanguage}
                className="text-xs font-bold text-[#872B44] px-3 py-1 rounded-full bg-[#FFF0F4] border border-[#F4A6B8]/50 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'العربية' : 'Français'}</span>
              </button>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl flex items-center justify-between ${
                  activeCategoryFilter === link.id
                    ? 'bg-[#FDE8EE] text-[#872B44] font-bold'
                    : 'text-[#3E2D32] hover:bg-[#FFF5F7]'
                }`}
              >
                <span>{link.label}</span>
                {link.isSpecial && (
                  <span className="text-[10px] bg-[#E26886] text-white px-2 py-0.5 rounded-full uppercase">
                    {t('packs')}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-3 border-t border-[#F8B4C5]/20">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPackBuilderOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('bannerCustomBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile / iPhone Thumb Zone */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#F8B4C5]/40 shadow-2xl py-2 px-4 sm:hidden flex items-center justify-around safe-area-bottom">
        
        {/* Collections */}
        <button
          onClick={() => {
            setActiveCategoryFilter('all');
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-0.5 text-[#544449] hover:text-[#872B44] active:scale-95 transition-all"
        >
          <Crown className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">{t('all')}</span>
        </button>

        {/* Highlighted Center: Custom Pack Studio Button */}
        <button
          onClick={() => setIsPackBuilderOpen(true)}
          className="relative -top-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white shadow-lg shadow-[#872B44]/30 flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#FDE8EE] animate-pulse" />
          <span className="text-xs font-bold">{t('customPackBtn')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 text-[#544449] hover:text-[#872B44] active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">{t('myCart')}</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#872B44] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </>
  );
};
