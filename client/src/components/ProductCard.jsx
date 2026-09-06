import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <Link to={`/products/${product._id}`}>
        <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover rounded" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description?.slice(0, 60)}...</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">PKR {product.price}</span>
          <span className="text-xs text-gray-500">{product.status}</span>
        </div>
      </Link>
    </div>
  );
}
