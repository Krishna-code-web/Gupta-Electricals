import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Zap, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="text-xl font-bold shrink-0 text-yellow-400 hover:text-yellow-500 transition-colors duration-200">
            Gupta Electricals
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search IC's, Mosfets, Driver Card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 text-white placeholder-gray-500 pl-4 pr-12 py-2 rounded-lg outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200 text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-yellow-400 text-gray-950 px-4 rounded-r-lg hover:bg-yellow-500 active:bg-yellow-600 transition-colors duration-200 cursor-pointer flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Right Side Nav */}
          <div className="flex items-center gap-6">

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
              <div className="relative">
                <ShoppingCart size={22} className="shrink-0" />
              </div>
              <span className="hidden md:inline text-sm font-semibold">Cart</span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1.5 cursor-pointer"
                >
                  <User size={22} className="shrink-0" />
                  <span className="hidden md:inline text-sm font-semibold">{user.name.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-950 border border-gray-800 text-white rounded-lg shadow-xl z-50 py-1">
                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-gray-800 transition-colors border-t border-gray-900"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors border-t border-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 px-5 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="flex md:hidden mt-3 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 text-white placeholder-gray-500 pl-4 pr-12 py-2 rounded-lg outline-none focus:border-yellow-400 transition-all duration-200 text-sm"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 bg-yellow-400 text-gray-950 px-4 rounded-r-lg hover:bg-yellow-500 active:bg-yellow-600 transition-colors duration-200"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-3 border-t border-gray-800 pt-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-yellow-400 font-medium py-1">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-yellow-400 font-medium py-1">Products</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-yellow-400 font-medium py-1">Cart</Link>
            {user && (
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-yellow-400 font-medium py-1">My Orders</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;