import express from 'express';
import paymentController from '../controllers/paymentController.js'; // Default import
import { protect } from "../middleware/authMiddleware.js"; // Import the protect middleware

const router = express.Router();

// Route to create a payment intent
router.post('/create-payment-intent',protect, paymentController.createPaymentIntent);

// Route to handle successful payments
router.post('/payment-success', paymentController.handlePaymentSuccess);

// Route to get subscription status
router.get('/subscription-status/:userId', paymentController.getSubscriptionStatus);

export default router;