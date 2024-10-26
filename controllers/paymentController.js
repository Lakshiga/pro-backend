import Stripe from 'stripe';
import Payment from '../models/paymentModel.js';

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51QBrrwHbve0bLiRTWUuz7F8nGK4yn8JpqQXRhH3rWwsvIbQ0rqvAahKJtBOcgosQYdQKjQJ1KAlrJc6NNCSoBFfH004JQOEquw');

const plans = {
  monthly: {
    amount: 2999, // $29.99 in cents
    currency: 'usd',
  },
  yearly: {
    amount: 29999, // $299.99 in cents
    currency: 'usd',
  },
};

// Create a PaymentIntent for the selected plan
const createPaymentIntent = async (req, res) => {
  const { plan } = req.body;
  const userId = req.user._id.toString();
  
  try {
    // Ensure the plan is valid
    if (!plans[plan]) {
      return res.status(400).send({ error: 'Invalid plan selected' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: plans[plan].amount,
      currency: plans[plan].currency,
      metadata: { userId, plan }, // Attach user and plan info to metadata
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
};

const handlePaymentSuccess = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
      if (!paymentIntentId || !paymentIntentId.startsWith('pi_')) {
          return res.status(400).send({ error: 'Invalid PaymentIntent ID provided' });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Log the status for debugging
      console.log('Payment Intent Status:', paymentIntent.status);

      // Handle different payment intent statuses
      if (paymentIntent.status === 'requires_payment_method') {
          return res.status(400).send({
              error: `Payment not successful. Current status: ${paymentIntent.status}. Please provide a valid payment method.`
          });
      } else if (paymentIntent.status !== 'succeeded') {
          return res.status(400).send({ error: `Payment not successful. Current status: ${paymentIntent.status}` });
      }

      const { userId, plan } = paymentIntent.metadata;

      const payment = new Payment({
          userId,
          plan,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId,
          status: paymentIntent.status,
      });

      await payment.save();

      return res.status(200).send({ message: 'Payment recorded successfully', payment });
  } catch (error) {
      console.error('Error handling payment success:', error);
      return res.status(500).send({ error: 'Failed to record payment', details: error.message });
  }
};


// Get subscription status for a user by userId
const getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the most recent payment for the user
    const latestPayment = await Payment.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestPayment) {
      return res.status(404).send({ error: 'No subscription found' });
    }

    const subscriptionStatus = {
      plan: latestPayment.plan,
      status: latestPayment.status,
      expiresAt: latestPayment.expiresAt,
    };

    res.status(200).send(subscriptionStatus);
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).send({ error: 'Failed to get subscription status' });
  }
};

// Export all functions as default object
export default {
  createPaymentIntent,
  handlePaymentSuccess,
  getSubscriptionStatus,
};