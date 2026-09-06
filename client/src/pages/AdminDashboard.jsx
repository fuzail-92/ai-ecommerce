import { useState } from 'react';
import ProductsManager from '../components/admin/ProductsManager';
import CategoriesManager from '../components/admin/CategoriesManager';
import BrandsManager from '../components/admin/BrandsManager';
import OrdersManager from '../components/admin/OrdersManager';
import UsersManager from '../components/admin/UsersManager';

const tabs = [
  { key: 'products', label: 'Products', icon: '📦' },
  { key: 'categories', label: 'Categories', icon: '🗂️' },
  { key: 'brands', label: 'Brands', icon: '🏷️' },
  { key: 'orders', label: 'Orders', icon: '📋' },
  { key: 'users', label: 'Users', icon: '👥' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-64 bg-white rounded-lg shadow p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-2 px-4 py-2 rounded-md text-left ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <section className="flex-1 bg-white rounded-lg shadow p-6">
            {activeTab === 'products' && <ProductsManager />}
            {activeTab === 'categories' && <CategoriesManager />}
            {activeTab === 'brands' && <BrandsManager />}
            {activeTab === 'orders' && <OrdersManager />}
            {activeTab === 'users' && <UsersManager />}
          </section>
        </div>
      </div>
    </div>
  );
}
