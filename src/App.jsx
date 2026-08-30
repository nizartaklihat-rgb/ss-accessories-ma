import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomPackBuilder } from './components/CustomPackBuilder';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

function MainApp() {
  const { isAdminRoute } = useStore();

  // If visiting the secret /admin route or #admin, render the dedicated Admin Portal
  if (isAdminRoute) {
    return <AdminPortal />;
  }

  // Public Storefront (Zero admin traces visible to customers)
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9FA] text-[#1E1618] selection:bg-[#F4A6B8]/40 selection:text-[#1E1618] pb-16 sm:pb-0 w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Hero />
        <ProductCatalog />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Drawers */}
      <CustomPackBuilder />
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
