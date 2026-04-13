import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ArrowRight, Shield, Truck, Headphones, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import hero from '../assets/hero.png'
import ic from '../assets/categories/ic.png'
import driver from '../assets/categories/driver.png'
import capacitor from '../assets/categories/capacitor.png'
import fuse from '../assets/categories/fuse.png'
import ic2 from '../assets/categories/ic2.png'
import IGBT from '../assets/categories/IGBT.png'
import mosfet from '../assets/categories/mosfet.png'
import powerC from '../assets/categories/powerC.png'
import relay from '../assets/categories/relay.png'
import thyristor from '../assets/categories/thyristor.png'
import transformer from '../assets/categories/transformer.png'
import transistor from '../assets/categories/transistor.png'
import cooling_fan from '../assets/categories/cooling_fan.png'
import electric_relay from '../assets/categories/electric_relay.png'
import GPR from '../assets/categories/GPR.png'
import microtek_inverter from '../assets/categories/microtek_inverter.png'
import panel from '../assets/categories/panel.png'
import power_mosfet from '../assets/categories/power_mosfet.png'
import power_transistor from '../assets/categories/power_transistor.png'
import spare_parts from '../assets/categories/spare_parts.png'
import Ups_battery from '../assets/categories/Ups_battery.png'
import voltage_stabilizer from '../assets/categories/voltage_stabilizer.png'

// import driver from '../assets/categories/driver.png'

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
    { name: 'Programmable IC', emoji: ic, color: 'bg-blue-100 text-blue-700' },
    { name: 'Driver Control Card', emoji: driver, color: 'bg-purple-100 text-purple-700' },
    { name: 'Mosfet Transistor', emoji: mosfet, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Integrated Circuits', emoji: ic2, color: 'bg-green-100 text-green-700' },
    { name: 'Thyristor Module', emoji: thyristor, color: 'bg-red-100 text-red-700' },
    { name: 'Capacitors', emoji: capacitor, color: 'bg-orange-100 text-orange-700' },
    { name: 'Leone Relays', emoji: relay, color: 'bg-teal-100 text-teal-700' },
    { name: 'Electronic Transistors', emoji: transistor, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Fuse Holder', emoji: fuse, color: 'bg-pink-100 text-pink-700' },
    { name: 'Single Phase Transformer', emoji: transformer, color: 'bg-cyan-100 text-cyan-700' },
    { name: 'Power Capacitor', emoji: powerC, color: 'bg-lime-100 text-lime-700' },
    { name: 'IGBT Module', emoji: IGBT, color: 'bg-amber-100 text-amber-700' },
    { name: 'Electrical Relays', emoji: electric_relay, color: 'bg-violet-100 text-violet-700' },
    { name: 'Spare Parts', emoji: spare_parts, color: 'bg-gray-100 text-gray-700' },
    { name: 'Colling Fan', emoji: cooling_fan, color: 'bg-sky-100 text-sky-700' },
    { name: 'Voltage Stabilizer', emoji: voltage_stabilizer, color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Microtek Inverter', emoji: microtek_inverter, color: 'bg-rose-100 text-rose-700' },
    { name: 'Panel Accessories', emoji: panel, color: 'bg-fuchsia-100 text-fuchsia-700' },
    { name: 'Power Mosfet', emoji: power_mosfet, color: 'bg-blue-100 text-blue-800' },
    { name: 'Power Transistor', emoji: power_transistor, color: 'bg-purple-100 text-purple-800' },
    { name: 'General Purpose Relays', emoji: GPR, color: 'bg-green-100 text-green-800' },
    { name: 'Ups Battery', emoji: Ups_battery, color: 'bg-yellow-100 text-yellow-800' },
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
      <section className="bg-linear-to-r from-gray-950 to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
              Best Deals on Electricals 
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
              Shop the Latest <br />
              <span className="text-yellow-400">Electricals Parts</span> Online
            </h1>
            <p className="text-gray-300 mt-4 text-lg">
              Mosfets, Driver Card, IC's & more — at unbeatable prices with fast delivery across India.
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
                View Products
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="animate-pulse"><img src={hero} alt="hero" /></div>
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
              <div className="text-4xl flex justify-center mb-2"><img className='h-20 w-20' src={cat.emoji} alt="" /></div>
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

      {/* Banner
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
      </section> */}
    </div>
  );
};

export default Home;