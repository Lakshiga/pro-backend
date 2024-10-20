import mongoose from 'mongoose';

const paymentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'pending'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Calculate expiresAt before saving
paymentSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    if (this.plan === 'monthly') {
      this.expiresAt = new Date(now.setMonth(now.getMonth() + 1));
    } else if (this.plan === 'yearly') {
      this.expiresAt = new Date(now.setFullYear(now.getFullYear() + 1));
    }
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
