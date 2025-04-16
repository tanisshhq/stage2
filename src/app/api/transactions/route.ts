import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

// GET all transactions
export async function GET() {
  await connectToDatabase();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(transactions);
}

// CREATE a new transaction
export async function POST(req: Request) {
  await connectToDatabase();

  const { amount, description, date, category } = await req.json();

  if (!amount || !description || !date || !category) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const newTransaction = await Transaction.create({ amount, description, date, category });
    return NextResponse.json(newTransaction);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
