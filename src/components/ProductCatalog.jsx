import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/moroccanCities';
import { 
  Sparkles, Eye, ShoppingBag, Gift, 
  Check, ArrowRight, Star 
} from 'lucide-react';

export const ProductCatalog = () => {
  const {
    t,
    isRTL,
    products,
    addToCart,
    setSelectedProductDetail,
    setIsPackBuilderOpen,
    activeCategoryFilter,
    setActiveCategoryFilter,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [sortBy, setSortBy] = useState('featured');
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategoryFilter === 'all' || product.category === activeCategoryFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.material && product.material.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, activeCategoryFilter, searchQuery, sortBy]);

  const handleAddToCartQuick = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1500);
  };

  return (
    <section id="catalog-section" className="py-10 sm:py-16 bg-[#FFF9FB] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Section Title & Subtitle */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#872B44] bg-[#FDE8EE] px-3 py-1 rounded-full border border-[#F4A6B8]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#E26886]" />
            <span>{t('catalogTag')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1E1618]">
            {t('catalogTitle')}
          </h2>

          <p className="text-xs sm:text-sm text-[#785C63] font-sans">
            {t('catalogDesc')}
          </p>
        </div>

        {/* Interactive Custom Pack Promotion Banner */}
        <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-r from-[#872B44] via-[#A2324F] to-[#E26886] text-white shadow-xl shadow-[#872B44]/15 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-[#FDE8EE]" />
              <span>{t('customPackBadge')}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#FFF5F7]">
              {t('bannerCustomTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#FDE8EE]/90 max-w-lg">
              {t('bannerCustomDesc')}
            </p>
          </div>

          <button
            onClick={() => setIsPackBuilderOpen(true)}
            className="relative z-10 shrink-0 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white text-[#872B44] hover:bg-[#FFF5F7] font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E26886]" />
            <span>{t('bannerCustomBtn')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Category Filter Tabs & Sort Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-[#F8B4C5]/30">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategoryFilter === cat.id;
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter(p => p.category === cat.id).length;

              const label = t(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#872B44] text-white font-semibold shadow-md'
                      : 'bg-white text-[#4A3B3E] hover:bg-[#FFF0F4] border border-[#F8B4C5]/40'
                  }`}
                >
                  {cat.id === 'packs' && <Gift className="w-3.5 h-3.5 text-[#E26886]" />}
                  <span>{label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#FDE8EE] text-[#872B44]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs">
            <span className="text-[#785C63] font-medium hidden sm:inline">{t('sortBy')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#F8B4C5]/50 text-[#1E1618] rounded-full px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#E26886] font-medium text-xs cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#F8B4C5]/30 p-8">
            <Sparkles className="w-10 h-10 text-[#E26886] mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-[#1E1618]">{t('noProductsFound')}</h3>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full bg-[#872B44] text-white text-xs font-semibold"
            >
              {t('viewAllProducts')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => {
              const isPack = product.category === 'packs';
              const isAdded = addedAnimationId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductDetail(product)}
                  className={`group relative rounded-2xl sm:rounded-3xl bg-white border border-[#F8B4C5]/40 hover:border-[#872B44]/60 p-2.5 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isPack ? 'ring-1 ring-[#F4A6B8]/50 bg-gradient-to-b from-white to-[#FFF5F7]' : ''
                  }`}
                >
                  {/* Top Image Frame */}
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-square bg-[#FDF2F5] mb-2.5 sm:mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-[#1E1618]/85 backdrop-blur-xs text-[#FDE8EE] text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Pack Marker */}
                    {isPack && (
                      <span className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-[#E26886] text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1`}>
                        <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{t('packs')}</span>
                      </span>
                    )}

                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductDetail(product);
                        }}
                        className="p-2 sm:p-3 bg-white text-[#872B44] rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
                        title={t('quickView')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata */}
                  <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#A2324F]">
                          {t(product.category) || product.category}
                        </span>
                        <div className="flex items-center gap-1 text-[#D4AF37]">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] sm:text-[11px] font-bold text-[#544449]">
                            {product.rating || '5.0'}
                          </span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h3 className="font-serif font-bold text-xs sm:text-base lg:text-lg text-[#1E1618] group-hover:text-[#872B44] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-[10px] sm:text-xs text-[#785C63] line-clamp-2 mt-0.5 leading-relaxed hidden sm:block">
                        {product.description}
                      </p>

                      {/* If Pack: Show items included */}
                      {product.itemsIncluded && (
                        <div className="mt-1.5 pt-1.5 border-t border-[#F8B4C5]/30">
                          <div className="text-[9px] sm:text-[10px] uppercase font-bold text-[#872B44] mb-0.5">
                            {t('contentsIncluded')}
                          </div>
                          <ul className="text-[10px] text-[#544449] space-y-0.5">
                            {product.itemsIncluded.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1 truncate">
                                <span className="w-1 h-1 rounded-full bg-[#E26886] shrink-0" />
                                <span className="truncate">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Price and Add CTA */}
                    <div className="pt-2 sm:pt-3 border-t border-[#F8B4C5]/20 flex items-center justify-between">
                      <div>
                        {product.originalPrice && (
                          <div className="text-[10px] sm:text-xs text-[#9B7C84] line-through">
                            {product.originalPrice} DH
                          </div>
                        )}
                        <div className="font-serif font-bold text-sm sm:text-xl text-[#1E1618]">
                          {product.price} <span className="text-[10px] sm:text-xs font-sans font-bold text-[#872B44]">DH</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCartQuick(e, product)}
                        className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 shadow-xs transition-all ${
                          isAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-[#FFF0F4] text-[#872B44] hover:bg-[#872B44] hover:text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>{t('added')}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span className="hidden sm:inline">{t('addToCart')}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
