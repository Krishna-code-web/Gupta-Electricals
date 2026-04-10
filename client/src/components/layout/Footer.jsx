import { Link } from 'react-router-dom';
import { Zap, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-xl mb-3">
            <Zap size={22} />
            ElectroStore
          </div>
          <p className="text-sm text-gray-400">
            Your trusted electronics store. Best prices on mobiles, laptops, TVs and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-yellow-400">All Products</Link></li>
            <li><Link to="/products?category=Mobile" className="hover:text-yellow-400">Mobiles</Link></li>
            <li><Link to="/products?category=Laptop" className="hover:text-yellow-400">Laptops</Link></li>
            <li><Link to="/products?category=TV" className="hover:text-yellow-400">TVs</Link></li>
          </ul>
        </div>

        {/* Customer */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/my-orders" className="hover:text-yellow-400">My Orders</Link></li>
            <li><Link to="/login" className="hover:text-yellow-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-yellow-400">Register</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 99999 99999
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@electrostore.in
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Delhi, India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © 2025 ElectroStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;