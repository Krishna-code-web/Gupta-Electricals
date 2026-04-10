import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios.js';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: queryParams.get('keyword') || '',
    category: queryParams.get('category') || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  const categories = [
    'Programmable IC', 'Driver Control Card', 'Mosfet Transistor', 'Integrated Circuits',
    'Thyristor Module', 'Capacitors', 'Leone Relays', 'Electronic Transistors', 'Fuse Holder',
    'Single Phase Transformer', 'Power Capacitor', 'IGBT Module', 'Electrical Relays', 'Spare Parts',
    'Colling Fan', 'Voltage Stabilizer', 'Microtek Inverter', 'Panel Accessories', 'Power Mosfet',
    'Power Transistor', 'General Purpose Relays', 'Ups Battery'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);

      const { data } = await axios.get(`/products?${params.toString()}`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [location.search]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    navigate(`/products?${params.toString()}`);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', brand: '', minPrice: '', maxPrice: '', sort: '' });
    navigate('/products');
  };

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Filter & Sort</h3>
            <button onClick={() => setFilterOpen(false)}>
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Keyword */}
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Brand</label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="e.g. Samsung"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Min Price</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="₹0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="₹100000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={applyFilters}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => { setFilters({ ...filters, category: '' }); navigate('/products'); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filters.category === '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setFilters({ ...filters, category: cat }); navigate(`/products?category=${cat}`); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filters.category === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-200 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-sm mt-2">Try changing your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-lg hover:bg-yellow-500"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden group"
            >
              <div
                className="cursor-pointer overflow-hidden"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <img
                  src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                <h3
                  className="font-semibold text-gray-800 text-sm cursor-pointer hover:text-yellow-500 line-clamp-2 mb-1"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {product.rating.toFixed(1)} ({product.numReviews})
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">
                    ₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                  </span>
                  {product.discountPrice > 0 && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {product.stock === 0 ? (
                  <button disabled className="w-full bg-gray-200 text-gray-400 font-semibold py-2 rounded-lg text-sm cursor-not-allowed">
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;