import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Lock, KeyRound, X, Plus, Edit2, Trash2, Upload, 
  Image as ImageIcon, CheckCircle, Clock, Truck, 
  Phone, MessageSquare, Save, Settings, Package, 
  ShoppingBag, ArrowLeft, Database, Check, RefreshCw,
  Cloud, CloudOff, AlertCircle, ExternalLink, Smartphone, Monitor
} from 'lucide-react';
import {
  saveSupabaseConfig,
  getSupabaseConfig,
  isSupabaseConfigured,
  uploadImageToSupabase,
  syncAllToCloud,
  fetchCloudProducts
} from '../lib/supabaseClient';

export const AdminPortal = () => {
  const {
    products,
    addProduct,
    editProduct,
    deleteProduct,
    toggleProductStock,
    resetToDefaultProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    settings,
    setSettings,
    closeAdminPortal,
    isCloudSyncing,
    cloudStatus,
    setCloudStatus
  } = useStore();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin View
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'settings' | 'supabase'

  // Product Modal State (Add or Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'colliers',
    price: 150,
    originalPrice: 190,
    badge: 'Nouveau',
    description: '',
    material: 'Acier Inoxydable 316L & Plaqué Or Rose 18K',
    length: '40 cm + 5 cm réglable',
    image: '',
    stock: 10,
    inStock: true
  });

  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Orders Search & Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Supabase Configuration Form
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: '',
    key: ''
  });
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState({
    loading: false,
    message: '',
    type: '' // 'success' | 'error' | ''
  });

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseConfig(config);
  }, []);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber || '212617247930',
    adminPin: settings.adminPin || '1234',
    casaFee: settings.deliveryRates?.Casablanca || 20,
    mohammediaFee: settings.deliveryRates?.Mohammedia || 25,
    autreFee: settings.deliveryRates?.Autres || 35
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Authentication Check
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (enteredPin === settings.adminPin || enteredPin === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Code PIN incorrect. Veuillez réessayer.');
    }
  };

  // Image File Upload Handler (Supabase Storage Cloud Upload with Base64 Fallback)
  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingImage(true);

    try {
      // 1. Try uploading to Supabase Storage if configured
      if (isSupabaseConfigured()) {
        const publicUrl = await uploadImageToSupabase(file);
        if (publicUrl) {
          setImagePreview(publicUrl);
          setProductForm(prev => ({ ...prev, image: publicUrl }));
          setIsUploadingImage(false);
          return;
        }
      }

      // 2. Fallback to Local Base64 reader
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setImagePreview(base64Url);
        setProductForm(prev => ({ ...prev, image: base64Url }));
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload error:', err);
      setIsUploadingImage(false);
    }
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      category: 'colliers',
      price: 180,
      originalPrice: 220,
      badge: 'Nouveau',
      description: 'Pièce raffinée en acier inoxydable 316L avec finition or rose 18k.',
      material: 'Acier Inoxydable 316L & Plaqué Or Rose 18K',
      length: 'Ajustable',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      stock: 12,
      inStock: true
    });
    setImagePreview('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80');
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.25),
      badge: prod.badge || '',
      description: prod.description || '',
      material: prod.material || '',
      length: prod.length || '',
      image: prod.image,
      stock: prod.stock || 10,
      inStock: prod.inStock !== false
    });
    setImagePreview(prod.image);
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Veuillez renseigner le nom du bijou.');
      return;
    }

    if (editingProductId) {
      await editProduct({
        id: editingProductId,
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock)
      });
    } else {
      await addProduct({
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        stock: Number(productForm.stock)
      });
    }

    setIsProductModalOpen(false);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      whatsappNumber: settingsForm.whatsappNumber,
      adminPin: settingsForm.adminPin,
      deliveryRates: {
        ...prev.deliveryRates,
        Casablanca: Number(settingsForm.casaFee),
        Mohammedia: Number(settingsForm.mohammediaFee),
        Autres: Number(settingsForm.autreFee)
      }
    }));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Save Supabase Configuration and Sync
  const handleSaveSupabaseConfig = async (e) => {
    e.preventDefault();
    setSupabaseSyncStatus({ loading: true, message: 'Connexion à Supabase...', type: '' });

    try {
      saveSupabaseConfig(supabaseConfig.url, supabaseConfig.key);
      const isConnected = isSupabaseConfigured();

      if (isConnected) {
        setCloudStatus('connected');
        // Test sync
        const syncRes = await syncAllToCloud(products);
        if (syncRes.success) {
          setSupabaseSyncStatus({
            loading: false,
            message: `✓ Connecté avec succès ! ${products.length} bijoux synchronisés dans le Cloud Supabase. Vos modifications sur PC et Téléphone sont maintenant liées en temps réel.`,
            type: 'success'
          });
        } else {
          setSupabaseSyncStatus({
            loading: false,
            message: `Connexion établie mais la table 'products' est inaccessible. Avez-vous exécuté le script SQL fourni ci-dessous ?`,
            type: 'error'
          });
        }
      } else {
        setSupabaseSyncStatus({
          loading: false,
          message: 'URL ou Clé Anon Supabase invalide.',
          type: 'error'
        });
      }
    } catch (err) {
      setSupabaseSyncStatus({
        loading: false,
        message: `Erreur : ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleManualSyncToCloud = async () => {
    setSupabaseSyncStatus({ loading: true, message: 'Synchronisation en cours...', type: '' });
    const res = await syncAllToCloud(products);
    if (res.success) {
      setSupabaseSyncStatus({
        loading: false,
        message: `✓ Synchronisation réussie ! ${products.length} bijoux sont à jour sur tous vos appareils.`,
        type: 'success'
      });
    } else {
      setSupabaseSyncStatus({
        loading: false,
        message: 'Échec de synchronisation. Vérifiez vos identifiants Supabase.',
        type: 'error'
      });
    }
  };

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#1E1618] text-white flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="px-4 sm:px-6 py-3.5 bg-[#140E10] border-b border-[#F8B4C5]/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E1618] p-0.5 border border-[#F4A6B8]/50 overflow-hidden shadow-inner shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-base sm:text-lg font-bold tracking-wide text-[#FFF5F7]">
                Portail Administrateur &bull; S&amp;S ACCESSORIES
              </h1>
              <span className="bg-[#872B44] text-[#FDE8EE] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Privé
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#FDE8EE]/70">
              <span className="flex items-center gap-1">
                {isSupabaseConfigured() ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Cloud Supabase Actif (Synchro Phone &amp; PC)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-300 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    Stockage Local (Non relié au Cloud)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Return to Storefront */}
        <button
          onClick={closeAdminPortal}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF5F7] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour à la Boutique</span>
          <span className="sm:hidden">Boutique</span>
        </button>
      </header>

      {/* Auth Gate if Not Logged In */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#251A1E] border border-[#F8B4C5]/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#872B44] text-[#FDE8EE] flex items-center justify-center mx-auto shadow-lg border border-[#F4A6B8]/30">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-white">
                Authentification Administrateur
              </h2>
              <p className="text-xs text-[#FDE8EE]/70">
                Veuillez entrer votre code PIN secret pour déverrouiller la gestion.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Code PIN (Défaut: 1234)"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full text-center text-2xl tracking-widest px-4 py-3.5 rounded-2xl bg-[#170F12] border border-[#F8B4C5]/40 focus:outline-none focus:ring-2 focus:ring-[#E26886] font-bold text-white shadow-inner"
                  autoFocus
                />
                {authError && <p className="text-xs text-red-400 mt-2 font-semibold">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#872B44] to-[#E26886] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Accéder au Panneau
              </button>
            </form>

            <div className="text-[11px] text-[#FDE8EE]/50">
              Code PIN par défaut : <strong className="text-[#F4A6B8]">1234</strong>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="flex-1 overflow-y-auto bg-[#FFF9FA] text-[#1E1618] flex flex-col">
          
          {/* Navigation Bar */}
          <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#F8B4C5]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#872B44] text-white shadow-xs'
                    : 'bg-[#FFF0F4] text-[#872B44] hover:bg-[#FDE8EE]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Bijoux ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#872B44] text-white shadow-xs'
                    : 'bg-[#FFF0F4] text-[#872B44] hover:bg-[#FDE8EE]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Commandes ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                  activeTab === 'supabase'
                    ? 'bg-[#872B44] text-white shadow-xs'
                    : 'bg-[#FFF0F4] text-[#872B44] hover:bg-[#FDE8EE]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Synchro Cloud Supabase</span>
                {isSupabaseConfigured() && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#872B44] text-white shadow-xs'
                    : 'bg-[#FFF0F4] text-[#872B44] hover:bg-[#FDE8EE]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Tarifs &amp; Paramètres</span>
              </button>
            </div>

            {activeTab === 'products' && (
              <div className="flex items-center gap-2">
                {isSupabaseConfigured() && (
                  <button
                    onClick={handleManualSyncToCloud}
                    disabled={isCloudSyncing}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#F4A6B8] text-[#872B44] text-xs font-semibold hover:bg-[#FFF0F4] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                    <span>Synchroniser</span>
                  </button>
                )}
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#872B44] to-[#E26886] text-white text-xs font-semibold shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Bijou</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
              
              {/* Cloud Sync Banner if not connected */}
              {!isSupabaseConfigured() && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-amber-900">
                  <div className="flex items-center gap-3">
                    <CloudOff className="w-6 h-6 text-amber-600 shrink-0" />
                    <div className="text-xs">
                      <strong className="block text-sm font-serif text-amber-950">
                        Synchronisation Multi-Appareils Désactivée
                      </strong>
                      Vos ajouts et modifications ne sont enregistrés que sur ce navigateur. Pour modifier vos bijoux depuis votre téléphone et que votre PC se mette à jour instantanément, connectez Supabase.
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('supabase')}
                    className="px-4 py-2 rounded-xl bg-[#872B44] text-white font-semibold text-xs shadow-xs hover:bg-[#6e2236] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Connecter Supabase Cloud
                  </button>
                </div>
              )}

              {/* Stats Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs">
                  <div className="text-xs text-[#785C63]">Total Modèles</div>
                  <div className="font-serif text-2xl font-bold text-[#1E1618]">{products.length}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs">
                  <div className="text-xs text-[#785C63]">Colliers &amp; Bracelets</div>
                  <div className="font-serif text-2xl font-bold text-[#872B44]">
                    {products.filter(p => p.category === 'colliers' || p.category === 'bracelets').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs">
                  <div className="text-xs text-[#785C63]">Montres &amp; Bagues</div>
                  <div className="font-serif text-2xl font-bold text-[#872B44]">
                    {products.filter(p => p.category === 'montres' || p.category === 'bagues').length}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs">
                  <div className="text-xs text-[#785C63]">Packs &amp; Ensembles</div>
                  <div className="font-serif text-2xl font-bold text-[#872B44]">
                    {products.filter(p => p.category === 'packs').length}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-[#F8B4C5]/40 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FFF0F4] text-[#872B44] uppercase tracking-wider font-bold border-b border-[#F8B4C5]/30">
                      <tr>
                        <th className="p-3.5">Aperçu</th>
                        <th className="p-3.5">Nom du Bijou</th>
                        <th className="p-3.5">Catégorie</th>
                        <th className="p-3.5">Prix (DH)</th>
                        <th className="p-3.5">Badge</th>
                        <th className="p-3.5">Disponibilité</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8B4C5]/20">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FFF8FA] transition-colors">
                          <td className="p-3.5">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-[#F8B4C5]/50 shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>

                          <td className="p-3.5 font-medium text-[#1E1618]">
                            <div className="font-serif font-bold text-sm">{p.name}</div>
                            <div className="text-[11px] text-[#785C63] line-clamp-1">{p.description}</div>
                          </td>

                          <td className="p-3.5 uppercase text-[11px] font-bold text-[#872B44]">
                            {p.category}
                          </td>

                          <td className="p-3.5 font-bold font-serif text-sm text-[#1E1618]">
                            {p.price} DH
                          </td>

                          <td className="p-3.5">
                            {p.badge ? (
                              <span className="bg-[#FFF0F4] text-[#872B44] px-2 py-0.5 rounded-full font-semibold text-[10px] border border-[#F4A6B8]/40">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => toggleProductStock(p.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                p.inStock !== false
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.inStock !== false ? 'En Stock' : 'Épuisé'}
                            </button>
                          </td>

                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg bg-[#FFF0F4] text-[#872B44] hover:bg-[#872B44] hover:text-white transition-colors cursor-pointer inline-flex items-center"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Voulez-vous supprimer "${p.name}" ?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer inline-flex items-center"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGER */}
          {activeTab === 'orders' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'Nouveau', 'En Préparation', 'Expédié', 'Livré', 'Annulé'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        orderStatusFilter === status
                          ? 'bg-[#872B44] text-white shadow-xs'
                          : 'bg-white text-[#544449] border border-[#F8B4C5]/40 hover:bg-[#FFF0F4]'
                      }`}
                    >
                      {status === 'all' ? 'Toutes les commandes' : status}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-[#785C63]">
                  Total commandes : <strong>{orders.length}</strong> &bull; CA : <strong>{totalRevenue} DH</strong>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#F8B4C5]/40 p-8">
                  <ShoppingBag className="w-10 h-10 text-[#E26886] mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-base text-[#1E1618]">Aucune commande pour le moment</h4>
                  <p className="text-xs text-[#785C63] mt-1">Les commandes passées par vos clients apparaîtront ici et sur votre WhatsApp.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl bg-white border border-[#F8B4C5]/40 shadow-xs space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F8B4C5]/20">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-[#872B44]">
                              #{order.id}
                            </span>
                            <span className="text-xs text-[#785C63]">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs font-bold px-3 py-1 rounded-full border border-gray-300 bg-white cursor-pointer"
                            >
                              <option value="Nouveau">Nouveau</option>
                              <option value="En Préparation">En Préparation</option>
                              <option value="Expédié">Expédié</option>
                              <option value="Livré">Livré</option>
                              <option value="Annulé">Annulé</option>
                            </select>

                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la commande #${order.id} ?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FFF8FA] p-3.5 rounded-xl border border-[#F8B4C5]/30">
                          <div>
                            <div className="text-[#785C63]">Client :</div>
                            <div className="font-bold text-[#1E1618] text-sm">{order.customerName}</div>
                          </div>
                          <div>
                            <div className="text-[#785C63]">Téléphone :</div>
                            <div className="font-bold text-[#872B44] flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{order.customerPhone}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[#785C63]">Ville :</div>
                            <div className="font-bold text-[#1E1618]">{order.city} (Livraison : {order.deliveryFee} DH)</div>
                          </div>
                          <div className="sm:col-span-3 pt-1">
                            <div className="text-[#785C63]">Adresse :</div>
                            <div className="font-medium text-[#1E1618]">{order.address}</div>
                            {order.note && (
                              <div className="mt-1 text-[#872B44] italic">
                                ✉ Note : {order.note}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="font-bold uppercase tracking-wider text-[#872B44] text-[10px]">
                            Articles :
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-white border border-[#F8B4C5]/30 flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-[#1E1618]">• {item.name}</span>
                                <span className="text-[#785C63] ml-2">(x{item.quantity})</span>
                                {item.isCustomPack && item.packDetails && (
                                  <div className="text-[11px] text-[#872B44] pl-3 mt-0.5 space-y-0.5">
                                    {item.packDetails.collier && <div>- Collier : {item.packDetails.collier.name}</div>}
                                    {item.packDetails.bracelet && <div>- Bracelet : {item.packDetails.bracelet.name}</div>}
                                    {item.packDetails.bague && <div>- Bague : {item.packDetails.bague.name}</div>}
                                    {item.packDetails.montre && <div>- Montre : {item.packDetails.montre.name}</div>}
                                  </div>
                                )}
                              </div>
                              <span className="font-bold font-serif text-sm text-[#872B44]">
                                {item.price * item.quantity} DH
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#F8B4C5]/20 gap-2">
                          <div>
                            <span className="text-xs text-[#785C63]">Total à payer à la livraison : </span>
                            <span className="font-serif font-bold text-lg text-[#1E1618]">{order.total} DH</span>
                          </div>

                          <a
                            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${order.customerName}, nous vous confirmons votre commande S&S ACCESSORIES (#${order.id}) d'un montant de ${order.total} DH.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contacter le client sur WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPABASE CLOUD SYNC */}
          {activeTab === 'supabase' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full text-xs">
              
              {/* Card 1: Configuration Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8B4C5]/40 shadow-xs space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#1E1618] flex items-center gap-2">
                      <Cloud className="w-6 h-6 text-[#872B44]" />
                      <span>Connexion Base de Données Supabase Cloud</span>
                    </h3>
                    <p className="text-[#785C63] mt-1 text-xs">
                      Permet de synchroniser instantanément vos bijoux, photos et commandes entre votre Téléphone, PC et le site public.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isSupabaseConfigured() ? '✓ Cloud Connecté' : 'Mode Hors-Ligne'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                      Project URL Supabase
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzabcdefghijklmnop.supabase.co"
                      value={supabaseConfig.url}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-xs font-mono font-medium text-[#1E1618]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                      Anon Public API Key
                    </label>
                    <input
                      type="text"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseConfig.key}
                      onChange={(e) => setSupabaseConfig({ ...supabaseConfig, key: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-xs font-mono font-medium text-[#1E1618]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={supabaseSyncStatus.loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#872B44] to-[#E26886] text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{supabaseSyncStatus.loading ? 'Connexion en cours...' : 'Enregistrer & Synchroniser'}</span>
                    </button>

                    {isSupabaseConfigured() && (
                      <button
                        type="button"
                        onClick={handleManualSyncToCloud}
                        disabled={supabaseSyncStatus.loading}
                        className="px-4 py-3 rounded-xl bg-white border border-[#872B44] text-[#872B44] font-semibold text-xs hover:bg-[#FFF0F4] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${supabaseSyncStatus.loading ? 'animate-spin' : ''}`} />
                        <span>Pousser tout le catalogue vers Supabase</span>
                      </button>
                    )}
                  </div>

                  {supabaseSyncStatus.message && (
                    <div className={`p-3.5 rounded-xl text-xs font-medium ${
                      supabaseSyncStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {supabaseSyncStatus.message}
                    </div>
                  )}
                </form>

                {/* Free Supabase Account reminder */}
                <div className="p-4 rounded-2xl bg-[#FFF0F4] border border-[#F4A6B8]/40 space-y-2">
                  <div className="font-bold text-[#872B44] text-xs flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" />
                    <span>Comment obtenir vos identifiants gratuits Supabase (1 minute) :</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[#544449] leading-relaxed">
                    <li>Rendez-vous sur <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#872B44] underline font-bold">supabase.com</a> et créez un projet gratuit (choisir région Europe/Frankfurt).</li>
                    <li>Dans <strong>Project Settings &gt; API</strong>, copiez l'<strong>URL</strong> et la <strong>anon public key</strong>, puis collez-les ci-dessus.</li>
                    <li>Ouvrez l'onglet <strong>SQL Editor</strong> dans Supabase et exécutez le script SQL ci-dessous en 1 clic.</li>
                  </ol>
                </div>
              </div>

              {/* Supabase SQL Script Box */}
              <div className="p-6 rounded-3xl bg-[#1E1618] text-[#FDE8EE] space-y-4 shadow-lg border border-[#F8B4C5]/30">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#E5C387] uppercase tracking-wider text-xs flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>Script SQL à exécuter dans Supabase SQL Editor</span>
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  badge text,
  description text,
  material text,
  length text,
  image text not null,
  stock integer default 10,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  note text,
  items jsonb not null,
  subtotal numeric not null,
  delivery_fee numeric not null,
  total numeric not null,
  status text default 'Nouveau',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

insert into storage.buckets (id, name, public) 
values ('jewelry-images', 'jewelry-images', true)
on conflict do nothing;

alter table products enable row level security;
alter table orders enable row level security;

create policy "Public Access Products" on products for all using (true) with check (true);
create policy "Public Access Orders" on orders for all using (true) with check (true);
create policy "Public Storage Upload" on storage.objects for all using (bucket_id = 'jewelry-images') with check (bucket_id = 'jewelry-images');`);
                      alert('Script SQL copié dans le presse-papier !');
                    }}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFF5F7] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Copier le Script SQL
                  </button>
                </div>
                
                <pre className="p-4 bg-black/60 rounded-2xl overflow-x-auto text-[11px] font-mono text-[#F4A6B8] leading-relaxed border border-white/5 max-h-64">
{`-- 1. Table des Bijoux
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  price numeric not null,
  original_price numeric,
  badge text,
  description text,
  material text,
  length text,
  image text not null,
  stock integer default 10,
  in_stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Table des Commandes
create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  note text,
  items jsonb not null,
  subtotal numeric not null,
  delivery_fee numeric not null,
  total numeric not null,
  status text default 'Nouveau',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Bucket de stockage photos
insert into storage.buckets (id, name, public) 
values ('jewelry-images', 'jewelry-images', true)
on conflict do nothing;

-- 4. Politiques d'accès ouvertes
alter table products enable row level security;
alter table orders enable row level security;

create policy "Public Access Products" on products for all using (true) with check (true);
create policy "Public Access Orders" on orders for all using (true) with check (true);
create policy "Public Storage Upload" on storage.objects for all using (bucket_id = 'jewelry-images') with check (bucket_id = 'jewelry-images');`}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto w-full text-xs">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8B4C5]/40 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1E1618]">
                    Paramètres de la Boutique S&amp;S ACCESSORIES
                  </h3>
                  <p className="text-xs text-[#785C63]">
                    Modifiez le numéro WhatsApp receveur, votre code PIN de sécurité et les tarifs de livraison par ville.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                      Numéro WhatsApp de Réception des Commandes
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-sm font-mono font-bold text-[#1E1618]"
                    />
                    <p className="text-[10px] text-[#785C63] mt-1">
                      Format international avec indicatif Maroc (Ex: 212617247930).
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                      Code PIN Administrateur
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={settingsForm.adminPin}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-sm font-mono font-bold text-[#1E1618]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#F8B4C5]/30">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                        Casablanca (DH)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.casaFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, casaFee: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-sm font-bold text-[#872B44]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                        Mohammedia (DH)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.mohammediaFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mohammediaFee: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-sm font-bold text-[#872B44]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                        Autres Villes (DH)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.autreFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, autreFee: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8B4C5]/60 bg-[#FFF8FA] text-sm font-bold text-[#872B44]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#872B44] to-[#E26886] text-white font-semibold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les Paramètres</span>
                    </button>
                    {settingsSaved && (
                      <p className="text-xs text-emerald-600 font-bold mt-2">
                        ✓ Paramètres mis à jour avec succès !
                      </p>
                    )}
                  </div>
                </form>

                <div className="pt-4 border-t border-[#F8B4C5]/30 flex items-center justify-between">
                  <span className="text-xs text-[#785C63]">Catalogue par défaut :</span>
                  <button
                    onClick={() => {
                      if (confirm('Réinitialiser le catalogue avec les 16 bijoux d’origine ?')) {
                        resetToDefaultProducts();
                        alert('Catalogue réinitialisé.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 text-xs hover:bg-red-50 cursor-pointer"
                  >
                    Réinitialiser les Produits
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL WITH IMAGE FILE UPLOAD */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-enter">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F8B4C5]/60 overflow-hidden max-h-[92vh] flex flex-col text-[#1E1618]">
            
            <div className="px-6 py-4 bg-[#1E1618] text-white flex items-center justify-between border-b border-[#F8B4C5]/20">
              <h3 className="font-serif font-bold text-lg text-[#FFF5F7]">
                {editingProductId ? 'Modifier le Bijou' : 'Ajouter un Nouveau Bijou'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-[#FDE8EE] hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-[#FFF8FA]">
              
              {/* Image Upload Box */}
              <div className="space-y-2">
                <label className="block font-bold uppercase tracking-wider text-[#1E1618]">
                  Photo du Bijou (Téléversement depuis votre appareil ou Supabase) <span className="text-[#872B44]">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-[#F8B4C5]/60 flex items-center justify-center shadow-xs">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#F4A6B8]" />
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-[11px] font-bold">
                        Téléversement...
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-8 space-y-2.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#FFF0F4] hover:bg-[#FDE8EE] border border-[#F4A6B8] text-[#872B44] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? 'Chargement...' : 'Choisir une Image (Depuis Mobile / PC)'}</span>
                    </button>

                    <div className="text-[10px] text-[#785C63]">
                      Ou collez une URL d'image directe :
                    </div>

                    <input
                      type="text"
                      placeholder="https://..."
                      value={productForm.image}
                      onChange={(e) => {
                        setProductForm({ ...productForm, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#F8B4C5]/60 bg-white text-xs text-[#1E1618]"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Nom du Modèle
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Collier Étoile Rose Gold"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Catégorie
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs cursor-pointer"
                  >
                    <option value="colliers">Les Colliers</option>
                    <option value="bracelets">Les Bracelets</option>
                    <option value="montres">Les Montres</option>
                    <option value="bagues">Les Bagues</option>
                    <option value="packs">Packs &amp; Ensembles</option>
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Prix de Vente (DH)
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white font-bold text-[#872B44] text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Prix Barré (DH)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-gray-500 text-xs"
                  />
                </div>
              </div>

              {/* Badge & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Badge Promotionnel
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Bestseller, Nouveau, Coup de Cœur"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Quantité en Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                  Description Détaillée
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                />
              </div>

              {/* Material & Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Matériaux
                  </label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#1E1618] mb-1">
                    Dimensions / Taille
                  </label>
                  <input
                    type="text"
                    value={productForm.length}
                    onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#F8B4C5]/60 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#F8B4C5]/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#872B44] to-[#E26886] text-white font-semibold shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Mettre à Jour' : 'Créer le Bijou'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
