const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../Models/paymentModel');

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

exports.createPaymentIntent = async (req, res) => {
  const { plan, userId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plans[plan].amount,
      currency: plans[plan].currency,
      metadata: { userId, plan },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Failed to create payment intent' });
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { userId, plan } = paymentIntent.metadata;

    const payment = new Payment({
      userId,
      plan,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentIntentId,
      status: 'succeeded',
    });

    await payment.save();

    res.status(200).send({ message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Error handling payment success:', error);
    res.status(500).send({ error: 'Failed to record payment' });
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
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