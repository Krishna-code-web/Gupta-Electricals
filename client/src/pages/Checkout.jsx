import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, ShoppingBag, ChevronRight } from 'lucide-react';
import axios from '../utils/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Review Order

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      return navigate('/login');
    }
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    if (stored.length === 0) {
      toast.error('Your cart is empty');
      return navigate('/cart');
    }
    setCart(stored);
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const { fullName, phone, street, city, state, pincode } = address;
    if (!fullName || !phone || !street || !city || !state || !pincode) {
      toast.error('Please fill all address fields');
      return false;
    }
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10 digit phone number');
      return false;
    }
    if (pincode.length !== 6) {
      toast.error('Please enter a valid 6 digit pincode');
      return false;
    }
    return true;
  };

  const getPrice = (item) =>
    item.discountPrice > 0 ? item.discountPrice : item.price;

  const itemsPrice = cart.reduce((acc, item) => acc + getPrice(item) * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 99;
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrder = async () => {
    if (!validateAddress()) return;
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.images[0]?.url || '',
        price: getPrice(item),
        quantity: item.quantity
      }));

      const { data: order } = await axios.post('/orders', {
        items: orderItems,
        shippingAddress: address,
        itemsPrice,
        shippingPrice,
        totalPrice
      });

      // Clear cart
      localStorage.removeItem('cart');

      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-yellow-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <span className="font-medium text-sm hidden md:inline">Delivery Address</span>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-yellow-500' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <span className="font-medium text-sm hidden md:inline">Review & Place Order</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side */}
        <div className="lg:col-span-2">

          {/* Step 1 - Address */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={22} className="text-yellow-500" />
                <h2 className="text-lg font-bold text-gray-800">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Street Address *
                  </label>
                  <textarea
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="House no, Building, Street, Area"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    State *
                  </label>
                  <select
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6 digit pincode"
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateAddress()) setStep(2);
                }}
                className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl"
              >
                Continue to Review Order →
              </button>
            </div>
          )}

          {/* Step 2 - Review Order */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingBag size={22} className="text-yellow-500" />
                <h2 className="text-lg font-bold text-gray-800">Review Your Order</h2>
              </div>

              {/* Address Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700 text-sm">Delivering to:</h3>
                  <button
                    onClick={() => setStep(1)}
                    className="text-yellow-500 text-sm font-medium hover:underline"
                  >
                    Change
                  </button>
                </div>
                <p className="text-gray-800 font-semibold">{address.fullName}</p>
                <p className="text-gray-600 text-sm">{address.street}</p>
                <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                <p className="text-gray-600 text-sm">📞 {address.phone}</p>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item._id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <img
                      src={item.images[0]?.url || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">
                      ₹{(getPrice(item) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50"
                >
                  ← Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order ✓'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Price Details</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Price ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span>₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                {shippingPrice === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{shippingPrice}</span>
                )}
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              {shippingPrice === 0 && (
                <p className="text-green-600 text-xs font-medium">
                  🎉 You saved ₹99 on delivery!
                </p>
              )}
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
              💳 Pay on delivery available. Online payment coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;