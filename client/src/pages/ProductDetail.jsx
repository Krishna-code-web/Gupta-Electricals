import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  const buyNow = () => {
    addToCart();
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return navigate('/login');
    }
    setReviewLoading(true);
    try {
      await axios.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const discount = product?.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const finalPrice = product?.discountPrice > 0 ? product.discountPrice : product?.price;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 rounded-xl h-96 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-200 rounded h-8 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} /> Back to Products
      </button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow p-6">

        {/* Images */}
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-50 mb-4 h-80 flex items-center justify-center">
            <img
              src={product.images[selectedImage]?.url || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="max-h-80 object-contain w-full"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === i ? 'border-yellow-400' : 'border-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={18}
                  className={star <= Math.round(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2 py-1 rounded-lg">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            {discount > 0 && (
              <p className="text-green-600 text-sm mt-1">
                You save ₹{(product.price - finalPrice).toLocaleString()}!
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} units left)
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg font-bold"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className="flex-1 border-2 border-yellow-400 text-yellow-600 font-bold py-3 rounded-xl hover:bg-yellow-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-1">
              <Truck size={20} className="text-blue-500" />
              Free Delivery
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield size={20} className="text-green-500" />
              Secure Payment
            </div>
            <div className="flex flex-col items-center gap-1">
              <Package size={20} className="text-yellow-500" />
              7 Day Return
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow mt-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {['description', 'specs', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition ${activeTab === tab
                ? 'border-b-2 border-yellow-400 text-yellow-600'
                : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab} {tab === 'reviews' && `(${product.numReviews})`}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          )}

          {/* Specs Tab */}
          {activeTab === 'specs' && (
            <div>
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-semibold text-gray-600 w-40">{key}</td>
                        <td className="py-3 text-gray-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No specifications available</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {/* Review Form */}
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        >
                          <Star
                            size={28}
                            className={star <= reviewForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Comment
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows={3}
                      required
                      placeholder="Share your experience with this product..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              {product.reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Star size={40} className="mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-gray-900">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              className={star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;