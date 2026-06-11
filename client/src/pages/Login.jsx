import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Zap } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import axios from '../utils/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/auth/login', formData);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Social Login using popup
  const handleSocialLogin = async (provider, providerName) => {
    setSocialLoading(providerName);
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Retrieve Firebase ID Token to send to the backend
      const idToken = await firebaseUser.getIdToken();

      const { data } = await axios.post('/auth/social-login', { idToken });
      login(data);
      toast.success(`Welcome, ${data.name}! 🎉`);
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(`${providerName} login failed:`, error);
      toast.error(error.response?.data?.message || `${providerName} login failed`);
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 mt-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-400 mb-6">
          Gupta Electricals
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-6">Login to your account</p>

        {/* Social Login */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin(googleProvider, 'google')}
            disabled={socialLoading === 'google'}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* <button
            onClick={() => handleSocialLogin(facebookProvider, 'facebook')}
            disabled={socialLoading === 'facebook'}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition font-medium disabled:opacity-50"
          >
            <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
            {socialLoading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
          </button> */}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or login with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="krishna@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-yellow-500 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;