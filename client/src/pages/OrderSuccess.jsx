import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import axios from '../utils/axios.js';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order');
      }
    };
    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">

      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Order Placed Successfully! 🎉
      </h1>
      <p className="text-gray-500 mb-8">
        Thank you for shopping with ElectroStore. Your order has been confirmed.
      </p>

      {order && (
        <div className="bg-white rounded-2xl shadow p-6 text-left mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-yellow-500" />
            <h2 className="font-bold text-gray-800">Order Details</h2>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-mono text-xs text-gray-800">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {order.orderStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivering to</span>
              <span className="text-right">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <img
                  src={item.image || 'https://via.placeholder.com/50'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate('/my-orders')}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl"
        >
          <Package size={18} /> Track Order
        </button>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50"
        >
          Continue Shopping <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;