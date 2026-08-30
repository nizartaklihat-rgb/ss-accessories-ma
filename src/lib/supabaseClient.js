import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from Env or LocalStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, source: 'env' };
  }

  try {
    const saved = localStorage.getItem('ss_accessories_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key, source: 'storage' };
      }
    }
  } catch (e) {}

  return { url: '', key: '', source: 'none' };
};

let supabaseInstance = null;

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
};

export const saveSupabaseConfig = (url, key) => {
  try {
    localStorage.setItem('ss_accessories_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
    supabaseInstance = null; // reset instance
    return true;
  } catch (e) {
    return false;
  }
};

export const clearSupabaseConfig = () => {
  try {
    localStorage.removeItem('ss_accessories_supabase_config');
    supabaseInstance = null;
  } catch (e) {}
};

// ==========================================
// SUPABASE DATABASE OPERATIONS
// ==========================================

// 1. Fetch Products from Supabase
export const fetchCloudProducts = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch products error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        badge: p.badge || undefined,
        description: p.description || '',
        material: p.material || '',
        length: p.length || '',
        image: p.image,
        stock: p.stock !== undefined ? p.stock : 10,
        inStock: p.in_stock !== false,
        rating: p.rating || 5.0
      }));
    }
    return [];
  } catch (e) {
    console.warn('Supabase fetch failed:', e);
    return null;
  }
};

// 2. Upsert (Save/Update) Product
export const upsertCloudProduct = async (product) => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      original_price: product.originalPrice ? Number(product.originalPrice) : null,
      badge: product.badge || null,
      description: product.description || '',
      material: product.material || '',
      length: product.length || '',
      image: product.image,
      stock: Number(product.stock) || 10,
      in_stock: product.inStock !== false
    };

    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      console.error('Supabase upsert product error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase upsert failed:', e);
    return false;
  }
};

// 3. Delete Product
export const deleteCloudProduct = async (productId) => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Supabase delete product error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// 4. Upload Product Image to Supabase Storage Bucket
export const uploadCloudImage = async (file) => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `jewelry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('jewelry-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('jewelry-images').getPublicUrl(filePath);
    return data?.publicUrl || null;
  } catch (e) {
    console.warn('Cloud image upload failed:', e);
    return null;
  }
};

export const uploadImageToSupabase = uploadCloudImage;

// 5. Fetch Orders
export const fetchCloudOrders = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders error:', error.message);
      return null;
    }

    if (data) {
      return data.map(o => ({
        id: o.id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        city: o.city,
        address: o.address,
        note: o.note || '',
        items: o.items || [],
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.delivery_fee),
        total: Number(o.total),
        status: o.status || 'Nouveau',
        createdAt: o.created_at
      }));
    }
    return [];
  } catch (e) {
    return null;
  }
};

// 6. Insert Order
export const insertCloudOrder = async (order) => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const payload = {
      id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      city: order.city,
      address: order.address,
      note: order.note || '',
      items: order.items,
      subtotal: Number(order.subtotal),
      delivery_fee: Number(order.deliveryFee),
      total: Number(order.total),
      status: order.status || 'Nouveau',
      created_at: order.createdAt || new Date().toISOString()
    };

    const { error } = await supabase.from('orders').insert(payload);
    if (error) {
      console.warn('Supabase insert order error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

// 7. Update Order Status
export const updateCloudOrderStatus = async (orderId, newStatus) => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    return !error;
  } catch (e) {
    return false;
  }
};

// 8. Delete Order
export const deleteCloudOrder = async (orderId) => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    return !error;
  } catch (e) {
    return false;
  }
};

// 9. Sync All Initial Products into Supabase
export const syncAllToCloud = async (productsList) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: 'Supabase client non initialisé' };

  try {
    const payloads = productsList.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      original_price: p.originalPrice ? Number(p.originalPrice) : null,
      badge: p.badge || null,
      description: p.description || '',
      material: p.material || '',
      length: p.length || '',
      image: p.image,
      stock: Number(p.stock) || 10,
      in_stock: p.inStock !== false
    }));

    const { error } = await supabase.from('products').upsert(payloads);
    if (error) {
      console.error('Supabase batch upsert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.error('Batch sync error:', e);
    return { success: false, error: e.message };
  }
};
