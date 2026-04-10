import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const statusColors = {
  Processing: 'bg-blue-100 text-blue-700',
  Packed: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

const statusSteps = ['Processing', 'Packed', 'Shipped', 'Delivered'];

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view orders');
      return navigate('/login');
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders/my');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cannot cancel this order');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Order Detail View
  if (selectedOrder) {
    const currentStep = statusSteps.indexOf(selectedOrder.orderStatus);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Order Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[selectedOrder.orderStatus]}`}>
              {selectedOrder.orderStatus}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-6 space-y-1">
            <p>Order ID: <span className="font-mono text-gray-800">{selectedOrder._id}</span></p>
            <p>Placed on: <span className="text-gray-800">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
            <p>Total: <span className="font-bold text-gray-900">₹{selectedOrder.totalPrice.toLocaleString()}</span></p>
          </div>

          {/* Order Tracker */}
          {selectedOrder.orderStatus !== 'Cancelled' && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-4 text-sm">Order Tracking</h3>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                  <div
                    className="h-1 bg-yellow-400 transition-all duration-500"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= currentStep
                      ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                      : 'bg-white border-gray-300 text-gray-400'}`}
                    >
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${i <= currentStep ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Items Ordered</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-100 pt-4 mb-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Price</span>
              <span>₹{selectedOrder.itemsPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              {selectedOrder.shippingPrice === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                <span>₹{selectedOrder.shippingPrice}</span>
              )}
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">Delivery Address</h3>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress.fullName}</p>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              <p>📞 {selectedOrder.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Cancel Button */}
          {['Processing', 'Packed'].includes(selectedOrder.orderStatus) && (
            <button
              onClick={() => cancelOrder(selectedOrder._id)}
              className="w-full mt-2 border border-red-400 text-red-500 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-xl"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition p-5 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 font-mono">{order._id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex gap-3 items-center">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border-2 border-white"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {order.items[0].name}
                    {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;