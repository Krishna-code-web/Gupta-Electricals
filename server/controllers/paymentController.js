const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// @POST /api/payment/create — Create Razorpay order
const createPayment = async (req, res) => {
  try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100), // Razorpay needs paise
      currency: 'INR',
      receipt: `receipt_${orderId}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/payment/verify — Verify payment after success
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order payment info
    const order = await Order.findByIdAndUpdate(orderId, {
      paymentInfo: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid'
      }
    }, { new: true });

    res.json({ message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, verifyPayment };