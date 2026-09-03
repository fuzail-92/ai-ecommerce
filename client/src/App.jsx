import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { useAuth } from './store/authContext.jsx';

function App() {
  const { user } = useAuth();
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/">Home</Link> | <Link to="/products">Products</Link> |{' '}
        <Link to="/cart">Cart</Link> | <Link to="/wishlist">Wishlist</Link> |{' '}
        {user ? (
          <>
            <Link to="/profile">Profile</Link> |{' '}
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
