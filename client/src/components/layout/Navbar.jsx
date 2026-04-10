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
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-yellow-400 shrink-0">
            <Zap size={24} />
            ElectroStore
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search mobiles, laptops, TVs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-lg text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-lg hover:bg-yellow-500"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-1 hover:text-yellow-400">
              <ShoppingCart size={22} />
              <span className="hidden md:inline text-sm">Cart</span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 hover:text-yellow-400"
                >
                  <User size={22} />
                  <span className="hidden md:inline text-sm">{user.name.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl z-50">
                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg"
                    >
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-blue-600 font-medium"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-lg font-medium hover:bg-yellow-500 text-sm"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="flex md:hidden mt-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg text-gray-900 outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-lg"
          >
            <Search size={20} />
          </button>
        </form>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-3 border-t border-gray-700 pt-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Home</Link>
            <Link to="/products" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Products</Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">Cart</Link>
            {user && (
              <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">My Orders</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;