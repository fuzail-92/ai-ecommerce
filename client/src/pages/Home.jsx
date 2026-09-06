import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-600 text-white rounded-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Amazing Products
        </h1>
        <p className="text-lg md:text-xl mb-6 text-blue-100">
          AI-powered recommendations for your shopping needs.
        </p>
        <Link to="/products">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Category Highlights */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Electronics', 'Mobiles', 'Audio', 'TVs', 'Sports'].map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat.toLowerCase()}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md text-center font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
        <p className="text-gray-600">
          Featured products will appear here from the API.
        </p>
      </section>
    </div>
  );
}
