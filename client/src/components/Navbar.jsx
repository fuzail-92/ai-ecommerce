import { Link } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { Button } from './ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          AI Shop
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <Link to="/cart" className="hover:text-blue-600">Cart</Link>
          <Link to="/wishlist" className="hover:text-blue-600">Wishlist</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-blue-600">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-blue-600">Admin</Link>
              )}
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/register">
                <Button variant="default" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
