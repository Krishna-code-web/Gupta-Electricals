import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(stored);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item._id !== id);
    updateCart(updated);
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    updateCart([]);
    toast.success('Cart cleared');
  };

  const getPrice = (item) =>
    item.discountPrice > 0 ? item.discountPrice : item.price;

  const itemsPrice = cart.reduce((acc, item) => acc + getPrice(item) * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const totalPrice = itemsPrice + shippingPrice;

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed');
      return navigate('/login');
    }
    if (cart.length === 0) {
      return toast.error('Your cart is empty');
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            My Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 flex gap-4">

              {/* Image */}
              <img
                src={item.images[0]?.url || 'https://via.placeholder.com/100'}
                alt={item.name}
                onClick={() => navigate(`/products/${item._id}`)}
                className="w-24 h-24 object-cover rounded-lg cursor-pointer shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{item.brand}</p>
                <h3
                  onClick={() => navigate(`/products/${item._id}`)}
                  className="font-semibold text-gray-800 text-sm cursor-pointer hover:text-yellow-500 line-clamp-2"
                >
                  {item.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-gray-900">
                    ₹{getPrice(item).toLocaleString()}
                  </span>
                  {item.discountPrice > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Quantity & Remove */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">
                      ₹{(getPrice(item) * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Items ({cart.reduce((acc, i) => acc + i.quantity, 0)})</span>
                <span>₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingPrice === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{shippingPrice}</span>
                )}
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{(999 - itemsPrice).toLocaleString()} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate('/products')}
              className="w-full mt-3 text-center text-sm text-gray-500 hover:text-gray-800"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;