import express from 'express';
import paymentController from '../controllers/paymentController.js'; // Default import

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Route to handle successful payments
router.post('/payment-success', paymentController.handlePaymentSuccess);

// Route to get subscription status
router.get('/subscription-status/:userId', paymentController.getSubscriptionStatus);

export default router;
