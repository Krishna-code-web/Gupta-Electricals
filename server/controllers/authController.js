const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyFirebaseToken } = require('../utils/firebaseAuth');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log('Register attempt:', { name, email, phone }); // debug line

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, phone });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error('Register error:', error); // debug line
    return res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email }); // debug line

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error('Login error:', error); // debug line
    return res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/social-login
const socialLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID Token is required' });
    }

    // Verify token using firebaseAuth utility
    const decodedToken = await verifyFirebaseToken(idToken);
    const { email, name, user_id: firebaseId } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided in social authentication' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    }

    // Create a new user if one doesn't exist
    const secureRandomPassword = crypto.randomBytes(32).toString('hex');
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      password: secureRandomPassword,
      role: 'customer'
    });

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });

  } catch (error) {
    console.error('Social Login Error:', error);
    res.status(401).json({ message: error.message || 'Social authentication failed' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, socialLogin };