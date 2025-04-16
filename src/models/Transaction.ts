import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: Date,
  category: {
    type: String,
    enum: ['Food', 'Rent', 'Utilities', 'Transport', 'Entertainment', 'Other'],
    required: true,
  },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);