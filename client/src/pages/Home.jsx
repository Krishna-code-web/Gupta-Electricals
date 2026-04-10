import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Shield, Truck, Headphones, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios.js';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/products/featured');
        setFeaturedProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Programmable IC', emoji: '🔬', color: 'bg-blue-100 text-blue-700' },
    { name: 'Driver Control Card', emoji: '🎛️', color: 'bg-purple-100 text-purple-700' },
    { name: 'Mosfet Transistor', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Integrated Circuits', emoji: '🔲', color: 'bg-green-100 text-green-700' },
    { name: 'Thyristor Module', emoji: '🔌', color: 'bg-red-100 text-red-700' },
    { name: 'Capacitors', emoji: '🔋', color: 'bg-orange-100 text-orange-700' },
    { name: 'Leone Relays', emoji: '🔀', color: 'bg-teal-100 text-teal-700' },
    { name: 'Electronic Transistors', emoji: '📡', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Fuse Holder', emoji: '🛡️', color: 'bg-pink-100 text-pink-700' },
    { name: 'Single Phase Transformer', emoji: '🔄', color: 'bg-cyan-100 text-cyan-700' },
    { name: 'Power Capacitor', emoji: '⚙️', color: 'bg-lime-100 text-lime-700' },
    { name: 'IGBT Module', emoji: '🔧', color: 'bg-amber-100 text-amber-700' },
    { name: 'Electrical Relays', emoji: '💡', color: 'bg-violet-100 text-violet-700' },
    { name: 'Spare Parts', emoji: '🔩', color: 'bg-gray-100 text-gray-700' },
    { name: 'Colling Fan', emoji: '🌀', color: 'bg-sky-100 text-sky-700' },
    { name: 'Voltage Stabilizer', emoji: '📊', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Microtek Inverter', emoji: '🔆', color: 'bg-rose-100 text-rose-700' },
    { name: 'Panel Accessories', emoji: '🗂️', color: 'bg-fuchsia-100 text-fuchsia-700' },
    { name: 'Power Mosfet', emoji: '⚡', color: 'bg-blue-100 text-blue-800' },
    { name: 'Power Transistor', emoji: '🔌', color: 'bg-purple-100 text-purple-800' },
    { name: 'General Purpose Relays', emoji: '🔀', color: 'bg-green-100 text-green-800' },
    { name: 'Ups Battery', emoji: '🔋', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const features = [
    { icon: <Truck size={28} />, title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: <Shield size={28} />, title: 'Secure Payments', desc: 'UPI, Cards, Net Banking' },
    { icon: <RotateCcw size={28} />, title: '7 Day Returns', desc: 'Easy return policy' },
    { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Always here to help' },
  ];

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Added to cart!');
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
              🔥 Best Deals on Electronics
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Shop the Latest <br />
              <span className="text-yellow-400">Electronics</span> Online
            </h1>
            <p className="text-gray-300 mt-4 text-lg">
              Mobiles, Laptops, TVs, Audio & more — at unbeatable prices with fast delivery across India.
            </p>
            <div className="flex gap-4 mt-8 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?category=Mobile"
                className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition"
              >
                View Mobiles
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-9xl animate-bounce">⚡</div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-yellow-400 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-900">
              <div className="shrink-0">{f.icon}</div>
              <div>
                <div className="font-bold text-sm">{f.title}</div>
                <div className="text-xs">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className={`${cat.color} rounded-xl p-4 text-center hover:scale-105 transition cursor-pointer`}
            >
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="font-semibold text-sm">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-yellow-500 font-semibold hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg font-medium">No featured products yet</p>
            <p className="text-sm mt-1">Add products from the admin panel</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                  <h3
                    className="font-semibold text-gray-800 text-sm cursor-pointer hover:text-yellow-500 line-clamp-2"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-gray-900">
                      ₹{product.discountPrice > 0 ? product.discountPrice.toLocaleString() : product.price.toLocaleString()}
                    </span>
                    {product.discountPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-2">Big Sale This Week! 🎉</h2>
          <p className="text-blue-200 mb-6">Up to 40% off on selected electronics. Limited time offer!</p>
          <Link
            to="/products"
            className="bg-white text-blue-700 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Grab the Deal
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;