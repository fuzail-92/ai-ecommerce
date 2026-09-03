import { useState } from 'react';
import ProductsManager from '../components/admin/ProductsManager.jsx';
import CategoriesManager from '../components/admin/CategoriesManager.jsx';
import BrandsManager from '../components/admin/BrandsManager.jsx';
import OrdersManager from '../components/admin/OrdersManager.jsx';
import UsersManager from '../components/admin/UsersManager.jsx';

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <button onClick={() => setTab('products')}>Products</button>
        <button onClick={() => setTab('categories')}>Categories</button>
        <button onClick={() => setTab('brands')}>Brands</button>
        <button onClick={() => setTab('orders')}>Orders</button>
        <button onClick={() => setTab('users')}>Users</button>
      </div>
      <hr />
      {tab === 'products' && <ProductsManager />}
      {tab === 'categories' && <CategoriesManager />}
      {tab === 'brands' && <BrandsManager />}
      {tab === 'orders' && <OrdersManager />}
      {tab === 'users' && <UsersManager />}
    </div>
  );
}
