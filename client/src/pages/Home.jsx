import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Welcome to AI E-Commerce</h1>
      <Link to="/products">Browse Products</Link>
    </div>
  );
}
