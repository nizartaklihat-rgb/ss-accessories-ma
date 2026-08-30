import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { MOROCCAN_CITIES } from '../data/moroccanCities';
import { TRANSLATIONS } from '../data/translations';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  fetchCloudProducts,
  upsertCloudProduct,
  deleteCloudProduct,
  fetchCloudOrders,
  insertCloudOrder,
  updateCloudOrderStatus,
  deleteCloudOrder,
  syncAllToCloud
} from '../lib/supabaseClient';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

export const StoreProvider = ({ children }) => {
  // 1. LANGUAGE STATE (FR / AR)
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('ss_accessories_lang') || 'fr';
    } catch (e) {
      return 'fr';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('ss_accessories_lang', language);
      document.documentElement.lang = language;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    } catch (e) {}
  }, [language, isRTL]);

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.fr;
    return langDict[key] || TRANSLATIONS.fr[key] || key;
  };

  // 2. PRODUCTS STATE (With Supabase Cloud Sync)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_accessories_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(isSupabaseConfigured() ? 'connected' : 'local');

  // Load from Supabase on mount
  useEffect(() => {
    const loadFromCloud = async () => {
      if (isSupabaseConfigured()) {
        setIsCloudSyncing(true);
        const cloudProducts = await fetchCloudProducts();
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          localStorage.setItem('ss_accessories_products', JSON.stringify(cloudProducts));
        } else if (cloudProducts && cloudProducts.length === 0) {
          // If Supabase table is empty, seed it with initial products!
          await syncAllToCloud(products);
        }
        setIsCloudSyncing(false);
        setCloudStatus('connected');
      } else {
        setCloudStatus('local');
      }
    };
    loadFromCloud();
  }, []);

  // Supabase Realtime Listener (Instant update across Phone & PC)
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const channel = supabase
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
          const fresh = await fetchCloudProducts();
          if (fresh && fresh.length > 0) {
            setProducts(fresh);
            localStorage.setItem('ss_accessories_products', JSON.stringify(fresh));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {}
  }, [cloudStatus]);

  useEffect(() => {
    try {
      localStorage.setItem('ss_accessories_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // 3. CART STATE
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_accessories_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ss_accessories_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // 4. ORDERS STATE (Database for Admin with Cloud Sync)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_accessories_orders');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const loadOrders = async () => {
      if (isSupabaseConfigured()) {
        const cloudOrders = await fetchCloudOrders();
        if (cloudOrders) {
          setOrders(cloudOrders);
        }
      }
    };
    loadOrders();
  }, [cloudStatus]);

  useEffect(() => {
    try {
      localStorage.setItem('ss_accessories_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // 5. SETTINGS STATE
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      whatsappNumber: '212617247930',
      adminPin: '1234',
      deliveryRates: {
        Casablanca: 20,
        Mohammedia: 25,
        Rabat: 35,
        Marrakech: 35,
        Tanger: 35,
        Fès: 35,
        Agadir: 35,
        Autres: 35
      },
      noFreeDelivery: true
    };
    try {
      const saved = localStorage.getItem('ss_accessories_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ss_accessories_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // 6. CUSTOM PACK BUILDER STATE
  const [customPack, setCustomPack] = useState({
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

  // 7. UI MODAL STATES & DEDICATED ADMIN ROUTE
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPackBuilderOpen, setIsPackBuilderOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check URL for separate admin portal access
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      return path.includes('/admin') || search.includes('admin=true') || hash === '#admin';
    }
    return false;
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      setIsAdminRoute(path.includes('/admin') || search.includes('admin=true') || hash === '#admin');
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const openAdminPortal = () => {
    window.location.hash = '#admin';
    setIsAdminRoute(true);
  };

  const closeAdminPortal = () => {
    window.location.hash = '';
    setIsAdminRoute(false);
  };

  // 8. CART HELPER FUNCTIONS
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && !item.isCustomPack);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && !item.isCustomPack
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const addCustomPackToCart = (packData) => {
    const packItems = [
      packData.collier,
      packData.bracelet,
      packData.bague,
      packData.montre
    ].filter(Boolean);

    if (packItems.length === 0) return false;

    const totalPackPrice = packItems.reduce((sum, item) => sum + item.price, 0);

    const packTitle = language === 'ar'
      ? `صندوق مجوهراتي المخصص (${packItems.length} قطع)`
      : `Mon Coffret Sur Mesure S&S (${packItems.length} Bijoux)`;

    const customPackItem = {
      id: `custom-pack-${Date.now()}`,
      isCustomPack: true,
      name: packTitle,
      category: 'packs',
      price: totalPackPrice,
      originalPrice: totalPackPrice,
      quantity: 1,
      image: packData.montre?.image || packData.collier?.image || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      packDetails: {
        collier: packData.collier,
        bracelet: packData.bracelet,
        bague: packData.bague,
        montre: packData.montre,
        boxColor: packData.boxColor,
        ribbonColor: packData.ribbonColor,
        giftMessage: packData.giftMessage,
        giftRecipient: packData.giftRecipient,
        itemsCount: packItems.length
      }
    };

    setCart(prev => [...prev, customPackItem]);
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 9. TOTALS CALCULATION
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getDeliveryFeeForCity = (cityName) => {
    const cityObj = MOROCCAN_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (cityObj) return cityObj.fee;
    if (cityName.toLowerCase().includes('casa')) return settings.deliveryRates?.Casablanca || 20;
    return settings.deliveryRates?.Autres || 35;
  };

  const currentDeliveryFee = getDeliveryFeeForCity(selectedCity);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + currentDeliveryFee : 0;

  // 10. PRODUCT ACTIONS (ADMIN + SUPABASE CLOUD)
  const addProduct = async (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      stock: Number(newProduct.stock) || 10,
      price: Number(newProduct.price) || 100,
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price),
    };
    setProducts(prev => [productWithId, ...prev]);

    // Save to Supabase Cloud
    if (isSupabaseConfigured()) {
      await upsertCloudProduct(productWithId);
    }
  };

  const editProduct = async (updatedProduct) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );

    // Save to Supabase Cloud
    if (isSupabaseConfigured()) {
      await upsertCloudProduct(updatedProduct);
    }
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Delete from Supabase Cloud
    if (isSupabaseConfigured()) {
      await deleteCloudProduct(productId);
    }
  };

  const toggleProductStock = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const updated = { ...target, inStock: target.inStock === false ? true : false };
    setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));

    if (isSupabaseConfigured()) {
      await upsertCloudProduct(updated);
    }
  };

  const resetToDefaultProducts = async () => {
    setProducts(INITIAL_PRODUCTS);
    if (isSupabaseConfigured()) {
      await syncAllToCloud(INITIAL_PRODUCTS);
    }
  };

  // 11. PLACE ORDER & DISPATCH TO WHATSAPP (Bilingual Formatter + Supabase DB)
  const placeOrder = async (orderData) => {
    const orderId = `SS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      customerName: orderData.fullName,
      customerPhone: orderData.phone,
      city: orderData.city,
      address: orderData.address,
      note: orderData.note || 'Aucune note particulière',
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: getDeliveryFeeForCity(orderData.city),
      total: cartSubtotal + getDeliveryFeeForCity(orderData.city),
      status: 'Nouveau',
      createdAt: new Date().toISOString()
    };

    // Save locally
    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);

    // Save to Supabase Cloud DB
    if (isSupabaseConfigured()) {
      await insertCloudOrder(newOrder);
    }

    // Format Structured WhatsApp Order Text based on language
    let waMessage = '';
    if (language === 'ar') {
      waMessage += `✨ *طلب جديد — S&S ACCESSORIES* ✨\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📋 *رقم الطلب :* #${newOrder.id}\n`;
      waMessage += `👤 *الاسم :* ${newOrder.customerName}\n`;
      waMessage += `📱 *الهاتف :* ${newOrder.customerPhone}\n`;
      waMessage += `📍 *المدينة :* ${newOrder.city}\n`;
      waMessage += `🏠 *العنوان الكامل :* ${newOrder.address}\n`;
      if (newOrder.note && newOrder.note.trim() !== '') {
        waMessage += `💌 *ملاحظة / رسالة هدية :* ${newOrder.note}\n`;
      }
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `🛍️ *تفاصيل القطع المطلوبة :*\n\n`;

      newOrder.items.forEach((item, index) => {
        if (item.isCustomPack) {
          waMessage += `🎁 *${index + 1}. ${item.name}* (الكمية: ${item.quantity})\n`;
          waMessage += `   • السعر : ${item.price} درهم\n`;
          if (item.packDetails.collier) waMessage += `   - السلسلة : ${item.packDetails.collier.name} (${item.packDetails.collier.price} درهم)\n`;
          if (item.packDetails.bracelet) waMessage += `   - الإسوارة : ${item.packDetails.bracelet.name} (${item.packDetails.bracelet.price} درهم)\n`;
          if (item.packDetails.bague) waMessage += `   - الخاتم : ${item.packDetails.bague.name} (${item.packDetails.bague.price} درهم)\n`;
          if (item.packDetails.montre) waMessage += `   - الساعة : ${item.packDetails.montre.name} (${item.packDetails.montre.price} درهم)\n`;
          if (item.packDetails.giftMessage) waMessage += `   - بطاقة الإهداء : "${item.packDetails.giftMessage}"\n`;
        } else {
          waMessage += `💎 *${index + 1}. ${item.name}*\n`;
          waMessage += `   • الكمية : ${item.quantity} | السعر : ${item.price} درهم | المجموع : ${item.price * item.quantity} درهم\n`;
        }
        waMessage += `\n`;
      });

      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `💰 *مجموع المجوهرات :* ${newOrder.subtotal} درهم\n`;
      waMessage += `🚚 *مصاريف التوصيل (${newOrder.city}) :* ${newOrder.deliveryFee} درهم\n`;
      waMessage += `👑 *المبلغ الإجمالي للدفع عند الاستلام :* ${newOrder.total} درهم (نقدًا)\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📦 *الحالة :* تم تسجيل الطلب وجارٍ تجهيزه.`;
    } else {
      waMessage += `✨ *NOUVELLE COMMANDE S&S ACCESSORIES* ✨\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📋 *Réf. Commande :* #${newOrder.id}\n`;
      waMessage += `👤 *Client :* ${newOrder.customerName}\n`;
      waMessage += `📱 *Téléphone :* ${newOrder.customerPhone}\n`;
      waMessage += `📍 *Ville :* ${newOrder.city}\n`;
      waMessage += `🏠 *Adresse de Livraison :* ${newOrder.address}\n`;
      if (newOrder.note && newOrder.note.trim() !== '') {
        waMessage += `💌 *Note/Message Cadeau :* ${newOrder.note}\n`;
      }
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `🛍️ *DÉTAIL DES ARTICLES :*\n\n`;

      newOrder.items.forEach((item, index) => {
        if (item.isCustomPack) {
          waMessage += `🎁 *${index + 1}. ${item.name}* (x${item.quantity})\n`;
          waMessage += `   • Prix : ${item.price} DH\n`;
          if (item.packDetails.collier) waMessage += `   - Collier : ${item.packDetails.collier.name} (${item.packDetails.collier.price} DH)\n`;
          if (item.packDetails.bracelet) waMessage += `   - Bracelet : ${item.packDetails.bracelet.name} (${item.packDetails.bracelet.price} DH)\n`;
          if (item.packDetails.bague) waMessage += `   - Bague : ${item.packDetails.bague.name} (${item.packDetails.bague.price} DH)\n`;
          if (item.packDetails.montre) waMessage += `   - Montre : ${item.packDetails.montre.name} (${item.packDetails.montre.price} DH)\n`;
          if (item.packDetails.giftMessage) waMessage += `   - Carte : "${item.packDetails.giftMessage}"\n`;
        } else {
          waMessage += `💎 *${index + 1}. ${item.name}*\n`;
          waMessage += `   • Quantité : ${item.quantity} | Prix : ${item.price} DH | Total : ${item.price * item.quantity} DH\n`;
        }
        waMessage += `\n`;
      });

      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `💰 *Sous-total Bijoux :* ${newOrder.subtotal} DH\n`;
      waMessage += `🚚 *Frais de Livraison (${newOrder.city}) :* ${newOrder.deliveryFee} DH\n`;
      waMessage += `👑 *MONTANT TOTAL À PAYER :* ${newOrder.total} DH (Paiement à la livraison)\n`;
      waMessage += `━━━━━━━━━━━━━━━━━━━━━\n`;
      waMessage += `📦 *Statut :* Commande enregistrée, en cours de préparation.`;
    }

    const encodedMessage = encodeURIComponent(waMessage);
    const targetWhatsAppUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodedMessage}`;

    window.open(targetWhatsAppUrl, '_blank');

    clearCart();
    setIsCheckoutOpen(false);

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (isSupabaseConfigured()) {
      await updateCloudOrderStatus(orderId, newStatus);
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (isSupabaseConfigured()) {
      await deleteCloudOrder(orderId);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        products,
        addProduct,
        editProduct,
        deleteProduct,
        toggleProductStock,
        resetToDefaultProducts,
        cart,
        addToCart,
        addCustomPackToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        cartTotal,
        currentDeliveryFee,
        selectedCity,
        setSelectedCity,
        getDeliveryFeeForCity,
        customPack,
        setCustomPack,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        settings,
        setSettings,
        // UI states
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isPackBuilderOpen,
        setIsPackBuilderOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        lastPlacedOrder,
        setLastPlacedOrder,
        activeCategoryFilter,
        setActiveCategoryFilter,
        searchQuery,
        setSearchQuery,
        // Admin separate routing
        isAdminRoute,
        openAdminPortal,
        closeAdminPortal,
        // Cloud state
        isCloudSyncing,
        cloudStatus,
        setCloudStatus
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
