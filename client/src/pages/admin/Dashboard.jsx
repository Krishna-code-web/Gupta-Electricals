import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Users, IndianRupee, TrendingUp } from 'lucide-react';
import axios from '../../utils/axios.js';
import AdminLayout from './AdminLayout.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    Processing: 'bg-blue-100 text-blue-700',
    Packed: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get('/orders'),
          axios.get('/products')
        ]);

        const orders = ordersRes.data.orders;
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];

        setStats({
          totalOrders: orders.length,
          totalRevenue: ordersRes.data.totalAmount,
          totalProducts: products.length,
          pendingOrders: orders.filter(o => o.orderStatus === 'Processing').length,
          deliveredOrders: orders.filter(o => o.orderStatus === 'Delivered').length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <ShoppingBag size={22} className="text-blue-600" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <IndianRupee size={22} className="text-green-600" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Package size={22} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-1">Total Products</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-100 p-3 rounded-xl">
              <ShoppingBag size={22} className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-1">Pending Orders</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Recent Orders</h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-sm text-yellow-500 font-medium hover:underline"
          >
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr
                    key={order._id}
                    onClick={() => navigate('/admin/orders')}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 font-mono text-xs text-gray-500">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 font-medium text-gray-800">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="py-3 text-gray-500">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </td>
                    <td className="py-3 font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;