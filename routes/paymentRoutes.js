const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');

// Route to create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Route to handle successful payments
router.post('/payment-success', paymentController.handlePaymentSuccess);

// Route to get subscription status
router.get('/subscription-status/:userId', paymentController.getSubscriptionStatus);

module.exports = router;