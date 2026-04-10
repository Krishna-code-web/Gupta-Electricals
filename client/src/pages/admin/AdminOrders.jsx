import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../../utils/axios.js';
import AdminLayout from './AdminLayout.jsx';

const statusColors = {
  Processing: 'bg-blue-100 text-blue-700',
  Packed: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

const statuses = ['Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/orders');
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await axios.put(`/orders/${orderId}/status`, { orderStatus: status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      setSelectedOrder(prev => prev ? { ...prev, orderStatus: status } : null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 rounded-xl h-20 animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-semibold">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map(order => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedOrder?._id === order._id ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {order.user?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')} •{' '}
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div className="bg-white rounded-2xl shadow p-5 h-fit sticky top-24">
          {!selectedOrder ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Click an order to view details</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Order Details</h3>

              {/* Customer */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">Customer</p>
                <p className="font-semibold text-gray-800">{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
                <p className="font-semibold">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-gray-600">{selectedOrder.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
                <p className="text-gray-600">📞 {selectedOrder.shippingAddress.phone}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <img
                        src={item.image || 'https://via.placeholder.com/40'}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-3 mb-4 text-sm space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>₹{selectedOrder.itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : `₹${selectedOrder.shippingPrice}`}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Update Status */}
              {selectedOrder.orderStatus !== 'Cancelled' && selectedOrder.orderStatus !== 'Delivered' && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Update Status</p>
                  <div className="space-y-2">
                    {statuses
                      .filter(s => s !== 'Cancelled' && statuses.indexOf(s) > statuses.indexOf(selectedOrder.orderStatus))
                      .map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedOrder._id, status)}
                          disabled={updating}
                          className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-50 text-sm disabled:opacity-50"
                        >
                          Mark as {status}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {(selectedOrder.orderStatus === 'Delivered' || selectedOrder.orderStatus === 'Cancelled') && (
                <div className={`text-center py-2 rounded-xl text-sm font-bold ${statusColors[selectedOrder.orderStatus]}`}>
                  Order {selectedOrder.orderStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;