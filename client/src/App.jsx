import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Home /></main><Footer /></>} />
        <Route path="/login" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Login /></main><Footer /></>} />
        <Route path="/register" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Register /></main><Footer /></>} />
        <Route path="/products" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Products /></main><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><main className="min-h-screen bg-gray-50"><ProductDetail /></main><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Cart /></main><Footer /></>} />
        <Route path="/checkout" element={<><Navbar /><main className="min-h-screen bg-gray-50"><Checkout /></main><Footer /></>} />
        <Route path="/order-success/:id" element={<><Navbar /><main className="min-h-screen bg-gray-50"><OrderSuccess /></main><Footer /></>} />
        <Route path="/my-orders" element={<><Navbar /><main className="min-h-screen bg-gray-50"><MyOrders /></main><Footer /></>} />

        {/* Admin Routes - No Navbar/Footer */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}

export default App;